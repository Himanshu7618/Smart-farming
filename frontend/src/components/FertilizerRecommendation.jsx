import { useState } from "react";

const FertilizerRecommendation = () => {
  const [crop, setCrop] = useState("");
  const [soilType, setSoilType] = useState("");
  const [goal, setGoal] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const parseResponse = async (res) => {
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!res.ok) {
      const message =
        data && typeof data === "object" && data.message
          ? data.message
          : typeof data === "string"
          ? data
          : `Request failed with status ${res.status}`;
      throw new Error(message);
    }
    return data;
  };

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
      const res = await fetch("http://localhost:5000/api/ai/fertilizer", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ crop, soilType, goal }),
      });
      const data = await parseResponse(res);
      setRecommendation(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not generate recommendation");
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
