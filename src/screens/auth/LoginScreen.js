// src/screens/auth/LoginScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { login } from '../../store/authSlice';
import { loadTheme } from '../../store/themeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 👉 Replace with your BG image
const BG_IMAGE = require('../../assets/images/bg1.jpg');

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(4, 'Min 4 characters')
    .required('Required'),
});

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const theme = useSelector(s => s.theme.colors);

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  const onSubmit = async (values) => {
    const { email, password } = values;

    const usersRaw = await AsyncStorage.getItem('@movieapp_users');
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    const found = users.find(
      u => u.email === email && u.password === password
    );

    if (!found) {
      Alert.alert('Login failed', 'User not found or wrong password.');
      return;
    }

    dispatch(login({ name: found.name, email: found.email }));
  };

  return (
    // <StatusBar barStyle={"default"} translucent/>
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
          backgroundColor: 'rgba(0,0,0,0.55)', // dark overlay
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
                backdropFilter: 'blur(8px)',
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
