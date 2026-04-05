import { collectionModel } from "../models/collection.model.js";
import { itemModel } from "../models/item.model.js";

/**
 * Fetch all collections for the current user.
 */
export const getCollections = async (req, res) => {
  try {
    const userId = req.user._id;
    const collections = await collectionModel.find({ userId }).sort({ name: 1 });
    res.json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
};

/**
 * Create a new collection.
 * Optionally adds an item to it immediately.
 */
export const createCollection = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, itemId } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Collection name is required" });
    }

    // Check for existing collection with same name for this user
    const existing = await collectionModel.findOne({ userId, name });
    if (existing) {
      return res.status(400).json({ error: "Collection already exists" });
    }

    const newCollection = await collectionModel.create({
      userId,
      name,
    });

    // If an itemId was provided, add the collection to that item
    if (itemId) {
      await itemModel.findByIdAndUpdate(itemId, {
        $addToSet: { collections: newCollection._id },
      });
    }

    res.status(201).json(newCollection);
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ error: "Failed to create collection" });
  }
};

/**
 * Toggle an item in a collection (Add if not present, Remove if present).
 */
export const toggleItemInCollection = async (req, res) => {
  try {
    const { collectionId, itemId } = req.body;

    if (!collectionId || !itemId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const item = await itemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const hasCollection = item.collections.includes(collectionId);
    
    if (hasCollection) {
      // Remove it
      item.collections = item.collections.filter(
        (id) => id.toString() !== collectionId
      );
    } else {
      // Add it
      item.collections.push(collectionId);
    }

    await item.save();
    res.json({ 
      success: true, 
      inCollection: !hasCollection,
      item
    });
  } catch (error) {
    console.error("Error toggling item in collection:", error);
    res.status(500).json({ error: "Failed to update item-collection link" });
  }
};
