import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StatusBar, Text, TextInput, View } from 'react-native';
import "./global.css";

export default function HomeScreen() {
  StatusBar.setHidden(true);
  const [ipAddress, setIpAddress] = React.useState(null);
  const router = useRouter();

  return (
    <View className="flex-1 bg-neutral-900 items-center justify-center  p-4">
      <StatusBar hidden={true} />
      <Text className="text-white text-3xl font-bold mb-8">Welcome to WinDeck</Text>

      <TextInput
        className="w-2/5 bg-neutral-800 text-white text-lg p-4 rounded-lg mb-6"
        placeholder="Enter: PC_IP_ADDRESS:PORT"
        placeholderTextColor="#9CA3AF"
        value={ipAddress}
        onChangeText={setIpAddress}
        keyboardType="default"
      />
      
      <Button title="Go to Dashboard" onPress={async() => {
        console.log('IP Address:', ipAddress);
        if (!ipAddress) {
          alert('Please enter a valid IP address.');
          return;
        }
        const data = await fetch(`http://${ipAddress}/`).then(res => res.json()).catch(err => null);
        if (!data || data.status !== 200) {
          alert('Unable to reach the server. Please check the IP address and try again.');
          return;
        }
        router.push({
          pathname: '/DashboardScreen',
          params: { API_URL: ipAddress }
        });
      }}/>
    </View>
  );
}
