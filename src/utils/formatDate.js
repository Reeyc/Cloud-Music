export const formatDateTime = (inputTime) => {
  const date = new Date(inputTime);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  m = m < 10 ? `0${m}` : m;
  d = d < 10 ? `0${d}` : d;
  return `${y}-${m}-${d}`
};
