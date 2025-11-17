// src/screens/DiscoverScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, RefreshControl, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { loadTheme } from '../store/themeSlice';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const [movies, setMovies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.theme.colors);

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  const fetchTrending = async () => {
    try {
      const resp = await axios.get('https://api.themoviedb.org/3/trending/movie/week', {
        params: { api_key: "39b54ed4ac0a48a33bc2175e85263b2f" },
      });
      setMovies(resp.data.results || []);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTrending();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('MovieDetail', { movie: item })}>
      <MovieCard movie={item} />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 8, backgroundColor: theme.background }}>
      <FlatList
        data={movies}
        numColumns={2}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}
