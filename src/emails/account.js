
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

console.log(process.env.SENDGRID_API_KEYSENDGRID_API_KEY)

sgMail.send({
    to:'devum99@gmail.com',
    from:'devum99@gmail.com',
    subject:'This is my first creation',
    text:'this is test email.'
})