// Weather App with Terminal Integration
class WeatherApp {
    constructor() {
        this.terminal = null;
        this.cityInput = document.getElementById("cityInput");
        this.btn = document.getElementById("btn");
        this.icon = document.querySelector(".icon");
        this.weatherBox = document.querySelector(".weather-box");
        this.weatherLocation = document.querySelector(".weather-location");
        this.temperature = document.querySelector(".temperature");
        this.description = document.querySelector(".description");
        this.loading = document.querySelector(".loading");

        this.apiKey = 'a5ac660febdf0fe62cea0ca919ac01f7'; // Using existing key from original code

        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeTerminal();
    }

    initializeTerminal() {
        if (window.TerminalUtils && window.TerminalUtils.TerminalUI) {
            this.terminal = new window.TerminalUtils.TerminalUI('weather-app');
            this.terminal.log('Weather App v3.0 initialized...', 'system');
            this.terminal.log('Enter a city name to check the weather.', 'info');
        }
    }

    bindEvents() {
        this.btn.addEventListener("click", () => this.handleSearch());

        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSearch();
            }
        });
    }

    handleSearch() {
        if (this.cityInput.value.trim()) {
            const city = this.cityInput.value.trim();
            this.getWeather(city);
        }
    }

    getWeather(city) {
        if (this.terminal) this.terminal.log(`Fetching weather for ${city}...`, 'info');

        this.showLoading(true);
        this.weatherBox.classList.add('hide');

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}`)
            .then(response => response.json())
            .then(data => {
                this.showLoading(false);
                if (data.cod === 200) {
                    this.displayWeather(data);
                } else {
                    if (this.terminal) this.terminal.log(`Error: City "${city}" not found`, 'error');
                }
            })
            .catch(error => {
                this.showLoading(false);
                if (this.terminal) this.terminal.log(`Error: Failed to fetch weather data`, 'error');
                console.error(error);
            });
    }

    displayWeather(data) {
        const iconCode = data.weather[0].icon;
        this.icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather Icon"/>`;

        const weatherCity = data.name;
        const weatherCountry = data.sys.country;
        this.weatherLocation.innerHTML = `${weatherCity}, ${weatherCountry}`;

        let weatherTemp = data.main.temp;
        weatherTemp = (weatherTemp - 273.15).toFixed(1); // Convert Kelvin to Celsius
        this.temperature.innerHTML = `${weatherTemp}°C`;

        const weatherDesc = data.weather[0].description;
        this.description.innerHTML = weatherDesc;

        this.weatherBox.classList.remove('hide');

        if (this.terminal) {
            this.terminal.log(`Response: ${weatherTemp}°C, ${weatherDesc} in ${weatherCity}`, 'success');
        }

        this.cityInput.value = '';
    }

    showLoading(isLoading) {
        if (isLoading) {
            this.loading.classList.remove('hide');
        } else {
            this.loading.classList.add('hide');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});