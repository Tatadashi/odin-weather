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

    console.log(responseJSON);
    console.log(place);
    console.log(dates);
    console.log(icons);
    console.log(fahrenheit);
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

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let formData = new FormData(form);
  const location = formData.get("location");
  getWeather(location);
});
