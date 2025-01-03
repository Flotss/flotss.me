export function fetchDataFromLocalStorage<T>(
  name: string,
  fetchFromApi: () => void,
  expirationTime: number,
  callback: (data: T) => void,
): void {
  const storedData = localStorage.getItem(name);
  if (storedData == null) {
    fetchFromApi();
    return;
  }

  const parsedData = JSON.parse(storedData);
  if (new Date().getTime() - parsedData.lastRequestDate < expirationTime) {
    callback(parsedData.data);
  } else {
    localStorage.removeItem(name);
    fetchFromApi();
  }
}

export function saveDataToLocalStorage<T>(name: string, nameData: string, data: T): void {
  const dataToStore = {
    [nameData]: data,
    lastRequestDate: new Date().getTime(),
  };
  localStorage.setItem(name, JSON.stringify(dataToStore));
}

export function clearLocalStorage(name: string): void {
  localStorage.removeItem(name);
}

export function getLocalStorage<T>(name: string): T | null {
  const storedData = localStorage.getItem(name);
  if (storedData == null) {
    return null;
  }

  const parsedData = JSON.parse(storedData);
  return parsedData as T;
}
