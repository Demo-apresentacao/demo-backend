import nodemailer from 'nodemailer';

/**
 * Função utilitária para enviar e-mails
 * @param {Object} options - Objeto contendo { email, subject, message }
 */
export const sendEmail = async (options) => {
  // 1. Cria o transportador (Configuração do Servidor de E-mail)
  const transporter = nodemailer.createTransport({
    // Se for usar Gmail, 'service: Gmail' resolve a porta e host automaticamente
    service: 'Gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS // ATENÇÃO: Senha de App (App Password), não a senha normal
    }
  });

  // 2. Define as opções do e-mail
  const mailOptions = {
    from: '"Suporte Urban" <urban.teste2026@gmail.com>', // Quem está enviando
    to: options.email, // Para quem vai
    subject: options.subject, // Assunto
    text: options.message, // Mensagem em texto puro
    // html: '<h1>Olá</h1>' // Se quiser mandar HTML no futuro, descomente aqui
  };

  // 3. Envia de fato
  await transporter.sendMail(mailOptions);
};