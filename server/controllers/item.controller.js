import { embedder } from "../config/ai.config.js";
import { imagekit } from "../config/imagekit.js";
import { itemModel } from "../models/item.model.js";
import { processingQueue } from "../services/queue.js";

const ALLOWED_ITEM_TYPES = [
  "web",
  "images",
  "videos",
  "documents",
  "articles",
  "notes",
  "youtube",
  "quotes",
  "posts",
  "snippets",
  "other",
];

const EXTENSION_TYPE_MAP = {
  webpage: "web",
  web: "web",
  image: "images",
  video: "videos",
  youtube_video: "youtube",
};

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isImageUrl(url) {
  if (!url) return false;
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(url);
}

function getRequestedType(value) {
  const normalizedValue = normalizeString(value).toLowerCase();
  const mappedValue = EXTENSION_TYPE_MAP[normalizedValue] || normalizedValue;
  return ALLOWED_ITEM_TYPES.includes(mappedValue) ? mappedValue : "";
}

function buildTextContent({ description, textContent, pageUrl, resourceUrl }) {
  if (textContent) {
    return textContent;
  }

  const fragments = [];

  if (description) {
    fragments.push(description);
  }

  if (pageUrl && resourceUrl && pageUrl !== resourceUrl) {
    fragments.push(`Source page: ${pageUrl}`);
  }

  return fragments.join("\n\n");
}

function getItemTypeFromMime(mime = "") {
  if (mime.startsWith("image/")) {
    return "images";
  }

  if (mime.startsWith("video/")) {
    return "videos";
  }

  if (
    mime.includes("pdf") ||
    mime.includes("document") ||
    mime.includes("word") ||
    mime.includes("sheet") ||
    mime.includes("presentation") ||
    mime.includes("text")
  ) {
    return "documents";
  }

  return "other";
}

// POST /api/items/manual
// Route to manually save an item and queue it for AI processing
async function saveManualItem(req, res) {
  try {
    const legacyUrl = normalizeString(req.body.url);
    const pageUrl = normalizeString(req.body.pageUrl);
    const resourceUrl = normalizeString(req.body.resourceUrl);
    const title = normalizeString(req.body.title);
    const description = normalizeString(req.body.description);

    const textContent = buildTextContent({
      description,
      textContent: normalizeString(req.body.textContent),
      pageUrl,
      resourceUrl,
    });

    const requestedType = getRequestedType(req.body.type);

    // Resolve the URL from various possible frontend/extension payloads
    let url = resourceUrl || pageUrl || legacyUrl;

    if (!url && !textContent) {
      return res
        .status(400)
        .json({ message: "A URL or text content is required." });
    }

    // 1. Explicit Type Inference
    let itemType = requestedType;

    if (!itemType) {
      if (textContent && !url) {
        // EXPLICIT NOTES OVERRIDE: Just text, no URL
        itemType = "notes";
      } else if (url) {
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
          itemType = "youtube";
        } else if (isImageUrl(url)) {
          itemType = "images";
        } else {
          itemType = "web";
        }
      }
    }

    itemType = itemType || "notes"; // Ultimate fallback

    // 2. Safe URL assignment for MongoDB
    // If url is "", make it strictly null so the DB sparse index works
    const finalUrl = url ? url : null;

    const newItem = new itemModel({
      userId: req.userId,
      url: finalUrl,
      title: title || (finalUrl ? "Analyzing Link..." : "Analyzing Note..."),
      type: itemType,
      thumbnailUrl: itemType === "images" ? finalUrl : undefined,
      textContent: textContent || undefined,
      status: "pending",
    });

    await newItem.save();

    await processingQueue.add("process-content", {
      documentId: newItem._id,
      url: finalUrl || undefined,
      textContent: textContent || undefined,
      type: itemType,
      sourceTitle: title || undefined,
      sourceType: requestedType || undefined,
    });

    return res.status(201).json({
      message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} queued for AI processing`,
      item: newItem,
    });
  } catch (error) {
    console.error("Error saving item:", error);

    // Check if it's a MongoDB Duplicate Key Error
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "You have already saved this link. If this is a note, ensure your DB url index is 'sparse: true'.",
      });
    }

    return res
      .status(500)
      .json({ message: "Server error while saving the item." });
  }
}

// GET /api/items/
// Route to fetch all items for the authenticated user
async function getUserItems(req, res) {
  try {
    const items = await itemModel
      .find({ userId: req.userId, isDeleted: { $ne: true } })
      .select("+textContent")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Items fetched successfully!",
      items,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Server error while fetching items." });
  }
}

// GET /api/items/:id
// A fast route to check the status of a specific item
async function getItemStatus(req, res) {
  try {
    // Look up the specific item. We include userId to ensure they own it!
    const item = await itemModel
      .findOne({
        _id: req.params.id,
        userId: req.userId,
      })
      .select("+textContent");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("Error checking item status:", error);
    res.status(500).json({ message: "Failed to fetch item status." });
  }
}

async function searchItems(req, res) {
  try {
    const queryText = req.query.q;
    if (!queryText) {
      return res.status(400).json({ message: "Search query is required." });
    }

    // 1. Generate query embedding (Mistral AI Call)
    const queryEmbedding = await embedder.embedQuery(queryText);

    // 2. Perform Hybrid Search: Keyword (Regex) + Vector Search concurrently
    const [keywordResults, vectorResults] = await Promise.all([
      // Keyword search on title, summary, or aiTags
      itemModel
        .find({
          userId: req.userId,
          $or: [
            { title: { $regex: queryText, $options: "i" } },
            { summary: { $regex: queryText, $options: "i" } },
            { aiTags: { $regex: queryText, $options: "i" } },
          ],
        })
        .select("-embedding")
        .limit(10)
        .lean(),

      // Semantic/Vector search
      itemModel.aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: 10,
            filter: { userId: req.userId },
          },
        },
        {
          $project: {
            embedding: 0,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ]),
    ]);

    // 3. Combine both result arrays
    const combinedResults = [...keywordResults, ...vectorResults];

    // 4. Deduplicate the combinedResults array based on the `_id` field
    const deduplicatedResults = Array.from(
      new Map(
        combinedResults.map((item) => [item._id.toString(), item]),
      ).values(),
    );

    res.status(200).json(deduplicatedResults);
  } catch (error) {
    console.error("Hybrid search failed:", error);
    res.status(500).json({ message: "Search engine failed." });
  }
}

async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided." });
    }

    const title = normalizeString(req.body.title);
    const textContent = normalizeString(req.body.textContent);
    const requestedType = getRequestedType(req.body.type);

    console.log(`[Upload] Receiving file: ${req.file.originalname}`);

    // 1. Categorize the upload from its MIME type, but allow a valid
    // manually selected type to override the final saved type.
    const detectedType = getItemTypeFromMime(req.file.mimetype);
    const itemType = requestedType || detectedType;
    const shouldQueueForAi =
      detectedType === "images" || detectedType === "documents";

    // 2. Upload to ImageKit (It accepts all files!)
    const imageKitResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: `/mindfolio-uploads/${detectedType}`,
    });

    console.log(`[Upload] Success! File URL: ${imageKitResponse.url}`);

    // 3. Create the item in MongoDB.
    const newItem = new itemModel({
      userId: req.userId,
      title:
        title ||
        (shouldQueueForAi ? `Analyzing ${itemType}...` : req.file.originalname),
      type: itemType,
      url: imageKitResponse.url,
      thumbnailUrl:
        detectedType === "images"
          ? imageKitResponse.thumbnailUrl || imageKitResponse.url
          : undefined,
      textContent: textContent || undefined,
      status: shouldQueueForAi ? "pending" : "completed",
    });

    await newItem.save();

    // 4. Image and document uploads go through the AI pipeline.
    if (shouldQueueForAi) {
      await processingQueue.add("process-content", {
        documentId: newItem._id,
        url: imageKitResponse.url,
        textContent: textContent || undefined,
        type: itemType,
        sourceTitle: title || undefined,
        sourceType: requestedType || undefined,
      });
    }

    res.status(201).json({
      message: shouldQueueForAi
        ? "File uploaded and queued for AI analysis!"
        : "File uploaded successfully!",
      item: newItem,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "You have already uploaded this file." });
    }
    console.error("File upload failed:", error);
    res.status(500).json({ message: "Failed to upload file." });
  }
}

// PATCH /api/items/:id/delete
// Soft-delete an item (marks it as deleted without removing it from the DB)
async function softDeleteItem(req, res) {
  try {
    const item = await itemModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isDeleted: true },
      { new: true },
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    return res.status(200).json({ message: "Item deleted.", item });
  } catch (error) {
    console.error("Error soft-deleting item:", error);
    return res.status(500).json({ message: "Server error while deleting the item." });
  }
}

export {
  saveManualItem,
  getUserItems,
  getItemStatus,
  searchItems,
  uploadImage,
  softDeleteItem,
};
