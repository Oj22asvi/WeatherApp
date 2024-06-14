//step1--->acess all the custom Attributes and Classes
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const errorPage=document.querySelector(".error");


// step2 -->introduce varriables
let oldTab = userTab;
const API_KEY = "0e2fd925ba2beeb36830176aad5dd7df";
oldTab.classList.add("current-tab");

getfromSessionStorage();



function switchTab(newTab) {  //user tab
    if (oldTab != newTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            errorPage.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorPage.classList.remove("active");
            getfromSessionStorage();
        }
    }
}
//switching of tab
userTab.addEventListener('click', () => {
    switchTab(userTab);
});

searchTab.addEventListener('click', () => {
    switchTab(searchTab);
});

//chk whether coordinates are present in local storage or not
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    
    if (!localCoordinates) {
        //agar local coordinates nhi mile
      
        grantAccessContainer.classList.add("active");
    }
    else {
        //agar pade h toh hme api call mein bhejne padenge
        //json string-----json object
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates) {
    // we have fetch latitude and longitude from coordinates
    const latitude=coordinates.lat;
    const longitude=coordinates.lon;
    
    // const { lati, long } = coordinates;
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loding container visible
    loadingScreen.classList.add("active");
    try {
        // const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        // const response = await fetch(`https:api.openweathermap.org/data/2.5/weather?lat=${latitude} & lon=${longitude} &appid=0e2fd925ba2beeb36830176aad5dd7df`);
        const response= await fetch (`https:api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=0e2fd925ba2beeb36830176aad5dd7df`);
        ;
        const data =await response.json();
        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove("active");
        //hw
    }

}
function renderWeatherInfo(weatherInfo) {
   
   
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    //https://flagcdn.com/144`
    //step2 insert values in all the fetch element
    // fetch values from weatherInfo object and put it in ui
    //?.-->optional chaining operator
    try{
    
    cityName.innerText= weatherInfo?.name;
    let city=weatherInfo?.sys?.country.toLowerCase();
    
    countryIcon.src=`https://flagcdn.com/16x12/${city}.png`;

    // countryIcon.src = `https://flagcdn.com/${city}/codes.json`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    // console.log(desc);
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
    }
    catch(exp){
        // console.log(404);
        // userInfoContainer.classList.remove("active");
        // errorPage.classList.add(active);
    }
}
//jab bhi grant acess pe click karu
//2 thinngs
//1.curr location found karo using geolocation 
//2.usse session storage mein bhej do
// const grantAccessButton=document.querySelector();   
grantAccessButton.addEventListener("click", getLocation);
function getLocation() {
    if (navigator.geolocation) {
        console.log("bye");
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        console.log("NO geoloaction Support");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    
    const ans = JSON.stringify(userCoordinates);
  
    sessionStorage.setItem("user-coordinates", ans);
    
    fetchUserWeatherInfo(userCoordinates);
    
}

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    // console.count("modi"+cityName);
    if (cityName === "")
        return;
    else {
        fetchSearchWeatherInfo(cityName);
    }

})
async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0e2fd925ba2beeb36830176aad5dd7df`);
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?city=${city}&units=metric`);
        // const url =await fetch( `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        const data = await response.json();
       
        console.log(data);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        
    }
    catch(err){

    }
    
}













