//              npx expo start
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';


const DropdownList = () => {
  const [selectedValue, setSelectedValue] = useState('January');
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const CalendarComponent = ({ selectedMonth }) => {
    const navigation = useNavigation();
    const years = new Date().getFullYear();
    const getDays = new Date(years, months.indexOf(selectedMonth) + 1, 0).getDate();

    const handleDayClick = (day) => {
      navigation.navigate("PictureUpload", { Month: months.indexOf(selectedMonth), day: day });
    };

    const days = [];
    for (let i = 1; i <= getDays; i++) {
      days.push(
        <View key={i} style={styles.dayContainer} onTouchEnd={() => handleDayClick(i)}>
          <Text style={styles.dayText}>{i}</Text>
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
    marginBottom: 200,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectedValue: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    marginTop: 50,

  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  dayContainer: {
    width: 70,
    height:50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    paddingVertical: 10,
  },
  dayText: {
    fontSize: 16,
  },
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
