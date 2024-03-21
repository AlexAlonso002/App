import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const YourComponent = () => {
  const [CFit, setCFit] = useState([]);
  const [BFit, setBFit] = useState([]);
  const [DFit, setDFit] = useState([]);
  


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
          id: (type + 'Fit').length,
          type: type,
          imageUrl: result.assets[0].uri,
        };
        if (type === "C") {
          setCFit[BFit, DFit];
          saveDataRows([...CFit, newItem], BFit, DFit);
        } else if (type === "B") {
          setBFit[CFit, DFit];
          saveDataRows([...BFit, newItem], CFit, DFit);
        } else if (type === "D") {
          setDFit [CFit, BFit];
          saveDataRows([...DFit, newItem], CFit, BFit);
        } 
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };


  const saveDataRows = async (dataTshirts) => {
    try {
      await AsyncStorage.setItem('savedFits', JSON.stringify(dataTshirts));
    } catch (error) {
      console.error('Error saving data rows:', error);
    }
  };

  const loadSavedImages = async () => {
    try {
      // Retrieve saved data rows array from AsyncStorage for T-shirts and Pants separately
      const saveFitsData = await AsyncStorage.getItem('savedFits');
      const savedFits = saveFitsData ? JSON.parse(saveFitsData) : []

      setCFit(savedFits);
    } catch (error) {
      console.error('Error loading saved data rows:', error);
    }
  };

  const removeDataRow = async (rowId, type) => {
    try {
      let newData;
        newData = CFit.filter(item => item.id !== rowId);
        setCFit(newData);
     
      // Save updated data after removal
      await saveDataRows(CFit);
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
      setFit([]);
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => pickImage("C")}>
         <Text>Select Casual Fit</Text>
      </TouchableOpacity>
      <FlatList
        data={CFit}
        keyExtractor={(item) => item.id}
        renderItem={renderDataRowItem}
        horizontal={true}
      />
      <TouchableOpacity onPress={() => pickImage("B")}>
         <Text>Select Business Fit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => pickImage("P")}>
         <Text>Select Party Fit</Text>
      </TouchableOpacity>

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
