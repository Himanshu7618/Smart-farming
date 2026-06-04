import Navbar from "../components/Navbar";
import WeatherCard from "../components/WeatherCard";
import SuggestionCard from "../components/SuggestionCard";
import ChartCard from "../components/ChartCard";
import CropCard from "../components/CropCard";
import StatCard from "../components/StatCard";
import ExpenseTracker from "../components/ExpenseTracker";
import YieldPrediction from "../components/YieldPrediction";
import FertilizerRecommendation from "../components/FertilizerRecommendation";
import DiseaseDetection from "../components/DiseaseDetection";
import AIFarmingAssistant from "../components/AIFarmingAssistant";
import { useEffect, useMemo, useState } from "react";

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [crops, setCrops] = useState([]);
  const [cropName, setCropName] = useState("");
  const [area, setArea] = useState("");
  const [season, setSeason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

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

  const fetchCrops = async () => {
    if (!token) {
      setError("Please login to manage crops.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/crops", {
        headers: getHeaders(),
      });
      const data = await parseResponse(res);
      setCrops(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load crops");
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const resetForm = () => {
    setCropName("");
    setArea("");
    setSeason("");
    setIsEditing(false);
    setEditId(null);
  };

  const suggestionItems = useMemo(() => {
    if (!weather || !weather.main || !weather.weather) return [];

    const suggestions = [];
    const condition = weather.weather[0]?.main;
    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const wind = weather.wind?.speed || 0;

    if (condition === "Rain") {
      suggestions.push("Avoid irrigation today");
    }
    if (condition === "Snow") {
      suggestions.push("Protect crops from frost and snow");
    }
    if (temp > 35) {
      suggestions.push("Increase watering and provide shade");
    }
    if (humidity > 80) {
      suggestions.push("Reduce watering and monitor for disease");
    }
    if (wind > 10) {
      suggestions.push("Secure light plants and reduce spraying");
    }
    if (!suggestions.length) {
      suggestions.push("Weather is favorable for farming");
    }
    return suggestions;
  }, [weather]);

  const totalCrops = crops.length;
  const currentTemperature = weather?.main?.temp ? `${weather.main.temp}°C` : "N/A";
  const suggestionCount = suggestionItems.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!cropName || !area || !season) {
      setError("All crop fields are required");
      return;
    }

    try {
      const payload = {
        cropName,
        area: Number(area),
        season,
      };

      const url = editId
        ? `http://localhost:5000/api/crops/${editId}`
        : "http://localhost:5000/api/crops";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await parseResponse(res);
      setMessage(data.message || (editId ? "Crop updated" : "Crop added"));
      resetForm();
      fetchCrops();
    } catch (err) {
      console.error(err);
      setError("Could not save crop");
    }
  };

  const handleEdit = (crop) => {
    setCropName(crop.cropName);
    setArea(crop.area);
    setSeason(crop.season);
    setIsEditing(true);
    setEditId(crop._id);
    setError("");
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this crop?")) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/crops/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await parseResponse(res);
      setMessage(data.message || "Crop deleted");
      fetchCrops();
    } catch (err) {
      console.error(err);
      setError("Could not delete crop");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Total Crops"
            value={totalCrops}
            description="All crops under your care"
          />
          <StatCard
            title="Current Temperature"
            value={currentTemperature}
            description="Latest weather for farming decisions"
          />
          <StatCard
            title="Farming Suggestions"
            value={suggestionCount}
            description="Active recommendations based on weather"
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-4">
            <div className="bg-white rounded shadow p-5">
              <h2 className="text-xl font-semibold mb-3">Add / Edit Crop</h2>
            {message && <div className="mb-3 p-3 rounded bg-green-100 text-green-800">{message}</div>}
            {error && <div className="mb-3 p-3 rounded bg-red-100 text-red-800">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Crop Name</label>
                <input
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full rounded border p-2"
                  placeholder="Enter crop name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Area (acres)</label>
                <input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  type="number"
                  min="0"
                  className="w-full rounded border p-2"
                  placeholder="Enter area"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Season</label>
                <input
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full rounded border p-2"
                  placeholder="Enter season"
                />
              </div>
              <button
                type="submit"
                className="bg-green-700 text-white px-4 py-2 rounded"
              >
                {isEditing ? "Update Crop" : "Add Crop"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="ml-3 text-gray-700 underline"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          <CropCard crops={crops} onEditCrop={handleEdit} onDeleteCrop={handleDelete} />
        </div>

        <div className="space-y-4">
          <WeatherCard setWeather={setWeather} />
          <SuggestionCard weather={weather} />
          <ChartCard />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <ExpenseTracker />
          <AIFarmingAssistant />
          <YieldPrediction />
          <FertilizerRecommendation />
          <div className="xl:col-span-2">
            <DiseaseDetection />
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Dashboard;