import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const YourComponent = () => {
  const [imageUrl1, setImageUrl1] = useState(null); 
  const [imageUrl2, setImageUrl2] = useState(null); 
  const [tshirts, setTshirts] = useState([]);
  const [pants, setPants] = useState([]);
  var [SaveCal, setCal] = useState(

    {
   //   Key: null,
      Tee: null,
      Pants: null,
    });
  const navigation = useNavigation();
  const route = useRoute();

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


  const renderDataRowItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.dataRowContainer}
      onPress={() => {TestButton(item)}}
    >
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
        />
      )}
    </TouchableOpacity>
  );

  const TestButton = (item) => {
 //   const newid = (route.params.Month) + 1 + "-" + route.params.day;
    let updatedCal = { ...SaveCal }; // Make a shallow copy of SaveCal
    updatedCal = {
      ...updatedCal,
     // Key:newid,
    };
  
    if (item.type === "T") {
      updatedCal = {
        ...updatedCal,
        Tee: item.imageUrl,
      };
    } else if (item.type === "P") {
      updatedCal = {
        ...updatedCal,
        Pants: item.imageUrl,
      };
    }
    setCal(updatedCal); // Update state with the modified object  
  };


  const SaveCalander = () =>{
    let key = (route.params.Month) + 1 + "-" + route.params.day;
    AsyncStorage.getItem('Call', (err, result) => {
      if (!err) {
        let combinedData = {}; // Initialize combinedData as an empty object
    
        if (result) {
          // Parse existing data from AsyncStorage
          const existingData = JSON.parse(result);
          
          console.log('Existing Data:', existingData);
          console.log('SaveCal:', SaveCal);
          
          // Merge SaveCal into existingData, ensuring SaveCal values take precedence
          combinedData = {
            ...existingData,
          };
          
          // Add SaveCal values to combinedData with unique keys
          Object.keys(SaveCal).forEach(key => {
            combinedData[`${key}-${Object.keys(combinedData).length + 1}`] = SaveCal[key];
          });
        } else {
          // If no existing data, use SaveCal as is
          combinedData = SaveCal;
        }
    
        console.log('Combined Data:', combinedData);
    
        // Save the combined data back to AsyncStorage
        AsyncStorage.setItem(key, JSON.stringify(combinedData), (err) => {
          if (err) {
            console.error('Error saving data rows:', err);
          }
        });
      } else {
        console.error('Error retrieving data rows:', err);
      }
    });
  ;
} 

const logKey = () => {
  // Constructing the key based on route params
  let key = (route.params.Month + 1) + "-" + route.params.day;

  AsyncStorage.getItem(key, (err, result) => {
    if (!err) {
      if (result) {
        // Parsing data from AsyncStorage
        const combinedData = JSON.parse(result);
        // Assuming combinedData contains image URLs
        const imageUrl1 = combinedData.Tee;
        setImageUrl1(combinedData.Tee);
        setImageUrl2(combinedData.Pants);
        const imageUrl2 = combinedData.Pants;
        console.log(imageUrl1)

        // Displaying images using Image componen
      } else {
        console.log('No data found in AsyncStorage');
      }
    } else {
      console.error('Error retrieving data rows:', err);
    }
  });
};



  return (
    <View>
      <FlatList
        data={tshirts}
        keyExtractor={(item) => item.id}
        renderItem={renderDataRowItem}
        horizontal={true}
      />
      <FlatList
        data={pants}
        keyExtractor={(item) => item.id}
        renderItem={renderDataRowItem}
        horizontal={true}
      />

      <TouchableOpacity onPress={() => SaveCalander()}>
        <Text>Save The Drip</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => logKey()}>
        <Text>TestKey</Text>
      </TouchableOpacity>

      {imageUrl1 && (
        <Image
          source={{ uri: imageUrl1 }}
          style={styles.image}
        />
      )}
      {imageUrl2 && (
        <Image
          source={{ uri: imageUrl2 }}
          style={styles.image}
        />
      )}
      
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
    padding: 20,
    margin: 5,
    width: 100,
    height: 100,
  },
});

export default YourComponent;
