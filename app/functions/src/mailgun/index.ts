import * as functions from 'firebase-functions';
const cors = require('cors')({ origin: true });

const config = {
  api_key: 'b536e2cb6c9592b2ee803b559e98a426-ea44b6dc-62046356',
  domain: 'mg.efiisolutions.com',
};

const mailgun = require('mailgun-js')(config);

export const sendEmail = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method === 'POST') {
      const { to, subject, text } = req.body;
      const data = {
        from: 'Efi@Isolutions <noreply.efiisolutions.com>',
        to,
        subject,
        text,
      };
      try {
        const mgRes = await mailgun.messages().send(data);
        res.status(200).send(JSON.stringify(mgRes));
      } catch (error) {
        return res.status(500).send(error);
      }
    }
    return res.status(500).send('Method not allowed');
  });
});
