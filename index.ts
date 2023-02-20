import * as nodemailer from "nodemailer";
import axios from "axios";
import { config } from "./config";
import figlet from "figlet";

let counter: number = 0;

console.log(
  figlet.textSync("Catmail", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  })
);

console.log(
  `%c ________________________________________
 <Catmail Starting -- Sending ${config.total_emails} cats to ${config.send_to}>
 ----------------------------------------`,
  "font-family:monospace"
);

let transporter = nodemailer.createTransport({
  host: config.server.hostname,
  port: config.server.port,
  secure: config.server.tls,
  auth: {
    user: config.server.user,
    pass: config.server.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendCatz = async () => {
  try {
    let response = await axios.get("https://aws.random.cat/meow");
    let catImageUrl = response.data.file;

    let { data: catImage } = await axios.get(catImageUrl, {
      responseType: "arraybuffer",
    });

    const mailOptions = {
      from: config.server.user,
      to: config.send_to,
      subject: `cat ${counter + 1} !!!`,
      html: `cat ${counter + 1} !!!`,
      attachments: [
        {
          filename: "cat.jpg",
          content: catImage,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`cat ${counter + 1} sent via catmail!!!`);
  } catch (error) {
    return console.error(error);
  }

  counter++;
};

(async () => {
  for (let i = 0; i < config.total_emails; i++) {
    await sendCatz();
  }
})();
