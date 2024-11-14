async function getInfo() {
  const response = await fetch(
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Rosemead?unitGroup=metric&key=GG46V6MMQ8NP36L2MC9XM3LWP&contentType=json",
    { mode: "cors" }
  );  
  console.log(response.json());
}

getInfo();
