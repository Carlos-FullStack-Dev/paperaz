import { sign } from "crypto";
import nodemailer from "nodemailer";
import app from "../../app";
import { DEFAULT_VALUES } from "../constants";
import { email_footer } from "../email-footer";
import { email_header } from "../email-header";

export const sendFileActionBusiness = async ( business: any, attachment:string, file:any, type:string, name?:string) => {
  var sender = nodemailer.createTransport({
    service: "Mailgun",
    auth: {
      user: app.get("email_user"),
      pass: app.get("email_password"),
    },
  });
  let cc = file.cc ? file.cc.trim().split(',') : [];
  let title;
  let subject;
  let mainText;
  let subtext;

  switch (type) {
    case "sign":
      subject= "File Signed"
      title = "Signed"
      mainText= " have signed "
      subtext="Signed PDF file is attached."
      break;
    case "complete":
      subject= "File Completed"
      title = "Completed"
      mainText= " have completed "
      subtext="Completed PDF file is attached."
      break;
    case "confirm":
      subject= "File Confirmed"
      title = "Confirmed"
      mainText= " have confirmed "
      subtext="Confirmed PDF file is attached."
      break;
  
    default:
      break;
  }
  const uppercaseWords = (str:string) => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());

  var mail = {
    from: app.get("email_from"),
    to: business.email,
    subject: `PaperLink, ${name + ' ' +subject}`,
    cc:cc,
    attachments:[
      {
        filename: file.fileName.slice(-4) === '.pdf' ? file.fileName : `${file.fileName}.pdf`,
        path: attachment,
      }
    ],
    html: `
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
                            ${uppercaseWords(name || 'Guest')} ${title} File</span>
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
                            ${business.companyName || business.firstName},</span>
                    </p>
                    <p style=" line-height: 160%; margin-bottom: 3rem;">
                        <span style=" line-height: 10px; ">
                            ${name ?? 'Guest'} ${mainText} ${file.fileName.slice(0, -4)}. Attached is PDF
                            copy for your records.

                        </span>
                    </p>

                </div>

            </td>
        </tr>
    </tbody>
</table>



     ${email_footer}
  
    `
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
