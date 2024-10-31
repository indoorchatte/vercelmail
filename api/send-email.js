// /api/send-email.js
import nodemailer from "nodemailer"

export default async function handler(req, res) {
    // Add CORS headers to handle cross-origin requests
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    // Handle preflight request
    if (req.method === "OPTIONS") {
        return res.status(200).end() // End preflight request
    }

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
            from: email, // Sender's email address
            to: process.env.TO_EMAIL, // Your personal email (set in Vercel environment variables)
            subject: `New message from ${name}`,
            text: message,
        }

        try {
            // Send the email
            await transporter.sendMail(mailOptions)
            return res.status(200).json({ message: "Email sent successfully!" })
        } catch (error) {
            console.error("Email sending error:", error) // Log error for debugging
            return res.status(500).json({ message: "Failed to send email", error: error.toString() })
        }
    } else {
        // Handle unsupported methods
        res.setHeader("Allow", ["POST"])
        return res.status(405).end(`Method ${req.method} not allowed`)
    }
}
