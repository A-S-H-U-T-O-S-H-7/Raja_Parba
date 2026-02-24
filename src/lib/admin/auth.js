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
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

class AdminAuthService {
  // Admin login with plain text password (TEMPORARY FOR TESTING)
  async login(username, password) {
    try {
      console.log('🔐 Login attempt:', username);
      
      // Find admin by username
      const adminsRef = collection(db, 'admin_users');
      const q = query(adminsRef, where('username', '==', username.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('❌ User not found');
        return { 
          success: false, 
          error: 'Invalid username or password' 
        };
      }

      const adminDoc = querySnapshot.docs[0];
      const adminData = adminDoc.data();
      
      console.log('✅ User found:', adminData.username);

      // 🔓 TEMPORARY: Plain text password comparison
      if (adminData.password !== password) {
        console.log('❌ Password mismatch');
        return { 
          success: false, 
          error: 'Invalid username or password' 
        };
      }

      console.log('✅ Password matched');

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
        lastLoginIp: null
      });

      // Remove password from response
      const { password: _, ...adminWithoutPassword } = adminData;
      
      // Generate session token
      const sessionToken = this.generateSessionToken();
      
      // Store session in Firestore
      await setDoc(doc(db, 'admin_sessions', sessionToken), {
        adminId: adminDoc.id,
        username: adminData.username,
        name: adminData.name,
        role: adminData.role,
        permissions: adminData.permissions || [],
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });

      return { 
        success: true, 
        admin: {
          id: adminDoc.id,
          ...adminWithoutPassword
        },
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
        session,
        error: null 
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

      // Create admin document (store password as plain text for testing)
      const adminRef = await addDoc(collection(db, 'admin_users'), {
        username: username.toLowerCase(),
        email: email?.toLowerCase(),
        password: password, // Plain text for testing
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
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          lastLogin: data.lastLogin?.toDate?.() || data.lastLogin,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
        };
      });
      
      return { success: true, admins, error: null };
    } catch (error) {
      console.error('Get all admins error:', error);
      return { success: false, admins: [], error: 'Failed to fetch admins' };
    }
  }

  // Get admin by ID
  async getAdminById(adminId) {
    try {
      const adminDoc = await getDoc(doc(db, 'admin_users', adminId));
      
      if (!adminDoc.exists()) {
        return { success: false, error: 'Admin not found' };
      }

      const data = adminDoc.data();
      const { password: _, ...adminWithoutPassword } = data;

      return { 
        success: true, 
        admin: {
          id: adminDoc.id,
          ...adminWithoutPassword,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          lastLogin: data.lastLogin?.toDate?.() || data.lastLogin
        },
        error: null 
      };
    } catch (error) {
      console.error('Get admin error:', error);
      return { success: false, error: 'Failed to fetch admin' };
    }
  }

  // Log admin activity
  async logAdminActivity(data) {
    try {
      await addDoc(collection(db, 'admin_activity_logs'), {
        ...data,
        timestamp: serverTimestamp(),
        ipAddress: null,
        userAgent: null
      });
    } catch (error) {
      console.error('Log activity error:', error);
    }
  }

  // Get admin activity logs
  async getActivityLogs(adminId = null, limitCount = 50) {
    try {
      let q;
      const logsRef = collection(db, 'admin_activity_logs');
      
      if (adminId) {
        q = query(
          logsRef,
          where('adminId', '==', adminId),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );
      } else {
        q = query(
          logsRef,
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );
      }
      
      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp
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
           Math.random().toString(36).substring(2, 15) +
           Date.now().toString(36);
  }

  // Check if username exists
  async checkUsernameExists(username) {
    try {
      const q = query(
        collection(db, 'admin_users'), 
        where('username', '==', username.toLowerCase())
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Check username error:', error);
      return false;
    }
  }

  // Check if email exists
  async checkEmailExists(email) {
    try {
      const q = query(
        collection(db, 'admin_users'), 
        where('email', '==', email.toLowerCase())
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Check email error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const adminAuthService = new AdminAuthService();