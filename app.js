// OpenCage API for Geocoding
const geoCodingURL =
  "https://nominatim.openstreetmap.org/search?format=json&q=";

// Open-Meteo API
const openMeteoURL =
  "https://api.open-meteo.com/v1/forecast?current_weather=true";

document
  .getElementById("get-weather-btn")
  .addEventListener("click", getWeather);

function getWeather() {
  const city = document.getElementById("city-input").value;
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  // Step 1: Get the city's latitude and longitude using OpenStreetMap's Geocoding API
  fetch(geoCodingURL + city)
    .then((response) => response.json())
    .then((data) => {
      console.log("Geocoding API response:", data);
      if (data.length === 0) {
        alert("City not found!");
        return;
      }

      const { lat, lon } = data[0];
      fetchWeatherData(lat, lon, city);
    })
    .catch((error) => console.error("Error fetching geolocation:", error));
}

function fetchWeatherData(lat, lon, city) {
  // Step 2: Fetch weather data using the Open-Meteo API
  fetch(`${openMeteoURL}&latitude=${lat}&longitude=${lon}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Weather API response:", data);
      const { temperature, windspeed, weathercode } = data.current_weather;
      displayWeatherData(city, temperature, windspeed, weathercode);
    })
    .catch((error) => console.error("Error fetching weather data:", error));
}

function displayWeatherData(city, temperature, windspeed, weathercode) {
  document.getElementById("city-name").textContent = `Weather in ${city}`;
  document.getElementById(
    "temperature"
  ).textContent = `Temperature: ${temperature}°C`;
  document.getElementById(
    "wind-speed"
  ).textContent = `Wind Speed: ${windspeed} km/h`;

  // Step 3: Show appropriate GIF based on WMO weather codes
  const weatherGif = document.getElementById("weather-gif");
  const weatherGifs = {
    0: "clear-sky.jpeg", // Clear sky
    1: "partly-cloudy.jpeg", // Mainly clear
    2: "cloudy.gif", // Partly cloudy
    3: "overcast.jpeg", // Overcast
    45: "fog.jpeg", // Fog
    48: "fog.jpeg", // Depositing rime fog
    51: "drizzle.gif", // Light drizzle
    53: "drizzle.gif", // Moderate drizzle
    55: "drizzle.gif", // Dense drizzle
    61: "rain.jpeg", // Slight rain
    63: "rain.jpeg", // Moderate rain
    65: "rain.jpeg", // Heavy rain
    95: "thunderstorm.jpeg", // Thunderstorm
    // Add more weather codes and GIFs as needed
  };

  // Set the appropriate GIF based on the weather code
  weatherGif.src = weatherGifs[weathercode] || "default-weather.gif"; // Fallback to a default GIF
}
