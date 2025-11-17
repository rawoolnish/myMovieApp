// src/screens/auth/LoginScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Svg, { Path } from 'react-native-svg';
import { login } from '../../store/authSlice';
import { loadTheme } from '../../store/themeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Background image
const BG_IMAGE = require('../../assets/images/bg1.jpg');

// Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(4, 'Min 4 characters').required('Required'),
});

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const theme = useSelector(s => s.theme.colors);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  const onSubmit = async values => {
    const { email, password } = values;

    const usersRaw = await AsyncStorage.getItem('@movieapp_users');
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    const found = users.find(u => u.email === email && u.password === password);

    if (!found) {
      Alert.alert('Login failed', 'User not found or wrong password.');
      return;
    }

    dispatch(login({ name: found.name, email: found.email }));
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
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={onSubmit}
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
                  fontSize: 28,
                  fontWeight: '700',
                  marginBottom: 20,
                  color: 'white',
                }}
              >
                Login
              </Text>

              {/* Email */}
              <TextInput
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                style={{
                  borderWidth: 1,
                  borderColor: errors.email && touched.email ? 'red' : '#666',
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

              {/* Password With Toggle */}
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

              {/* Login Button */}
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
                <Text style={{ color: 'white', fontWeight: '600' }}>Login</Text>
              </TouchableOpacity>

              {/* Navigate to Register */}
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                style={{ marginTop: 12 }}
              >
                <Text style={{ color: '#4f8cff', textAlign: 'center' }}>
                  Create an account
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
