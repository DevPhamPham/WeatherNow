const axios = require('axios');

class WeatherAPI{
  async getWeatherData(cityId) {
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=b520bb88e33296ef9ee9941b34e09f25&units=metric`;
    try {
      const response = await axios.get(url);
      const data = response.data;
      const weatherData = {
        city: data.name,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description
      };
      return weatherData;
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong. Please try again later.');
    }
  }
}

module.exports = new WeatherAPI();