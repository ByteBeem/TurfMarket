import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, useWindowDimensions, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Modal from "../Modal/Modal";
import { StatusBar } from 'expo-status-bar';

const LazyJobPostCard = React.lazy(() => import('./LovePost'));

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [color, setColor] = useState('#0000FF');
  const windowWidth = useWindowDimensions().width;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch('https://jobs4lifeserver-1648d8d4bba0.herokuapp.com/posts/fetch', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'CustomAppcheck': 'DonaldRSA04?',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setJobs(data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleHomePress = () => {
    navigation.navigate('Home');
  };

  const handleFeedPress = () => {
    navigation.navigate('Sell');
  };
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      setColor(randomColor);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleAddPost = () => {
    navigation.navigate("Posting");
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
       
        <Text style={{ fontSize: windowWidth * 0.05, fontWeight: 'bold', color: color, paddingTop: windowWidth * 0.05 }}> 🇿🇦 ULSingles</Text>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0000FF']}
          />
        }
      >
        {jobs.slice().reverse().map((job, index) => (
          <Suspense
            key={index}
            fallback={
              <View style={styles.loading}>
                <Text>Loading...</Text>
              </View>
            }
          >
            <LazyJobPostCard job={job} loading={loading} />
          </Suspense>
        ))}
      </ScrollView>
      <StatusBar style="auto" />

      <Modal visible={loading} message="Please wait..." />
      <TouchableOpacity  style={styles.loveIconContainer}onPress={handleAddPost}>
          <Ionicons name="add-circle-outline" size={39} color="black" />
        </TouchableOpacity>

      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton} onPress={handleHomePress}>
          <Ionicons name="home-outline" size={24} color="black" />
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleFeedPress}>
          <MaterialIcons name="sell" size={24} color="black" />
          <Text>Sell</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="heart-circle" size={29} color="black" />
          <Text>Love</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleProfilePress}>
          <Ionicons name="person-outline" size={24} color="black" />
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '25%',
  },
  loveIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  header: {
    position: 'absolute',
    top: '2%',
    left: '2%',
    backgroundColor: 'transparent',
    paddingTop: '5%',
    zIndex: 999,
  },
  scrollView: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '5%',
    marginTop: '5%',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  navButton: {
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
