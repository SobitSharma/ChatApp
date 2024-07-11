import Group from "../models/Groups.model.js";
import UserGroup from "../models/usergroups.model.js";
import GroupMessage from "../models/groupMessage.model.js";
import { getReceiverId, io, userSocketMap } from "../soket/socket.js";
import { uploadOnCloudinary } from "../middleware/cloudinary.middleware.js";

const addNewGroup = async (req, res) => {
  try {
    const senderId = req.user?._id;
    const { groupname } = req.body;
    const grouppic = req.user?.profilePic
    if (!groupname) {
      return res.status(400).json({ error: "GroupName is Empty" });
    }
    let SendersGroup = await UserGroup.findOne({ Person: senderId });

    const newGroup = new Group({
      admin: senderId,
      groupname,
      grouppic
    });

    if (SendersGroup) {
      console.log(SendersGroup);
      SendersGroup.Groups.push(newGroup?._id);
    }
    await Promise.all([newGroup.save(), SendersGroup.save()]);

    return res.status(200).json({
      admin: senderId,
      groupname: newGroup.groupname,
      grouppic: newGroup.grouppic,
      participants: newGroup.participants,
      groupmessages: newGroup.groupmessages,
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Internal Error" });
  }
};

const sendMessagesInGroup = async (req, res) => {
  try {
    const { groupId, message, sendername} = req.body;
    const senderId = req.user?._id; 

    const onlineUsers = Object.keys(userSocketMap)
    const filteredArry = onlineUsers.filter((single)=> single!==senderId.toString())

    const socketIds = []
    console.log(filteredArry)
    filteredArry.map((single)=> {
      socketIds.push(getReceiverId(single))
    })

    if (!message) {
      return res.status(401).json({ error: "Empty Message" });
    }

    const findgroup = await Group.findById(groupId);
    if (!findgroup) {
      return res.status(401).json("Invalid Request");
    }

    const userMessage = new GroupMessage({
      senderId,
      receiverId: groupId,
      message,
      type: "text",
      sendername
    });

    const DataToSend = {
      senderId,
      receiverId: groupId,
      message,
      type: "text",
      sendername,
      createdAt:Date.now()
    }
    
    console.log("socketids", socketIds)
    socketIds.forEach((singleId) => {
      io.to(singleId).emit("groupmessage", DataToSend);
    });
    

    findgroup.groupmessages.push(userMessage._id);
    await Promise.all([userMessage.save(), findgroup.save()]);

    return res.status(200).json({
      senderId: userMessage.senderId,
      receiverId: userMessage.receiverId,
      message: userMessage.message,
      sendername:userMessage.sendername
    });
  } catch (error) {
    return res.status(501).json({ error: "Internal Server Error" });
  }
};

async function helpAddGroupUsers(userId, groupId) {
  console.log(userId)
  const usergroup = await UserGroup.findOne({ Person: userId });
  console.log(usergroup)
  usergroup.Groups.push(groupId);
  await usergroup.save();
}

const addGroupUsers = async (req, res) => {
  try {
    const { groupId, usersId } = req.body;
    console.log(groupId, usersId);
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(301).json({ error: "Incorrect Group" });
    }

    const onlineUsers = []

    usersId.map((user) => {
      if(userSocketMap[user]){
        onlineUsers.push(getReceiverId(user))
      }
      group.participants.push(user);
      helpAddGroupUsers(user, groupId);
    });

    if(onlineUsers.length > 1){
      onlineUsers.forEach((user)=> {
        io.to(user).emit("reload", "1")
      })
    }

    await group.save();
    return res.status(200).json({
      participants: group.participants,
    });
  } catch (error) {
    res.status(501).json({ error: "Internal Error Occurred" });
  }
};

const getUserGroups = async (req, res) => {
  try {
    const user = req.user?._id;

    const usergroup = await UserGroup.findOne({ Person: user }).populate({
      path: "Groups",
      populate: [
        {
          path: "participants",
          select: "-password",
        },
        { path: "groupmessages" },
      ],
    });

    if (!usergroup) {
      return res.status(200).json({ groups: [] });
    }
    console.log(usergroup);
    return res.status(200).json({usergroup});
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Internal Error" });
  }
};

const sendImagesInGroups = async(req, res) => {

  const {groupId} = req.params
  const senderId = req.user?._id
  const sendername = req.user?.fullname
  const imagesPath = req.file?.path
  if(!imagesPath){ 
    return res.status(501).json({error:"File Not Found"}) 
  }

  const onlineUsers = Object.keys(userSocketMap)
  const filteredArry = onlineUsers.filter((single)=> single!==senderId.toString())

  const socketIds = []
  filteredArry.map((single)=> {
    socketIds.push(getReceiverId(single))
  })

  const uploadTheImage = await uploadOnCloudinary(imagesPath);
  if(uploadTheImage === "error"){
      return res.status(500).json({error:"Internal Server Error"})    
  }
  const imageUrl = uploadTheImage.secure_url

  const findgroup = await Group.findById(groupId);
    if (!findgroup) {
      return res.status(401).json("Invalid Request");
    }

    const userMessage = new GroupMessage({
      senderId,
      receiverId: groupId,
      message:imageUrl,
      type: "image",
      sendername
    });

    const DataToSend = {
      senderId,
      receiverId: groupId,
      message:imageUrl,
      type: "image",
      sendername,
      createdAt:Date.now()
    }
    
    console.log("socketids", socketIds)
    socketIds.forEach((singleId) => {
      io.to(singleId).emit("groupmessage", DataToSend);
    });

    findgroup.groupmessages.push(userMessage._id);
    await Promise.all([userMessage.save(), findgroup.save()]);

    return res.status(200).json({
      senderId: userMessage.senderId,
      receiverId: userMessage.receiverId,
      message: userMessage.message,
      sendername:userMessage.sendername,
      createdAt:Date.now()
    });
} 

export { addNewGroup, sendMessagesInGroup, addGroupUsers, getUserGroups , sendImagesInGroups};
