const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (Ensure it correctly serves your index.html)
app.use(express.static(__dirname));

// Route for serving the homepage
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route for handling the weather API request
app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = "765636232ea242dae071ced28f68501c";
  const units = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${units}`;

  https
    .get(url, function (response) {
      if (response.statusCode !== 200) {
        return res.send("<h2>City not found. Please try again.</h2>");
      }

      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imgURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        res.send(`
            <html>
            <head>
                <title>Weather App</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .weather-container {
                        background: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        width: 350px;
                    }
                    h2 {
                        color: #333;
                        font-size: 20px;
                        margin-bottom: 10px;
                    }
                    h1 {
                        color: #007BFF;
                        font-size: 26px;
                        margin-bottom: 15px;
                    }
                    img {
                        width: 100px;
                        height: 100px;
                    }
                    .back-btn {
                        display: inline-block;
                        text-decoration: none;
                        background-color: #007BFF;
                        color: white;
                        padding: 10px 15px;
                        font-size: 16px;
                        border-radius: 5px;
                        transition: 0.3s;
                        margin-top: 15px;
                    }
                    .back-btn:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="weather-container">
                    <h2>The weather in <strong>${query}</strong> is currently:</h2>
                    <img src="${imgURL}" alt="Weather Icon">
                    <h1>${temp}°C</h1>
                    <h2>${
                      weatherDescription.charAt(0).toUpperCase() +
                      weatherDescription.slice(1)
                    }</h2>
                    <a class="back-btn" href="/">Check another city</a>
                </div>
            </body>
            </html>
        `);
      });
    })
    .on("error", function () {
      res.send("<h2>Unable to fetch weather data. Try again later.</h2>");
    });
});

// Start the server on port 3000
app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});
