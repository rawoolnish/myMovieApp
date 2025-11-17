// src/screens/auth/RegisterScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Svg, { Path } from 'react-native-svg';
import { loadTheme } from '../../store/themeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 👉 Replace with your background image
const BG_IMAGE = require('../../assets/images/bg1.jpg');

// Yup validation schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(4, 'Min 4 characters')
    .required('Required'),
});

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const theme = useSelector(s => s.theme.colors);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  const handleRegister = async (values) => {
    const { name, email, password } = values;

    const raw = await AsyncStorage.getItem('@movieapp_users');
    const users = raw ? JSON.parse(raw) : [];

    if (users.find(u => u.email === email)) {
      Alert.alert('Error', 'Email already registered.');
      return;
    }

    users.push({ name, email, password });
    await AsyncStorage.setItem('@movieapp_users', JSON.stringify(users));

    Alert.alert('Success', 'Account created. Please login.');
    navigation.navigate('Login');
  };

  return (
    <ImageBackground source={BG_IMAGE} style={{ flex: 1 }} resizeMode="cover">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          backgroundColor: 'rgba(0,0,0,0.55)',
        }}
      >
        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.45)',
                padding: 20,
                borderRadius: 14,
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: '700',
                  marginBottom: 18,
                  color: 'white',
                }}
              >
                Create Account
              </Text>

              {/* Name */}
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#aaa"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                style={{
                  borderWidth: 1,
                  borderColor:
                    errors.name && touched.name ? 'red' : '#666',
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  marginBottom: 5,
                }}
              />
              {errors.name && touched.name && (
                <Text style={{ color: 'red', marginBottom: 8 }}>
                  {errors.name}
                </Text>
              )}

              {/* Email */}
              <TextInput
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor:
                    errors.email && touched.email ? 'red' : '#666',
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  marginBottom: 5,
                }}
              />
              {errors.email && touched.email && (
                <Text style={{ color: 'red', marginBottom: 8 }}>
                  {errors.email}
                </Text>
              )}

              {/* Password with toggle */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor:
                    errors.password && touched.password ? 'red' : '#666',
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  marginBottom: 5,
                  paddingRight: 10,
                }}
              >
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showPassword}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  style={{
                    flex: 1,
                    padding: 12,
                    color: 'white',
                  }}
                />

                {/* Eye Icon */}
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Svg width={24} height={24} viewBox="0 0 24 24">
                    {showPassword ? (
  // 👁️ Eye Open
  <Path
    fill="#fff"
    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"
  />
) : (
  // 🙈 Eye Closed (Slash)
  <>
    <Path
      fill="#fff"
      d="M1 1l22 22-1.5 1.5L18 19.5c-1.8 1-3.8 1.5-6 1.5-5 0-9.27-3.11-11-7.5 1-2.6 2.7-4.8 4.8-6.3L1 2.5 1 1z"
    />
    <Path
      fill="#fff"
      d="M12 4.5c2.1 0 4 .5 5.7 1.4l-1.6 1.6c-1.2-.5-2.5-.7-3.9-.4-3 .6-5.3 3.1-5.8 6.1-.2 1.1 0 2.1.4 3L5.4 17c-1.9-1.4-3.4-3.4-4.4-5.7 1.73-4.39 6-7.5 11-7.5z"
    />
  </>
)}

                  </Svg>
                </TouchableOpacity>
              </View>

              {errors.password && touched.password && (
                <Text style={{ color: 'red', marginBottom: 8 }}>
                  {errors.password}
                </Text>
              )}

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  padding: 12,
                  backgroundColor: '#4f8cff',
                  borderRadius: 10,
                  alignItems: 'center',
                  marginTop: 10,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>
                  Register
                </Text>
              </TouchableOpacity>

              {/* Back to Login */}
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={{ marginTop: 14 }}
              >
                <Text style={{ color: '#4f8cff', textAlign: 'center' }}>
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
