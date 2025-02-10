// models/score.ts
import mongoose, { Document, Model, Schema } from "mongoose";

interface IScore extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  score: number;
  difficulty: string;
  updatedAt: Date;
}

const ScoreSchema: Schema<IScore> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["classic", "easy", "medium", "hard"],
    },
  },
  { timestamps: true }
);

// Compound index for userId and difficulty to ensure uniqueness
ScoreSchema.index({ userId: 1, difficulty: 1 }, { unique: true });

const Score: Model<IScore> =
  mongoose.models.Score || mongoose.model<IScore>("Score", ScoreSchema);

export default Score;
