const sgMail = require('@sendgrid/mail');

const sendWelcomeMessage = (email, name) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: process.env.STRIPE_EMAIL_ADDRESS,
    subject: 'Fashionit Successfull Registeration',
    html: `<strong>Welcome to Fashionit, ${name}. You are all set. Log in to your new account</strong>`
  };

  sgMail.send(msg)
    .then(() => { }, error => {
      if (error.response) {
        console.error(error.response.body);
      }
    });
};

module.exports = sendWelcomeMessage;
