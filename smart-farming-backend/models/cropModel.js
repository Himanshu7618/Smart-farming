import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Crop = mongoose.model("Crop", cropSchema);
export default Crop;
