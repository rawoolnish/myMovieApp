// src/screens/WatchlistScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { loadWatchlist, removeMovieAndPersist } from '../store/watchlistSlice';
import { loadTheme } from '../store/themeSlice';
import { Swipeable } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';

export default function WatchlistScreen() {
  const dispatch = useDispatch();
  const movies = useSelector(s => s.watchlist.movies);
  const theme = useSelector(s => s.theme.colors);

  console.log('watchlist', movies);

  useEffect(() => {
    dispatch(loadWatchlist());
    dispatch(loadTheme());
  }, [dispatch]);

  const renderRight = id => (
    <TouchableOpacity
      onPress={() => {
        Alert.alert('Remove', 'Remove from watchlist?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => dispatch(removeMovieAndPersist(id)),
          },
        ]);
      }}
      style={{
        backgroundColor: 'red',
        justifyContent: 'center',
        paddingHorizontal: 20,
      }}
    >
      <Text style={{ color: 'white' }}>Delete</Text>
    </TouchableOpacity>
  );

  if (!movies.length) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          backgroundColor: theme.background,
        }}
      >
        <LottieView
          source={require('../assets/animation/nofile.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />

        <Text style={{ color: theme.textSecondary, marginTop: 12, textAlign: 'center' }}>
          Your watchlist is empty.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 0.5,
          borderColor: theme.border,
          backgroundColor: theme.background,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>
          Watchlist
        </Text>
      </View>
      <FlatList
        data={movies}
        contentContainerStyle={{padding:3}}
        keyExtractor={i => String(i.id)}
        // contentContainerStyle={{paddingTop:12}}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRight(item.id)}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: 2,
                backgroundColor: theme.background,
              }}
            >
              {/* LEFT — Poster */}
              <Image
                source={{
                  uri: 'https://image.tmdb.org/t/p/w500' + item.poster_path,
                }}
                style={{
                  width: 40,
                  height: 60,
                  marginRight: 12,
                }}
                resizeMode="cover"
              />

              {/* RIGHT — Align text at bottom */}
              <View
                style={{
                  flex: 1,
                  height: 60,
                  justifyContent: 'flex-end',
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: '700', color: theme.text }}
                >
                  {item.title}
                </Text>

                <Text style={{ color: theme.textSecondary, marginTop: 3, fontSize: 12 }}>
                  {item.release_date}
                </Text>
              </View>
            </View>
          </Swipeable>
        )}
      />
    </View>
  );
}
