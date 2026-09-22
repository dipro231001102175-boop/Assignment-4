import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchWeather = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      console.log("API Key:", apiKey);

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${apiKey}&units=metric`
      );


      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Weather data not found");
      }

      setWeather(data);

    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      <h1>🌤️ Weather Dashboard</h1>

      <form onSubmit={searchWeather}>

        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button type="submit">
          Search
        </button>

      </form>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading weather...</p>
        </div>
      )}

      {error && (
        <p className="error">
          ⚠️ {error}
        </p>
      )}

      {weather && !loading && (
        <div className="weather-card">

          <h2>
            {weather.name}, {weather.sys.country}
          </h2>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather"
          />

          <h3>
            {Math.round(weather.main.temp)}°C
          </h3>

          <p>
            🌡️ Temperature: {Math.round(weather.main.temp)}°C
          </p>

          <p>
            💧 Humidity: {weather.main.humidity}%
          </p>

          <p>
            💨 Wind Speed: {weather.wind.speed} m/s
          </p>

          <p>
            🌅 Sunrise:{" "}
            {new Date(
              weather.sys.sunrise * 1000
            ).toLocaleTimeString()}
          </p>

          <p>
            🌇 Sunset:{" "}
            {new Date(
              weather.sys.sunset * 1000
            ).toLocaleTimeString()}
          </p>

        </div>
      )}

    </div>
  );
}

export default App;