//```````                       npx expo start
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './Navigation/screens/Homescreen';
import DetailsScreen from './Navigation/screens/SettingsScreen';
import SettingsScreen from './Navigation/screens/Calander';
import ClosetScren from './Navigation/screens/Closet';
import PictureSave from '/Users/AlexA/Desktop/ReactAppV1/Navigation/screens/ph.js';
import print2 from '/Users/AlexA/Desktop/ReactAppV1/Navigation/screens/aysncprint.js';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const homeName = "Home";
const settingsName = "Settings";
const ClosetName = "Wardrobe";
const Pic = "fefefefe";
const Print = "Asycn";


// The stack when a new tab needs to be open
function MainContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          name="Home"
          component={TabStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="PictureUpload" component={DetailsScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// the stack for the default bottom navigation
function TabStack() {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;
          if (rn === homeName) {
          iconName = focused ? 'home' : 'home-outline';
          }  else if (rn === settingsName) {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          else if(rn === ClosetName){
            iconName = focused ? 'settings' : 'settings-outline';
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'grey',
        labelStyle: { paddingBottom: 10, fontSize: 10 },
        style: { padding: 10, height: 70 }
      }}>

      <Tab.Screen name={homeName} component={HomeScreen} />
      <Tab.Screen name={settingsName} component={SettingsScreen} />
      <Tab.Screen name={ClosetName} component={ClosetScren} />
      <Tab.Screen name={Pic} component={PictureSave} />
      <Tab.Screen name={Print} component={print2} />
    </Tab.Navigator>
  );
}

export default MainContainer;
