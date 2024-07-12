import nodemailer from "nodemailer";
import app from "../../app";
import { DEFAULT_VALUES } from "../constants";
import { email_footer } from "../email-footer";
import { email_header } from "../email-header";

export const shareToGuest = async (email:string, file:any, editedFileLink:string, name?:string) => {
  var sender = nodemailer.createTransport({
    service: "Mailgun",
    auth: {
      user: app.get("email_user"),
      pass: app.get("email_password"),
    },
  });

  let html = `
 ${email_header}
  
  <table style="" role="presentation" cellpadding="0" cellspacing="0"
  width="100%" border="0">
  <tbody>
      <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:15px;"
              align="left">
              <div
                  style="line-height: 140%; text-align: center; word-wrap: break-word;">
                  <p
                      style="font-size: 14px; margin-top: 1rem; line-height: 140%;">
                      <span
                          style="font-size: 1rem; font-weight:600; line-height: 24px; font-family: 'Open Sans', sans-serif;">
                          ${name || 'Guest'} File ${file.fileAction}</span>
                  </p>
              </div>
          </td>
      </tr>
      <tr>
          <td style="overflow-wrap:break-word;word-break:break-word"
              align="left" class="side-padding">

              <div
                  style="line-height: 160%; font-size: 0.9rem;   margin-top: 2.5rem; color: rgba(56, 56, 56, 1); text-align: left; word-wrap: break-word;">
                  <p
                      style=" line-height: 160%;  margin-bottom: 3rem;">
                      <span style="line-height: 28.8px;">
                          Hi
                          ${email || name},</span>
                  </p>
                  <p style=" line-height: 160%; margin-bottom: 3rem;">
                      <span style=" line-height: 10px; ">
                          Attached is PDF copy for your records.
                      </span>
                  </p>

              </div>

          </td>
      </tr>
  </tbody>
</table>


  
  

   ${email_footer}

  `;
  var mail = {
    from: app.get("email_from"),
    to: email,
    subject: `Paperlink, ${name|| ''} Paperlink Created`+` #${Math.floor(Math.random() * (10000 - 1 + 1) + 1)}`,
    attachments:[
      {
        filename: file.fileName.slice(-4) === '.pdf' ? file.fileName : `${file.fileName}.pdf`,
        path: editedFileLink,
      }
    ],
    html: html
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
