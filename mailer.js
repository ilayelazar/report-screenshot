const nodemailer = require("nodemailer");
//sending email with the screenshot

exports.sendMail = async function(email) {
  var mailTo;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "tomiprosis@gmail.com",
      pass: "tmtm12!T"
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: "reports@iXplorer.com", // sender address
    to: email, // list of receivers
    subject: "iProsis Report", // Subject line
    text: "", // plain text body
    html:
      "<h1 style='text-align:center'>iProsis Report<br><img src='cid:unique@cid'></h1>",
    attachments: [
      {
        filename: "report.png",
        path: __dirname + "/image/report.png",
        cid: "unique@cid"
      }
    ]
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);
};
