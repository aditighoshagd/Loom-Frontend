import { apiPostMultipart } from "./client";

export async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  return apiPostMultipart("/uploads/file", form);
}
