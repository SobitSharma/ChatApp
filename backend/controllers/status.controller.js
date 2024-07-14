import { uploadOnCloudinary } from "../middleware/cloudinary.middleware.js";
import Status from "../models/status.model.js";

const uploadUserStatus = async (req, res) => {
    const files = req.files;
    const userId = req.user?._id

    if (!files || files.length < 1) {
        return res.status(200).json({ message: "Empty request not allowed" });
    }

    try {
        const uploadPromises = files.map(async (singleFile) => {
            const uploadResult = await uploadOnCloudinary(singleFile.path);
            if (uploadResult === "error") {
                throw new Error("Internal Server Error");
            }
            return uploadResult.secure_url;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        const alreadyStatus = await Status.findOne({statusId:userId})

        if(alreadyStatus){
            if(alreadyStatus.statusData.length > 5){
                return res.status(301).json({error:"You can upload only upto 5 files"})
            }
            uploadedUrls.map((singleurl)=>alreadyStatus.statusData.push(singleurl))
            await alreadyStatus.save()
        }
        else{
            const status = new Status({
                statusId:userId,
                statusData:uploadedUrls,
            })

            await status.save()
        }
        return res.status(200).json({ message: "ok", uploadedUrls});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getUserStatus = async(req, res) => {
    const userId = req.user?._id
    const userStatus = await Status.findOne({statusId:userId})?.populate({path:"statusId", select:"-password -email"})

    if(!userStatus){
        return res.status(200).json({userStatus:{statusData:[]}})
    }
    return res.status(200).json({userStatus})
}

const deleteStatus = async(req, res) => {
    const userId = req.user?._id
    
    try {
        await Status.findOneAndDelete({statusId:userId})
        return res.status(200).json({statusData:[]})
    } catch (error) {
        return res.status(501).json({message:"Internal Server Error"})
    }



}

const getAllUsersStatus = async(req, res) => {
    const alluserStatus = await Status.find({}).populate({path:'statusId', select:'-password -email'})
    res.status(200).json({alluserStatus})
}
export { uploadUserStatus , getUserStatus, deleteStatus, getAllUsersStatus};
