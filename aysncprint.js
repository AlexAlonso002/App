import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const YourComponent = () => {
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();

  const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(storedData);

      // Sort data by ID
      const sortedData = values.sort((a, b) => {
        // Extract numeric part of ID
        const idA = parseInt(a[0].split('T-shirt')[1]);
        const idB = parseInt(b[0].split('T-shirt')[1]);
        return idA - idB;
      });

      setData(sortedData);
    } catch (error) {
      console.error('Error fetching data from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  return (
    <ScrollView>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.headerCell}>ID</Text>
          <Text style={styles.headerCell}>Value</Text>
        </View>
        {data.map(([key, value]) => (
          <View key={key} style={styles.tableRow}>
            <Text style={styles.cell}>{key}</Text>
            <Text style={styles.cell}>{value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: 'black',
    margin: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  headerCell: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  cell: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
});

export default YourComponent;
