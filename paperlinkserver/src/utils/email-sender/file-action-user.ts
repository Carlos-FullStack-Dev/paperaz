import nodemailer from "nodemailer";
import app from "../../app";
import { DEFAULT_VALUES } from "../constants";
import { email_footer } from "../email-footer";
import { email_header } from "../email-header";

export const sendFileActionUser = async (user: any, attachment:string, file:any, type:string) => {
  var sender = nodemailer.createTransport({
    service: "Mailgun",
    auth: {
      user: app.get("email_user"),
      pass: app.get("email_password"),
    },
  });

  let title;
  let subject;
  let mainText;
  let subtext;

  switch (type) {
    case "sign":
      subject= "File Signed"
      title = "Signed"
      mainText= " You have signed "
      subtext="Signed PDF file is attached."
      break;
    case "complete":
      subject= "File Completed"
      title = "Completed"
      mainText= " You have completed "
      subtext="Completed PDF file is attached."
      break;
    case "confirm":
      subject= "File Confirmed"
      title = "Confirmed"
      mainText= " You have confirmed "
      subtext="Confirmed PDF file is attached."
      break;
  
    default:
      break;
  }

  let footer = email_footer
  var mail = {
    from: app.get("email_from"),
    to: user.email,
    subject: `PaperLink, ${subject}`+` #${Math.floor(Math.random() * (10000 - 1 + 1) + 1)}`,
    attachments:[
      {
        filename: file.fileName.slice(-4) === '.pdf' ? file.fileName : `${file.fileName}.pdf`,
        path: attachment,
      }
    ],
    html: `

    ${email_header}

  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
    <tbody>
      <tr>
        <td style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Cabin',sans-serif;" align="left">
          
    <div style="line-height: 140%; text-align: center; word-wrap: break-word;">
      <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 20px; line-height: 28px; font-family: 'Open Sans', sans-serif;"><strong>${title} File</strong></span></p>
    </div>
  
        </td>
      </tr>
    </tbody>
  </table>
  

  
  
  
  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
    <tbody>
      <tr>
        <td style="overflow-wrap:break-word;word-break:break-word;padding:20px 55px;font-family:'Cabin',sans-serif;" align="left">
          
    <div style="line-height: 160%; text-align: left; word-wrap: break-word;">
      <div style="font-size: 14px; line-height: 160%;display: flex;align-items: center;">
          <div class="u-col-smaller" style="display: inline-block;flex:none">
              <img src="${user.profilePicture}" style="width: 40px;height:40px;border-radius:50px;padding: 2px;border: 1px solid #4caf50;object-fit: cover;"/>
          </div>
    
          <div  class="u-col-larger" >
              <p> Hi ${user.firstName},</p>
          </div>
      </div>
  <p style="font-size: 14px; line-height: 160%;"> </p>
  <p style="font-size: 14px; line-height: 160%;padding: 1em 0;"><span style="font-size: 18px; line-height: 28.8px;"> ${mainText} <span style="color:#4caf50"> ${file.fileName}</span> file </span></p>
  <p style="font-size: 14px; line-height: 160%;"> </p>
  <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 18px; line-height: 28.8px;"><span style="line-height: 17.8px; font-size: 18px;">${title} PDF file is attached</span></span></p>
    </div>
  
        </td>
      </tr>
    </tbody>
  </table>
  
     ${footer}
  
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
