import { itemModel } from "../models/item.model.js";

// POST /api/items/manual
// Route to manually save an item (No AI processing yet)
async function saveManualItem(req, res) {
  try {
    const { url, title, type, textContent } = req.body;

    // 1. Updated Validation: Must have EITHER a URL or Text
    if (!url && !textContent) {
      return res.status(400).json({
        message: "Please provide either a URL or text content to save.",
      });
    }

    // 2. Check for Duplicates (ONLY if a URL is provided)
    if (url) {
      const existingItem = await itemModel.findOne({
        userId: req.userId,
        url: url,
      });
      if (existingItem) {
        return res
          .status(409)
          .json({ message: "You have already saved this link." });
      }
    }

    // 3. Determine the Type automatically if not provided
    const itemType = type || (url ? "other" : "note");

    // 4. Save to Database
    const newItem = await itemModel.create({
      userId: req.userId,
      url: url || undefined, // Use undefined so Mongoose doesn't save a null string
      title: title || (url ? "Untitled Document" : "Untitled Note"),
      type: itemType,
      textContent: textContent || "",
      status: "completed",
      aiTags: ["manual-save"],
    });

    res.status(201).json({
      message: "Saved successfully!",
      item: newItem,
    });
  } catch (error) {
    console.error("Error saving item:", error);
    res.status(500).json({ message: "Server error while saving the item." });
  }
}

// GET /api/items/
// Route to fetch all items for the authenticated user
async function getUserItems(req, res) {
  try {
    const items = await itemModel
      .find({ userId: req.userId })
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

export { saveManualItem, getUserItems };
