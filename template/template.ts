export const newsLetterEmail = (
  token
) => `<p className='text'>You have requested for password reset</p>
<h5>click in this <a href="${process.env.FRONTEND_ADDRESS}resetpassword/${token}">link</a> to reset password</h5>`;

export const welcomeEmail = (token) => `
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Welcome Email Template</title>
  </head>
  <body>
  <a style="border:0;margin:0;padding:0;color:#ffffff;display:block;height:38px;text-align:center;text-decoration:none" href="${process.env.FRONTEND_ADDRESS}resetpassword/${token}">${process.env.FRONTEND_ADDRESS}resetpassword/${token}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://dev-f63lapj1.eu.auth0.com/u/email-verification?ticket%3DL8HOeuqyPsXn3VzYxOitDEQC5Yzozqer%23&amp;source=gmail&amp;ust=1682247297141000&amp;usg=AOvVaw0WcntIbMIwNkZpiRSPguWb">
  <span style="border:0;margin:0;padding:0;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;font-size:16px;font-weight:bold;height:38px;line-height:38px;text-decoration:none;vertical-align:middle;white-space:nowrap;width:100%">&nbsp;&nbsp;&nbsp;&nbsp;Verify<span style="border:0;margin:0;padding:0;color:rgba(103,114,229,0);font-size:12px;text-decoration:none">‑</span>email<span style="border:0;margin:0;padding:0;color:rgb(103,114,229);font-size:12px;text-decoration:none"> </span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
</a>
  </body>
</html>`;
