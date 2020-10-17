function formatDate(timestamp) {
  let date = new Date(timestamp);
  let dateMilliseconds = Date.parse(date);
  let utcTimezoneOffset = date.getTimezoneOffset();
  date = new Date(dateMilliseconds + (utcTimezoneOffset * 60 * 1000));
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let dateNumber = date.getDate();
  let ordinals;
  if (dateNumber === 1 || dateNumber === 21 || dateNumber === 31) {
    ordinals = "st";
  } else if (dateNumber === 2 || dateNumber === 22) {
    ordinals = "nd";
  } else if (dateNumber === 3 || dateNumber === 23) {
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
  let month = months[date.getMonth()];
  return `${day} ${dateNumber}${ordinals} ${month}`;
}

function formatTime(timestamp) {
  let time = new Date(timestamp);
  let dateMilliseconds = Date.parse(time);
  let utcTimezoneOffset = time.getTimezoneOffset();
  time = new Date(dateMilliseconds + (utcTimezoneOffset * 60 * 1000));
  let hours = time.getHours();
  let minutes = ("0" + time.getMinutes()).slice(-2);
  let amPm = document.querySelector("#am-pm");
  if (hours >= 12) {
    amPm.innerHTML = "pm";
  } else {
    amPm.innerHTML = "am";
  }
  return `${hours}:${minutes}`;
}

const conditionsToIcons = {
  clear: "fa-sun",
  clouds: "fa-cloud",
  rain: "fa-cloud-showers-heavy",
  drizzle: "fa-cloud-sun-rain",
  thunderstorm: "fa-bolt",
  snow: "fa-snowflake",
  mist: "fa-smog",
  smoke: "fa-smog",
  haze: "fa-smog",
  fog: "fa-smog",
  dust: "fa-smog",
  ash: "fa-smog",
  squall: "fa-smog",
  tornado: "fa-smog",
};

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`
  }
  
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`
  }
  
  return `${hours}:${minutes}`
}

let currentIconClass;

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temp");
  let cityElement = document.querySelector("#city");
  let conditionsElement = document.querySelector("#conditions");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let feelsLikeElement = document.querySelector("#feels-like");
  let dateElement = document.querySelector("#date");
  let timeElement = document.querySelector("#current-time");
  let iconElement = document.querySelector("#icon");
  celciusTemperature = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(celciusTemperature);
  cityElement.innerHTML = response.data.name;
  conditionsElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = `${response.data.main.humidity}%`;
  windSpeedElement.innerHTML = `${Math.round(response.data.wind.speed)}km/h`;
  feelsLikeElement.innerHTML = `${Math.round(response.data.main.feels_like)}°C`;
  let currentUtcTimestamp = new Date().getTime();
  let timezoneOffset = response.data.timezone * 1000;
  dateElement.innerHTML = formatDate(currentUtcTimestamp + timezoneOffset);
  timeElement.innerHTML = formatTime(currentUtcTimestamp + timezoneOffset);

  let iconClass =
    conditionsToIcons[response.data.weather[0].main.toLowerCase()];
  if (currentIconClass) {
    iconElement.classList.remove(currentIconClass);
  }
  iconElement.classList.add(iconClass);
  currentIconClass = iconClass;
}


function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 5; index ++) {
  forecast = response.data.list[index];
  let forecastIconClass = conditionsToIcons[response.data.list[0].weather[0].main.toLowerCase()];
  forecastElement.innerHTML += 
          `<div class="col">
            <i class="fas ${forecastIconClass}"></i> <br />
            ${formatHours(forecast.dt * 1000)}
          </div>`;
  }
}

function search(city) {
  let apiKey = "cd1b9c21f5e4554f5edf21cc918b902c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(displayTemperature);
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
  axios.get(apiUrl).then(displayForecast)
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function displayFarenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temp")
  celciusLink.classList.remove("active");
  farenheitLink.classList.add("active");
  let farenheitTemperature = (celciusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(farenheitTemperature);
}

function displayCelciusTemperature(event) {
  event.preventDefault();
  celciusLink.classList.add("active");
  farenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temp");
  temperatureElement.innerHTML = Math.round(celciusTemperature);
}

let celciusTemperature = null;

let searchCityForm = document.querySelector("#search-city-button");
searchCityForm.addEventListener("click", handleSubmit);

let farenheitLink = document.querySelector("#farenheit-link");
farenheitLink.addEventListener("click", displayFarenheitTemperature);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", displayCelciusTemperature);

search("New York");

function displayCurrentLocation(results) {
  let currentLocation = results.data.results[0].address_components[3].long_name;
  cityElement = document.querySelector("h1");
  cityElement.innerHTML = currentLocation;
  search(currentLocation);
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



let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCoordinates);

