const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_URL = `${API_BASE}/api/collections`;

/**
 * Fetch all collections for the current user.
 */
export async function getCollections() {
  const response = await fetch(API_URL, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to fetch collections");
  return response.json();
}

/**
 * Create a new collection.
 */
export async function createCollection(name, itemId) {
  const response = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, itemId }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create collection");
  }
  return response.json();
}

/**
 * Toggle an item in a specific collection.
 */
export async function toggleCollectionItem(collectionId, itemId) {
  const response = await fetch(`${API_URL}/toggle`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ collectionId, itemId }),
  });
  if (!response.ok) throw new Error("Failed to toggle collection item");
  return response.json();
}
