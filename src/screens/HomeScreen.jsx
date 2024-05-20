import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {theme} from '../theme';

import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
} from 'react-native-heroicons/outline';

import {debounce} from 'lodash';
import {fetchLocations, fetchWeatherForecast} from '../api/weather.js';
import moment from 'moment';
import {weatherImages} from '../constants/index.js';

import * as Progress from 'react-native-progress';
import {getData, storeData} from '../utils/astncStorage.js';

const HomeScreen = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});

  const {location, current} = weather;

  // Functions
  // Search Section
  const handleLocation = loc => {
    setLocations([]);
    setLoading(true);
    fetchWeatherForecast({city: loc.name, day: '4'}).then(data => {
      setWeather(data);
      setLoading(false);
    });
    setShowSearchBar(false);
    storeData('city', loc.name);
  };

  const handleSearch = value => {
    if (value?.length > 2) {
      fetchLocations({city: value}).then(data => setLocations(data));
    } else {
      setLocations([]);
    }
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [
    locations,
  ]);

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
          <View className="mx-4 relative z-50" style={{height: '7%'}}>
            <View
              className="flex-row justify-end items-center rounded-full"
              style={{
                backgroundColor: showSearchBar
                  ? theme.bgWhite(0.15)
                  : 'transparent',
              }}>
              {showSearchBar && (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="Search City"
                  placeholderTextColor={'lightgray'}
                  className="pl-6 pb-1 h-10 text-base flex-1 text-white"
                />
              )}

              <TouchableOpacity
                onPress={() => setShowSearchBar(!showSearchBar)}
                style={{backgroundColor: theme.bgWhite(0.4)}}
                className="rounded-full p-4">
                <MagnifyingGlassIcon size={25} color="white" />
              </TouchableOpacity>
            </View>
            {locations?.length > 1 && showSearchBar ? (
              <View className="w-full absolute bg-gray-300/40 top-16 pt-1 rounded-3xl">
                {locations?.map((loc, index) => (
                  <TouchableOpacity
                    onPress={() => handleLocation(loc)}
                    key={index}
                    className={`flex-row items-center p-3 mb-1 ${
                      index === locations.length - 1
                        ? ''
                        : 'border-b-2 border-b-gray-400'
                    }`}>
                    <MapPinIcon size={20} color={'gray'} />
                    <Text className="text-black text-lg ml-2">
                      {loc?.name}, {loc?.country}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>
          {/*Forecast Section*/}
          <View className="mx-4 justify-evenly flex-1 mb-2">
            {/*Text Section*/}
            <Text className="text-white text-center text-5xl font-bold">
              {location?.name}
            </Text>
            <Text className="text-lg text-center font-semibold text-gray-300">
              {' ' + location?.country}
            </Text>

            {/*Image Section*/}
            <View className="flex-row justify-center ">
              <Image
                source={weatherImages[current?.condition?.text]}
                className="w-52 h-52"
              />
            </View>
            {/*Degree Section*/}
            <View className="space-y-2 items-center">
              <Text className="font-bold text-white text-6xl ml-5">
                {current?.temp_c}&#176;
              </Text>
              <Text className="text-white text-xl tracking-widest">
                {current?.condition?.text}
              </Text>
            </View>
            {/*Other Stats*/}
            <View className="flex-row justify-between mx-4">
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require('../assets/wind.png')}
                  className="h-6 w-6"
                />
                <Text className="text-white font-semibold text-base">
                  {current?.wind_kph} km
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require('../assets/drop.png')}
                  className="h-6 w-6"
                />
                <Text className="text-white font-semibold text-base">
                  {current?.humidity} %
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require('../assets/sun.png')}
                  className="h-6 w-6"
                />
                <Text className="text-white font-semibold text-base">
                  {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
            {/*Forecast for next days*/}
            <View className="mb-2 space-y-3">
              <View className="flex-row items-center mx-5 space-x-2">
                <CalendarDaysIcon size={22} color="white" />
                <Text className="text-white text-base">Daily Forecast</Text>
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={{paddingHorizontal: 15}}
                showsHorizontalScrollIndicator={false}>
                {weather?.forecast?.forecastday?.map((item, index) => (
                  <View
                    key={index}
                    className="justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                    style={{backgroundColor: theme.bgWhite(0.15)}}>
                    <Image
                      className="w-11 h-11"
                      source={weatherImages[current?.condition?.text]}
                    />
                    <Text className="text-white">
                      {moment(item?.date).format('dddd')}
                    </Text>
                    <Text className="text-white text-xl font-semibold">
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
export default HomeScreen;
