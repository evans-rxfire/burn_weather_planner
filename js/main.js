const htmlElement = document.documentElement;

const propertyName = document.getElementById("propery-name");
const latitutdeInput = document.getElementById("latitude-input");
const longitudeInput = document.getElementById("longitude-input");
const preferredMinTemp = document.getElementById("preferred-min-temp")
const preferredMaxTemp = document.getElementById("preferred-max-temp");
const preferredMinRH = document.getElementById("preferred-min-rh");
const preferredMaxRH = document.getElementById("preferred-max-rh");
const preferredMinWindSpeed = document.getElementById("preferred-min-wind-speed");
const preferredMaxWindSpeed = document.getElementById("preferred-max-wind-speed");
const preferredWindDirs = Array.from(document.querySelectorAll('input[name="preferredWindDir"]:checked')).map((el) => el.value);
const acceptableMinTemp = document.getElementById("acceptable-min-temp");
const acceptableMaxTemp = document.getElementById("acceptable-max-temp");
const acceptableMinRH = document.getElementById("acceptable-min-rh");
const acceptableMaxRH = document.getElementById("acceptable-max-rh");
const acceptableMinWindSpeed = document.getElementById("acceptable-min-wind-speed");
const acceptableMaxWindSpeed = document.getElementById("acceptable-max-wind-speed");
const acceptableWindDirs = Array.from(document.querySelectorAll('input[name="acceptableWindDir"]:checked')).map((el) => el.value);

const outputContainer = document.getElementById("output-container");

const sumbitBtn = document.getElementById("sumbit-button");
const saveBtn = document.getElementById("save-button");
const clearBtn = document.getElementById("clear-button");
const darkModeBtn = document.getElementById("dark-mode-toggle");


if (darkModeBtn) {
    darkModeBtn.addEventListener("click", () => {
        htmlElement.classList.toggle("dark");
        localStorage.setItem("theme", htmlElement.classList.contains("dark") ? "dark" : "light");
    });

    window.addEventListener("DOMContentLoaded", () => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            htmlElement.classList.add("dark");
        }
    });
}


// FUNCTIONS
// get data from weather API
function fetchForecastData() {
    fetch(`https://api.weather.gov/points/${latitutdeInput},${longitudeInput}`)
        .then()
        .catch()
}

// functions to work through weather forecast data
function isTempPreferred(hour) {
    if (temp[hour].value >= preferredMinTemp && temp[hour].value <= preferredMaxTemp) {
        return true;
    } else {
        return false;
    }
}

// populate forecast grid in index.html
function buildForecastGrid() {

}

// save form data for future use
function saveFormData() {

}

// clear form data 
function clearFormData() {

}

//clear forecast grid
function clearForecastGrid() {
    outputContainer.innerHTML = "";
}

// EVENT LISTENERS
sumbitBtn.addEventListener("click", () => {
    clearForecastGrid();
    fetchForecastData();
    buildForecastGrid();
});

saveBtn.addEventListener("click", () => {
    saveFormData();
});

clearBtn.addEventListener("click", () => {
    clearForecastGrid();
    clearForecastGrid();
});