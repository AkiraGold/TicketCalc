const memoryStorage = new Map();

export const getInitialState = (key, defaultValue, isJSON = true) => {
  try {
    const savedValue = localStorage.getItem(key);
    if (savedValue === null) return defaultValue;
    return isJSON ? JSON.parse(savedValue) : savedValue;
  } catch (error) {
    console.warn(`localStorage failed for ${key}, using memory fallback:`, error);
    const memoryValue = memoryStorage.get(key);
    if (memoryValue !== undefined) return memoryValue;
    return defaultValue;
  }
};

export const saveToLocalStorage = (key, value) => {
  try {
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    memoryStorage.set(key, value);
    return { success: true, method: 'localStorage' };
  } catch (error) {
    console.warn(`localStorage failed for ${key}, using memory fallback:`, error);
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

export const getStorageStatus = () => {
  return {
    localStorage: isLocalStorageAvailable(),
    memoryFallback: memoryStorage.size > 0,
    memorySize: memoryStorage.size
  };
};
