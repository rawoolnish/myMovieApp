// src/screens/MovieDetailScreen.js
import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { addMovieAndPersist } from '../store/watchlistSlice';
import { loadTheme } from '../store/themeSlice';
import Svg, { Path } from 'react-native-svg';
import BottomSheetReview from '../components/BottomSheetReview';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w780';

export default function MovieDetailScreen({ route, navigation }) {
  const { movie } = route.params;
  const zoom = useSharedValue(0);
  const dispatch = useDispatch();

  const reviews = useSelector(s => s.reviews[movie.id] || []);
  const theme = useSelector(s => s.theme.colors);

  const bottomSheetRef = useRef(null);

  const style = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(1 + zoom.value * 0.02, { duration: 400 }) },
    ],
  }));

  React.useEffect(() => {
    zoom.value = 1;
    dispatch(loadTheme());
  }, []);

  const STATUS_HEIGHT =
    Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44;

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
        {/* Poster */}
        <Animated.View
          style={[{ width: '100%', height: 420, overflow: 'hidden' }, style]}
        >
          <Image
            source={{
              uri:
                movie.backdrop_path
                  ? IMAGE_BASE + movie.backdrop_path
                  : 'https://image.tmdb.org/t/p/w500' + movie.poster_path,
            }}
            style={{ width: '100%', height: 420 }}
            resizeMode="cover"
          />

          {/* Top gradient */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 200,
            }}
          />

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              top: STATUS_HEIGHT,
              left: 16,
              padding: 8,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 50,
            }}
          >
            <Svg width={22} height={22} viewBox="0 0 24 24">
              <Path
                d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                fill="#fff"
              />
            </Svg>
          </TouchableOpacity>
        </Animated.View>

        {/* Movie Info */}
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: theme.text }}>
            {movie.title}
          </Text>

          <Text style={{ color: theme.textSecondary, marginTop: 6 }}>
            {movie.release_date}
          </Text>

          <Text style={{ color: theme.textSecondary, marginTop: 12 }}>{movie.overview}</Text>

          {/* Buttons */}
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <TouchableOpacity
              onPress={() => dispatch(addMovieAndPersist(movie))}
              style={{
                padding: 12,
                backgroundColor: theme.card,
                borderRadius: 8,
                marginRight: 8,
              }}
            >
              <Text style={{ color: theme.text }}>Add to Watchlist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => bottomSheetRef.current?.open()}
              style={{
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <Text style={{ color: theme.text }}>Write a Review</Text>
            </TouchableOpacity>
          </View>

          {/* Reviews Section */}
          <Text
            style={{
              color: theme.text,
              marginTop: 25,
              fontSize: 18,
              fontWeight: '700',
            }}
          >
            Community Reviews
          </Text>

          {reviews.length === 0 ? (
            <Text style={{ color: theme.textTertiary, marginTop: 10 }}>
              No reviews yet. Be the first!
            </Text>
          ) : (
            reviews.map((r, i) => (
              <View
                key={i}
                style={{
                  marginTop: 12,
                  padding: 12,
                  backgroundColor: theme.card,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: theme.text, fontWeight: '600' }}>
                  {r.user}
                </Text>
                <Text style={{ color: theme.textSecondary, marginTop: 4 }}>{r.text}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Sheet for Review */}
      <BottomSheetReview ref={bottomSheetRef} movie={movie} />
    </>
  );
}
