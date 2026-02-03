import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Google API configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
].join(' ');

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  accessToken: string;
  sheetId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isGapiReady: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGapiReady, setIsGapiReady] = useState(false);
  const [tokenClient, setTokenClient] = useState<any>(null);

  // Load Google API scripts
  useEffect(() => {
    const loadGoogleScripts = async () => {
      // Load GAPI
      const gapiScript = document.createElement('script');
      gapiScript.src = 'https://apis.google.com/js/api.js';
      gapiScript.async = true;
      gapiScript.defer = true;
      
      // Load GSI (Google Sign In)
      const gsiScript = document.createElement('script');
      gsiScript.src = 'https://accounts.google.com/gsi/client';
      gsiScript.async = true;
      gsiScript.defer = true;

      gapiScript.onload = () => {
        window.gapi.load('client', async () => {
          try {
            await window.gapi.client.init({
              discoveryDocs: [
                'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
                'https://sheets.googleapis.com/$discovery/rest?version=v4',
              ],
            });
            setIsGapiReady(true);
          } catch (error) {
            console.error('Error initializing GAPI client:', error);
          }
        });
      };

      gsiScript.onload = () => {
        if (!GOOGLE_CLIENT_ID) {
          console.warn('Google Client ID not configured');
          setIsLoading(false);
          return;
        }

        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: SCOPES,
          callback: () => {}, // Will be set during sign in
        });
        setTokenClient(client);
        setIsLoading(false);
      };

      document.body.appendChild(gapiScript);
      document.body.appendChild(gsiScript);
    };

    loadGoogleScripts();

    // Check for saved user session
    const savedUser = localStorage.getItem('lifevibe_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('lifevibe_user');
      }
    }
  }, []);

  const signIn = useCallback(async () => {
    if (!tokenClient || !isGapiReady) {
      console.error('Google APIs not ready');
      return;
    }

    return new Promise<void>((resolve, reject) => {
      tokenClient.callback = async (response: any) => {
        if (response.error) {
          reject(response.error);
          return;
        }

        try {
          // Set the access token for GAPI
          window.gapi.client.setToken({ access_token: response.access_token });

          // Get user info
          const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${response.access_token}` },
          });
          const userInfo = await userInfoResponse.json();

          // Check for existing sheet ID in localStorage
          const savedSheetId = localStorage.getItem(`lifevibe_sheet_${userInfo.id}`);

          const newUser: User = {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            accessToken: response.access_token,
            sheetId: savedSheetId || undefined,
          };

          setUser(newUser);
          localStorage.setItem('lifevibe_user', JSON.stringify(newUser));
          resolve();
        } catch (error) {
          console.error('Error getting user info:', error);
          reject(error);
        }
      };

      tokenClient.requestAccessToken({ prompt: 'consent' });
    });
  }, [tokenClient, isGapiReady]);

  const signOut = useCallback(async () => {
    if (user?.accessToken) {
      window.google.accounts.oauth2.revoke(user.accessToken, () => {
        console.log('Token revoked');
      });
    }
    
    setUser(null);
    localStorage.removeItem('lifevibe_user');
    
    if (window.gapi?.client) {
      window.gapi.client.setToken(null);
    }
  }, [user]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('lifevibe_user', JSON.stringify(updated));
      if (updates.sheetId) {
        localStorage.setItem(`lifevibe_sheet_${prev.id}`, updates.sheetId);
      }
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isGapiReady, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
