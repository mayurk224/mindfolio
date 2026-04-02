// middleware/auth.js
import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  // Get the token from headers (Bearer token) or cookies
  let token = null;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    // Verify the token using your secret (with dev fallback)
    const secret = process.env.JWT_SECRET || "mindfolio-dev-jwt-secret";
    const decoded = jwt.verify(token, secret);

    // Attach the userId to the request object so the next route can use it
    req.userId = decoded.userId;
    next(); // Move on to the controller!
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
