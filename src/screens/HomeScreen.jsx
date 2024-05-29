import {View, SafeAreaView, StatusBar, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fetchWeatherForecast} from '../api/weather.js';
import * as Progress from 'react-native-progress';
import {getData} from '../utils/astncStorage.js';
import WeatherMetrics from '../components/WeatherMetrics.jsx';
import NextDaysForecast from '../components/NextDaysForecast.jsx';
import SearchSection from '../components/SearchSection.jsx';
import CurrentWeather from '../components/CurrentWeather.jsx';

const HomeScreen = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({});

  const {location, current} = weather;

  // Result section
  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let city = 'London';
    if (myCity) {
      city = myCity;
    }
    fetchWeatherForecast({city, day: '3'}).then(data => {
      setWeather(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  return (
    <SafeAreaView className="flex-1 relative">
      <StatusBar style="light"></StatusBar>
      <Image
        blurRadius={70}
        source={require('../assets/bg.png')}
        className="absolute w-full"
      />
      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
        </View>
      ) : (
        <View className="flex flex-1">
          {/*Search Section*/}
          <SearchSection setLoading={setLoading} setWeather={setWeather} />
          {/*Forecast Section*/}
          <View className="mx-4 justify-evenly flex-1 mb-2">
            <CurrentWeather location={location} current={current} />
            {/*Other Stats*/}
            <WeatherMetrics current={current} weather={weather} />
            {/*Forecast for next days*/}
            <NextDaysForecast weather={weather} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
export default HomeScreen;