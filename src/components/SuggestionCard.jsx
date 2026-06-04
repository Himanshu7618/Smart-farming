const SuggestionCard = ({ weather }) => {
  let suggestion = "Enter a city to get farming recommendations.";

  if (weather && weather.main && weather.weather) {
    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const condition = weather.weather[0].main;
    const windSpeed = weather.wind?.speed || 0;

    if (condition === "Rain") {
      suggestion = "It's raining, avoid irrigation today.";
    } else if (condition === "Snow") {
      suggestion = "Snowy conditions—protect tender crops.";
    } else if (temp > 35) {
      suggestion = "High temperature detected, irrigate and provide shade.";
    } else if (humidity > 80) {
      suggestion = "High humidity—reduce watering and watch for disease.";
    } else if (windSpeed > 10) {
      suggestion = "Windy conditions, secure light plants and reduce spraying.";
    } else {
      suggestion = "Weather is favorable for farming activities.";
    }
  }

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-bold mb-2">Suggestion</h2>
      <p>{suggestion}</p>
    </div>
  );
};

export default SuggestionCard;