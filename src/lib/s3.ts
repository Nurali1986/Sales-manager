import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner'

// S3/MinIO client — singleton
let s3Client: S3Client | null = null

function getS3Client(): S3Client {
  if (s3Client) return s3Client

  const endpoint = process.env.S3_ENDPOINT || 'http://localhost:9000'
  const region = process.env.S3_REGION || 'us-east-1'
  const accessKeyId = process.env.S3_ACCESS_KEY_ID || 'minioadmin'
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || 'minioadmin'

  s3Client = new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true, // MinIO uchun zarur
  })

  return s3Client
}

const BUCKET = process.env.S3_BUCKET || 'sales-manager'

/**
 * Faylni yuklab olish uchun vaqtinchalik URL yaratadi (GET)
 */
export async function getSignedUrl(storageKey: string, expiresIn = 3600): Promise<string> {
  const client = getS3Client()
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: storageKey })
  return awsGetSignedUrl(client, command, { expiresIn })
}

/**
 * Faylni yuklash uchun vaqtinchalik URL yaratadi (PUT)
 */
export async function getPutSignedUrl(
  storageKey: string,
  mimeType: string,
  expiresIn = 3600
): Promise<string> {
  const client = getS3Client()
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: storageKey,
    ContentType: mimeType,
  })
  return awsGetSignedUrl(client, command, { expiresIn })
}

/**
 * Faylni S3/MinIO dan o'chiradi
 */
export async function deleteFile(storageKey: string): Promise<void> {
  const client = getS3Client()
  const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: storageKey })
  await client.send(command)
}
