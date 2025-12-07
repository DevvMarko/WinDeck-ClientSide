import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import * as NavigationBar from 'expo-navigation-bar';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from "react";
import { Button, Image, ScrollView, StatusBar, Text, View, useWindowDimensions } from "react-native";
import "./global.css";

NavigationBar.setVisibilityAsync("hidden");

export default function DashboardScreen() {
  StatusBar.setHidden(true);
  const [masterDisplay, setMasterDisplay] = useState(null);
  const [songInfo, setSongInfo] = useState(null); 
  const [time, setTime] = useState(new Date());
  const [error, setError] = useState("");
  const { API_URL } = useLocalSearchParams();

  const { width, height } = useWindowDimensions();
  const isTablet = width > 900;
  const screenFactor = isTablet ? 1 : 0.45;

  
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

            <View className="items-center">
              <Text className={`text-white ${isTablet ? 'text-3xl' : 'text-xl'} font-bold text-center mb-2`}>
                {songInfo?.title || "No Song Playing"}
              </Text>
              <Text className={`text-white ${isTablet ? 'text-2xl' : 'text-lg'} text-center mb-1`}>
                {songInfo?.artist || "Unknown Artist"}
              </Text>
              <Text className={`text-white ${isTablet ? 'text-xl' : 'text-base'} text-center mb-0 opacity-80`}>
                {songInfo?.album || "Unknown Album"}
              </Text>
                <View className="flex flex-row gap-10 mt-4 items-center justify-center">
                <View style={{ transform: [{ scale: isTablet ? 1.8 : 1 }] }}>
                  <Button title="⏮" onPress={fetchControlPrev} />
                </View>
                <View style={{ transform: [{ scale: isTablet ? 1.8 : 1 }] }}>
                  <Button title="⏸" onPress={fetchControlPause} />
                </View>
                <View style={{ transform: [{ scale: isTablet ? 1.8 : 1 }] }}>
                  <Button title="▶" onPress={fetchControlPlay} />
                </View>
                <View style={{ transform: [{ scale: isTablet ? 1.8 : 1 }] }}>
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
      <View className="flex-1 bg-neutral-700 rounded-lg p-2">
        {masterDisplay ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'space-evenly', 
              alignItems: 'center',
              paddingHorizontal: 10
            }}
          >
            {Object.entries(masterDisplay).map(([proc, vol]) => (
              <View key={proc} className="items-center mx-2">
                
                <Text className="text-white text-xs text-center mb-2" numberOfLines={1} style={{ maxWidth: 80 }}>
                  {proc}
                </Text>
                <View className="justify-center items-center" style={{ height: screenFactor * 220 }}>
                  <View style={{ height: screenFactor * 220, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <Slider
                      value={vol}
                      minimumValue={0}
                      maximumValue={1}
                      step={0.01}
                      style={{ width: screenFactor * 220, height: 40, transform: [{ rotate: '-90deg' }] }}
                      minimumTrackTintColor="#8B5CF6"
                      maximumTrackTintColor="#333"
                      thumbTintColor="#EC4899"
                      onSlidingComplete={async (value) => {
                        try {
                          await fetch(`http://${API_URL}/volume/${encodeURIComponent(proc)}/${value}`);
                        } catch (e) { console.error(e); }
                      }}
                    />
                  </View>
                </View>
                
                <Text className="text-white mt-2 font-bold">{Math.round((vol) * 100)}%</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text className="text-center text-white">Loading...</Text>
        )}
      </View>

    </View>
  );
}