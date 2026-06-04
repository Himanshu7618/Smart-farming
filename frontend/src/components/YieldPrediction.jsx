import { useState } from "react";
import { aiAPI } from "../api/apiServices";

const YieldPrediction = () => {
  const [crop, setCrop] = useState("");
  const [area, setArea] = useState("");
  const [season, setSeason] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!crop || !area) {
      setError("Please provide crop and area.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await aiAPI.yieldPrediction({ crop, area, season });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Could not predict yield");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-5">
      <h2 className="text-xl font-semibold">Yield Prediction</h2>
      <p className="text-sm text-slate-500">Estimate production using field data and crop type.</p>

      {error && <div className="mt-4 rounded bg-red-100 p-3 text-red-800">{error}</div>}

      <form onSubmit={handleSubmit} className="grid gap-3 mt-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Crop</label>
          <input
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="mt-1 w-full rounded border p-2"
            placeholder="e.g. Wheat"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Area (acres)</label>
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            type="number"
            min="0"
            className="mt-1 w-full rounded border p-2"
            placeholder="e.g. 10"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Season</label>
          <input
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="mt-1 w-full rounded border p-2"
            placeholder="e.g. Spring"
          />
        </div>
        <div className="sm:col-span-2 flex gap-3">
          <button className="rounded bg-green-700 px-4 py-2 text-white" type="submit">
            {isLoading ? "Predicting..." : "Predict Yield"}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-4 rounded border bg-green-50 p-4">
          <div className="text-lg font-semibold">{result.prediction}</div>
          <div className="text-sm text-slate-600 mt-2">{result.details}</div>
          <div className="text-sm text-slate-700 mt-2">Confidence: {result.confidence}</div>
        </div>
      )}
    </div>
  );
};

export default YieldPrediction;
