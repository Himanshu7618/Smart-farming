import { useState } from "react";

const DiseaseDetection = () => {
  const [crop, setCrop] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
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
    setResult(null);

    if (!symptoms) {
      setError("Please describe the symptoms to detect disease.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai/disease", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ crop, symptoms }),
      });
      const data = await parseResponse(res);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not detect disease");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-5">
      <h2 className="text-xl font-semibold">Crop Disease Detection</h2>
      <p className="text-sm text-slate-500">Describe symptoms and get an instant diagnosis.</p>

      {error && <div className="mt-4 rounded bg-red-100 p-3 text-red-800">{error}</div>}

      <form onSubmit={handleSubmit} className="grid gap-3 mt-4">
        <div>
          <label className="block text-sm font-medium">Crop</label>
          <input
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="mt-1 w-full rounded border p-2"
            placeholder="Optional crop name"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Symptoms</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="mt-1 w-full rounded border p-2"
            rows="4"
            placeholder="e.g. yellow spots, wilting leaves"
          />
        </div>
        <button className="rounded bg-green-700 px-4 py-2 text-white w-fit" type="submit">
          {loading ? "Analyzing..." : "Detect Disease"}
        </button>
      </form>

      {result && (
        <div className="mt-4 rounded border bg-green-50 p-4">
          <div className="font-semibold">{result.disease}</div>
          <div className="text-sm text-slate-600 mt-2">{result.advice}</div>
          <div className="text-sm text-slate-700 mt-2">Confidence: {result.confidence}</div>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetection;
