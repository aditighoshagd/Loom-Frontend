import { apiGet, apiPostEmpty } from "./client";

export function subscribe(userId) {
  return apiPostEmpty(`/connections/core/request/${userId}`);
}

export function unsubscribe(userId) {
  return apiPostEmpty(`/connections/core/reject/${userId}`);
}

export function getSubscriptions(userId) {
  return apiGet(`/connections/core/${userId}/first-degree`);
}

export function getSubscriberCount(userId) {
  return apiGet(`/connections/core/${userId}/subscribers/count`);
}
