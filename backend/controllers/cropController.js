import Crop from "../models/cropModel.js";

export const createCrop = async (req, res) => {
  try {
    const { cropName, area, season } = req.body;
    const crop = await Crop.create({
      cropName,
      area,
      season,
      userId: req.user.id,
    });
    res.status(201).json({ message: "Crop created successfully", crop });
  } catch (error) {
    console.error("Create Crop Error:", error);
    res.status(500).json({ message: "Could not create crop" });
  }
};

export const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(crops);
  } catch (error) {
    console.error("Get Crops Error:", error);
    res.status(500).json({ message: "Could not fetch crops" });
  }
};

export const updateCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const { cropName, area, season } = req.body;
    const crop = await Crop.findById(id);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }
    if (crop.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    crop.cropName = cropName ?? crop.cropName;
    crop.area = area ?? crop.area;
    crop.season = season ?? crop.season;
    await crop.save();
    res.json({ message: "Crop updated successfully", crop });
  } catch (error) {
    console.error("Update Crop Error:", error);
    res.status(500).json({ message: "Could not update crop" });
  }
};

export const deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const crop = await Crop.findById(id);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }
    if (crop.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await crop.deleteOne();
    res.json({ message: "Crop deleted successfully" });
  } catch (error) {
    console.error("Delete Crop Error:", error);
    res.status(500).json({ message: "Could not delete crop" });
  }
};
