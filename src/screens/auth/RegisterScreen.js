// src/screens/auth/RegisterScreen.js
import React, { useEffect } from 'react';
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

import { loadTheme } from '../../store/themeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 👉 Replace with your provided image
const BG_IMAGE = require('../../assets/images/bg1.jpg');

// Yup validation
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Name required'),
  email: Yup.string().email('Invalid email').required('Email required'),
  password: Yup.string()
    .min(4, 'Min 4 characters')
    .required('Password required'),
});

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const theme = useSelector(s => s.theme.colors);

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  const handleRegister = async (values) => {
    const { name, email, password } = values;

    const usersRaw = await AsyncStorage.getItem('@movieapp_users');
    const users = usersRaw ? JSON.parse(usersRaw) : [];

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
    <ImageBackground
      source={BG_IMAGE}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
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
                  marginBottom: 16,
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

              {/* Password */}
              <TextInput
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                style={{
                  borderWidth: 1,
                  borderColor:
                    errors.password && touched.password ? 'red' : '#666',
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  marginBottom: 5,
                }}
              />
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

              {/* Login Link */}
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
