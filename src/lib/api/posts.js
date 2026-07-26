import {
  apiDelete,
  apiGet,
  apiGetText,
  apiPostEmpty,
  apiPostMultipart,
  apiPostText,
} from "./client";

export function createPost(form) {
  return apiPostMultipart("/posts/core", form);
}

export function getPost(postId) {
  return apiGet(`/posts/core/${postId}`);
}

export function getPostsByUser(userId) {
  return apiGet(`/posts/core/users/${userId}/allPosts`);
}

export function getFeed() {
  return apiGet("/posts/core/feed");
}

export function getExplore() {
  return apiGet("/posts/core/explore");
}

export function reloomPost(postId, note) {
  return apiPostText(`/posts/core/${postId}/restack`, note ?? "");
}

export function addComment(postId, content) {
  return apiPostText(`/posts/core/${postId}/comments`, content);
}

export function getComments(postId) {
  return apiGet(`/posts/core/${postId}/comments`);
}

export function likePost(postId) {
  return apiPostEmpty(`/posts/likes/${postId}`);
}

export function unlikePost(postId) {
  return apiDelete(`/posts/likes/${postId}`);
}

export function getAiSummary(postId) {
  return apiGetText(`/posts/core/${postId}/ai-summary`);
}

export function getAiTags(postId) {
  return apiGet(`/posts/core/${postId}/ai-tags`);
}

export function semanticSearch(query, limit = 10) {
  const q = encodeURIComponent(query);
  return apiGet(`/posts/core/semantic-search?query=${q}&limit=${limit}`);
}

export function suggestTags(content) {
  return apiPostText("/intelligence/suggest-tags", content);
}

export function suggestTitleSubtitle(content) {
  return apiPostText("/intelligence/suggest-title-subtitle", content);
}
