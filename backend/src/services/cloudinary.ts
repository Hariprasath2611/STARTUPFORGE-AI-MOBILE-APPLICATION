import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'mock_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'mock_secret'
});

export const uploadAsset = async (fileBuffer: Buffer, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Return mock URL if API is not fully configured to prevent dev blocking
    if (process.env.CLOUDINARY_CLOUD_NAME === 'mock_cloud') {
      console.log(`☁️ Mock asset uploaded to folder: ${folder}`);
      return resolve(`https://res.cloudinary.com/mock-cloud/image/upload/v1234567/${folder}/mock-file.png`);
    }

    cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || '');
      }
    ).end(fileBuffer);
  });
};
