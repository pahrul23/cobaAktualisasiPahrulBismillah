const STORAGE_KEYS = {
  DASHBOARD_PREFERENCES: 'dpd_executive_dashboard_preferences',
  LAST_SELECTED_MONTH: 'dpd_executive_last_month',
  NOTIFICATION_SETTINGS: 'dpd_executive_notifications'
};

export const storage = {
  // Dashboard preferences
  getDashboardPreferences: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DASHBOARD_PREFERENCES);
      return data ? JSON.parse(data) : {
        autoRefresh: true,
        refreshInterval: 300000, // 5 minutes
        showNotifications: true
      };
    } catch {
      return {};
    }
  },

  setDashboardPreferences: (preferences) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.DASHBOARD_PREFERENCES, 
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.error('Failed to save dashboard preferences:', error);
    }
  },

  // Last selected month
  getLastSelectedMonth: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_SELECTED_MONTH) || 
             new Date().toISOString().slice(0, 7);
    } catch {
      return new Date().toISOString().slice(0, 7);
    }
  },

  setLastSelectedMonth: (month) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SELECTED_MONTH, month);
    } catch (error) {
      console.error('Failed to save last selected month:', error);
    }
  },

  // Clear all storage
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Failed to remove ${key}:`, error);
      }
    });
  }
};