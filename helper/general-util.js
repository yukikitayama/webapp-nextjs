export const dateRange = (startDate, endDate) => {
  const dateArray = [];
  var currentDate = startDate;
  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
};
