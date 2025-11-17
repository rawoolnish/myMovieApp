// src/components/BottomSheetReview.js
import React, { forwardRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import Svg, { Path } from 'react-native-svg';
import { addReview } from '../store/reviewSlice';

const BottomSheetReview = forwardRef(({ movie }, ref) => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const theme = useSelector((s) => s.theme.colors);

  const translateY = useSharedValue(500);

  // Expose open() to parent
  React.useImperativeHandle(ref, () => ({
    open: () => {
      translateY.value = withTiming(0, { duration: 300 });
    },
  }));

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleClose = () => {
    translateY.value = withTiming(500, { duration: 250 });
  };

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.card,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
        },
        style,
      ]}
    >
      <KeyboardAvoidingView behavior="padding">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: '700' }}>
            Write a Review
          </Text>
          <TouchableOpacity onPress={handleClose}>
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                fill={theme.text}
              />
            </Svg>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Share your thoughts..."
          placeholderTextColor={theme.textTertiary}
          multiline
          value={text}
          onChangeText={setText}
          style={{
            marginTop: 15,
            color: theme.text,
            backgroundColor: theme.surface,
            borderRadius: 12,
            padding: 12,
            height: 120,
            textAlignVertical: 'top',
          }}
        />

        <TouchableOpacity
          onPress={() => {
            if (!text.trim()) return;

            dispatch(addReview({ movieId: movie.id, text }));

            setText('');
            translateY.value = withTiming(500, { duration: 250 });
          }}
          style={{
            backgroundColor: theme.primary,
            padding: 12,
            borderRadius: 10,
            marginTop: 15,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Post Review
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Animated.View>
  );
});

export default BottomSheetReview;
