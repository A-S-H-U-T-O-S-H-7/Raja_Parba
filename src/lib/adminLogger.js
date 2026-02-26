// lib/adminLogger.js
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

class AdminLogger {
  constructor() {
    this.collectionName = 'adminLogs';
  }

  async log(adminUser, action, entityType, entityId, details = null) {
    if (!adminUser?.uid) return false;

    try {
      await addDoc(collection(db, this.collectionName), {
        adminId: adminUser.uid,
        adminName: adminUser.name || adminUser.email,
        adminRole: adminUser.role || 'admin',
        action,
        entityType,
        entityId,
        details,
        timestamp: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error logging admin activity:', error);
      return false;
    }
  }

  async logBookingActivity(adminUser, action, bookingId, details) {
    return this.log(adminUser, action, 'booking', bookingId, details);
  }

  async logUserActivity(adminUser, action, userId, details) {
    return this.log(adminUser, action, 'user', userId, details);
  }

  async logAdminActivity(adminUser, action, targetAdminId, details) {
    return this.log(adminUser, action, 'admin', targetAdminId, details);
  }

  async logSeatActivity(adminUser, action, seatId, details) {
    return this.log(adminUser, action, 'seat', seatId, details);
  }

  async logSettingsActivity(adminUser, action, settingType, details) {
    return this.log(adminUser, action, 'settings', settingType, details);
  }

  async logPaymentActivity(adminUser, action, paymentId, details) {
    return this.log(adminUser, action, 'payment', paymentId, details);
  }

  async logSystemActivity(adminUser, action, systemComponent, details) {
    return this.log(adminUser, action, 'system', systemComponent, details);
  }
}

const adminLogger = new AdminLogger();
export default adminLogger;