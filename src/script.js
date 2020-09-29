function displayTime() {
  let currentTime = new Date();
  let hour = currentTime.getHours();
  let minutes = ("0" + currentTime.getMinutes()).slice(-2);
  let formattedTime = `${hour}:${minutes}`;
  let time = document.querySelector("#current-time");
  time.innerText = formattedTime;
  let amPm = document.querySelector("#am-pm");
  if (hour >= 12) {
    amPm.innerHTML = "pm";
  } else {
    amPm.innerHTML = "am";
  }
}

function displayDate() {
  let date = document.querySelector("h2");
  let currentDate = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[currentDate.getDay()];
  let currentDateNumber = currentDate.getDate();
  let ordinals;
  if (
    currentDateNumber === 1 ||
    currentDateNumber === 21 ||
    currentDateNumber === 31
  ) {
    ordinals = "st";
  } else if (currentDateNumber === 2 || currentDateNumber === 22) {
    ordinals = "nd";
  } else if (currentDateNumber === 3 || currentDateNumber === 23) {
    ordinals = "rd";
  } else {
    ordinals = "th";
  }
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
  let currentMonth = months[currentDate.getMonth()];
  let formattedDate = `${currentDay} ${currentDateNumber}${ordinals} ${currentMonth}`;
  date.innerHTML = formattedDate;
}

function displayCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city");
  let cityInput = document.querySelector("#city-input");
  city.innerHTML = capitalizeFirstLetter(cityInput.value);
  retrieveWeather();
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function changeToCelcius() {
  let celcius = document.querySelector("#celcius");
  let farenheit = document.querySelector("#farenheit");
  let temp = document.querySelector("#temp");
  temp.innerHTML = "17";
  celcius.style.fontWeight = "bold";
  farenheit.style.fontWeight = "normal";
}

function changeToFarenheit() {
  let farenheit = document.querySelector("#farenheit");
  let celcius = document.querySelector("#celcius");
  let temp = document.querySelector("#temp");
  temp.innerHTML = "66";
  farenheit.style.fontWeight = "bold";
  celcius.style.fontWeight = "normal";
}

function displayTemperature(response) {
  let tempData = response.data.main.temp;
  let tempElement = document.querySelector("#temp");
  tempData = Math.round(tempData);
  tempElement.innerHTML = tempData;
}

function displayConditions(response) {
  let conditionsData = response.data.weather[0].description;
  let conditionsElement = document.querySelector("#conditions");
  conditionsElement.innerHTML = conditionsData;
}

function displayHumidity(response) {
  let humidityData = response.data.main.humidity;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerText = `${humidityData}%`;
}

function displayWindSpeed(response) {
  let windSpeedData = response.data.wind.speed;
  windSpeedData = Math.round(windSpeedData);
  let windSpeedElement = document.querySelector("#wind-speed");
  windSpeedElement.innerText = `${windSpeedData}mph`;
}

function displayFeelsLike(response) {
  let feelsLikeData = response.data.main.feels_like;
  feelsLikeData = Math.round(feelsLikeData);
  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerText = `${feelsLikeData}°C`;
}

function displayCurrentLocation(results) {
  let currentLocation = results.data.results[0].address_components[3].long_name;
  cityElement = document.querySelector("h1");
  cityElement.innerHTML = currentLocation;
  retrieveWeather();
}
function getCoordinates(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
}

function getCurrentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = `AIzaSyAR7b8bSwV8L3zhkJ04zf8JfvtuZVh0ezs`;
  let apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  axios.get(apiUrl).then(displayCurrentLocation);
}

function retrieveWeather() {
  let units = "metric";
  let city = document.querySelector("h1").innerText;
  let apiKey = "cd1b9c21f5e4554f5edf21cc918b902c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then((response) => {
    displayTemperature(response);
    displayConditions(response);
    displayHumidity(response);
    displayWindSpeed(response);
    displayFeelsLike(response);
  });
}

let farenheitButton = document.querySelector("#farenheit");
farenheitButton.addEventListener("click", changeToFarenheit);

let searchCityForm = document.querySelector("#search-city-button");
searchCityForm.addEventListener("click", displayCity);

let celciusButton = document.querySelector("#celcius");
celciusButton.addEventListener("click", changeToCelcius);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCoordinates);

retrieveWeather();
displayTime();
displayDate();
