import app from "../app";
import { DEFAULT_VALUES } from "./constants";
export const email_header = 
       `
       <!DOCTYPE HTML
       PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
   <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
       xmlns:o="urn:schemas-microsoft-com:office:office">
   
   <head>
       <!--[if gte mso 9]>
                 <xml>
                   <o:OfficeDocumentSettings>
                     <o:AllowPNG/>
                     <o:PixelsPerInch>96</o:PixelsPerInch>
                   </o:OfficeDocumentSettings>
                 </xml>
                 <![endif]-->
       <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <meta name="x-apple-disable-message-reformatting">
       <!--[if !mso]><!-->
       <meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
       <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
       <script src="https://cdn.jsdelivr.net/npm/iconify-icon@1.0.0-beta.3/dist/iconify-icon.min.js"></script>
       <script src="https://code.iconify.design/iconify-icon/1.0.0-beta.3/iconify-icon.min.js"></script>
       <title></title>
   
       <style type="text/css">
           @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
   
           @media only screen and (min-width: 620px) {
               .u-row {
                   width: 600px !important;
               }
   
               .u-row .u-col {
                   vertical-align: top;
               }
   
               .u-row .u-col-33p33 {
                   width: 199.98px !important;
               }
   
               .u-col-small {
                   width: 80.98px !important;
               }
   
               .u-col-large {
                   width: calc(100% - 80.98px) !important;
               }
   
               .u-row .u-col-66p67 {
                   width: 400.02px !important;
               }
   
               .u-row .u-col-100 {
                   width: 600px !important;
               }
   
               .side-padding {
                   padding-left: 15%;
                   padding-right: 15%;
               }
   
           }
   
           @media (max-width: 620px) {
               .side-padding {
                   padding-left: 7%;
                   padding-right: 7%;
               }
   
               .green-footer {
                   flex-direction: column;
               }
   
               .black-card {
                   width: fit-content;
               }
   
               .ipad-image {
                   display: none;
               }
   
               .u-row-container {
                   max-width: 100% !important;
                   padding-left: 0px !important;
                   padding-right: 0px !important;
               }
   
               .u-row .u-col {
                   min-width: 320px !important;
                   max-width: 100% !important;
                   display: block !important;
               }
   
               .u-row {
                   width: calc(100% - 40px) !important;
               }
   
               .u-col {
                   width: 100% !important;
               }
   
               .u-col>div {
                   margin: 0 auto;
               }
   
               .u-col-small {
                   width: 80.98px !important;
               }
   
               .u-col-large {
                   width: calc(100% - 80.98px) !important;
               }
           }
   
           body {
               margin: 0;
               padding: 0;
               background-color: #f9f9f9;
           }
   
           table,
           tr,
           td {
               vertical-align: top;
               border-collapse: collapse;
           }
   
           p {
               margin: 0;
           }
   
           .ie-container table,
           .mso-container table {
               table-layout: fixed;
           }
   
           * {
               line-height: inherit;
               font-family: 'Poppins', sans-serif;
           }
   
           a[x-apple-data-detectors='true'] {
               color: inherit !important;
               text-decoration: none !important;
           }
   
           .logo-img {
               transform: scale(0.7);
           }
   
   
           table,
           td {
               color: #000000;
           }
   
           a {
               color: #0000ee;
               text-decoration: underline;
           }
   
           .green-footer {
               padding: 1rem;
               background-color: #77B550;
               min-height: 10px;
               display: flex;
           }
   
           .black-card {
               margin-top: 1rem;
               background-color: #000000;
               border: none;
               outline: none;
               border-radius: 5px;
               color: #fff;
               padding: 0.5rem;
               cursor: pointer;
               text-decoration: none;
               display: flex;
               align-items: center;
   
   
           }
   
           .black-card>img {
               width: 40px;
               height: 20px;
               margin-right: 0.5rem;
           }
           @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');


           @media only screen and (min-width: 620px) {
               .u-row {
                   width: 600px !important;
               }
   
               .u-row .u-col {
                   vertical-align: top;
               }
   
               .u-row .u-col-33p33 {
                   width: 199.98px !important;
               }
   
               .u-col-small {
                   width: 80.98px !important;
               }
   
               .u-col-large {
                   width: calc(100% - 80.98px) !important;
               }
   
               .u-row .u-col-66p67 {
                   width: 400.02px !important;
               }
   
               .u-row .u-col-100 {
                   width: 600px !important;
               }
   
               .side-padding {
                   padding-left: 15%;
                   padding-right: 15%;
               }
   
           }
   
           @media (max-width: 620px) {
               .side-padding {
                   padding-left: 7%;
                   padding-right: 7%;
               }
   
               .green-footer {
                   flex-direction: column;
               }
   
               .black-card {
                   width: fit-content;
               }
   
               .ipad-image {
                   display: none;
               }
   
               .u-row-container {
                   max-width: 100% !important;
                   padding-left: 0px !important;
                   padding-right: 0px !important;
               }
   
               .u-row .u-col {
                   min-width: 320px !important;
                   max-width: 100% !important;
                   display: block !important;
               }
   
               .u-row {
                   width: calc(100% - 40px) !important;
               }
   
               .u-col {
                   width: 100% !important;
               }
   
               .u-col>div {
                   margin: 0 auto;
               }
   
               .u-col-small {
                   width: 80.98px !important;
               }
   
               .u-col-large {
                   width: calc(100% - 80.98px) !important;
               }
           }
   
           .user-side-content {
               border-left: 1px solid #77B550;
               padding-left: 1.4rem;
           }
   
           .green-btn {
               cursor: pointer;
               font-size: 0.7rem;
               border: none;
               border-radius: 5px;
               padding: 5px 5px 5px 5px;
               background-color: #77B54F;
               color: #fff;
               margin-right: 0.5rem;
               text-decoration: none;
           }
   
           .footer-link {
               cursor: pointer;
               font-size: 0.7rem;
               border: none;
               border-radius: 50px;
               color: #fff;
           }
   
           body {
               margin: 0;
               padding: 0;
               background-color: #f9f9f9;
           }
   
           table,
           tr,
           td {
               vertical-align: top;
               border-collapse: collapse;
           }
   
           p {
               margin: 0;
           }
   
           .ie-container table,
           .mso-container table {
               table-layout: fixed;
           }
   
           * {
               line-height: inherit;
               font-family: 'Poppins', sans-serif;
           }
   
           a[x-apple-data-detectors='true'] {
               color: inherit !important;
               text-decoration: none !important;
           }
   
           .logo-img {
               transform: scale(0.7);
           }
   
   
           table,
           td {
               color: #000000;
           }
   
           a {
               color: #0000ee;
               text-decoration: underline;
           }
   
           .green-footer {
               padding: 1rem;
               background-color: #77B550;
               min-height: 10px;
               display: flex;
           }
   
           .black-card {
               margin-top: 1rem;
               background-color: #000000;
               border: none;
               outline: none;
               border-radius: 5px;
               color: #fff;
               padding: 0.5rem;
               cursor: pointer;
               text-decoration: none;
               display: flex;
               align-items: center;
   
   
           }
   
           .black-card>img {
               width: 40px;
               height: 20px;
               margin-right: 0.5rem;
           }
   
   
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
      
              @media only screen and (min-width: 620px) {
                  .u-row {
                      width: 600px !important;
                  }
      
                  .u-row .u-col {
                      vertical-align: top;
                  }
      
                  .u-row .u-col-33p33 {
                      width: 199.98px !important;
                  }
      
                  .u-col-small {
                      width: 80.98px !important;
                  }
      
                  .u-col-large {
                      width: calc(100% - 80.98px) !important;
                  }
      
                  .u-row .u-col-66p67 {
                      width: 400.02px !important;
                  }
      
                  .u-row .u-col-100 {
                      width: 600px !important;
                  }
      
                  .side-padding {
                      padding-left: 15%;
                      padding-right: 15%;
                  }
      
              }
      
              @media (max-width: 620px) {
                  .side-padding {
                      padding-left: 7%;
                      padding-right: 7%;
                  }
      
                  .green-footer {
                      flex-direction: column;
                  }
      
                  .black-card {
                      width: fit-content;
                  }
      
                  .ipad-image {
                      display: none;
                  }
      
                  .u-row-container {
                      max-width: 100% !important;
                      padding-left: 0px !important;
                      padding-right: 0px !important;
                  }
      
                  .u-row .u-col {
                      min-width: 320px !important;
                      max-width: 100% !important;
                      display: block !important;
                  }
      
                  .u-row {
                      width: calc(100% - 40px) !important;
                  }
      
                  .u-col {
                      width: 100% !important;
                  }
      
                  .u-col>div {
                      margin: 0 auto;
                  }
      
                  .u-col-small {
                      width: 80.98px !important;
                  }
      
                  .u-col-large {
                      width: calc(100% - 80.98px) !important;
                  }
              }
      
              body {
                  margin: 0;
                  padding: 0;
                  background-color: #f9f9f9;
              }
      
              table,
              tr,
              td {
                  vertical-align: top;
                  border-collapse: collapse;
              }
      
              p {
                  margin: 0;
              }
      
              .ie-container table,
              .mso-container table {
                  table-layout: fixed;
              }
      
              * {
                  line-height: inherit;
                  font-family: 'Poppins', sans-serif;
              }
      
              a[x-apple-data-detectors='true'] {
                  color: inherit !important;
                  text-decoration: none !important;
              }
      
              .logo-img {
                  transform: scale(0.7);
              }
      
      
              table,
              td {
                  color: #000000;
              }
      
              a {
                  color: #0000ee;
                  text-decoration: underline;
              }
      
              .green-footer {
                  padding: 1rem;
                  background-color: #77B550;
                  min-height: 10px;
                  display: flex;
              }
      
              .black-card {
                  margin-top: 1rem;
                  background-color: #000000;
                  border: none;
                  outline: none;
                  border-radius: 5px;
                  color: #fff;
                  padding: 0.5rem;
                  cursor: pointer;
                  text-decoration: none;
                  display: flex;
                  align-items: center;
      
      
              }
      
              .black-card>img {
                  width: 40px;
                  height: 20px;
                  margin-right: 0.5rem;
              }
       </style>
   
   
   
       <!--[if !mso]><!-->
       <link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css">
       <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet" type="text/css">
       <!--<![endif]-->
   
   </head>
   
   <body class="clean-body u_body"
       style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background: #f9f9f9 !important;color: #000000">
       <!--[if IE]><div class="ie-container"><![endif]-->
       <!--[if mso]><div class="mso-container"><![endif]-->
       <main style="background-color: #f9f9f9; padding:1em 0">
           <table
               style="border-radius:20px;width:100%;max-width:600px; border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%"
               cellpadding="0" cellspacing="0">
               <tbody>
                   <tr style="vertical-align: top">
                       <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                           <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]-->
   
   
                           <div class="u-row-container" style="padding: 0px;background:#FFFFFF !important;height: auto; padding-bottom: 1rem;">
                               <div class="u-row"
                                   style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                                   <div
                                       style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                       <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
   
                                       <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                                       <div class="u-col u-col-100"
                                           style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                           <div style="background-color: #ffffff;height: 100%;width: 100% !important;">
                                               <!--[if (!mso)&(!IE)]><!-->
                                               <div
                                                   style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                   <!--<![endif]-->
   
                                                   <table style="" role="presentation" cellpadding="0" cellspacing="0"
                                                       width="100%" border="0">
                                                       <tbody>
                                                           <tr>
                                                               <td style="overflow-wrap:break-word;word-break:break-word;padding:5px;"
                                                                   align="left">
   
                                                                   <table width="100%" cellpadding="0" cellspacing="0"
                                                                       border="0">
                                                                       <tr>
                                                                           <td style="padding-right: 0px;padding-left: 0px;"
                                                                               align="center">
   
                                                                               <img class="logo-img" align="center"
                                                                                   border="0"
                                                                                   src="https://paperdazfile.nyc3.digitaloceanspaces.com/assets/paperlink_assets/fullLogo.png"
                                                                                   alt="Image" title="Image"
                                                                                   style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 40%;max-width: 236px;"
                                                                                   width="236" />
   
                                                                           </td>
                                                                       </tr>
                                                                   </table>
   
                                                               </td>
                                                           </tr>
                                                       </tbody>
                                                   </table>
   
                                                   <!--[if (!mso)&(!IE)]><!-->
                                               </div><!--<![endif]-->
                                           </div>
                                       </div>
                                       <!--[if (mso)|(IE)]></td><![endif]-->
                                       <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                   </div>
                               </div>
                           </div>
   
                           <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                               style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #77b550;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                               <tbody>
                                   <tr style="vertical-align: top">
                                       <td
                                           style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                           <span>&#160;</span>
                                       </td>
                                   </tr>
                               </tbody>
                           </table>
   
   
   
   
   
   <!-- content started -->
                           <div class="u-row-container" style="padding: 0px;background-color: #ffffff">
                               <div class="u-row"
                                   style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                                   <div
                                       style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                       <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
   
                                       <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                       <div class="u-col u-col-100"
                                           style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                           <div
                                               style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                               <!--[if (!mso)&(!IE)]><!-->
                                               <div
                                                   style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                   <!--<![endif]-->
   
                                                   <!--[if (!mso)&(!IE)]><!-->
                                               </div><!--<![endif]-->
                                           </div>
                                       </div>
                                       <!--[if (mso)|(IE)]></td><![endif]-->
                                       <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                   </div>
                               </div>
                           </div>
   <!-- content ended -->
   
   
                           <div class="u-row-container" style="padding: 0px;background-color: #ffffff">
                               <div class="u-row"
                                   style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                                   <div
                                       style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                       <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
   
                                       <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                                       <div class="u-col u-col-100"
                                           style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                           <div style="height: 100%;width: 100% !important;">
                                               <!--[if (!mso)&(!IE)]><!-->
                                               <div
                                                   style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                   <!--<![endif]-->
                                   
   
   
       
   
           ` 
