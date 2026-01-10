import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ email, subject, message }) => {
    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: email,
            reply_to: process.env.EMAIL_REPLY_TO,
            subject: subject,
            text: message
        });
    } catch (error) {
        console.error('Erro ao enviar e-mail (Resend):', error);
        throw error;
    }
};
