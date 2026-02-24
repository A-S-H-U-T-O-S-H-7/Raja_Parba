"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from "firebase/auth";

const defaultAuthContextValue = {
  user: null,
  loading: false,
  signup: async () => {
    throw new Error("AuthProvider is not mounted");
  },
  login: async () => {
    throw new Error("AuthProvider is not mounted");
  },
  signInWithGoogle: async () => {
    throw new Error("AuthProvider is not mounted");
  },
  sendPasswordReset: async () => {
    throw new Error("AuthProvider is not mounted");
  },
  resetPassword: async () => {
    throw new Error("AuthProvider is not mounted");
  },
  logout: async () => {
    throw new Error("AuthProvider is not mounted");
  },
};

const AuthContext = createContext(defaultAuthContextValue);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, 
      (firebaseUser) => {
        console.log('🔥 Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
        if (firebaseUser) {
          console.log('User details:', {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified
          });
        }
        setUser(firebaseUser);
        setLoading(false);
      },
      (error) => {
        console.error('🔥 Auth state change error:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sign up
  const signup = async (email, password) => {
    try {
      console.log('🔥 Attempting signup for:', email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Signup successful for:', email);
      return result;
    } catch (error) {
      console.error('❌ Signup failed:', {
        code: error.code,
        message: error.message,
        email: email
      });
      throw error;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      console.log('🔥 Attempting login for:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login successful for:', email);
      return result;
    } catch (error) {
      console.error('❌ Login failed:', {
        code: error.code,
        message: error.message,
        email: email
      });
      throw error;
    }
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      console.log('🔥 Attempting Google sign-in');
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Google sign-in successful for:', result.user.email);
      return result;
    } catch (error) {
      console.error('❌ Google sign-in failed:', {
        code: error.code,
        message: error.message
      });
      throw error;
    }
  };

  // Send password reset email
  const sendPasswordReset = async (email) => {
    try {
      console.log('🔥 Attempting to send password reset email for:', email);
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Password reset email sent successfully for:', email);
      return { success: true };
    } catch (error) {
      console.error('❌ Password reset email failed:', {
        code: error.code,
        message: error.message,
        email: email
      });
      throw error;
    }
  };

  // Reset password with code
  const resetPassword = async (oobCode, newPassword) => {
    try {
      console.log('🔥 Attempting to reset password with code');
      await confirmPasswordReset(auth, oobCode, newPassword);
      console.log('✅ Password reset successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Password reset failed:', {
        code: error.code,
        message: error.message
      });
      throw error;
    }
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, signInWithGoogle, sendPasswordReset, resetPassword, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) || defaultAuthContextValue;
