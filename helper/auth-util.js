export const calculateRemainingTime = (expirationTime) => {
  // getTime() returns in millisecond
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  // In millisecond to use it in setTimeout()
  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

export const retrieveStoredAuthData = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 60000) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime
  };
};