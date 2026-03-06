function getWeatherIcon(code) {
  if (code === 0) return "☀️ Clear sky";
  if (code === 1) return "🌤️ Mostly clear";
  if (code === 2) return "⛅ Partly cloudy";
  if (code === 3) return "☁️ Overcast";

  if (code === 45 || code === 48) return "🌫️ Fog";

  if ([51, 53, 55].includes(code)) return "🌦️ Drizzle";
  if ([61, 63, 65].includes(code)) return "🌧️ Rain";
  if ([66, 67].includes(code)) return "🌧️ Freezing rain";

  if ([71, 73, 75].includes(code)) return "❄️ Snow";
  if (code === 77) return "🌨️ Snow grains";

  if ([80, 81, 82].includes(code)) return "🌧️ Showers";
  if ([85, 86].includes(code)) return "❄️ Snow showers";

  if (code === 95) return "⛈️ Thunderstorm";
  if ([96, 97].includes(code)) return "⛈️ Thunderstorm w/ hail";

  return "❓ Unknown";
}
async function getWeather() {
  const loc = document.getElementById("location").value;
  const date = document.getElementById("date").value;
  const output = document.getElementById("output");

  if (!loc || !date) {
    output.textContent = "Please enter both a location and a date.";
    return;
  }

  // Reset + fade-out before loading
  output.classList.remove("show");
  output.textContent = "Loading...";

  try {
    const res = await fetch(`/api/weather?loc=${encodeURIComponent(loc)}&date=${date}`);
    const data = await res.json();

    if (data.error) {
      output.textContent = "Error: " + data.error;

      // Trigger fade-in
      setTimeout(() => output.classList.add("show"), 10);
      return;
    }

    const lines = [
      `Location: ${data.location}`,
      `Date: ${data.date}`,
      `Conditions: ${getWeatherIcon(data.weathercode)}`,
      `Min Temp: ${data.minTemp.toFixed(1)} °C`,
      `Max Temp: ${data.maxTemp.toFixed(1)} °C`,
      "",
      "Raw data (for debugging):",
      JSON.stringify(data.raw, null, 2)
    ];

    output.textContent = lines.join("\n");

    // Trigger fade-in
    setTimeout(() => output.classList.add("show"), 10);

  } catch (err) {
    output.textContent = "Something went wrong fetching the weather.";

    // Trigger fade-in
    setTimeout(() => output.classList.add("show"), 10);
  }
}