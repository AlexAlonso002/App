import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const YourComponent = () => {
  const [tshirts, setTshirts] = useState([]);
  const [pants, setPants] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        console.log('Permission to access photo library denied');
      } else {
        // Load and display saved images when the app starts
        loadSavedImages();
      }
    })();
  }, []);

  const pickImage = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        const newItem = {
          id: `${type}${type === 'T' ? tshirts.length + 1 : pants.length + 1}`,
          type: type,
          imageUrl: result.assets[0].uri,
        };
        if (type === 'T') {
          setTshirts([...tshirts, newItem]);
          saveDataRows([...tshirts, newItem], pants); // Saving both T-shirts and Pants data
        } else if (type === 'P') {
          setPants([...pants, newItem]);
          saveDataRows(tshirts, [...pants, newItem]); // Saving both T-shirts and Pants data
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const saveDataRows = async (dataTshirts, dataPants) => {
    try {
      // Save the data rows array for T-shirts and Pants separately to AsyncStorage
      await AsyncStorage.setItem('savedDataRowsTshirts', JSON.stringify(dataTshirts));
      await AsyncStorage.setItem('savedDataRowsPants', JSON.stringify(dataPants));
    } catch (error) {
      console.error('Error saving data rows:', error);
    }
  };

  const loadSavedImages = async () => {
    try {
      // Retrieve saved data rows array from AsyncStorage for T-shirts and Pants separately
      const savedDataRowsJsonTshirts = await AsyncStorage.getItem('savedDataRowsTshirts');
      const savedDataRowsJsonPants = await AsyncStorage.getItem('savedDataRowsPants');

      const savedTshirts = savedDataRowsJsonTshirts ? JSON.parse(savedDataRowsJsonTshirts) : [];
      const savedPants = savedDataRowsJsonPants ? JSON.parse(savedDataRowsJsonPants) : [];

      setTshirts(savedTshirts);
      setPants(savedPants);
    } catch (error) {
      console.error('Error loading saved data rows:', error);
    }
  };

  const removeDataRow = async (rowId, type) => {
    try {
      let newData;
      if (type === 'T') {
        newData = tshirts.filter(item => item.id !== rowId);
        setTshirts(newData);
      } else if (type === 'P') {
        newData = pants.filter(item => item.id !== rowId);
        setPants(newData);
      }
      // Save updated data after removal
      await saveDataRows(tshirts, pants);
    } catch (error) {
      console.error('Error removing data row:', error);
    }
  };

  const renderDataRowItem = ({ item }) => (
    <View key={item.id} style={styles.dataRowContainer}>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeDataRow(item.id, item.type)}
      >
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      // Clear the state as well if needed
      setTshirts([]);
      setPants([]);
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => pickImage("T")}>
         <Text>Select Tee</Text>
      </TouchableOpacity>

      <FlatList
        data={tshirts}
        keyExtractor={(item) => item.id}
        renderItem={renderDataRowItem}
        horizontal={true}
      />
      <TouchableOpacity onPress={() => pickImage("P")}>
        <Text>Select Pants</Text>
      </TouchableOpacity>

      <FlatList
        data={pants}
        keyExtractor={(item) => item.id}
        renderItem={renderDataRowItem}
        horizontal={true}
      />

      <TouchableOpacity onPress={() => clearAsyncStorage()}>
        <Text>Remove Data</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  image: {
    padding: 10,
    margin: 5,
    width: 150,
    height: 250,
  },
});

export default YourComponent;
