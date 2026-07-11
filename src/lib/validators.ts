export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateTitle = (title: string): boolean => {
  return title.trim().length >= 5 && title.trim().length <= 200;
};

export const validateDescription = (description: string): boolean => {
  return description.trim().length >= 20 && description.trim().length <= 5000;
};

export const VALID_CATEGORIES = [
  'Black Magic',
  'Village Horror',
  'Urban Legends',
  'Ghost Stories',
  'Supernatural',
  'True Stories',
  'Paranormal',
  'Other',
];

export const validateCategory = (category: string): boolean => {
  return VALID_CATEGORIES.includes(category);
};
