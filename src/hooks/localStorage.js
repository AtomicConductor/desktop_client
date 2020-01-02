import { useState } from "react";

const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = JSON.parse(localStorage.getItem(key));
      return storedValue === null ? defaultValue : storedValue;
    } catch {
      return defaultValue;
    }
  });

  return [
    value,
    valueToStore => {
      try {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (e) {
        console.log(e);
      } finally {
        setValue(valueToStore);
      }
    }
  ];
};

export { useLocalStorage };
