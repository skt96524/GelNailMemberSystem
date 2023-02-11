import fs from "fs";
import formidable from "formidable";

export const uploadDir = "uploads";

fs.mkdirSync(uploadDir, { recursive: true });

export const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFiles: 1,
  maxFileSize: 10000 * 1024 ** 2, // the default limit is 200KB
  filter: (part) => part.mimetype?.startsWith("image/") || false,
  filename: (originalName, originalExt, part, form) => {
    let fieldName = part.name;
    let timestamp = Date.now();
    let ext = part.mimetype?.split("/").pop();
    return `${fieldName}-${timestamp}.${ext}`;
  },
});

export type Formidable = typeof form;

export function toArray<T>(fields: T[] | T | undefined): T[] {
  if (Array.isArray(fields)) {
    return fields;
  }
  if (!fields) {
    return [];
  }
  return [fields];
}
