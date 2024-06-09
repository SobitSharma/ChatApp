import mongoose from "mongoose";

const connectToMongoDB = async()=> {
    try {
        return await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
    } catch (err) {
        console.log("Error Connecting to Mongodb", err)
        
    }
}

export default connectToMongoDB