import { useState } from "react";
import {
  saveItemToDB,
  getItemsFromDB,
  uploadItemToDB,
  getDeletedItemsFromDB,
} from "@/services/itemService";

export const useItem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  const saveItem = async (itemData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await saveItemToDB(itemData);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save item.");
      }

      setIsLoading(false);
      return { success: true, item: data.item, data };
    } catch (err) {
      console.error("Save Item Error:", err);
      setIsLoading(false);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const uploadItem = async (file, itemData = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await uploadItemToDB(file, itemData);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload item.");
      }

      setIsLoading(false);
      return { success: true, item: data.item, data };
    } catch (err) {
      console.error("Upload Item Error:", err);
      setIsLoading(false);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const fetchItems = async (page = 1, limit = 20, collectionId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getItemsFromDB(page, limit, collectionId);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch items.");
      }

      setItems(data.items);
      setIsLoading(false);
      return { success: true, items: data.items, hasMore: data.hasMore, data };
    } catch (err) {
      console.error("Fetch Items Error:", err);
      setIsLoading(false);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const fetchDeletedItems = async (page = 1, limit = 20) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getDeletedItemsFromDB(page, limit);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch deleted items.");
      }

      setItems(data.items);
      setIsLoading(false);
      return { success: true, items: data.items, hasMore: data.hasMore, data };
    } catch (err) {
      console.error("Fetch Deleted Items Error:", err);
      setIsLoading(false);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    saveItem,
    uploadItem,
    fetchItems,
    fetchDeletedItems,
    items,
    isLoading,
    error,
  };
};
