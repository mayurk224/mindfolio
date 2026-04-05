import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    }
  },
  {
    timestamps: true,
  },
);

// Ensure a user cannot have two collections with the same name
collectionSchema.index({ userId: 1, name: 1 }, { unique: true });

export const collectionModel = mongoose.model("collections", collectionSchema);
