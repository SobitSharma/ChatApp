import { v2 as cloudinary } from 'cloudinary';

async function uploadOnCloudinary(image) {
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET
    });
    try {
        const uploadResult = await cloudinary.uploader.upload(image)
        return uploadResult
    } catch (error) {
        console.log("Error in Cloudinary", error)
        return "error"
    }

}

export {uploadOnCloudinary}