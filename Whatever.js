import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ClosetScreen({ navigation }) {
  const [dataRow1, setData1] = useState([
    { id: 'T-shirt1', 
    text: 'Add T-Shirt Image',
    type: 'T',
    imageUrl: null,
   },
  ]);

  const [dataRow2, setData2] = useState([
    { id: 'Pants1', 
    text: 'Add Paint Image',
    type: 'P',
    imageUrl: null,
   },
  ]);

  const STORAGE_KEY = 'closetData';

  useEffect(() => {
    // Load data from AsyncStorage when the component mounts
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        const shirtsData = parsedData.filter(item => item.type === 'T');
        const pantsData = parsedData.filter(item => item.type === 'P');
        setData1(shirtsData);
        setData2(pantsData);
      }
      else{
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async (newData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const removeDataRow = (rowId, type) => {
    let newData;
    if (type === 'T') {
      newData = dataRow1.filter(item => item.id !== rowId);
      setData(newData);
    } else if (type === 'P') {
      newData = dataRow2.filter(item => item.id !== rowId);
      setData2(newData);
    }
    // Add similar conditions for other data rows (dataRow3, dataRow4, dataRow5)
  
    // Ensure newData is not null before saving
    if (newData !== null && newData !== undefined) {
      saveData(newData);
    } else {
      console.warn('New data is null or undefined, not saving to AsyncStorage.');
    }
  };

  const handleAddDataRow = async (itemType) => {
    const newData = [];
  
    if (itemType === 'T') {
      const newId = "T-Shirt" + (dataRow1.length + 1).toString();
      const newDataRow = {
        id: newId,
        text: 'New Tee Image',
        type: 'T',
        imageUrl: null,
      };
      newData.push(...dataRow1, newDataRow);
      setData([...dataRow1, newDataRow]);
    } else {
      const newId = "Pants" + (dataRow2.length + 1).toString();
      const newDataRow = {
        id: newId,
        text: 'New Pants Image',
        type: 'P',
        imageUrl: null,
      };
      newData.push(...dataRow2, newDataRow);
      setData2([...dataRow2, newDataRow]);
    }
    saveData([...dataRow1, ...dataRow2, ...newData]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <View style={[styles.item, { backgroundColor: '#e0e0e0' }]}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeDataRow(item.id, item.type)}
        >
          <Text style={{ color: 'black' }}>Delete</Text>
        </TouchableOpacity>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={{ width: 50, height: 50 }} />
        ) : (
          <View>
            <Text>{item.text}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const handleItemPress = (item) => {
    console.log(`Hi! You pressed the item with id: ${item.id}`);
  };

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      // Clear the state as well if needed
      setData([]);
      setData2([]);
      // Clear other data states if you have more
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Shirts</Text>
      <TouchableOpacity onPress={() => handleAddDataRow("T")}>
        <Text>Add New DataRow</Text>
      </TouchableOpacity>
      <FlatList
        data={dataRow1}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
      />

      <TouchableOpacity onPress={()=>handleAddDataRow("P")}>
        <Text>Add New DataRow</Text>
      </TouchableOpacity>
      <FlatList
        data={dataRow2}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
      />

      <TouchableOpacity onPress={() => clearAsyncStorage()}>
        <Text>Remove Data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    margin: 5,
    height: 170,
    borderRadius: 10,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 1,
    padding: 5,
    borderRadius: 5,
  },
});
