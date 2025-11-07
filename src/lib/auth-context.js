"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import api from './axios';
import { getProfileNav } from './ProfileApi';
import { buildImageUrl } from './utils';

// Bentuk data user minimal; kini termasuk avatar/image apabila tersedia.
const defaultUser = { name: null, roles: [], image: null, loading: true };

const AuthContext = createContext({
  user: defaultUser,
  setUser: () => {},
  refreshUser: async () => {},
  logoutLocal: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser);

  const fetchProfile = useCallback(async () => {
    // Jika tidak ada token -> anggap belum login
    const token = Cookies.get('token');
    if (!token) {
        setUser({ name: null, roles: [], image: null, loading: false });
      return;
    }
    try {
      const response = await getProfileNav();
      const image = buildImageUrl(response.image || response.avatar_url || null);
      setUser({ name: response.name || 'User', roles: response.roles, image, loading: false });
      if (response.name) {
        Cookies.set('name', response.name);
      }
    } catch (e) {
      console.warn('Gagal fetch profil:', e?.response?.data || e.message);
      setUser({ name: null, roles: [], image: null, loading: false });
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const refreshUser = fetchProfile;

  const logoutLocal = () => {
    Cookies.remove('token');
    Cookies.remove('roles');
    Cookies.remove('name');
  setUser({ name: null, roles: [], image: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser, logoutLocal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
