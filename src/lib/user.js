const USER_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
  '#F8B739',
  '#52B788'
];

export function generateUserId() {
  return `user_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateUserName() {
  const adjectives = ['Quick', 'Clever', 'Happy', 'Bright', 'Swift', 'Bold', 'Calm', 'Wise'];
  const nouns = ['Fox', 'Owl', 'Bear', 'Wolf', 'Eagle', 'Lion', 'Tiger', 'Panda'];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 100);

  return `${adj}${noun}${num}`;
}

export function assignUserColor(existingColors) {
  const availableColors = USER_COLORS.filter(c => !existingColors.includes(c));

  if (availableColors.length > 0) {
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  }

  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}

export function saveUserToStorage(userId, userName, userColor) {
  localStorage.setItem('canvas_user_id', userId);
  localStorage.setItem('canvas_user_name', userName);
  localStorage.setItem('canvas_user_color', userColor);
}

export function loadUserFromStorage() {
  const userId = localStorage.getItem('canvas_user_id');
  const userName = localStorage.getItem('canvas_user_name');
  const userColor = localStorage.getItem('canvas_user_color');

  if (userId && userName && userColor) {
    return { userId, userName, userColor };
  }

  return null;
}
