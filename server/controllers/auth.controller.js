import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleLogin(req, res) {
  const { token } = req.body; // The ID token sent from React

  try {
    // 1. Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // 2. Extract the user's payload
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;
    // 'sub' is the unique Google ID

    // 3. Find the user in MongoDB, or create them if they are new
    let user = await userModel.findOne({ googleId: sub });

    if (!user) {
      user = await userModel.create({
        googleId: sub,
        email: email,
        displayName: name,
        avatarUrl: picture,
      });
    }

    // 4. Create your own JWT so your app remembers they are logged in
    const appToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // Token expires in 7 days
    );

    res.cookie("token", appToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 5. Send the token and user data back to React
    res.status(200).json({
      message: "Login successful",
      token: appToken,
      user: {
        id: user._id,
        name: user.displayName,
        email: user.email,
        avatar: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Invalid Google Token" });
  }
}

export { googleLogin };
