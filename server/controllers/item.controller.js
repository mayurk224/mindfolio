import { itemModel } from "../models/item.model.js";

// POST /api/items/manual
// Route to manually save an item (No AI processing yet)
async function saveManualItem(req, res) {
  try {
    const { url, title, type, textContent } = req.body;

    // 1. Basic Validation
    if (!url) {
      return res
        .status(400)
        .json({ message: "URL is required to save an item." });
    }

    // 2. Check for Duplicates
    // We prevent the user from saving the exact same URL twice
    const existingItem = await itemModel.findOne({
      userId: req.userId,
      url: url,
    });
    if (existingItem) {
      return res
        .status(409)
        .json({ message: "You have already saved this link." });
    }

    // 3. Save to Database
    const newItem = await itemModel.create({
      userId: req.userId, // Pulled securely from the JWT middleware
      url,
      title: title || "Untitled Document",
      type: type || "other",
      textContent: textContent || "",
      status: "completed", // Bypassing AI, so it's "done" immediately
      aiTags: ["manual-save"], // A placeholder tag so you have something to display
    });

    // 4. Send Success Response
    res.status(201).json({
      message: "Item saved successfully!",
      item: {
        id: newItem._id,
        url: newItem.url,
        title: newItem.title,
        type: newItem.type,
        tags: newItem.aiTags,
      },
    });
  } catch (error) {
    console.error("Error saving manual item:", error);
    res.status(500).json({ message: "Server error while saving the item." });
  }
}

export { saveManualItem };
