// In-memory fallback storage when localStorage fails
const memoryStorage = new Map();

export const getInitialState = (key, defaultValue, isJSON = true) => {
  try {
    const savedValue = localStorage.getItem(key);
    if (savedValue === null) return defaultValue;
    return isJSON ? JSON.parse(savedValue) : savedValue;
  } catch (error) {
    console.warn(`localStorage failed for ${key}, using memory fallback:`, error);
    // Try to get from memory fallback
    const memoryValue = memoryStorage.get(key);
    if (memoryValue !== undefined) return memoryValue;
    return defaultValue;
  }
};

export const saveToLocalStorage = (key, value) => {
  try {
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    // Also save to memory fallback
    memoryStorage.set(key, value);
    return { success: true, method: 'localStorage' };
  } catch (error) {
    console.warn(`localStorage failed for ${key}, using memory fallback:`, error);
    // Fallback to memory storage
    try {
      memoryStorage.set(key, value);
      return { success: true, method: 'memory' };
    } catch (memoryError) {
      console.error(`Memory storage also failed for ${key}:`, memoryError);
      return { success: false, error: memoryError };
    }
  }
};

export const clearLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    memoryStorage.delete(key);
    return { success: true, method: 'localStorage' };
  } catch (error) {
    console.warn(`localStorage clear failed for ${key}, using memory fallback:`, error);
    try {
      memoryStorage.delete(key);
      return { success: true, method: 'memory' };
    } catch (memoryError) {
      console.error(`Memory storage clear also failed for ${key}:`, memoryError);
      return { success: false, error: memoryError };
    }
  }
};

// Check if localStorage is available
export const isLocalStorageAvailable = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Get storage status for debugging
export const getStorageStatus = () => {
  return {
    localStorage: isLocalStorageAvailable(),
    memoryFallback: memoryStorage.size > 0,
    memorySize: memoryStorage.size
  };
};
