import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import { store } from "./store";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./AppNavigator";
// import * as Font from 'expo-font';

// const fetchFonts = () => {
//   return Font.loadAsync({
//     'ProximaNova-Bold': require('./path/to/ProximaNova-Bold.ttf'),
//     // Add more font variants if needed
//   });
// };

//set up redux
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
