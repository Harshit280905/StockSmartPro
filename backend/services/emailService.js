const nodemailer = require('nodemailer');

if (!process.env.ADMIN_EMAIL) {
    console.error('⚠️ WARNING: ADMIN_EMAIL is not defined in your .env file. Emails will not be sent.');
}

const sendLowStockEmail = async (product) => {
    try {
        console.log(`Attempting to send Low Stock Email for: ${product.name}`);
        
        const transporterOptions = process.env.SMTP_SERVICE === 'gmail' 
            ? {
                service: 'gmail',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
              }
            : {
                host: process.env.SMTP_HOST || 'smtp.ethereal.email',
                port: process.env.SMTP_PORT || 587,
                auth: {
                    user: process.env.SMTP_USER || 'placeholder@ethereal.email',
                    pass: process.env.SMTP_PASS || 'placeholder_pass'
                }
              };

        const transporter = nodemailer.createTransport(transporterOptions);

        const mailOptions = {
            from: `"INV-X Alerts" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
            subject: `⚠️ Low Stock Alert: ${product.name}`,
            html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 12px; padding: 24px;">
                    <h2 style="color: #f59e0b;">Low Stock Alert</h2>
                    <p>The following item is running low on stock:</p>
                    <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0;">
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li><strong>Product:</strong> ${product.name}</li>
                            <li><strong>SKU:</strong> ${product.sku}</li>
                            <li><strong>Current Quantity:</strong> ${product.quantity}</li>
                            <li><strong>Threshold:</strong> ${product.lowStockThreshold}</li>
                        </ul>
                    </div>
                    <p>Please restock this item soon to avoid fulfillment delays.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Low stock email sent successfully: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error sending Low Stock email:', error);
    }
};

const sendAIInsightAlert = async (insight) => {
    try {
        console.log(`Attempting to send AI Insight Alert: ${insight.message}`);

        const transporterOptions = process.env.SMTP_SERVICE === 'gmail' 
            ? {
                service: 'gmail',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
              }
            : {
                host: process.env.SMTP_HOST || 'smtp.ethereal.email',
                port: process.env.SMTP_PORT || 587,
                auth: {
                    user: process.env.SMTP_USER || 'placeholder@ethereal.email',
                    pass: process.env.SMTP_PASS || 'placeholder_pass'
                }
              };

        const transporter = nodemailer.createTransport(transporterOptions);

        // Modern Dark Mode UI for AI Insights
        const mailOptions = {
            from: `"INV-X AI Intelligence" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
            subject: `🚀 Strategic Alert: ${insight.message}`,
            html: `
                <div style="background-color: #020617; font-family: 'Inter', sans-serif; color: #f8fafc; max-width: 600px; border-radius: 24px; padding: 40px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: inline-block; background: rgba(99, 102, 241, 0.1); padding: 12px; border-radius: 12px; margin-bottom: 24px;">
                        <span style="color: #6366f1; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">AI Strategic Insight</span>
                    </div>
                    
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 16px 0; letter-spacing: -0.02em;">${insight.message}</h1>
                    
                    <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">Our AI has analyzed your sales velocity and detected a potential optimization opportunity.</p>
                    
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                        <h4 style="color: #6366f1; margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase;">Recommendation</h4>
                        <p style="color: #f8fafc; font-size: 16px; line-height: 1.5; margin: 0;">${insight.recommendation}</p>
                    </div>
                    
                    ${insight.impact ? `
                    <div style="text-align: center; padding: 24px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%); border-radius: 16px; margin-bottom: 32px;">
                        <div style="color: #94a3b8; font-size: 14px; margin-bottom: 4px;">Potential Revenue Impact</div>
                        <div style="color: #10b981; font-size: 32px; font-weight: 800;">$${insight.impact.toLocaleString()}</div>
                    </div>` : ''}
                    
                    <div style="text-align: center;">
                        <a href="http://localhost:5173" style="display: inline-block; background: #6366f1; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">Open Dashboard</a>
                    </div>
                    
                    <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 40px 0;">
                    
                    <p style="color: #475569; font-size: 12px; text-align: center; line-height: 1.5;">
                        You are receiving this because AI Strategic Insights are enabled for your account.<br>
                        Manage notification preferences in your INV-X dashboard settings.
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ AI Insight email sent successfully: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error sending AI email:', error);
    }
};

module.exports = { sendLowStockEmail, sendAIInsightAlert };
