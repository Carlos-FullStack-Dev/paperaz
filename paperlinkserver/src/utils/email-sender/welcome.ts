require("dotenv").config();
import nodemailer from "nodemailer";
import app from "../../app";
import { DEFAULT_VALUES } from "../constants";
import { email_footer } from "../email-footer";
import { email_header } from "../email-header";

export const sendWelcomeEmail = async (user: any, token: string, attachment:string ) => {
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
    subject: "PaperLink, Registration Successful"+` #${Math.floor(Math.random() * (10000 - 1 + 1) + 1)}`,
    attachments:[
      {
        filename: 'Paperlink Billing Reciept.pdf',
        path: attachment,
      }
    ],
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
                                Welcome to Paperlink!</span></p>
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
                    style=" line-height: 160%;  margin-bottom: 2.5rem;">
                    <span style="line-height: 28.8px;">
                    ${user.companyName}, </span>
                </p>
                <p style=" line-height: 160%; margin-bottom: 2rem;"><span
                    style=" line-height: 10px; text-decoration: none;">
                    1.
                    <a style="color:#77B550; text-decoration: none;;"
                        href="https://paperdaz.com"> Getting Started</a>
                    with Paperlink
                   
                </span>
            </p>  

                <p style=" line-height: 160%;"><span
                        style=" line-height: 10px; text-decoration: none;">
                        2. Open and download 
                        <a style="color:#77B550; text-decoration: none;;"
                            href="${process.env.APP_URL}/${user.businessPage}">PWA Business Page</a>
                        
                       
                    </span>
                </p>

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
