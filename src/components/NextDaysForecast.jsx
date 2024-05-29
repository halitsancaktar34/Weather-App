import {View, Text, ScrollView, Image} from 'react-native';
import React from 'react';
import {CalendarDaysIcon} from 'react-native-heroicons/outline';
import { theme } from '../theme';
import { weatherImages } from '../constants';
import moment from 'moment';

const NextDaysForecast = ({weather}) => {
    const {current} = weather;
  return (
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
  );
};

export default NextDaysForecast;
