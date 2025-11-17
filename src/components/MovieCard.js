import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useSelector } from 'react-redux';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function MovieCard({ movie }) {
  const theme = useSelector((s) => s.theme.colors);

  return (
    <Animated.View
      entering={Animated?.FadeInUp?.duration(350)}
      layout={Animated?.Layout?.springify()}
      style={{
        width: CARD_WIDTH,
        margin: 8,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: theme.card,
      }}
    >
      {/* Poster */}
      {movie.poster_path ? (
        <Image
          source={{ uri: IMAGE_BASE + movie.poster_path }}
          style={{ width: CARD_WIDTH, height: 240 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: CARD_WIDTH,
            height: 240,
            backgroundColor: '#333',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text>No Image</Text>
        </View>
      )}

      {/* Rating Overlay */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: 8,
          backgroundColor: 'rgba(0,0,0,0.4)', // half transparent background
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <Path
            d="M12 .587l3.668 7.431L24 9.748l-6 5.847 1.417 8.265L12 19.771 4.583 23.86 6 15.595 0 9.748l8.332-1.73z"
            fill="#f5c518"
          />
        </Svg>

        <Text style={{ color: '#fff', marginLeft: 6, fontWeight: '600' }}>
          {movie.vote_average ?? '-'}
        </Text>
      </View>
    </Animated.View>
  );
}
