import nodemailer from "nodemailer"

async function Mail({To,subject,text}){
    console.log(To)
    const transport = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:'sharmasobit223@gmail.com',
            pass:'frsq swdp anwa mirg'
        }
    });

    const mailOptions = {
        from:"sharmasobit223@gmail.com",
        to:To,
        subject:subject,
        text:text
    }

    try {
        const mailVerify = await transport.sendMail(mailOptions);
        return mailVerify
    } catch (error) {
        console.log(error)
        return "error"
    }
}

export {Mail}

