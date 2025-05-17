import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native"; // ✅ Added Text here
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function App() {
  return (
    <View style={styles.hello}>
      <Text style={{ color: 'white' }}>Hello App</Text>
    
    </View>
  );
};

const styles = StyleSheet.create({
  hello: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: 'center',
    alignItems: 'center',
  },
});
