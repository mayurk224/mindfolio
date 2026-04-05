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

export const uploadItemToDB = async (file, itemData = {}) => {
  const formData = new FormData();
  formData.append("file", file);

  Object.entries(itemData).forEach(([key, value]) => {
    if (typeof value === "string" && value.trim()) {
      formData.append(key, value.trim());
    }
  });

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return response;
};

export const softDeleteItem = async (itemId) => {
  const response = await fetch(`${API_URL}/${itemId}/delete`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};

export const updateItem = async (itemId, updateData) => {
  const response = await fetch(`${API_URL}/${itemId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  return response;
};

export const getItemsFromDB = async () => {
  const response = await fetch(`${API_URL}/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};
