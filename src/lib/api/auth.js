import { apiGet, apiPost, apiPutText } from "./client";

export function signup(body) {
  return apiPost("/users/auth/signup", { profilePictureUrl: null, ...body });
}

export function login(body) {
  return apiPost("/users/auth/login", body);
}

export function updateProfilePicture(url) {
  return apiPutText("/users/core/profile-picture", url);
}

export function getUserProfile(userId) {
  return apiGet(`/users/core/${userId}`);
}
