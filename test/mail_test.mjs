// @format
import test from "ava";
import esmock from "esmock";

test("to send an email", async t => {
  const to = "to@example.com";
  const subject = "hello";
  const text = "text";
  const html = "<p>lol</p>";

  t.plan(4);
  const { send } = await esmock("../src/mail.mjs", null, {
    nodemailer: {
      default: {
        createTransport: () => ({
          sendMail: data => {
            t.is(data.to, to);
            t.is(data.subject, subject);
            t.is(data.text, text);
            t.is(data.html, html);
          }
        })
      }
    }
  });
  await send(to, subject, text, html);
});
