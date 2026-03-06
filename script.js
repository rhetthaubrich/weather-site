async function getWeather() {
  const loc = document.getElementById("location").value;
  const date = document.getElementById("date").value;
  const output = document.getElementById("output");

  if (!loc || !date) {
    output.textContent = "Please enter both a location and a date.";
    return;
  }

  output.textContent = "Loading...";

  try {
    const res = await fetch(`/api/weather?loc=${encodeURIComponent(loc)}&date=${date}`);
    const data = await res.json();

    if (data.error) {
      output.textContent = "Error: " + data.error;
      return;
    }

    const lines = [
      `Location: ${data.location}`,
      `Date: ${data.date}`,
      `Min Temp: ${data.minTemp.toFixed(1)} °C`,
      `Max Temp: ${data.maxTemp.toFixed(1)} °C`,
      "",
      "Raw data (for debugging):",
      JSON.stringify(data.raw, null, 2)
    ];

    output.textContent = lines.join("\n");
  } catch (err) {
    output.textContent = "Something went wrong fetching the weather.";
  }
}