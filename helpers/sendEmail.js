import nodemailer from 'nodemailer'

export const sendEmail = async (options) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    
    
    })


    const emailOptions = {
        from: "Nana Adwoa <addo@mail.com>",
        to: options.email,
        subject: options.subject,
        text: options.text
    }

    return await transport.sendMail(emailOptions)
}