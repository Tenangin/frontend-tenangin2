const TOKEN_KEY = "access_token";
const USER_ID_KEY = "user_id";
const EMAIL_KEY = "email";
const USERNAME_KEY ="username";

// token
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// users_id
export function setUserId(id) {
  localStorage.setItem(USER_ID_KEY, id);
}

export function getUserId() {
  return localStorage.getItem(USER_ID_KEY);
}

export function removeUserId() {
  localStorage.removeItem(USER_ID_KEY);
}

// email user
export function setUserEmail(email){
  localStorage.setItem(EMAIL_KEY, email);
}
export function getUserEmail() {
  return localStorage.getItem(EMAIL_KEY);
}
export function removeEmail() {
  localStorage.removeItem(EMAIL_KEY);
}

// username user
export function setUsername(username) {
  localStorage.setItem(USERNAME_KEY, username);
}
export function getUsername() {
  return localStorage.getItem(USERNAME_KEY);
}
export function removeUsername() {
  localStorage.removeItem(USERNAME_KEY);
}