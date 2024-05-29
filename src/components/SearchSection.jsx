import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useCallback, useState} from 'react';
import {MagnifyingGlassIcon, MapPinIcon} from 'react-native-heroicons/outline';
import {theme} from '../theme';
import {debounce} from 'lodash';
import {storeData} from '../utils/astncStorage';
import {fetchLocations, fetchWeatherForecast} from '../api/weather';

const SearchSection = ({setLoading, setWeather}) => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [locations, setLocations] = useState([]);

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
  return (
    <View className="mx-4 relative z-50" style={{height: '7%'}}>
      <View
        className="flex-row justify-end items-center rounded-full"
        style={{
          backgroundColor: showSearchBar ? theme.bgWhite(0.15) : 'transparent',
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
  );
};

export default SearchSection;
