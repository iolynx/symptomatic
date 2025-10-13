import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    userInput: {
      type: String,
      required: true,
    },
    aiResponse: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const History = mongoose.model("History", historySchema);

export default History;
