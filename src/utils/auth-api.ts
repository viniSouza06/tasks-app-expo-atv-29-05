import axios from 'axios';

export interface SignupPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const response = await axios.post(`${baseURL}/api/auth/signup`, payload);
  return response.data;
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const response = await axios.post(`${baseURL}/api/auth/login`, payload);
  return response.data;
}
