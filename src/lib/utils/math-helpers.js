export const numberToWords = (num) => {
  const onesArr = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tensArr = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  if (num < 20) return onesArr[num];
  return tensArr[Math.floor(num / 10)] + (num % 10 === 0 ? "" : "-" + onesArr[num % 10]);
};

// Add other math-related helpers here if needed globally