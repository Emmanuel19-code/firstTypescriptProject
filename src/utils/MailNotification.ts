import { sendEmail } from "./sendEmail";

interface OneTime {
  name:string,
  email:string,
  verificationToken:string,
  title:string
}

export const sendOneTimePassword = async ({
  name,
  email,
  verificationToken,
  title
}:OneTime) => {

  return sendEmail({
    to: email,
    subject: title,
    html: `<h4> Hello, ${name}</h4>
    This is your email verification token ${ verificationToken} 
    `,
  });
};




export const ResetPasswordToken = ({
 name,
 email,
 verificationToken,
 title
}:OneTime) =>{
   return sendEmail({
     to:email,
     subject: title,
     html:`<h4>Hello, ${name} </h4>
      This is your password reset token ${verificationToken}
     `
   })
}


 