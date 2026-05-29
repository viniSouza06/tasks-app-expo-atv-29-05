import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export interface User {
  id: string;
  name: string;
  email: string;
}

async function setItem(key: string, value: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function removeItem(key: string) {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export async function saveToken(token: string) {
  await setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return getItem(TOKEN_KEY);
}

export async function removeToken() {
  await removeItem(TOKEN_KEY);
}

export async function saveUser(user: User) {
  await setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<User | null> {
  const data = await getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function removeUser() {
  await removeItem(USER_KEY);
}
