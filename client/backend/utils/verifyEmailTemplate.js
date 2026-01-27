const VerificationEmail = (username, otp) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #ddd;
    }
    .header h1 {
      color: #3872fa; /* ඔයාගේ E-commerce theme color එක */
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px 0;
      line-height: 1.6;
    }
    .otp-box {
      display: block;
      width: fit-content;
      margin: 20px auto;
      background-color: #f0f8ff;
      border: 2px dashed #3872fa;
      padding: 15px 30px;
      text-align: center;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 5px;
      color: #333;
      border-radius: 5px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888;
      margin-top: 20px;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    
    <div class="header">
      <h1>Email Verification</h1>
    </div>

    <div class="content">
      <p>Hello <strong>${username}</strong>,</p>
      
      <p>Thank you for registering with our E-Commerce App. To complete your sign-up process, please verify your email address using the One-Time Password (OTP) below:</p>
      
      <div class="otp-box">
        ${otp}
      </div>
      
      <p>This OTP is valid for <strong>10 minutes</strong>. If you did not request this verification, please ignore this email.</p>
      
      <p>Best Regards,<br>The E-Commerce Team</p>
    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} E-Commerce App. All rights reserved.</p>
    </div>

  </div>
</body>
</html>`;
};

export default VerificationEmail;
