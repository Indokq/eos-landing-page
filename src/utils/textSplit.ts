export const splitTextToLetters = (text: string) => {
  return text.split('').map((char, index) => ({
    char: char === ' ' ? '\u00A0' : char,
    index,
  }));
};

export const splitTextToWords = (text: string) => {
  return text.split(' ').map((word, index) => ({
    word,
    index,
  }));
};
