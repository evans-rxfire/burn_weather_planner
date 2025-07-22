# Prescribed Burning Weather Planner

A web-based tool to assist in the prescribed fire planning process by evaluating the seven-day weather forecast for potential burn windows.

## Live Demo

[View the App](https://evans-rxfire.github.io/burn_weather_planner/)

---

## Features

- Retrieves 7-day weather forecast from **National Weather Service** based on user-input lat/long
- Determines which hours in the burn period (0800-2000) are within prescription based on:
  - Temperature
  - Relative Humidity
  - Wind Speed
  - Wind Direction
- The user can input weather parameters for a preferred range fo condtions and a broader acceptable range. 
- Location information (County and State) are provided by **OpenStreeMap**, but not available when using app as PWA. 

---

## How to Use

- Input valid (in Decimal Degress format and within the continental US) latitude and logitiude values.
- Input the range of weather parameters that fit within a preferred and/or acceptable range.
- Submit the prameters to generate a gird showing the 7-day forecast period with each hour color-coded based on how the forecasted conditions compare with input parameters.

### Run Locally

1. Clone this repository:
    ```bash
    git clone https://github.io/evans-rxfire/burn_weather_planner.git

2. Open index.html in you web browser. No build tools or  dependincies required.

---

## Tech Stack

 - HTML5, CSS3, JavaScript
 - Tailwind CSS for styling
 - Designed for modern browsers
 - Uses api.weather.gov for weather forecast data
 - Uses Nominatum for location information

## Background

Prescribed burn planning during the burn season can be difficult when planning for multiple burns in multiple locations. Scanning weather forecasts looking for those conditions needed to meet burn objectives can be a daunting task. This app was designed to lighten that load by allowing users to quickly enter prescription parameters for a given location to get a rough idea of the potential burn windows for the next seven days. 

## Roadmap

- [x] Basic burn location and prescription parameter form
- [x] Fetch weather data and determine prescription status
- [x] Save form data for mutliple runs without need to re-enter inputs
- [x] Hovering over each hour in output will show weather forecast values
- [x] Shows location information (County, State) based on user inputs
- [ ] Responsive mobile interface

## Contributing
Pull requests and feedback are welcome. If you'd like to contribute a feature or report a bug, please open an issue first to dicuss it.

## License
This project is licenced under the [MIT License](LICENSE).

## Acknowledgments

- National Weather Service's API Web Service https://www.weather.gov/documentation/services-web-api is used for forecast data. 
- The FCC lat/long unit converted is referenced or use in converting Degrees Minutes Seconds to Decimal Degrees https://www.fcc.gov/media/radio/dms-decimal
