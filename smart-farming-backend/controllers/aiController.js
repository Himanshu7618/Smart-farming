const round = (value) => Math.round(value * 10) / 10;

const cropMultipliers = {
  wheat: 1.1,
  rice: 1.2,
  maize: 1.15,
  corn: 1.15,
  soybean: 1.05,
  tomato: 0.9,
  potato: 1.0,
};

const seasonFactors = {
  spring: 1.1,
  summer: 1.05,
  autumn: 0.95,
  fall: 0.95,
  winter: 0.8,
};

const fertilizerAdvice = {
  nitrogen: "Apply nitrogen-rich fertilizer for leafy growth and strong stems.",
  phosphorus: "Use phosphorus-rich fertilizer to improve root development and flowering.",
  potassium: "Potassium helps with stress resistance and fruit quality.",
};

const diseaseProfiles = [
  {
    keywords: ["yellow", "leaf", "spot", "brown", "blight"],
    disease: "Leaf Blight",
    advice: "Remove affected leaves, improve airflow, and reduce overhead irrigation.",
  },
  {
    keywords: ["mildew", "powdery", "white", "fluffy"],
    disease: "Powdery Mildew",
    advice: "Apply a potassium-bicarbonate spray and keep humidity lower.",
  },
  {
    keywords: ["root", "rot", "soft", "dark", "waterlogged"],
    disease: "Root Rot",
    advice: "Improve soil drainage and avoid overwatering.",
  },
];

const assistantAnswers = [
  "Monitor soil moisture daily and water only when the top 2 inches are dry.",
  "Rotate crops each season to reduce pests and conserve soil nutrients.",
  "Apply compost or organic matter to improve soil structure and nutrient availability.",
  "Scout fields every week for insects and disease symptoms.",
];

export const getYieldPrediction = async (req, res) => {
  try {
    const { crop, area, season } = req.body;
    const normalizedCrop = String(crop || "").trim().toLowerCase();
    const normalizedSeason = String(season || "").trim().toLowerCase();
    const areaValue = Number(area) || 0;

    if (!normalizedCrop || areaValue <= 0) {
      return res.status(400).json({ message: "Crop name and area are required for prediction" });
    }

    const cropFactor = cropMultipliers[normalizedCrop] ?? 1.0;
    const seasonFactor = seasonFactors[normalizedSeason] ?? 1.0;
    const estimate = round(areaValue * cropFactor * seasonFactor * 0.8);
    const response = {
      prediction: `${estimate} tons per season`,
      details: `Estimated yield for ${crop} on ${area} acres during ${season || "current"} season.`,
      confidence: estimate > 5 ? "High" : "Moderate",
    };

    res.json(response);
  } catch (error) {
    console.error("Yield Prediction Error:", error);
    res.status(500).json({ message: "Could not generate yield prediction" });
  }
};

export const getFertilizerRecommendation = async (req, res) => {
  try {
    const { crop, soilType, goal } = req.body;
    const normalizedSoil = String(soilType || "").trim().toLowerCase();
    const normalizedCrop = String(crop || "").trim().toLowerCase();

    let baseRecommendation = "A balanced N-P-K fertilizer will work well for most vegetable crops.";
    if (normalizedSoil.includes("sandy")) {
      baseRecommendation = "Sandy soil benefits from frequent, light applications of fertilizer and organic matter.";
    } else if (normalizedSoil.includes("clay")) {
      baseRecommendation = "Clay soil performs better with slow-release fertilizer and organic matter to improve drainage.";
    }

    const cropHint = normalizedCrop.includes("tomato")
      ? fertilizerAdvice.phosphorus
      : normalizedCrop.includes("corn") || normalizedCrop.includes("wheat")
      ? fertilizerAdvice.nitrogen
      : fertilizerAdvice.potassium;

    const recommendation = `${baseRecommendation} ${cropHint} ${goal ? `Focus on ${goal.toLowerCase()} goals.` : ""}`.trim();

    res.json({ recommendation, soilType: soilType || "General", crop: crop || "Crop" });
  } catch (error) {
    console.error("Fertilizer Recommendation Error:", error);
    res.status(500).json({ message: "Could not generate fertilizer recommendation" });
  }
};

export const detectCropDisease = async (req, res) => {
  try {
    const { symptoms, crop } = req.body;
    const text = `${symptoms || ""} ${crop || ""}`.toLowerCase();
    const profile = diseaseProfiles.find((profile) =>
      profile.keywords.some((keyword) => text.includes(keyword))
    );

    if (profile) {
      return res.json({
        disease: profile.disease,
        advice: profile.advice,
        confidence: "Likely",
      });
    }

    res.json({
      disease: "No obvious disease detected",
      advice: "Keep monitoring symptoms and maintain good field hygiene.",
      confidence: "Low",
    });
  } catch (error) {
    console.error("Disease Detection Error:", error);
    res.status(500).json({ message: "Could not analyze symptoms" });
  }
};

export const aiFarmingAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    const normalizedMessage = String(message || "").toLowerCase();
    const answer = assistantAnswers.find((answerText) =>
      normalizedMessage.includes("water") && answerText.includes("water")
    ) || assistantAnswers.find((answerText) => normalizedMessage.includes("soil") && answerText.includes("soil")) ||
      assistantAnswers[Math.floor(Math.random() * assistantAnswers.length)];

    res.json({ response: answer });
  } catch (error) {
    console.error("AI Assistant Error:", error);
    res.status(500).json({ message: "Could not provide advice" });
  }
};
