// Weather App
class WeatherApp {
    constructor() {
        this.cityInput = document.getElementById("cityInput");
        this.btn = document.getElementById("btn");
        this.icon = document.querySelector(".icon");
        this.weatherBox = document.querySelector(".weather-box");
        this.weatherLocation = document.querySelector(".weather-location");
        this.temperature = document.querySelector(".temperature");
        this.description = document.querySelector(".description");
        this.loading = document.querySelector(".loading");
        this.toastContainer = document.querySelector("#toast-container");

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.btn.addEventListener("click", () => this.handleSearch());

        this.cityInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSearch();
            }
        });
    }

    handleSearch() {
        const city = this.cityInput.value.trim();
        if (city) {
            this.getWeather(city);
        }
    }

    async getWeather(city) {
        this.showLoading(true);
        this.weatherBox.classList.add('hide');

        try {
            const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 404) {
                    this.showToast(`City "${city}" not found`, 'error');
                } else if (response.status === 401 || response.status === 429) {
                    this.showToast('Weather service is temporarily unavailable', 'error');
                } else {
                    this.showToast(data.error || 'Failed to fetch weather data', 'error');
                }
                return;
            }

            this.displayWeather(data);
        } catch (error) {
            console.error(error);
            this.showToast('Failed to reach weather service. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    displayWeather(data) {
        const iconCode = data.weather[0].icon;
        this.icon.replaceChildren(this.createIcon(iconCode, data.weather[0].description));

        this.weatherLocation.textContent = `${data.name}, ${data.sys.country}`;
        this.temperature.textContent = `${data.main.temp.toFixed(1)}°C`;
        this.description.textContent = data.weather[0].description;

        this.weatherBox.classList.remove('hide');
        this.cityInput.value = '';
    }

    createIcon(code, alt) {
        const img = document.createElement('img');
        img.src = `https://openweathermap.org/img/wn/${code}@2x.png`;
        img.alt = alt || 'Weather icon';
        return img;
    }

    showLoading(isLoading) {
        this.loading.classList.toggle('hide', !isLoading);
    }

    showToast(message, type = 'error') {
        if (window.TerminalUtils) {
            window.TerminalUtils.showToast(message, type);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});
