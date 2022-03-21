import { RequestHandler, response } from 'express';
import httpStatus from 'http-status';
import fetch from 'node-fetch';

export const findUnique: RequestHandler = async (req, res) => {
  const city = req.params['city']
  if (!city) {
    return res.sendStatus(httpStatus.BAD_REQUEST)
  }
  
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
  if (response.status !== 200) {
    res.send(response.status)
  }

  const data = await response.json()
  const result = {
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    windSpeed: data.wind.speed,
    icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
  }
  res.send(result)
};
