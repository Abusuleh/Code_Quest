const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

resend.emails
  .send({
    from: "CodeQuest <onboarding@resend.dev>",
    to: "abusuleh@yahoo.co.uk",
    subject: "CodeQuest waitlist test",
    html: '<div style="font-family:Arial">CodeQuest waitlist test email.</div>',
  })
  .then((res) => {
    console.log("ok", res);
  })
  .catch((err) => {
    console.error("err", err);
    process.exit(1);
  });
