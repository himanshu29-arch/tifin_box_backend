import { bucket } from "../config/gcp";
import { v4 as uuid } from "uuid";

export const uploadImageToGCP = async (
  file: Express.Multer.File,
  folder: string,
) => {
  const fileName = `${folder}/${uuid()}-${file.originalname}`;
  const blob = bucket.file(fileName);

  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });

  return new Promise<string>((resolve, reject) => {
    blobStream.on("error", reject);

    blobStream.on("finish", async () => {
      // Make file public (OPTION 1)
      await blob.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};
