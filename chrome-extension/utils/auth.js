import { EXTENSION_CONFIG, buildApiUrl, requestJson } from "./api.js";

export async function checkAuthentication() {
  const response = await requestJson(buildApiUrl(EXTENSION_CONFIG.authMePath), {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return {
    ...response,
    isAuthenticated:
      response.ok && response.data?.isAuthenticated !== false,
  };
}
