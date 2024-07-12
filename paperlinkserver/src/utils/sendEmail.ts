import nodemailer from "nodemailer";
import app from "../app";
import { DEFAULT_VALUES } from "./constants";

export const sendEmailOld = async (type?:string, user?:any, file?:any,  attachement?:string) =>{
  var sender = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
      user: app.get('email_user'),
      pass: app.get('email_password')
    }
  });
  var mail = {};
  let fileOwner = await app.services.users.get(file.userId);
  let mailReciepients = [
    user.email,
    fileOwner.email
  ]
  let cc = file.cc ? file.cc.trim().split(',') : [];
  let fromMail = app.get('email_from')
  


  switch (type) {
    case DEFAULT_VALUES.emailAction.SAVE:
          mail = {
            from: fromMail,
            to: user.email,
            subject: DEFAULT_VALUES.emailSubjects.SAVE +` #${Math.floor(Math.random() * (10000 - 1 + 1) + 1)}`,
            html:``,
            attachments: [
              {
                  filename: file.fileName,
                  path: attachement,
              }
            ]
          };
      break;
    case DEFAULT_VALUES.emailAction.CONFIRM:
          mail = {
            from: fromMail,
            to: mailReciepients,
            cc:cc,
            subject: DEFAULT_VALUES.emailSubjects.CONFIRM+` #${Math.floor(Math.random() * (10000 - 1 + 1) + 1)}`,
            html:"<h1>this a test</h1><p>this is a test with attachement*Isaac*</p>",
          };
      break;
    case DEFAULT_VALUES.emailAction.SIGN:
          mail = {
            from: fromMail,
            to: mailReciepients,
            cc:cc,
            subject: DEFAULT_VALUES.emailSubjects.SIGN+` #${Math.floor(Math.random() * (10000 - 1 + 1) + 1)}`,
            html:"<h1>this a test</h1><p>this is a test with attachement*Isaac*</p>",
          };
      break;
  
    default:
      break;
  }

  await sender.sendMail(mail, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successfully: " + info.response);
    }
  });
}

