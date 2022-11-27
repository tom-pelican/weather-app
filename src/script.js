//Datum
function formatDate(now) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let date = now.getDate();
  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let hour = now.getHours();
  let minutes = now.getMinutes();

  if (hour < 10) {
    hour = `0${hour}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${date} ${month} ${hour}:${minutes}`;
}

let dateElement = document.querySelector("#current-date");
let formattedDate = formatDate(new Date());
dateElement.innerHTML = formattedDate;

//search form
function getForecast(coordinates) {
  let lat = coordinates.latitude;
  let lon = coordinates.longitude;
  let apiUrl = `${apiEndpoint}forecast?lat=${lat}&lon=${lon}&key=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  console.log(response);
  let description = response.data.condition.description;
  description = description.charAt(0).toUpperCase() + description.slice(1);
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = description;

  celciusTemperature = response.data.temperature.current;
  fahrenheitTemperature = celciusTemperature * 1.8 + 32;

  let currentTemp = Math.round(celciusTemperature);
  let tempTodayElement = document.querySelector("#temp-today");
  tempTodayElement.innerHTML = currentTemp;

  let city = response.data.city;
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = city;

  let currentHum = response.data.temperature.humidity;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `${currentHum}%`;

  let currentWind = Math.round(response.data.wind.speed);
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = `${currentWind} km/h`;

  let currentIcon = response.data.condition.icon;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src", `Images/Icon_${currentIcon}.svg`);
  iconElement.setAttribute("alt", currentIcon);

  celsiusElement.setAttribute("class", "selected");
  fahrenheitElement.setAttribute("class", "disabled");

  getForecast(response.data.coordinates);
}

function search(event) {
  event.preventDefault();
  searchInput = document.querySelector("#search-input").value;
  let apiUrl = `${apiEndpoint}current?query=${searchInput}&key=${apiKey}&units=${unit}`;
  if (searchInput) {
    axios.get(apiUrl).then(displayWeather);
  } else {
    return;
  }
}

function myLocation(location) {
  let lat = location.coords.latitude;
  let lon = location.coords.longitude;
  let apiUrl = `${apiEndpoint}current?lon=${lon}&lat=${lat}&key=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayWeather);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(myLocation);
}

let apiEndpoint = "https://api.shecodes.io/weather/v1/";
let apiKey = "7ctdc077a2e3a3ado6fe94bb8949bd5b";
let unit = "metric";

let searchFormElement = document.querySelector("#search-form");
let searchButtonElement = document.querySelector("#search-button");
let currentLocationElement = document.querySelector("#current-location");

let celciusTemperature = null;
let fahrenheitTemperature = null;
let forecastTempCelMax = [];
let forecastTempCelMin = [];
let forecastTempFahrMax = [];
let forecastTempFahrMin = [];

searchFormElement.addEventListener("search", search);
searchButtonElement.addEventListener("click", search);
currentLocationElement.addEventListener("click", getCurrentLocation);

getCurrentLocation();

//display the forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

function displayForecast(response) {
  forecastTempCelMax = [];
  forecastTempCelMin = [];
  forecastTempFahrMax = [];
  forecastTempFahrMin = [];

  let forecastElement = document.querySelector("#weather-forecast");
  let forecastHTML = "";

  let days = response.data.daily;

  days.forEach(function (day, index) {
    if (index > 0) {
      forecastTempCelMax.push(Math.round(day.temperature.maximum));
      forecastTempCelMin.push(Math.round(day.temperature.minimum));
      forecastTempFahrMax.push(Math.round(day.temperature.maximum / 1.8 + 32));
      forecastTempFahrMin.push(Math.round(day.temperature.minimum / 1.8 + 32));

      forecastHTML =
        forecastHTML +
        `<div class="col-2">
          <img class="img-responsive" src='Images/Icon_${
            day.condition.icon
          }.svg' alt="Sunny" />
          <div class="weather-forecast-date">${formatDay(day.time)}</div>
          <div class="weather-forecast-temperatures">
            <span class="weather-forecast-temperature-max" id="tempmax${index}">${Math.round(
          day.temperature.maximum
        )}°</span>
            <span class="weather-forecast-temperature-min" id="tempmin${index}">${Math.round(
          day.temperature.minimum
        )}°</span>
          </div>
        </div>`;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

//celsius or fahrenheit
function changeToCelsius() {
  tempTodayElement.innerHTML = Math.round(celciusTemperature);
  celsiusElement.setAttribute("class", "selected");
  fahrenheitElement.setAttribute("class", "disabled");

  let maxTempForecastElements = document.getElementsByClassName(
    "weather-forecast-temperature-max"
  );
  let minTempForecastElements = document.getElementsByClassName(
    "weather-forecast-temperature-min"
  );

  Array.from(maxTempForecastElements).forEach(function changeMaxFahr(
    day,
    index
  ) {
    day.innerHTML = `${forecastTempCelMax[index]}°`;
  });
  Array.from(minTempForecastElements).forEach(function changeMinFahr(
    day,
    index
  ) {
    day.innerHTML = `${forecastTempCelMin[index]}°`;
  });
}

function changeToFahrenheit() {
  tempTodayElement.innerHTML = Math.round(fahrenheitTemperature);
  celsiusElement.setAttribute("class", "disabled");
  fahrenheitElement.setAttribute("class", "selected");

  let maxTempForecastElements = document.getElementsByClassName(
    "weather-forecast-temperature-max"
  );
  let minTempForecastElements = document.getElementsByClassName(
    "weather-forecast-temperature-min"
  );

  Array.from(maxTempForecastElements).forEach(function changeMaxFahr(
    day,
    index
  ) {
    day.innerHTML = `${forecastTempFahrMax[index]}°`;
  });
  Array.from(minTempForecastElements).forEach(function changeMinFahr(
    day,
    index
  ) {
    day.innerHTML = `${forecastTempFahrMin[index]}°`;
  });
}

let tempTodayElement = document.querySelector("#temp-today");
let celsiusElement = document.querySelector("#celcius");
let fahrenheitElement = document.querySelector("#fahrenheit");
celsiusElement.addEventListener("click", changeToCelsius);
fahrenheitElement.addEventListener("click", changeToFahrenheit);
