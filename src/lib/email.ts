import nodemailer from "nodemailer";

const transporter = () => {
    try {
      return nodemailer.createTransport({
        service:"gmail",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
        // tls: {
        //   rejectUnauthorized: false
        // }
      })
    } catch (err) {
      console.log(err)
    }
  }
  
  export const sendInviteEmail = async (email: string, projectName: string, role: string, acceptUrl: string) => {
    const transport = transporter();
    const mailOptions = {
      from: process.env.EMAIL, // Use env variable for from address
      to: email,
      subject: `You're invited to join ${projectName} on Taskify`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You're invited to join ${projectName}</h2>
          <p>You have been invited to join <strong>${projectName}</strong> as <strong>${role}</strong>.</p>
          <p>Click the button below to accept the invitation:</p>
          <p>
            <a href="${acceptUrl}" style="display: inline-block; background: #2563EB; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
              Accept Invitation
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">If you did not expect this invitation, you can safely ignore this email.</p>
        </div>
      `,
    };

    if (!transport) {
      console.log("Failed to create transport")
      return { success: false, error: "Failed to create transport" }
    }

    try {
      const info = await transport.sendMail(mailOptions);
      console.log("Email sent successfully:", info);
      
      // For test environments, try to get preview URL
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("Preview URL:", previewUrl);
      }
      
      return { 
        success: true, 
        messageId: info.messageId, 
        previewUrl 
      };
    } catch (error: unknown) {
      const err = error as Record<string, unknown>;
      console.error("Failed to send email:", error);
      
      if (err && (err.code === 'ESOCKET' || err.code === 'ETIMEDOUT')) {
        return { 
          success: false, 
          error: "Connection timeout - check your internet connection or try again later" 
        };
      }
      const message = err && typeof err.message === 'string' ? err.message : 'Unknown error';
      return { success: false, error: message };
    }
  }