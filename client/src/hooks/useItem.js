import { useState } from "react";
import { saveItemToDB } from "@/services/itemService";

export const useItem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      return { success: true, data };
    } catch (err) {
      console.error("Save Item Error:", err);
      setIsLoading(false);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return { saveItem, isLoading, error };
};
