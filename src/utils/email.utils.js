import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // CONFIGURAÇÃO EXPLÍCITA PARA EVITAR TIMEOUT
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,                 // Porta padrão para TLS
    secure: false,             // false para porta 587 (usa STARTTLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // Adiciona logs detalhados no console do Render para debug
    logger: true,
    debug: true 
  });

  const mailOptions = {
    from: '"Suporte Urban" <urban.teste2026@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};