const apiWeather = require('../../api/weather.api')
const fs = require('fs');
const path = require('path');

// Đường dẫn tới file city.json
const cityFilePath = path.join(__dirname, '../../data/city.list.json');
// Đọc file city.json và chuyển đổi thành một đối tượng JavaScript
const citiesData = fs.readFileSync(cityFilePath, 'utf-8');
let cities = JSON.parse(citiesData);

class APIController {
      async getWeather(req,res){
        const cityName = req.query.city;
        const city = cities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
        const cityId = city ? city.id : null;
        const weatherData = await apiWeather.getWeatherData(cityId);
        res.send(weatherData);
      }
  
      async getCities(req, res) {
        try {
          const cityName = req.query.name;
          let filteredCities;
          if (cityName) {
              filteredCities = cities.filter(city => city.name.toLowerCase().includes(cityName.toLowerCase()));
            } else filteredCities = cities;
          res.json(filteredCities);
        } catch (error) {
          console.error(error);
          res.status(500).send('Đã có lỗi xảy ra khi tìm kiếm thành phố');
        }
      }
}

module.exports = new APIController();
