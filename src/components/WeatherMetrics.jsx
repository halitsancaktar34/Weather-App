import {View, Text, Image} from 'react-native';
import React from 'react';

const WeatherMetric = props => {
  const {current, weather} = props;
  return (
    <View className="flex-row justify-between mx-4">
      <View className="flex-row space-x-2 items-center">
        <Image source={require('../assets/wind.png')} className="h-6 w-6" />
        <Text className="text-white font-semibold text-base">
          {current?.wind_kph} km
        </Text>
      </View>
      <View className="flex-row space-x-2 items-center">
        <Image source={require('../assets/drop.png')} className="h-6 w-6" />
        <Text className="text-white font-semibold text-base">
          {current?.humidity} %
        </Text>
      </View>
      <View className="flex-row space-x-2 items-center">
        <Image source={require('../assets/sun.png')} className="h-6 w-6" />
        <Text className="text-white font-semibold text-base">
          {weather?.forecast?.forecastday[0]?.astro?.sunrise}
        </Text>
      </View>
    </View>
  );
};

export default WeatherMetric;
