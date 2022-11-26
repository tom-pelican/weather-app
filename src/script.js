//Datum
function formatDatum(now) {
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
let formattedDate = formatDatum(new Date());
dateElement.innerHTML = formattedDate;

//search form
function getForecast(coordinates) {
  let lat = coordinates.latitude;
  let lon = coordinates.longitude;
  let apiUrl = `${apiEndpoint}forecast?lat=${lat}&lon=${lon}&key=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  let description = response.data.condition.description;
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
  let iconElement = document.querySelector("#icon-0");
  iconElement.setAttribute("src", `Images/Icon_${currentIcon}.svg`);

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

searchFormElement.addEventListener("search", search);
searchButtonElement.addEventListener("click", search);
currentLocationElement.addEventListener("click", getCurrentLocation);

getCurrentLocation();

//celsius or fahrenheit
function changeToCelsius() {
  tempTodayElement.innerHTML = Math.round(celciusTemperature);
  celsiusElement.setAttribute("class", "selected");
  fahrenheitElement.setAttribute("class", "disabled");
}

function changeToFahrenheit() {
  tempTodayElement.innerHTML = Math.round(fahrenheitTemperature);
  celsiusElement.setAttribute("class", "disabled");
  fahrenheitElement.setAttribute("class", "selected");
}

let tempTodayElement = document.querySelector("#temp-today");
let celsiusElement = document.querySelector("#celcius");
let fahrenheitElement = document.querySelector("#fahrenheit");
celsiusElement.addEventListener("click", changeToCelsius);
fahrenheitElement.addEventListener("click", changeToFahrenheit);

//display the forecast
function displayForecast(response) {
  console.log(response);

  let forecastElement = document.querySelector("#weather-forecast");
  let forecastHTML = "";

  let days = response.data.daily;

  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
  <div class="col-2">
    <img class="img-responsive" src='Images/Icon_${
      day.condition.icon
    }.svg' alt="Sunny" />
    <div class="weather-forecast-date">${day}</div>
    <div class="weather-forecast-temperatures">
      <span class="weather-forecast-temperature-max">${Math.round(
        day.temperature.maximum
      )}°</span>
      <span class="weather-forecast-temperature-min">${Math.round(
        day.temperature.minimum
      )}°</span>
    </div>
  </div>
  `;
  });

  forecastElement.innerHTML = forecastHTML;
}
