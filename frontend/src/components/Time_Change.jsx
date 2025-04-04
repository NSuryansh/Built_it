export const TimeChange = (time) => {
  const date = new Date();
  var userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(time + userTimezoneOffset);
};

export const TimeReduce = (time) =>{
  const date = new Date();
  var userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(time - userTimezoneOffset);
}
