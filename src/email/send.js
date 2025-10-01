const nodemailer = require("nodemailer");
require("dotenv");

function getTodayDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');     // dia com 2 dígitos
  const month = String(today.getMonth() + 1).padStart(2, '0'); // meses começam em 0
  const year = today.getFullYear();

  return `${day}-${month}-${year}`;
}


async function sendEmail(
    to,
    subject,
    texto,
    dataCourse
) {
    // Criar um transporte SMTP
    let transporter = nodemailer.createTransport({
        service: "gmail", // você pode usar outros serviços ou SMTP customizado
        auth: {
            user: process.env.EMAIL_ADDRESS, // seu e-mail
            pass: process.env.EMAIL_PASSWORD,  // senha ou "App Password" (recomendado)
        },
    });



    // Configuração da mensagem
    let mailOptions = {
        from: '"Ovambo Angola" <ovamboangola@gmail.com>', // remetente
        to: to, // destinatário(s)
        subject: subject || "Olá! Seu pagamento foi bem sucedido",
        text: "Olá! Seu pagamento foi bem sucedido",
        html: `
        <!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmação de Pagamento</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background-color: #f0f2f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #735048;
      text-align: center;
      padding: 40px 20px;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      margin: 10px 0 0;
      font-size: 16px;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
      color: #333333;
      line-height: 1.8;
    }
    .content h2 {
      color: grey;
      font-size: 20px;
      margin-bottom: 20px;
    }
    .details {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .details p {
      margin: 8px 0;
      font-size: 16px;
    }
    .details p strong {
      color: #A6918D;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: #735048;
      color: #ffffff !important;
      font-weight: 600;
      border-radius: 10px;
      margin: 20px 0;
      text-decoration: none;
    }
    .footer {
      text-align: center;
      padding: 20px;
      background-color: #f8f9fa;
      font-size: 14px;
      color: #666666;
    }
    .footer a {
      color: #59270A;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .container {
        margin: 10px;
      }
      .header {
        padding: 30px 15px;
      }
      .content {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pagamento Confirmado com Sucesso!</h1>
      <p>Obrigado por confiar em Ovambo Angola!</p>
    </div>
    <div class="content">
      <h2>Olá, ${dataCourse.full_name}!</h2>
      <p>Estamos entusiasmados em informar que seu pagamento foi processado com sucesso! Confira os detalhes abaixo:</p>
      <div class="details">
        <p><strong>Curso:</strong> ${dataCourse.title}</p>
        <p><strong>Valor:</strong> ${dataCourse.price},00 Kz</p>
        <p><strong>Data do Pagamento:</strong> ${getTodayDate()}</p>
      </div>
      <p>${texto}</p>
      <a href="${process.env.URL_FRONT}" class="button">Ir ao Site</a>
      <p>Qualquer dúvida? Entre em contato com nossa equipe de suporte!</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 Ovambo Angola. Todos os direitos reservados.</p>
      <p>Precisa de ajuda? <a href="mailto:ovamboangola@gmail.com">Fale conosco</a></p>
    </div>
  </div>
</body>
</html>
        `,
    };

    // Enviar
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            throw new Error(error);
        }
        console.log("Email enviado com sucesso!", info);
    });
}

module.exports = { sendEmail }