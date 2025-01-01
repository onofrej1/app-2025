"use server";
const Imap = require("imap");
const simpleParser = require("mailparser").simpleParser;

const { ImapFlow } = require("imapflow");
const client: any = {};

const imap = new Imap({
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASS,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
});

/*const client = new ImapFlow({
  host: "imap.gmail.com",
  port: 993,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS+' ',
  },
});*/

export async function fetchEmails() {
  //return [];
  await client.connect();

  // Select and lock a mailbox. Throws if mailbox does not exist
  let lock = await client.getMailboxLock("INBOX");
  try {
    let tree = await client.listTree();
    //let message = await client.fetchOne(client.mailbox.exists, { source: true });
    //console.log(message.source.toString());

    // list subjects for all messages
    // uid value is always included in FETCH response, envelope strings are in unicode.
    for await (let message of client.fetch("1:*", { envelope: true })) {
      //console.log(`${message.uid}: ${message.envelope.subject}`);
    }
  } finally {
    // Make sure lock is released, otherwise next `getMailboxLock()` never returns
    lock.release();
  }

  // log out and close connection
  await client.logout();
}

export async function fetchEmails2() {
  await client.connect();
  const lock = await client.getMailboxLock("INBOX");
  try {
    for await (const message of client.fetch("1:*", {
      envelope: true,
      bodyParts: true,
      bodyStructure: true,
    })) {
      const { content } = await client.download(message.uid, ["TEXT"]);
      //console.log("Email Content:", content.toString());
      return(content.toString());
    }
  } catch(e) {
    console.log('error occured');
    console.log(e);
  } finally {
    lock.release();
    if (client) {
        await client.logout();
    }    
  }
}

export async function getEmails() {
  console.log("get emails:");
  const body: any[] = [];
  imap.once("ready", () => {
    imap.openBox("INBOX", false, () => {
      imap.search(
        ["UNSEEN", ["SINCE", new Date()]],
        (err: any, results: any) => {
          const f = imap.fetch(results, { bodies: "" });
          f.on("message", (msg: any) => {
            msg.on("body", (stream: any) => {
              simpleParser(stream, async (err: any, parsed: any) => {
                console.log(parsed);
                body.push({ body: parsed });
              });
            });
            msg.once("attributes", (attrs: any) => {
              const { uid } = attrs;
              imap.addFlags(uid, ["\\Seen"], () => {
                console.log("Marked as read!");
              });
            });
          });
          f.once("error", (ex: any) => {
            return Promise.reject(ex);
          });
          f.once("end", () => {
            console.log("Done fetching all messages!");
            imap.end();
            return Promise.resolve(body);
          });
        }
      );
    });
  });
}

export async function getUnreadMails() {
  imap.once("ready", function () {
    imap.openBox("INBOX", true, function (err: any, box: any) {
      if (err) throw err;

      const searchCriteria = [
        ["FROM", "Discord"],
        //["HEADER", "SUBJECT", SUBJECT],
        ["UNSEEN", ["SINCE", "Day, Year"]],
      ];
      const fetchOptions = { bodies: ["HEADER", "TEXT"], markSeen: true };

      imap.search(searchCriteria, function (err: any, results: any) {
        if (err) throw err;

        const mailStream = imap.fetch(results, fetchOptions);

        mailStream.on("message", function (message: any) {
          message.on("body", function (stream: any, info: any) {
            simpleParser(stream, (err: any, mail: any) => {
              console.log("Subject:", mail.subject);
              //console.log("Body:", mail.text);
            });
          });
        });

        mailStream.once("end", function () {
          imap.end();
        });
      });
    });
  });

  imap.connect();
  return [];
}
