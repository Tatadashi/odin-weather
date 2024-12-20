import "./style.css";

async function getWeather(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=GG46V6MMQ8NP36L2MC9XM3LWP&contentType=json`,
      { mode: "cors" }
    );
    const responseJSON = await response.json();
    const place = responseJSON.resolvedAddress;
    const days = responseJSON.days;
    const icons = makeDayArrayFromJSON(days, "icon");
    const dates = makeDayArrayFromJSON(days, "datetime");
    const temps = makeDayArrayFromJSON(days, "temp");
    const fahrenheit = convertCelsiusToFahrenheit(temps);

    updateWeather(dates, fahrenheit, icons, place);
  } catch (error) {
    alert("Location Not Found");
  }
}

function makeDayArrayFromJSON(json, data) {
  const array = [];
  json.forEach((day) => {
    const specifiedData = day[data];
    array.push(specifiedData);
  });

  return array;
}

function updateWeather(dates, temps, icons, place) {
  showCurrentDayData(dates, temps, icons, place);
  showDayData(dates, "date");
  showDayData(temps, "temp");
  showDayData(icons, "N/A", true);
}

function showCurrentDayData(dates, temps, icons, place) {
  const location = document.getElementById("location");
  location.textContent = place;

  const currentDay = document
    .getElementById("current-day")
    .querySelector(".day");
  currentDay.querySelector(".date").textContent = dates[0];
  currentDay.querySelector(".temp").textContent = temps[0];

  const currentDayIcon = currentDay.querySelector("img");
  setDayIcon(currentDayIcon, icons[0]);
  currentDayIcon.alt = icons[0];
}

function showDayData(data, dataName, isIcon = false) {
  const days = document
    .getElementById("days-container")
    .querySelectorAll(".day");

  //current day not included, so starts at 1
  let iterator = 1;
  days.forEach((day) => {
    if (isIcon) {
      day = day.querySelector("img");
      setDayIcon(day, data[iterator]);
      day.alt = data[iterator];
      iterator++;
    } else {
      day = day.querySelector(`.${dataName}`);
      day.textContent = data[iterator];
      iterator++;
    }
  });
}

async function getIconUrlWithName(iconName) {
  const iconUrl = await import(`./icons/${iconName}.svg`);
  //iconUrl is module, iconUrl.default is url
  return iconUrl.default;
}

async function setDayIcon(day, iconName) {
  const iconUrl = await getIconUrlWithName(iconName);
  day.src = iconUrl;
}

function addTempChangeButton() {
  const tempButton = document.getElementById("temperature-button");
  tempButton.addEventListener("click", (e) => {
    changeTemperature();
  });
}

function changeTemperature() {
  const currentScale = checkTemperatureScale();
  const currentTempsArray = getTemps();
  let newTempsArray = [];

  if (currentScale == "F") {
    newTempsArray = convertFahrenheitToCelsius(currentTempsArray);
  } else if (currentScale == "C") {
    newTempsArray = convertCelsiusToFahrenheit(currentTempsArray);
  }

  updateTemps(newTempsArray);
}

function checkTemperatureScale() {
  const currentDayTemp = document
    .getElementById("current-day")
    .querySelector(".temp").textContent;
  const currentTempScale = currentDayTemp.slice(-1);

  return currentTempScale;
}

function getTemps() {
  const tempsArray = [];
  const temps = document.querySelectorAll(".temp");
  temps.forEach((temp) => {
    tempsArray.push(temp.textContent);
  });

  return tempsArray;
}

function convertCelsiusToFahrenheit(temps) {
  const newTemps = [];
  temps.forEach((celsius) => {
    //remove symbol before doing math conversion and adding new symbol
    celsius = celsius.toString();
    celsius = celsius.replace("°C", "");
    celsius = Number(celsius);

    let fahrenheit = (celsius * 9) / 5 + 32;
    fahrenheit = roundToTwoDecimals(fahrenheit);
    fahrenheit = fahrenheit.toString() + "°F";
    newTemps.push(fahrenheit);
  });

  return newTemps;
}

function convertFahrenheitToCelsius(temps) {
  const newTemps = [];
  temps.forEach((fahrenheit) => {
    //remove symbol before doing math conversion and adding new symbol
    fahrenheit = fahrenheit.toString();
    fahrenheit = fahrenheit.replace("°F", "");
    fahrenheit = Number(fahrenheit);

    let celsius = (5 / 9) * (fahrenheit - 32);
    celsius = roundToTwoDecimals(celsius);
    celsius = celsius.toString() + "°C";
    newTemps.push(celsius);
  });

  return newTemps;
}

function roundToTwoDecimals(num) {
  //negative nums such as -1.5 Math.round to -1 rather than -2 so have to Math.round positive and convert back negative
  if (num < 0) {
    num = (Math.sign(num) * Math.round(Math.abs(num) * 100)) / 100;
  } else {
    num = Math.round(num * 100) / 100;
  }

  return num;
}

function updateTemps(tempsArray) {
  const temps = document.querySelectorAll(".temp");
  let iterator = 0;
  temps.forEach((temp) => {
    temp.textContent = tempsArray[iterator];
    iterator++;
  });
}

function addSearchButton() {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showAllData();

    let formData = new FormData(form);
    const location = formData.get("location");
    getWeather(location);
  });
}

function showAllData() {
  const location = document.getElementById("location");
  const currentDay = document.getElementById("current-day");
  const daysContainer = document.getElementById("days-container");
  const temperatureButton = document.getElementById("temperature-button");
  location.style.visibility = "visible";
  currentDay.style.visibility = "visible";
  daysContainer.style.visibility = "visible";
  temperatureButton.style.visibility = "visible";
}

addSearchButton();
addTempChangeButton();
