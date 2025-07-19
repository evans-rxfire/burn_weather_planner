const htmlElement = document.documentElement;

const propertyName = document.getElementById("property-name");
const latitudeInput = document.getElementById("latitude-input");
const longitudeInput = document.getElementById("longitude-input");

const preferred = {
    temp: {
        min: document.getElementById("preferred-min-temp"),
        max: document.getElementById("preferred-max-temp"),
    },
    rh: {
        min: document.getElementById("preferred-min-rh"),
        max: document.getElementById("preferred-max-rh"),
    },
    windSpeed: {
        min: document.getElementById("preferred-min-wind-speed"),
        max: document.getElementById("preferred-max-wind-speed"),
    },
    windDirs: () => getCheckedDirs("preferredWindDir")
};
const acceptable = {
    temp: {
        min: document.getElementById("acceptable-min-temp"),
        max: document.getElementById("acceptable-max-temp"),
    },
    rh: {
        min: document.getElementById("acceptable-min-rh"),
        max: document.getElementById("acceptable-max-rh"),
    },
    windSpeed: {
        min: document.getElementById("acceptable-min-wind-speed"),
        max: document.getElementById("acceptable-max-wind-speed"),
    },
    windDirs: () => getCheckedDirs("acceptabaleWindDir")
};

let forecastPeriods = [];
const structuredForecast = processForecastData(forecastPeriods);
const burnPeriodData = filterBurnPeriods(structuredForecast);
const evaluatedBurnPeriodData = burnPeriodData.map(period => ({
    ...period,
    status: determineStatus(period, preferred, acceptable)
}));

const outputContainer = document.getElementById("output-container");

const submitBtn = document.getElementById("submit-button");
const saveBtn = document.getElementById("save-button");
const clearBtn = document.getElementById("clear-button");

let deferredPrompt;
const installBtn = document.getElementById("install-button");

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
async function fetchForecastData(lat, lon) {
    const pointUrl = `https://api.weather.gov/points/${lat},${lon}`;

    try {
        const pointResponse = await fetch(pointUrl);
        if (!pointResponse.ok) {
            throw new Error(`Point forecast not found (status: ${pointResponse.status})`);
        }
        const pointData = await pointResponse.json();

        const forecastUrl = pointData.properties.forecastHourly;
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error(`Hourly forecast not found (status: ${forecastResponse.status})`);
        }
        const forecastData = await forecastResponse.json();

        return forecastData.properties.periods;
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        throw error;
    }
}

async function loadForecastData(lat, lon) {
  forecastPeriods = await fetchForecastData(lat, lon);
}

// functions to work through weather forecast data
function processForecastData(periods) {
    return periods.map((period) => {
        const dateObj = new Date(period.startTime);
        const hour = String(dateObj.getHours()).padStart(2, '0') + '00';
        const date = dateObj.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit"
    });

        return {
            date: date,
            hour: hour,
            temperature: period.temperature,
            humidity: period.relativeHumidity.value,
            windSpeed: parseInt(period.windSpeed),
            windDir: period.windDirection,
        };
  });
}

function filterBurnPeriods(periods) {
    return periods.filter((period) => {
        const hourInt = parseInt(period.hour);
        return hourInt >= 800 && hourInt <= 2000;
    });
}

function getCheckedDirs(name) {
    return Array.from(document.querySelectorAll('input[name="${name}"]:checked')).map(er => el.value);
}

function determineStatus(period, preferred, acceptable) {
    const { temp, rh, windSpeed, windDir } = period;

    if (
        temp >= preferred.temp.min && temp <= preferred.temp.max &&
        rh >= preferred.rh.min && rh <= preferred.rh.max &&
        windSpeed >= preferred.windSpeed.min && windSpeed <= preferred.windSpeed.max &&
        preferred.windDirs.includes(windDir)
    ) {
        return "preferred";
    } else if (
        temp >= acceptable.temp.min && temp <= acceptable.temp.max &&
        rh >= acceptable.rh.min && rh <= acceptable.rh.max &&
        windSpeed >= acceptable.windSpeed.min && windSpeed <= acceptable.windSpeed.max &&
        acceptable.windDirs.includes(windDir)
    ) {
        return "acceptable";
    } else {
        return "unsuitable";
    }
}

// populate forecast grid in index.html
function buildForecastGrid(evaluatedBurnPeriodData) {
    clearForecastGrid();

    // Group periods by date
    const groupedByDate = evaluatedBurnPeriodData.reduce((groups, period) => {
        if (!groups[period.date]) {
        groups[period.date] = [];
        }
        groups[period.date].push(period);
        return groups;
    }, {});

    // Create a container div to hold all days as columns
    const gridContainer = document.createElement("div");
    gridContainer.className = "flex gap-4";

    // For each date, create a column with hour divs
    for (const [date, periods] of Object.entries(groupedByDate)) {
        const dayColumn = document.createElement("div");
        dayColumn.className = "flex flex-col border border-gray-300 rounded p-2";

        // Date header
        const dateHeader = document.createElement("div");
        dateHeader.textContent = date;
        dateHeader.className = "font-semibold mb-2 text-center";
        dayColumn.appendChild(dateHeader);

        // Hour blocks
        periods.forEach((period) => {
        const hourDiv = document.createElement("div");
        hourDiv.className = `p-2 mb-1 rounded text-sm ${
            period.status === "preferred"
            ? "bg-green-200 dark:bg-green-700"
            : period.status === "acceptable"
            ? "bg-yellow-200 dark:bg-yellow-700"
            : "bg-gray-200 dark:bg-gray-700"
        }`;

        hourDiv.textContent = `${period.hour}`;

        dayColumn.appendChild(hourDiv);
        });

        gridContainer.appendChild(dayColumn);
    }

    outputContainer.appendChild(gridContainer);
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

function showErrorMessage(msg) {
    const errorDiv = document.getElementById("error-message");
    errorDiv.textContent = msg;
    errorDiv.classList.remove("hidden");
}

function clearErrorMessage() {
    const errorDiv = document.getElementById("error-message");
    errorDiv.textContent = "";
    errorDiv.classList.add("hidden");
}


// EVENT LISTENERS
submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    clearForecastGrid();
    clearErrorMessage();

    const lat = parseFloat(latitudeInput.value);
    const lon = parseFloat(longitudeInput.value);

    try {
        await loadForecastData(lat, lon);

        const structuredForecast = processForecastData(forecastPeriods);
        const burnPeriodData = filterBurnPeriods(structuredForecast);
        const evaluatedBurnPeriodData = burnPeriodData.map(period => ({
            ...period,
            status: determineStatus(period, {
                temp: {
                    min: parseFloat(preferred.temp.min.value),
                    max: parseFloat(preferred.temp.max.value)
                },
                rh: {
                    min: parseFloat(preferred.rh.min.value),
                    max: parseFloat(preferred.rh.max.value)
                },
                windSpeed: {
                    min: parseFloat(preferred.windSpeed.min.value),
                    max: parseFloat(preferred.windSpeed.max.value)
                },
                windDirs: preferred.windDirs()
            }, {
                temp: {
                    min: parseFloat(acceptable.temp.min.value),
                    max: parseFloat(acceptable.temp.max.value)
                },
                rh: {
                    min: parseFloat(acceptable.rh.min.value),
                    max: parseFloat(acceptable.rh.max.value)
                },
                windSpeed: {
                    min: parseFloat(acceptable.windSpeed.min.value),
                    max: parseFloat(acceptable.windSpeed.max.value)
                },
                windDirs: acceptable.windDirs()
            })
        }));

        buildForecastGrid(evaluatedBurnPeriodData);

    } catch (error) {
        showErrorMessage("No forecast data found for this location. Please check your latitude and longitude.");
    }
});


saveBtn.addEventListener("click", () => {
    saveFormData();
});

clearBtn.addEventListener("click", () => {
    clearForecastGrid();
});


/*installBtn?.classList.add("hidden");

// Listen for beforeinstallprompt event
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // Prevent automatic prompt
    deferredPrompt = e;

    // Show the install button
    installBtn?.classList.remove("hidden");
});

// Handle install button click
installBtn?.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User choice:", outcome);

    // Reset the deferred prompt variable & hide button
    deferredPrompt = null;
    installBtn?.classList.add("hidden");
});

// Listen for appinstalled event
window.addEventListener("appinstalled", () => {
    console.log("✅ App installed");
    deferredPrompt = null;
    installBtn?.classList.add("hidden");
});
*/