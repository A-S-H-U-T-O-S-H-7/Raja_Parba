// lib/firebase/auth.js
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  confirmPasswordReset,
  signInAnonymously
} from "firebase/auth";
import { auth } from "./config";

class AuthService {
  // Register new user
  async signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { 
        success: true, 
        user: userCredential.user,
        error: null 
      };
    } catch (error) {
      return { 
        success: false, 
        user: null, 
        error: this.handleAuthError(error) 
      };
    }
  }

  // Login with email/password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { 
        success: true, 
        user: userCredential.user,
        error: null 
      };
    } catch (error) {
      return { 
        success: false, 
        user: null, 
        error: this.handleAuthError(error) 
      };
    }
  }

  // Google sign in
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      const userCredential = await signInWithPopup(auth, provider);
      return { 
        success: true, 
        user: userCredential.user,
        error: null 
      };
    } catch (error) {
      return { 
        success: false, 
        user: null, 
        error: this.handleAuthError(error) 
      };
    }
  }

  // Send password reset email
  async sendPasswordReset(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { 
        success: true, 
        error: null 
      };
    } catch (error) {
      return { 
        success: false, 
        error: this.handleAuthError(error) 
      };
    }
  }

  // Confirm password reset
  async confirmPasswordReset(oobCode, newPassword) {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      return { 
        success: true, 
        error: null 
      };
    } catch (error) {
      return { 
        success: false, 
        error: this.handleAuthError(error) 
      };
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: this.handleAuthError(error) };
    }
  }

  // Anonymous sign in (for admin initialization)
  async signInAnonymously() {
    try {
      const userCredential = await signInAnonymously(auth);
      return { 
        success: true, 
        user: userCredential.user,
        error: null 
      };
    } catch (error) {
      return { 
        success: false, 
        user: null, 
        error: this.handleAuthError(error) 
      };
    }
  }

  // Auth state observer
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Handle Firebase auth errors
  handleAuthError(error) {
    console.error('Auth Error:', error.code, error.message);
    
    const errorMap = {
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Invalid password',
      'auth/invalid-email': 'Please enter a valid email address',
      'auth/user-disabled': 'This account has been disabled',
      'auth/email-already-in-use': 'An account already exists with this email',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/popup-closed-by-user': 'Sign in cancelled',
      'auth/cancelled-popup-request': 'Sign in cancelled',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Check your connection',
      'auth/expired-action-code': 'Reset link has expired',
      'auth/invalid-action-code': 'Invalid reset link',
      'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations'
    };

    return errorMap[error.code] || error.message || 'An authentication error occurred';
  }
}

// Export singleton instance
export const authService = new AuthService();