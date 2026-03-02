import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are missing.");
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  configured = true;
}

export async function uploadHtmlSnapshot(html: string, slug: string): Promise<string> {
  ensureConfigured();
  const payload = Buffer.from(html, "utf8").toString("base64");
  const result = await cloudinary.uploader.upload(`data:text/html;base64,${payload}`, {
    resource_type: "raw",
    public_id: `codequest/gallery/${slug}`,
    overwrite: true,
  });
  return result.secure_url;
}
