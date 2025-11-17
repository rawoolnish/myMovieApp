// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Svg, { Rect, G, Text as SvgText, Path } from 'react-native-svg';
import { logout } from '../store/authSlice';
import { toggleTheme, loadTheme } from '../store/themeSlice';

// TMDB Genre Mapping
const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  27: 'Horror',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  53: 'Thriller',
};

// Bar Chart Colors
const COLORS = [
  '#4f8cff',
  '#ff8f00',
  '#1fae4b',
  '#d6336c',
  '#9c27b0',
  '#00bcd4',
];

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector(s => s.auth.user);
  const watchlist = useSelector(s => s.watchlist.movies);
  const theme = useSelector(s => s.theme.colors);
  const isDark = useSelector(s => s.theme.mode === 'dark');

  React.useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  // Count genres
  const freq = {};
  watchlist.forEach(m => {
    (m.genre_ids || []).forEach(g => {
      const name = GENRE_MAP[g] || g;
      freq[name] = (freq[name] || 0) + 1;
    });
  });

  // Convert to list and take top 6
  const entries = Object.entries(freq)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Chart settings
  const chartWidth = 320;
  const chartHeight = 160;
  const max = Math.max(...entries.map(e => e.count), 1);

  // Profile Stats
  const totalHours = watchlist.length * 2; // avg 2 hr movie
  const avgRating =
    watchlist.reduce((sum, m) => sum + (m.vote_average || 0), 0) /
    (watchlist.length || 1);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ padding: 16 }}>
        {/* USER INFO */}
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>
          {user?.name}
        </Text>
        <Text
          style={{ color: theme.textSecondary, marginBottom: 12, fontSize: 12 }}
        >
          {user?.email}
        </Text>


        {/* STATIC STATS */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={{
              backgroundColor: isDark ? '#1a2a4a' : '#f2f4ff',
              padding: 16,
              borderRadius: 12,
              width: '48%',
            }}
          >
            <Text style={{ color: '#4f8cff', fontSize: 12 }}>Movies Added</Text>
            <Text
              style={{ color: theme.text, fontSize: 22, fontWeight: '700' }}
            >
              {watchlist.length}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: isDark ? '#3a2a1a' : '#fff4e5',
              padding: 16,
              borderRadius: 12,
              width: '48%',
            }}
          >
            <Text style={{ color: '#ff8f00', fontSize: 12 }}>Avg Rating</Text>
            <Text
              style={{ color: theme.text, fontSize: 22, fontWeight: '700' }}
            >
              {avgRating.toFixed(1)}
            </Text>
          </View>
        </View>

        <View style={{ height: 12 }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={{
              backgroundColor: isDark ? '#1a3a2a' : '#e9fff2',
              padding: 16,
              borderRadius: 12,
              width: '48%',
            }}
          >
            <Text style={{ color: '#1fae4b', fontSize: 12 }}>Watch Time</Text>
            <Text
              style={{ color: theme.text, fontSize: 22, fontWeight: '700' }}
            >
              {totalHours} hrs
            </Text>
          </View>

          <View
            style={{
              backgroundColor: isDark ? '#3a1a2a' : '#ffe6ea',
              padding: 16,
              borderRadius: 12,
              width: '48%',
            }}
          >
            <Text style={{ color: '#d6336c', fontSize: 12 }}>Top Genre</Text>
            <Text
              style={{ color: theme.text, fontSize: 22, fontWeight: '700' }}
            >
              {entries[0]?.genre || '-'}
            </Text>
          </View>
        </View>

        {/* GENRE CHART */}
        <Text
          style={{
            color: theme.text,
            marginBottom: 8,
            marginTop: 20,
            fontSize: 18,
            fontWeight: '600',
          }}
        >
          Genre Preferences
        </Text>

        {entries.length === 0 ? (
          <Text style={{ color: theme.textSecondary }}>
            No data yet. Add movies to see genre stats.
          </Text>
        ) : (
          <Svg width={chartWidth} height={chartHeight}>
            <G>
              {entries.map((e, i) => {
                const bw = chartWidth / entries.length;

                const minHeight = 25;
                const maxHeight = chartHeight - 60;

                const h = (e.count / max) * maxHeight + minHeight;

                return (
                  <G key={e.genre}>
                    <Rect
                      x={i * bw + 12}
                      y={20}
                      width={bw - 24}
                      height={maxHeight + minHeight}
                      fill={isDark ? '#222' : '#eaeaea'}
                      rx={6}
                    />

                    <Rect
                      x={i * bw + 12}
                      y={chartHeight - h - 20}
                      width={bw - 24}
                      height={h}
                      fill={COLORS[i % COLORS.length]}
                      rx={6}
                    />

                    <SvgText
                      x={i * bw + bw / 2}
                      y={chartHeight - h - 25}
                      fontSize={11}
                      fill={theme.text}
                      textAnchor="middle"
                    >
                      {e.count}
                    </SvgText>

                    <SvgText
                      x={i * bw + bw / 2}
                      y={chartHeight - 5}
                      fontSize={11}
                      fill={theme.textSecondary}
                      textAnchor="middle"
                    >
                      {e.genre}
                    </SvgText>
                  </G>
                );
              })}
            </G>
          </Svg>
        )}
        
        {/* THEME TOGGLE */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.card,
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.border,
            marginTop:30
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              style={{ marginRight: 12 }}
            >
              {isDark ? (
                <Path
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                  fill={theme.text}
                />
              ) : (
                <Path
                  d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a1 1 0 0 0-1.41 0 1 1 0 0 0 0 1.41l1.06 1.06a1 1 0 1 0 1.41-1.41L5.99 4.58zm12.37 12.37a1 1 0 0 0-1.41 0 1 1 0 0 0 0 1.41l1.06 1.06a1 1 0 1 0 1.41-1.41l-1.06-1.06zm1.06-10.96a1 1 0 0 0 0-1.41 1 1 0 0 0-1.41 0l-1.06 1.06a1 1 0 1 0 1.41 1.41l1.06-1.06zM7.05 18.36a1 1 0 0 0 0-1.41 1 1 0 0 0-1.41 0l-1.06 1.06a1 1 0 1 0 1.41 1.41l1.06-1.06z"
                  fill={theme.text}
                />
              )}
            </Svg>
            <Text
              style={{ color: theme.text, fontSize: 16, fontWeight: '600' }}
            >
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={() => dispatch(toggleTheme())}
            trackColor={{ false: '#ccc', true: '#4f8cff' }}
            thumbColor="#fff"
          />
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.card,
            padding: 16,
            borderRadius: 12,
            marginBottom: 18,
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            style={{ marginRight: 12 }}
          >
            <Path
              d="M17 8l-1.41 1.41L17.17 11H9v2h8.17l-1.58 1.58L17 16l4-4-4-4zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V5z"
              fill={theme.error}
            />
          </Svg>
          <Text style={{ color: theme.error, fontSize: 16, fontWeight: '600' }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
