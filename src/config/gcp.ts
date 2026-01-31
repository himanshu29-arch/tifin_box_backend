import { Storage } from "@google-cloud/storage";
import path from "path";

export const storage = new Storage({
  keyFilename: path.join(
    __dirname,
    "gcp-service-account.json",
  ),
  projectId: process.env.GCP_PROJECT_ID,
});
// export const storage = new Storage({
//   credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_JSON!),
// });
export const bucket = storage.bucket(
  process.env.GCP_BUCKET_NAME!,
);
