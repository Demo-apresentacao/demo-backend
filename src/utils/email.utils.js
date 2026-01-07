import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true para 465, false para outras
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // --- A SOLUÇÃO ESTÁ AQUI EMBAIXO ---
    tls: {
        ciphers: 'SSLv3', // Ajuda em conexões legadas
        rejectUnauthorized: false // (Opcional) Evita erros de certificado em alguns containers
    },
    // O pulo do gato: Força o uso de IPv4
    family: 4 
  });

  const mailOptions = {
    from: '"Suporte Urban" <urban.teste2026@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};