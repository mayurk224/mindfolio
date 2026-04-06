import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const isProduction = process.env.NODE_ENV === "production";

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function verifyGoogleToken(token) {
  if (!token) {
    throw new HttpError(400, "Google token is required.");
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new HttpError(500, "Google auth is not configured on the server.");
  }

  try {
    // Try verifying as ID Token first (JWT)
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      return ticket.getPayload();
    } catch (idTokenError) {
      // If ID Token verification fails, try as Access Token
      const tokenInfo = await client.getTokenInfo(token);

      // Fetch user profile using access token
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`,
      );
      const profile = await response.json();

      if (!profile?.email) {
        throw new HttpError(400, "Google account email is unavailable.");
      }

      return {
        ...profile,
        sub: profile.sub || tokenInfo.sub,
      };
    }
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    throw new HttpError(401, "Invalid Google token.");
  }
}

function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (!isProduction) {
    return "mindfolio-dev-jwt-secret";
  }

  throw new HttpError(500, "JWT auth is not configured on the server.");
}

function createAppToken(userId) {
  return jwt.sign({ userId }, getJwtSecret(), {
    expiresIn: "7d",
  });
}

function getCookieSameSite() {
  const configuredValue = (
    process.env.AUTH_COOKIE_SAME_SITE || (isProduction ? "none" : "lax")
  ).toLowerCase();

  if (["lax", "strict", "none"].includes(configuredValue)) {
    return configuredValue;
  }

  return isProduction ? "none" : "lax";
}

function getCookieSecure(sameSite) {
  if (process.env.AUTH_COOKIE_SECURE === "true") {
    return true;
  }

  if (process.env.AUTH_COOKIE_SECURE === "false") {
    return false;
  }

  return isProduction || sameSite === "none";
}

function setAuthCookie(res, token) {
  const sameSite = getCookieSameSite();

  res.cookie("token", token, {
    httpOnly: true,
    secure: getCookieSecure(sameSite),
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function handleAuthError(res, context, error) {
  console.error(`${context} Error:`, error);

  const status = error instanceof HttpError ? error.status : 500;
  const message =
    error instanceof HttpError
      ? error.message
      : "Something went wrong while processing authentication.";

  return res.status(status).json({ message });
}

async function googleLogin(req, res) {
  const { token } = req.body;

  try {
    const payload = await verifyGoogleToken(token);
    const user = await userModel.findOne({ email: payload.email });

    if (!user) {
      return res.status(404).json({
        message: "Account does not exist. Please sign up first.",
      });
    }

    const appToken = createAppToken(user._id);

    setAuthCookie(res, appToken);

    return res.status(200).json({
      message: "Login successful",
      // Also return token in body so the Chrome extension can store it in localStorage
      token: appToken,
      user: {
        id: user._id,
        name: user.displayName,
        email: user.email,
        avatar: user.avatarUrl,
      },
    });
  } catch (error) {
    return handleAuthError(res, "Google Login", error);
  }
}

async function googleSignup(req, res) {
  const { token } = req.body;

  try {
    const payload = await verifyGoogleToken(token);
    let user = await userModel.findOne({ email: payload.email });

    if (user) {
      return res.status(409).json({
        message: "Account already exists with this email. Please log in.",
      });
    }

    user = await userModel.create({
      googleId: payload.sub,
      email: payload.email,
      displayName: payload.name,
      avatarUrl: payload.picture,
    });

    return res.status(201).json({
      message: "Account created successfully, please login",
      user: {
        id: user._id,
        name: user.displayName,
        email: user.email,
        avatar: user.avatarUrl,
      },
    });
  } catch (error) {
    return handleAuthError(res, "Google Signup", error);
  }
}

async function getMe(req, res) {
  // Accept token from cookie (web app) OR Authorization: Bearer header (Chrome extension)
  let token = req.cookies?.token;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res
        .status(404)
        .json({ isAuthenticated: false, message: "User not found" });
    }

    return res.status(200).json({
      isAuthenticated: true,
      user: {
        id: user._id,
        name: user.displayName,
        email: user.email,
        avatar: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("verify error", error);
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "Invalid session" });
  }
}

async function logout(req, res) {
  try {
    const sameSite = getCookieSameSite();
    res.clearCookie("token", {
      httpOnly: true,
      secure: getCookieSecure(sameSite),
      sameSite,
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return handleAuthError(res, "Logout", error);
  }
}

export { googleLogin, googleSignup, getMe, logout };
