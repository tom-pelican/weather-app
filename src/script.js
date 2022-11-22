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
function displayWeather(response) {
  console.log(response);
  let rainElement = document.querySelector("#rain");
  if (response.data.rain) {
    let currentPrecip = response.data.rain["1h"];
    rainElement.innerHTML = `${currentPrecip} mm`;
  } else {
    rainElement.innerHTML = "0 mm";
  }

  const currentTemp = Math.round(response.data.main.temp);
  let tempTodayElement = document.querySelector("#temp-today");
  tempTodayElement.innerHTML = currentTemp;

  let city = response.data.name;
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = city;

  let currentHum = response.data.main.humidity;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `${currentHum}%`;

  let currentWind = response.data.wind.speed;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = `${currentWind} km/h`;
}

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input").value;
  let apiUrl = `${apiEndpoint}?q=${searchInput}&appid=${apiKey}&units=${unit}`;
  if (searchInput) {
    axios.get(apiUrl).then(displayWeather);
  } else {
    return;
  }
}

function myLocation(location) {
  let lat = location.coords.latitude;
  let lon = location.coords.longitude;
  let apiUrl = `${apiEndpoint}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayWeather);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(myLocation);
}

let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
let apiKey = "f09d3949047ab6c9e3bcaf79cf61f619";
let unit = "metric";

let searchFormElement = document.querySelector("#search-form");
let searchButtonElement = document.querySelector("#search-button");
let currentLocationElement = document.querySelector("#current-location");

searchFormElement.addEventListener("search", search);
searchButtonElement.addEventListener("click", search);
currentLocationElement.addEventListener("click", getCurrentLocation);

getCurrentLocation();

//celsius or fahrenheit
function changeToCelsius() {
  celsiusElement.classList.remove("disabled");
  celsiusElement.classList.add("selected");
  fahrenheitElement.classList.remove("selected");
  fahrenheitElement.classList.add("disabled");
}

function changeToFahrenheit() {
  tempTodayElement.innerHTML = Math.round(19 * 1.8 + 32);
  fahrenheitElement.classList.remove("disabled");
  fahrenheitElement.classList.add("selected");
  celsiusElement.classList.remove("selected");
  celsiusElement.classList.add("disabled");
}

let tempTodayElement = document.querySelector("#temp-today");
let celsiusElement = document.querySelector("#celcius");
let fahrenheitElement = document.querySelector("#fahrenheit");
celsiusElement.addEventListener("click", changeToCelsius);
fahrenheitElement.addEventListener("click", changeToFahrenheit);
