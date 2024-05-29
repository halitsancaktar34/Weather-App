import {View, Text, Image} from 'react-native';
import React from 'react';
import {weatherImages} from '../constants';

const CurrentWeather = ({location, current}) => {
  return (
    <View>
      {/*Text Section*/}
      <View>
        <Text className="text-white text-center text-5xl font-bold mb-5">
          {location?.name}
        </Text>
        <Text className="text-lg text-center font-semibold text-gray-300">
          {' ' + location?.country}
        </Text>
      </View>
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
    </View>
  );
};

export default CurrentWeather;
