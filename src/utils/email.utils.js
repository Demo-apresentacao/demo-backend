import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,     // MUDANÇA 1: Usar porta SSL direta (mais estável em Cloud)
    secure: true,  // MUDANÇA 2: true para porta 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // MUDANÇA 3: Removemos o bloco 'tls' com 'SSLv3' (o Gmail não aceita mais)
    // Mantemos apenas o family: 4 para garantir IPv4
    family: 4, 
    
    // Debug para ver no log se funcionar
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