// lib/admin/auth.js
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import bcrypt from 'bcryptjs'; // Install: npm install bcryptjs

class AdminAuthService {
  // Admin login (custom credentials, NOT Firebase Auth)
  async login(username, password) {
    try {
      // Find admin by username
      const adminsRef = collection(db, 'admin_users');
      const q = query(adminsRef, where('username', '==', username.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { 
          success: false, 
          error: 'Invalid username or password' 
        };
      }

      const adminDoc = querySnapshot.docs[0];
      const adminData = adminDoc.data();

      // Verify password
      const isValid = await bcrypt.compare(password, adminData.password);
      
      if (!isValid) {
        return { 
          success: false, 
          error: 'Invalid username or password' 
        };
      }

      // Check if admin is active
      if (adminData.status !== 'active') {
        return { 
          success: false, 
          error: 'Your account has been deactivated' 
        };
      }

      // Update last login
      await updateDoc(doc(db, 'admin_users', adminDoc.id), {
        lastLogin: serverTimestamp(),
        lastLoginIp: null, // You can add IP tracking
      });

      // Remove password from response
      const { password: _, ...adminWithoutPassword } = adminData;
      
      // Generate session token (you can use JWT or just store session)
      const sessionToken = this.generateSessionToken();
      
      // Store session in Firestore or use httpOnly cookies
      await setDoc(doc(db, 'admin_sessions', sessionToken), {
        adminId: adminDoc.id,
        username: adminData.username,
        role: adminData.role,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });

      return { 
        success: true, 
        admin: adminWithoutPassword,
        sessionToken,
        error: null 
      };
    } catch (error) {
      console.error('Admin login error:', error);
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      };
    }
  }

  // Create admin account (super admin only)
  async createAdmin(adminData) {
    try {
      const { username, password, name, email, role, permissions, createdBy } = adminData;

      // Check if username already exists
      const usernameCheck = await getDocs(
        query(collection(db, 'admin_users'), where('username', '==', username.toLowerCase()))
      );
      
      if (!usernameCheck.empty) {
        return { 
          success: false, 
          error: 'Username already taken' 
        };
      }

      // Check if email already used
      if (email) {
        const emailCheck = await getDocs(
          query(collection(db, 'admin_users'), where('email', '==', email.toLowerCase()))
        );
        
        if (!emailCheck.empty) {
          return { 
            success: false, 
            error: 'Email already registered' 
          };
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create admin document
      const adminRef = await addDoc(collection(db, 'admin_users'), {
        username: username.toLowerCase(),
        email: email?.toLowerCase(),
        password: hashedPassword,
        name,
        role: role || 'admin',
        permissions: permissions || [],
        status: 'active',
        createdBy,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: null
      });

      // Log activity
      await this.logAdminActivity({
        adminId: createdBy,
        action: 'CREATE_ADMIN',
        target: adminRef.id,
        details: { username, role }
      });

      return { 
        success: true, 
        adminId: adminRef.id,
        error: null 
      };
    } catch (error) {
      console.error('Create admin error:', error);
      return { 
        success: false, 
        error: 'Failed to create admin account' 
      };
    }
  }

  // Update admin account
  async updateAdmin(adminId, updates, updatedBy) {
    try {
      const adminRef = doc(db, 'admin_users', adminId);
      
      // If updating password, hash it
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      // Don't allow username change (for security)
      delete updates.username;

      await updateDoc(adminRef, {
        ...updates,
        updatedAt: serverTimestamp(),
        updatedBy
      });

      // Log activity
      await this.logAdminActivity({
        adminId: updatedBy,
        action: 'UPDATE_ADMIN',
        target: adminId,
        details: { updates: Object.keys(updates) }
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Update admin error:', error);
      return { 
        success: false, 
        error: 'Failed to update admin account' 
      };
    }
  }

  // Delete admin account
  async deleteAdmin(adminId, deletedBy) {
    try {
      // Prevent self-deletion
      if (adminId === deletedBy) {
        return { 
          success: false, 
          error: 'You cannot delete your own account' 
        };
      }

      // Check if admin is super admin
      const adminDoc = await getDoc(doc(db, 'admin_users', adminId));
      if (adminDoc.exists() && adminDoc.data().role === 'super_admin') {
        // Count super admins
        const superAdmins = await getDocs(
          query(collection(db, 'admin_users'), where('role', '==', 'super_admin'))
        );
        
        if (superAdmins.size <= 1) {
          return { 
            success: false, 
            error: 'Cannot delete the only super admin' 
          };
        }
      }

      await deleteDoc(doc(db, 'admin_users', adminId));

      // Log activity
      await this.logAdminActivity({
        adminId: deletedBy,
        action: 'DELETE_ADMIN',
        target: adminId
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Delete admin error:', error);
      return { 
        success: false, 
        error: 'Failed to delete admin account' 
      };
    }
  }

  // Verify session
  async verifySession(sessionToken) {
    try {
      const sessionDoc = await getDoc(doc(db, 'admin_sessions', sessionToken));
      
      if (!sessionDoc.exists()) {
        return { success: false, error: 'Invalid session' };
      }

      const session = sessionDoc.data();
      
      // Check if session expired
      if (session.expiresAt?.toDate() < new Date()) {
        await deleteDoc(doc(db, 'admin_sessions', sessionToken));
        return { success: false, error: 'Session expired' };
      }

      // Get admin details
      const adminDoc = await getDoc(doc(db, 'admin_users', session.adminId));
      
      if (!adminDoc.exists() || adminDoc.data().status !== 'active') {
        await deleteDoc(doc(db, 'admin_sessions', sessionToken));
        return { success: false, error: 'Admin account not found or inactive' };
      }

      const adminData = adminDoc.data();
      const { password: _, ...adminWithoutPassword } = adminData;

      return { 
        success: true, 
        admin: {
          id: adminDoc.id,
          ...adminWithoutPassword
        },
        session 
      };
    } catch (error) {
      console.error('Verify session error:', error);
      return { success: false, error: 'Failed to verify session' };
    }
  }

  // Logout
  async logout(sessionToken) {
    try {
      if (sessionToken) {
        await deleteDoc(doc(db, 'admin_sessions', sessionToken));
      }
      return { success: true, error: null };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Failed to logout' };
    }
  }

  // Get all admins (super admin only)
  async getAllAdmins() {
    try {
      const snapshot = await getDocs(collection(db, 'admin_users'));
      const admins = snapshot.docs.map(doc => {
        const data = doc.data();
        const { password: _, ...adminWithoutPassword } = data;
        return {
          id: doc.id,
          ...adminWithoutPassword,
          createdAt: data.createdAt?.toDate(),
          lastLogin: data.lastLogin?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        };
      });
      
      return { success: true, admins, error: null };
    } catch (error) {
      console.error('Get all admins error:', error);
      return { success: false, admins: [], error: 'Failed to fetch admins' };
    }
  }

  // Log admin activity
  async logAdminActivity(data) {
    try {
      await addDoc(collection(db, 'admin_activity_logs'), {
        ...data,
        timestamp: serverTimestamp(),
        ipAddress: null, // Add IP tracking if needed
        userAgent: null // Add user agent if needed
      });
    } catch (error) {
      console.error('Log activity error:', error);
    }
  }

  // Get admin activity logs
  async getActivityLogs(adminId, limit = 50) {
    try {
      const logsRef = collection(db, 'admin_activity_logs');
      const q = query(
        logsRef,
        where('adminId', '==', adminId),
        orderBy('timestamp', 'desc'),
        limit(limit)
      );
      
      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      
      return { success: true, logs, error: null };
    } catch (error) {
      console.error('Get activity logs error:', error);
      return { success: false, logs: [], error: 'Failed to fetch logs' };
    }
  }

  // Generate session token
  generateSessionToken() {
    return 'adm_' + Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

export const adminAuthService = new AdminAuthService();