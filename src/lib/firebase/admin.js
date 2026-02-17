// lib/firebase/admin.js
import { 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "./config";
import { authService } from "./auth";

class AdminService {
  // Check if user is admin
  async checkAdminStatus(userId, userEmail) {
    try {
      // Try to find admin by UID first
      let adminDoc = await getDoc(doc(db, 'admins', userId));
      
      if (adminDoc.exists()) {
        return { 
          isAdmin: true, 
          data: adminDoc.data(),
          error: null 
        };
      }

      // If not found by UID, try by email
      if (userEmail) {
        const emailBasedId = userEmail.replace(/[.@]/g, '_');
        const emailAdminDoc = await getDoc(doc(db, 'admins', emailBasedId));
        
        if (emailAdminDoc.exists()) {
          // Migrate email-based admin to UID-based
          const adminData = emailAdminDoc.data();
          await this.migrateAdminRecord(userId, userEmail, adminData);
          
          // Get the new document
          adminDoc = await getDoc(doc(db, 'admins', userId));
          return { 
            isAdmin: true, 
            data: adminDoc.data(),
            error: null 
          };
        }
      }

      return { isAdmin: false, data: null, error: null };
    } catch (error) {
      console.error('Error checking admin status:', error);
      return { isAdmin: false, data: null, error: error.message };
    }
  }

  // Migrate email-based admin to UID-based
  async migrateAdminRecord(userId, userEmail, adminData) {
    try {
      const emailBasedId = userEmail.replace(/[.@]/g, '_');
      
      // Create new record with UID
      await setDoc(doc(db, 'admins', userId), {
        ...adminData,
        uid: userId,
        migratedFrom: emailBasedId,
        migratedAt: new Date(),
        lastLogin: new Date()
      });
      
      // Delete old email-based record
      await deleteDoc(doc(db, 'admins', emailBasedId));
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error migrating admin record:', error);
      return { success: false, error: error.message };
    }
  }

  // Subscribe to admin data changes
  subscribeToAdmin(userId, callback) {
    if (!userId) return () => {};
    
    const adminRef = doc(db, 'admins', userId);
    return onSnapshot(adminRef, 
      (doc) => {
        if (doc.exists()) {
          callback({ 
            exists: true, 
            data: doc.data(),
            id: doc.id 
          });
        } else {
          callback({ 
            exists: false, 
            data: null,
            id: null 
          });
        }
      },
      (error) => {
        console.error('Admin snapshot error:', error);
        callback({ exists: false, data: null, error: error.message });
      }
    );
  }

  // Format admin user data
  formatAdminUser(firebaseUser, adminData) {
    if (!firebaseUser || !adminData) return null;
    
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: adminData.name || firebaseUser.displayName,
      role: adminData.role || 'admin',
      permissions: adminData.permissions || [],
      createdAt: adminData.createdAt,
      lastLogin: adminData.lastLogin,
      setupCompleted: adminData.setupCompleted || false,
      photoURL: adminData.photoURL || firebaseUser.photoURL
    };
  }

  // Check specific permission
  hasPermission(adminUser, permission) {
    if (!adminUser) return false;
    if (adminUser.role === 'super_admin') return true;
    return adminUser.permissions?.includes(permission) || false;
  }

  // Create admin record (for super admin use)
  async createAdminRecord(userId, adminData) {
    try {
      await setDoc(doc(db, 'admins', userId), {
        ...adminData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true, error: null };
    } catch (error) {
      console.error('Error creating admin record:', error);
      return { success: false, error: error.message };
    }
  }

  // Update admin record
  async updateAdminRecord(userId, updates) {
    try {
      await setDoc(doc(db, 'admins', userId), {
        ...updates,
        updatedAt: new Date()
      }, { merge: true });
      return { success: true, error: null };
    } catch (error) {
      console.error('Error updating admin record:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete admin record
  async deleteAdminRecord(userId) {
    try {
      await deleteDoc(doc(db, 'admins', userId));
      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting admin record:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all admins (super admin only)
  async getAllAdmins() {
    try {
      const adminsRef = collection(db, 'admins');
      const snapshot = await getDocs(adminsRef);
      const admins = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, admins, error: null };
    } catch (error) {
      console.error('Error fetching admins:', error);
      return { success: false, admins: [], error: error.message };
    }
  }
}

// Export singleton instance
export const adminService = new AdminService();