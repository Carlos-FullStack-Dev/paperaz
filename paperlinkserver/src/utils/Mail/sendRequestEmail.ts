import nodemailer from "nodemailer";
import app from "../../app";

export const sendRequestMail = (email: string, note: string, file:string) =>{
  var sender = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
      user: 'postmaster@main.paperdaz.com',
      pass: 'bd237fa273702f96a28c9f74eb018bd4-c9746cf8-1ebbe0e8'
    }
  });

  var mail = {
    from: "info@paperdaz.com",
    to: email,
    subject: "Request to complete file"+` #${Math.floor(Math.random() * (10000 - 1 + 1) + 1)}`,
    html:`<p>${note}</p>`,
    attachments: [
      {
          filename: 'paperdaz.pdf',
          path: file,
      }
    ]
  };

  sender.sendMail(mail, function(error, info) {
    if (error) {
      console.log(error);
      return
    } else {
      console.log("Email sent successfully: " + info.response);
      return
    }
  });

}

