const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/auth";

export const googleSignup = async (token) => {
  const response = await fetch(`${API_URL}/google/signup`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  return response;
};

export const googleLogin = async (token) => {
  const response = await fetch(`${API_URL}/google/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  return response;
};
export const getMe = async () => {
  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};
