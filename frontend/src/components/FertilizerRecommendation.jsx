import { useState } from "react";
import { aiAPI } from "../api/apiServices";

const FertilizerRecommendation = () => {
  const [crop, setCrop] = useState("");
  const [soilType, setSoilType] = useState("");
  const [goal, setGoal] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setRecommendation(null);

    if (!crop) {
      setError("Please provide the crop name.");
      return;
    }

    setLoading(true);
    try {
      const res = await aiAPI.fertilizerRecommendation({ crop, soilType, goal });
      setRecommendation(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Could not generate recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-5">
      <h2 className="text-xl font-semibold">Fertilizer Recommendation</h2>
      <p className="text-sm text-slate-500">Get crop-specific fertilizer advice in seconds.</p>

      {error && <div className="mt-4 rounded bg-red-100 p-3 text-red-800">{error}</div>}

      <form onSubmit={handleSubmit} className="grid gap-3 mt-4">
        <div>
          <label className="block text-sm font-medium">Crop</label>
          <input
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="mt-1 w-full rounded border p-2"
            placeholder="e.g. Corn"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Soil Type</label>
          <input
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
            className="mt-1 w-full rounded border p-2"
            placeholder="e.g. Sandy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Goal</label>
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="mt-1 w-full rounded border p-2"
            placeholder="e.g. Growth / Flowering"
          />
        </div>
        <button className="rounded bg-green-700 px-4 py-2 text-white w-fit" type="submit">
          {loading ? "Generating..." : "Get Recommendation"}
        </button>
      </form>

      {recommendation && (
        <div className="mt-4 rounded border bg-green-50 p-4">
          <div className="font-semibold">Recommendation for {recommendation.crop}</div>
          <div className="text-sm text-slate-600 mt-2">{recommendation.recommendation}</div>
        </div>
      )}
    </div>
  );
};

export default FertilizerRecommendation;
