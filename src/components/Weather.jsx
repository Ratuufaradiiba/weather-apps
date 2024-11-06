import React, { useEffect, useRef, useState } from 'react';
import '../styles/style.css';
import search_icon from '../assets/search.png';
import clearday_icon from '../assets/clear.png';
import cloudn_icon from '../assets/cloudy-night.png';
import cloud_icon from '../assets/cloudy.png';
import humidity_icon from '../assets/humidity.png';
import mist_icon from '../assets/mist.png';
import nclear_icon from '../assets/nclear.png';
import rain_icon from '../assets/rain.png';
import drizzle_icon from '../assets/drizzle.png';
import shower_icon from '../assets/shower.png';
import snow_icon from '../assets/snow.png';
import thunderstorm_icon from '../assets/thunderstorm.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [hourlyForecast, setHourlyForecast] = useState([]);

  const allIcons = {
    '01d': clearday_icon,
    '01n': nclear_icon,
    '02d': cloud_icon,
    '02n': cloudn_icon,
    '03d': cloud_icon,
    '03n': cloudn_icon,
    '04d': drizzle_icon,
    '04n': drizzle_icon,
    '09d': shower_icon,
    '09n': shower_icon,
    '10d': rain_icon,
    '10n': rain_icon,
    '11d': thunderstorm_icon,
    '11n': thunderstorm_icon,
    '13d': snow_icon,
    '13n': snow_icon,
    '50d': mist_icon,
    '50n': mist_icon,
  };

  //kalau dari dicoding ini pakai class, tapi klo diubah ke function bisa bgini
  // const [keyword, setKeyword] = useState('');

  // const onGantiKeyword = (event) => {
  //   const value = event.target.value;
  //   setKeyword(value);
  // };
  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Good Afternoon';
    } else if (currentHour >= 17 && currentHour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };

  const search = async (city) => {
    if (city === '') {
      alert('Enter City Name');
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      console.log(data);

      //data perhari
      const forecastMap = {};
      data.list.forEach((item) => {
        const forcastDate = new Date(item.dt * 1000);
        const dateString = forcastDate.toDateString();

        if (!forecastMap[dateString]) {
          forecastMap[dateString] = item;
        }
      });

      const forecastList = Object.values(forecastMap).map((item) => {
        const forecastDate = new Date(item.dt * 1000);
        const today = new Date();

        let dayLabel = '';

        if (forecastDate.toDateString() === today.toDateString()) {
          dayLabel = 'Today';
        } else {
          dayLabel = forecastDate.toLocaleDateString('en-EN', { weekday: 'long' });
        }

        return {
          date: new Date(item.dt * 1000).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          dayy: dayLabel,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temp: item.main.temp.toFixed(0),
          feels: item.main.feels_like.toFixed(0),
          humidity: item.main.humidity,
          desc: item.weather[0].description
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          wind: item.wind.speed,
          maindesc: item.weather[0].main,
          icon: allIcons[item.weather[0].icon] || clearday_icon,
        };
      });

      //data perjam
      const hourlyList = data.list.map((item) => {
        const forecastDate = new Date(item.dt * 1000);
        const timeString = forecastDate.toLocaleTimeString([], { hour: 'numeric' });

        return {
          time: timeString,
          temp: item.main.temp.toFixed(0),
          desc: item.weather[0].main,
          icon: allIcons[item.weather[0].icon] || clearday_icon,
        };
      });

      const greeting = getGreeting();

      setWeatherData({
        location: data.city.name,
        greeting: greeting,
        forecastList,
      });

      //setHourly
      setHourlyForecast(hourlyList);

    } catch (error) {
      setWeatherData(null);
      console.error('Error fetching weather data', error);
    }
  };

  useEffect(() => {
    search('bekasi');
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        {/* <input ref={inputRef} type="text" placeholder="Search City.." value={keyword} onChange={onGantiKeyword} /> */}
        <input ref={inputRef} type="text" placeholder="Search City.." />
        <img src={search_icon} alt="" onClick={() => search(inputRef.current.value)} />
      </div>
      {weatherData ? (
        <>
          <div className="container">
            <div className="main-weather">
              <div className="header-main-weather">
                <p>{weatherData.location}</p>
                <p>{weatherData.forecastList[0].date}</p>
              </div>
              <div className="temp">
                <p className="temperature">{weatherData.forecastList[0].temp}°C</p>
                <span className="weather-name">{weatherData.forecastList[0].desc}</span>
              </div>
              <div className="weather-day-container">
                {weatherData.forecastList.slice(0, 6).map((forecast, index) => (
                  <div key={index} className="weather-day">
                    <p className="day">{forecast.dayy}</p>
                    <img src={forecast.icon} alt="" />
                    <p className="day-temp">{forecast.temp}°</p>
                    <p className="day-wname">{forecast.maindesc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="side-weather">
              <div className="day-time">
                <p className="day">{weatherData.greeting}</p>
                <span>{weatherData.forecastList[0].time}</span>
              </div>
              <div className="side-temp">
                <p className="temperature-side">{weatherData.forecastList[0].temp}°</p>
                <div className="humi-wind">
                  <div className="wind">
                    <img src={wind_icon} alt="" />
                    <p className="speed-wind">{weatherData.forecastList[0].wind} mph</p>
                  </div>
                  <div className="humidity">
                    <img src={humidity_icon} alt="" />
                    <p>{weatherData.forecastList[0].humidity}%</p>
                  </div>
                </div>
              </div>
              <p className="feels">Feels Like {weatherData.forecastList[0].feels}°</p>
              <p className="wname">{weatherData.forecastList[0].desc}</p>
              <div className="hourly">
                <p className="title-hourly">Hourly Forcast</p>
                <div className="hourly-container">
                  {hourlyForecast.slice(0, 6).map((hour, index) => {
                    return (
                      <div key={index} className="weather-hourly">
                        <p className="hour">{hour.time}</p>
                        <img src={hour.icon} alt="" />
                        <p className="hourly-temp">{hour.temp}°</p>
                        <p className="hourly-wname">{hour.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>Loading...</>
      )}
    </div>
  );
};

export default Weather;
