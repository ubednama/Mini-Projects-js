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

        this.apiKey = 'a5ac660febdf0fe62cea0ca919ac01f7'; // Using existing key

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.btn.addEventListener("click", () => this.handleSearch());

        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSearch();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
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
        this.showLoading(true);
        this.weatherBox.classList.add('hide');

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("City not found");
                }
                return response.json();
            })
            .then(data => {
                this.showLoading(false);
                if (data.cod === 200) {
                    this.displayWeather(data);
                } else {
                    this.showToast(`Error: City "${city}" not found`, 'error');
                }
            })
            .catch(error => {
                this.showLoading(false);
                console.error(error);
                this.showToast('Failed to fetch weather data. Please try again.', 'error');
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
        this.cityInput.value = '';
    }

    showLoading(isLoading) {
        if (isLoading) {
            this.loading.classList.remove('hide');
        } else {
            this.loading.classList.add('hide');
        }
    }

    showToast(message, type = 'error') {
        if (!this.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;

        this.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});