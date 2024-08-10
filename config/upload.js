import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const uploadFiles = (file) => {
  return new Promise((resolve, reject) => {
    const uploadDir = path.resolve("uploads/");
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    fs.mkdirSync(uploadDir, { recursive: true });

    fs.writeFile(filePath, file.data, (err) => {
      if (err) {
        console.error("파일 업로드 실패:", err.message);
        reject(new Error("파일 업로드 실패"));
      } else {
        resolve(`/uploads/${fileName}`);
      }
    });
  });
};
