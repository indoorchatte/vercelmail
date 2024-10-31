// /api/send-email.js
import nodemailer from "nodemailer"

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { name, email, message } = req.body

        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Set in Vercel environment variables
                pass: process.env.EMAIL_PASS, // Set in Vercel environment variables
            },
        })

        const mailOptions = {
            from: email,
            to: process.env.TO_EMAIL, // Set in Vercel environment variables
            subject: `New message from ${name}`,
            text: message,
        }

        try {
            await transporter.sendMail(mailOptions)
            res.status(200).json({ message: "Email sent successfully!" })
        } catch (error) {
            res.status(500).json({ message: "Failed to send email", error })
        }
    } else {
        res.setHeader("Allow", ["POST"])
        res.status(405).end(`Method ${req.method} not allowed`)
    }
}
