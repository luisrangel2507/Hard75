import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getConfig() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicBaseUrl = process.env.R2_PUBLIC_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) {
    throw new Error(
      "R2 storage is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL."
    );
  }

  return { accountId, accessKeyId, secretAccessKey, bucket, publicBaseUrl };
}

function getClient() {
  const { accountId, accessKeyId, secretAccessKey } = getConfig();
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export async function createUploadUrl(key: string, contentType: string) {
  const { bucket, publicBaseUrl } = getConfig();
  const client = getClient();
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });
  const publicUrl = `${publicBaseUrl.replace(/\/$/, "")}/${key}`;
  return { uploadUrl, publicUrl };
}

export async function deleteObjectByUrl(url: string) {
  const { bucket, publicBaseUrl } = getConfig();
  const client = getClient();
  const prefix = `${publicBaseUrl.replace(/\/$/, "")}/`;
  if (!url.startsWith(prefix)) return;
  const key = url.slice(prefix.length);
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export function photoKey(dayNumber: number, slot: string, ext: string) {
  return `days/${dayNumber}/${slot}.${ext}`;
}
