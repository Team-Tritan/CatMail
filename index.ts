import nodemailer from "nodemailer";
import axios from "axios";
import { config } from "./config";
import figlet from "figlet";

let counter: number = 0;

console.log(`
${figlet.textSync("Catmail", {
  font: "Standard",
  horizontalLayout: "default",
  verticalLayout: "default",
  width: 80,
  whitespaceBreak: true,
})}
________________________________________
Catmail Starting -- Sending ${config.total_emails} cats to ${config.send_to}.
----------------------------------------
`);

const catmail = nodemailer.createTransport({
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

async function sendCatz() {
  try {
    let {
      data: { file: catImageUrl },
    } = await axios.get("https://aws.random.cat/meow");

    let { data: catImage } = await axios.get(catImageUrl, {
      responseType: "arraybuffer",
    });

    let body = {
      from: config.server.user,
      to: config.send_to,
      subject: `cat ${counter + 1} !!!`,
      html: `<p> Someone wants you to have many cat pictures my friend. Here is cat #${
        counter + 1
      }!!! </p>`,
      attachments: [
        {
          filename: `cat-${counter + 1}.jpg`,
          content: catImage,
        },
      ],
    };

    await catmail.sendMail(body);
    console.log(`cat ${counter + 1} sent via catmail!!!`);
    counter++;
  } catch (error) {
    return console.error(error);
  }
}

(async () => {
  for await (const _ of Array(config.total_emails)) {
    await sendCatz();
  }
})();
