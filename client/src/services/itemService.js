const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/items`
  : "http://localhost:8000/api/items";

export const saveItemToDB = async (itemData) => {
  const response = await fetch(`${API_URL}/save`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });

  return response;
};
