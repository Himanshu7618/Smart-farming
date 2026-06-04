import { useState } from "react";

const WeatherCard = ({ setWeather }) => {
  const [weather, setLocalWeather] = useState(null);
  const [city, setCity] = useState("Delhi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "a3689ffc4f2f2f951de3f201a7297af3"; // replace with your own OpenWeatherMap API key

  const fetchWeather = async (cityName) => {
    try {
      setError("");
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch weather");
      }
      setLocalWeather(data);
      if (setWeather) {
        setWeather(data);
      }
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError(err.message || "Unable to get weather data");
      setLocalWeather(null);
      if (setWeather) {
        setWeather(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    fetchWeather(city.trim());
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-bold mb-2">Weather</h2>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2 flex-wrap">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 rounded border p-2"
          placeholder="Enter city"
        />
        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading weather...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : weather ? (
        <>
          <p>🌡️ Temp: {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>☁️ Condition: {weather.weather[0].main}</p>
          <p>🍃 Wind speed: {weather.wind.speed} m/s</p>
        </>
      ) : (
        <p>Search a city to load weather data.</p>
      )}
    </div>
  );
};

export default WeatherCard;