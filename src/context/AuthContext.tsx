import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, saveToken, removeToken, getUser, saveUser, removeUser, User } from '../utils/storage';

type AuthContextValue = {
  session: string | null;
  user: User | null;
  loading: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      const userData = await getUser();
      setSession(token);
      setUser(userData);
      setLoading(false);
    })();
  }, []);

  async function signIn(token: string, userObj: User) {
    await saveToken(token);
    await saveUser(userObj);
    setSession(token);
    setUser(userObj);
  }

  async function signOut() {
    await removeToken();
    await removeUser();
    setSession(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
