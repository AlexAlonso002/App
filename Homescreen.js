//              npx expo start
import React, { useState, useEffect } from 'react';
import { View, Text,Image } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet } from 'react-native';


const DropdownList = () => {

  const GetData = async (i, j) => {
    try {
      const asyncData = await AsyncStorage.getItem(`${i}-${j}`);
      if(asyncData !==null){
        const asyncDataS = JSON.parse(asyncData);
        return(
          <View style={styles.calpic}>
            <Image source={{ uri: asyncDataS.Tee }} style={styles.calpicImage} />
            <Image source={{ uri: asyncDataS.Pants }} style={styles.calpicImage} />
          </View>
      ) }
      return  " ";

    } catch (error) {
      console.error(`Error fetching data for (${i}, ${j}) from AsyncStorage:`, error);
      return null;
    }
  };


  const [selectedValue, setSelectedValue] = useState('January');
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const CalendarComponent = ({ selectedMonth }) => {
    const navigation = useNavigation();
    const years = new Date().getFullYear();
    const getDays = new Date(years, months.indexOf(selectedMonth) + 1, 0).getDate();
    const [data, setData] = useState(null);

    const fetchData = async () => {
      const newData = {};
        i = months.indexOf(selectedMonth)+1
        for (let j = 1; j <= getDays; j++) {
          newData[`${i}-${j}`] = await GetData(months.indexOf(selectedMonth)+1, j);
        }
      
      return newData;
    };

    const handleDayClick = (day) => {
      navigation.navigate("PictureUpload", { Month: months.indexOf(selectedMonth), day: day });
    };

    useEffect(() => {
      const fetchDataAndSetData = async () => {
        const newData = await fetchData();
        setData(newData);
      };
  
      fetchDataAndSetData();
    }, [selectedMonth]);

    const days = [];
    for (let i = 1; i <= getDays; i++) {
      days.push(
        <View key={i} style={styles.dayContainer} onTouchEnd={() => handleDayClick(i)}>
          <Text style={styles.dayText}>{i}</Text>
          <Text>{data && data[`${months.indexOf(selectedMonth)+1}-${i}`]}</Text>
        </View>
      );
    }
    return (
      <View style={styles.calendarContainer}>
        <View style={styles.daysContainer}>{days}</View>
      </View>
    );
  };

  const handleValueChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select a Month:</Text>
      <RNPickerSelect
        items={months.map(month => ({ label: month, value: month }))}
        onValueChange={handleValueChange}
        value={selectedValue}
        style={pickerSelectStyles}
      />
      <CalendarComponent selectedMonth={selectedValue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  label: {
    fontSize: 16,
    marginBottom: 1,
  },
  selectedValue: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarContainer: {
    flex: 1, // Occupy the full screen
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    marginTop: 1,
    padding: 5, // You can adjust padding if needed
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayContainer: {
    width: 95, // Increase the width
    height: 75,
    borderWidth: 1,
    borderColor: 'gray',
    paddingVertical: 10,
  },
  dayText: {
    fontSize: 13,
  },
  calpic: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1, 
  },
  calpicImage:{
    width: 30,
    height: 30,
    alignSelf: 'flex-end', 
  }


});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    textAlign: 'center',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    textAlign: 'center',
  },
});

// Your styles and pickerSelectStyles here

export default DropdownList;
