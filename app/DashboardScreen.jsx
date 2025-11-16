import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import * as NavigationBar from 'expo-navigation-bar';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from "react";
import { Button, Image, StatusBar, Text, View } from "react-native";
import "./global.css";

// const API_URL = "192.168.100.214:6776";
NavigationBar.setVisibilityAsync("hidden");

export default function DashboardScreen() {
  StatusBar.setHidden(true);
  const [masterDisplay, setMasterDisplay] = useState(null);
  const [songInfo, setSongInfo] = useState(null); 
  const [time, setTime] = useState(new Date());
  const [error, setError] = useState("");
  const { API_URL } = useLocalSearchParams();
  
  // function to fetch pause control
  const fetchControlPause = async () => {
    try {
      const response = await fetch(`http://${API_URL}/songcontrol/pause`);
      const data = await response.json();
      console.log("Response pause status:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // function to fetch pause control
  const fetchControlPlay = async () => {
    try {
      const response = await fetch(`http://${API_URL}/songcontrol/play`);
      const data = await response.json();
      console.log("Response play status:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // function to fetch pause control
  const fetchControlNext = async () => {
    try {
      const response = await fetch(`http://${API_URL}/songcontrol/next`);
      const data = await response.json();
      console.log("Response next status:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // function to fetch pause control
  const fetchControlPrev = async () => {
    try {
      const response = await fetch(`http://${API_URL}/songcontrol/prev`);
      const data = await response.json();
      console.log("Response prev status:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchMasterDisplay = async () => {
      try {
        const response = await fetch(`http://${API_URL}/display/allvol`);
        const data = await response.json();
        setMasterDisplay(data);
      } catch (error) {
        console.error("Error fetching master display data:", error);
      }
    }

    const fetchSongInfo = async () => {
      try {
        setError("");
        const response = await fetch(`http://${API_URL}/display/song`);
        const data = await response.json();
        if (data.error) {
          setError(data.error);
          setSongInfo(null);
        } else {
          setSongInfo(data);
        }
      } catch (e) {
        setError(`Nie można połączyć z serwerem. Error ${e}`);
        console.error(`Nie można połączyć z serwerem. Error ${error}`);
        setSongInfo(null);
      }
    };

    fetchMasterDisplay();
    fetchSongInfo();
    const intervalId = setInterval(fetchMasterDisplay, 1000); // Fetch every 1 second
    const songInfoIntervalId = setInterval(fetchSongInfo, 1000); // Fetch every 1 second
    const timeIntervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Funkcja "czyszcząca" - zatrzymuje interwał, gdy komponent zniknie
    return () => {
      clearInterval(intervalId);
      clearInterval(timeIntervalId);
      clearInterval(songInfoIntervalId);
    };
  }, [API_URL, error]);

  

  return (
    <View className="flex flex-col h-full w-full p-4 gap-4 bg-black">
      <StatusBar hidden={true} />

      {/* First row - two views side by side */}
      <View className="flex flex-row flex-1 gap-4">

        {/* View - sound control */}
        <View className="flex-1 items-center justify-center rounded-lg overflow-hidden">
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            className="flex-1 w-full items-center justify-center p-4"
          >
            {songInfo && songInfo.thumbnail && (
              <View className="absolute inset-0 opacity-40">
                <Image
                  source={{ uri: `data:${songInfo.thumbnail_mimetype};base64,${songInfo.thumbnail}` }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            )}

            <View className="z-10 items-center">
              <Text className="text-white text-3xl font-bold text-center mb-2">
                {songInfo?.title || "No Song Playing"}
              </Text>
              <Text className="text-white text-2xl text-center mb-1">
                {songInfo?.artist || "Unknown Artist"}
              </Text>
              <Text className="text-white text-xl text-center mb-4 opacity-80">
                {songInfo?.album || "Unknown Album"}
              </Text>
                <View className="flex flex-row gap-10 mt-4 items-center justify-center">
                <View style={{ transform: [{ scale: 1.8 }] }}>
                  <Button title="⏮" onPress={fetchControlPrev} />
                </View>
                <View style={{ transform: [{ scale: 1.8 }] }}>
                  <Button title="⏸" onPress={fetchControlPause} />
                </View>
                <View style={{ transform: [{ scale: 1.8 }] }}>
                  <Button title="▶" onPress={fetchControlPlay} />
                </View>
                <View style={{ transform: [{ scale: 1.8 }] }}>
                  <Button title="⏭" onPress={fetchControlNext} />
                </View>
                </View>
            </View>
          </LinearGradient>
        </View>

        {/* View - watch */}
        <View className="flex-1 items-center justify-center rounded-lg overflow-hidden">
          <LinearGradient
            colors={['#22C1C3', '#FDBB2D']}
            className="flex-1 w-full items-center justify-center"
          >
            <Text className='text-white text-8xl'>{time.toLocaleTimeString()}</Text>
          </LinearGradient>
        </View>
      </View>
      
      {/* Second row - Volume */}
      <View className="flex-1 bg-neutral-700 rounded-lg p-4">
        {masterDisplay ? (
          <View className="flex-1 flex-row justify-evenly items-stretch">
        {Object.entries(masterDisplay).map(([proc, vol]) => (
          <View key={proc} className="flex-1 items-center mx-2">
            <Text className="text-white text-xs text-center mb-2 w-24" numberOfLines={2}>{proc}</Text>
            <View className="flex-1 w-full justify-center items-center" style={{ minHeight: 200 }}>
              <View style={{ height: 200, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                <Slider
                value={vol}
                minimumValue={0}
                maximumValue={1}
                step={0.01}
                style={{ width: 200, height: 40, transform: [{ rotate: '-90deg' }] }}
                minimumTrackTintColor="#8B5CF6"
                maximumTrackTintColor="#333"
                thumbTintColor="#EC4899"
                onSlidingComplete={async (value) => {
                  try {
                    await fetch(`http://${API_URL}/volume/${encodeURIComponent(proc)}/${value}`);
                  } catch (e) {
                  console.error('Error setting volume:', e);
                  }
                }}
                />
              </View>
              <Text className="text-white mt-1">{Math.round((vol) * 100)}%</Text>
            </View>
          </View>
        ))}
          </View>
        ) : (
          <Text className="text-center text-white">Loading...</Text>
        )}
      </View>

    </View>
  );
}