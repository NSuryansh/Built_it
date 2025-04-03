export const TimeChange = (time) => {
  const date = new Date();
  console.log(time)
  var userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(time + userTimezoneOffset);
};
