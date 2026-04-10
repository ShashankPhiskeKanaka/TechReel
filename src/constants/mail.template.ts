const WelcomeMail = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to InteriorProject</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 0 30px 0; background-color: #2D3748;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Tech Reel</h1>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #1a1a1a; font-size: 24px; font-weight: bold;">
                                        Welcome, {{name}}!
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #4a4a4a; font-size: 16px; line-height: 24px;">
                                        We're thrilled to have you here! Start learning on our platform and build your profile for recruiters.
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate;">
                                            <tr>
                                                <td align="center" style="border-radius: 4px; background-color: #4A90E2;">
                                                    <a href="{{verifyMail}}" target="_blank" style="padding: 12px 24px; display: inline-block; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">Verify Mail by Following this Link</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; background-color: #f8f9fa; border-top: 1px solid #eeeeee;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #888888; font-size: 12px; text-align: center;">
                                        &copy; 2026 Tech Reel. All rights reserved.<br>
                                        You received this email because you signed up for an account.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`

const ForgetPassMail = `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #dddddd; margin-top: 20px;">
        <tr>
            <td align="center" style="padding: 40px 0; background-color: #2D3748; color: #ffffff; font-size: 24px; font-weight: bold;">
                InteriorProject
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">
                <h2 style="color: #333333;">Password Reset Request</h2>
                <p style="color: #666666; line-height: 1.6;">
                    We received a request to reset your password. Click the button below to choose a new one. **This link will expire in 1 hour.**
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{{resetUrl}}" style="background-color: #E53E3E; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset My Password</a>
                </div>
                <p style="color: #666666; line-height: 1.6; font-size: 14px;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="{{resetUrl}}" style="color: #3182ce;">{{resetUrl}}</a>
                </p>
                <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
                <p style="color: #999999; font-size: 12px;">
                    If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>

`

export { WelcomeMail, ForgetPassMail }