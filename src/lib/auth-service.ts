import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'
import { validateCustomerRegistration, validateLogin, checkRateLimit, ValidationResult } from './validation'

export interface UserProfile {
  uid: string
  email: string
  firstName: string
  lastName: string
  phone: string
  createdAt: any
  updatedAt: any
}

export class AuthService {
  private static instance: AuthService
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  // Sign up with email and password
  async signUp(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    phone: string,
    confirmPassword: string
  ): Promise<UserCredential> {
    try {
      // Rate limiting check
      const rateLimitIdentifier = `signup:${email}`;
      if (!checkRateLimit(rateLimitIdentifier)) {
        throw new Error('Too many registration attempts. Please try again later.');
      }

      // Validate input data
      const validationResult: ValidationResult = validateCustomerRegistration({
        firstName,
        lastName,
        email,
        phone,
        password,
        confirmPassword
      });

      if (!validationResult.isValid) {
        const errorMessages = Object.values(validationResult.errors);
        throw new Error(errorMessages[0] || 'Invalid registration data');
      }

      // Use sanitized data
      const sanitized = validationResult.sanitizedData;

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        sanitized.email, 
        sanitized.password
      );
      
      // Create user profile in Firestore with sanitized data
      const userProfile: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'> = {
        email: sanitized.email,
        firstName: sanitized.firstName,
        lastName: sanitized.lastName,
        phone: sanitized.phone
      }

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userProfile,
        uid: userCredential.user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      return userCredential
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Handle Firebase auth errors
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            throw new Error('An account with this email already exists.');
          case 'auth/weak-password':
            throw new Error('Password should be at least 6 characters.');
          case 'auth/invalid-email':
            throw new Error('Please enter a valid email address.');
          case 'auth/too-many-requests':
            throw new Error('Too many attempts. Please try again later.');
          default:
            throw new Error('Registration failed. Please try again.');
        }
      }
      
      throw error;
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      // Rate limiting check
      const rateLimitIdentifier = `signin:${email}`;
      if (!checkRateLimit(rateLimitIdentifier)) {
        throw new Error('Too many login attempts. Please try again later.');
      }

      // Validate input data
      const validationResult: ValidationResult = validateLogin({ email, password });

      if (!validationResult.isValid) {
        const errorMessages = Object.values(validationResult.errors);
        throw new Error(errorMessages[0] || 'Invalid login data');
      }

      // Use sanitized data
      const sanitized = validationResult.sanitizedData;

      return await signInWithEmailAndPassword(auth, sanitized.email, sanitized.password)
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle Firebase auth errors
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            throw new Error('No account found with this email.');
          case 'auth/wrong-password':
            throw new Error('Incorrect password.');
          case 'auth/invalid-email':
            throw new Error('Please enter a valid email address.');
          case 'auth/too-many-requests':
            throw new Error('Too many failed attempts. Please try again later.');
          case 'auth/user-disabled':
            throw new Error('This account has been disabled.');
          default:
            throw new Error('Login failed. Please try again.');
        }
      }
      
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser
  }

  // Get user profile from Firestore
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile
      } else {
        return null
      }
    } catch (error) {
      console.error('Get user profile error:', error)
      throw error
    }
  }

  // Update user profile
  async updateUserProfile(uid: string, updates: { firstName: string; lastName: string; phone: string }): Promise<void> {
    try {
      // Validate input data
      const validationResult: ValidationResult = validateProfileUpdate(updates);

      if (!validationResult.isValid) {
        const errorMessages = Object.values(validationResult.errors);
        throw new Error(errorMessages[0] || 'Invalid profile data');
      }

      // Use sanitized data
      const sanitized = validationResult.sanitizedData;

      const docRef = doc(db, 'users', uid)
      await setDoc(docRef, {
        ...sanitized,
        updatedAt: serverTimestamp()
      }, { merge: true })
    } catch (error) {
      console.error('Update user profile error:', error)
      throw error
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback)
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return auth.currentUser !== null
  }

  // Get authentication error messages
  getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.'
      case 'auth/invalid-email':
        return 'Please enter a valid email address.'
      case 'auth/user-not-found':
        return 'No account found with this email.'
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.'
      default:
        return 'An error occurred. Please try again.'
    }
  }
}

export const authService = AuthService.getInstance()
