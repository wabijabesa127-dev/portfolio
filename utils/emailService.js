const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send contact notification email
const sendContactNotification = async (data) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.ADMIN_EMAIL,
            subject: `New Contact Message: ${data.subject}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #38bdf8, #6366f1); color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background: #f4f4f4; }
                        .field { margin-bottom: 15px; }
                        .label { font-weight: bold; color: #333; }
                        .value { color: #666; margin-top: 5px; }
                        .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>New Contact Message</h2>
                        </div>
                        <div class="content">
                            <div class="field">
                                <div class="label">From:</div>
                                <div class="value">${data.name} (${data.email})</div>
                            </div>
                            ${data.phone ? `
                            <div class="field">
                                <div class="label">Phone:</div>
                                <div class="value">${data.phone}</div>
                            </div>
                            ` : ''}
                            <div class="field">
                                <div class="label">Subject:</div>
                                <div class="value">${data.subject}</div>
                            </div>
                            <div class="field">
                                <div class="label">Message:</div>
                                <div class="value">${data.message}</div>
                            </div>
                        </div>
                        <div class="footer">
                            <p>Sent from your portfolio website contact form</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Contact notification email sent');
    } catch (error) {
        console.error('Email sending error:', error);
        // Don't throw error - we don't want to break the API if email fails
    }
};

// Send newsletter welcome email
const sendNewsletterWelcome = async (email) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Welcome to Wabi Jabesa Newsletter!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #38bdf8, #6366f1); color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; }
                        .button { display: inline-block; padding: 10px 20px; background: linear-gradient(135deg, #38bdf8, #6366f1); color: white; text-decoration: none; border-radius: 5px; }
                        .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Welcome to My Newsletter!</h2>
                        </div>
                        <div class="content">
                            <p>Thank you for subscribing to my newsletter!</p>
                            <p>You'll receive updates about:</p>
                            <ul>
                                <li>New blog posts and tutorials</li>
                                <li>Project showcases</li>
                                <li>Programming tips and resources</li>
                                <li>Career advice for developers</li>
                            </ul>
                            <p>I'm excited to have you on this journey!</p>
                            <p>Best regards,<br>Wabi Jabesa</p>
                        </div>
                        <div class="footer">
                            <p><a href="{{unsubscribe_url}}">Unsubscribe</a> anytime.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent to:', email);
    } catch (error) {
        console.error('Welcome email error:', error);
    }
};

module.exports = {
    sendContactNotification,
    sendNewsletterWelcome
};