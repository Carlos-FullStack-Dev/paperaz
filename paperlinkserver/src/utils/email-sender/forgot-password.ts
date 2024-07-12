import nodemailer from "nodemailer";
import app from "../../app";
import { DEFAULT_VALUES } from "../constants";
import { email_footer } from "../email-footer";
import { email_header } from "../email-header";

export const sendForgotPassword = async (user: any, forgotPasswordLink:string) => {
  var sender = nodemailer.createTransport({
    service: "Mailgun",
    auth: {
      user: app.get("email_user"),
      pass: app.get("email_password"),
    },
  });

  var mail = {
    from: app.get("email_from"),
    to: user.email,
    subject: "PaperLink, Forgot Password"+` #${Math.floor(Math.random() * (10000 - 1 + 1) + 1)}`,
    html: `
        
${email_header}

          <table style="" role="presentation"
cellpadding="0" cellspacing="0" width="100%" border="0">
<tbody>
    <tr>
        <td style="overflow-wrap:break-word;word-break:break-word;padding:15px;"
            align="left">

            <div
                style="line-height: 140%; text-align: center; word-wrap: break-word;">
                <p
                    style="font-size: 14px; margin-top: 1rem; line-height: 140%;">
                    <span
                        style="font-size: 17px; font-weight: 600; line-height: 24px; font-family: 'Open Sans', sans-serif;">
                        Password Reset</span></p>
            </div>
        </td>
    </tr>
</tbody>
</table>


<table style="" role="presentation"
cellpadding="0" cellspacing="0" width="100%" border="0">
<tbody>
    <tr>
        <td style="overflow-wrap:break-word;word-break:break-word"
            align="left" class="side-padding">

            <div
                style="line-height: 160%; font-size: 0.9rem;   margin-top: 2.5rem; color: rgba(56, 56, 56, 1); text-align: left; word-wrap: break-word;">
                <p
                    style=" line-height: 160%;  margin-bottom: 1.5rem;">
                    <span
                        style="line-height: 28.8px;">
                        Hi
                         ${user.firstName|| ''},</span></p>
                <p style=" line-height: 160%;"><span
                        style=" line-height: 10px; ">
                        Click on link below to create a new password</span></p>
              
            </div>

        </td>
    </tr>
</tbody>
</table>

<table role="presentation"
cellpadding="0" cellspacing="0" width="100%" border="0">
<tbody>
    <tr>
        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;"
            align="left">

            <div  style="padding-top: 2rem ; padding-bottom: 2rem;" align="center">
                <a href="${forgotPasswordLink}"
                    target="_blank"
                    style="box-sizing: border-box; margin-top: 1rem; display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; color: #77b550; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
                    <span
                        style="display:block;padding:0px 0px; font-weight: 500;"><span
                            ><span
                                    style=" font-size: 16px;">Create New Password</span></span></span>
                </a>
            </div>

        </td>
    </tr>
</tbody>
</table>

      ${email_footer}
    `,
  };

  sender.sendMail(mail, function (error, info) {
    if (error) {
      console.log(error);
      return;
    } else {
      console.log("Email sent successfully: " + info.response);
      //log here
      return; 
    }
  }); 
};
