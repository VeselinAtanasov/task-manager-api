
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'veselin_atanasov88@abv.bg',
    subject: 'Welcome to the App!',
    text: `Hello, ${name}. Welcome to the app! `
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'veselin_atanasov88@abv.bg',
    subject: 'We are sorry you are canceling your account!',
    text: `Hello, ${name}. We are so sorry that you are canceling your account! `
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};
