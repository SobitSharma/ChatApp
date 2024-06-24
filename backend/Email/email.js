import nodemailer from "nodemailer"

async function Mail({To,subject,text}){
    console.log(To)
    const transport = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
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

