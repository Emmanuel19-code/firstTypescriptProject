import nodemailer from 'nodemailer'
import { transporter } from './nodeMailerConfig';

interface Email{
   to:string;
   subject:string;
   html:string;
}

const sendEmail = async ({ to, subject, html }:Email) => {
 
  const transport = nodemailer.createTransport(transporter);

  return transport.sendMail({
    from: '"StarCLinic" generalproject4@gmail.com', // sender address
    to,
    subject,
    html,
  });
};

export {
  sendEmail
}
