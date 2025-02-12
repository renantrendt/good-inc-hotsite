import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendFormNotification(formData: any) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'Novo Lead Registrado - Good Inc Hotsite',
    html: `
      <h2>Novo Lead Registrado!</h2>
      
      <h3>Dados Pessoais</h3>
      <p><strong>Nome:</strong> ${formData.firstName} ${formData.lastName}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      ${formData.cityCode ? `<p><strong>Código da Cidade:</strong> ${formData.cityCode}</p>` : ''}
      <p><strong>Telefone:</strong> ${formData.phone}</p>
      ${formData.cpf ? `<p><strong>CPF:</strong> ${formData.cpf}</p>` : ''}
      
      <h3>Endereço</h3>
      <p><strong>Rua:</strong> ${formData.street}${formData.number ? `, ${formData.number}` : ''}</p>
      ${formData.complement ? `<p><strong>Complemento:</strong> ${formData.complement}</p>` : ''}
      ${formData.neighborhood ? `<p><strong>Bairro:</strong> ${formData.neighborhood}</p>` : ''}
      <p><strong>Cidade:</strong> ${formData.city}</p>
      <p><strong>Estado:</strong> ${formData.state}</p>
      <p><strong>CEP:</strong> ${formData.zipCode}</p>
      <p><strong>País:</strong> ${formData.country}</p>
      ${formData.countryCode ? `<p><strong>Código do País:</strong> ${formData.countryCode}</p>` : ''}
      
      <h3>Perfil</h3>
      <p><strong>Odor das Roupas:</strong> ${formData.clothesOdor}</p>
      <p><strong>Entendimento do Produto:</strong> ${formData.productUnderstanding}</p>
      <p><strong>Foco Principal:</strong> ${formData.mainFocus}</p>
      <p><strong>Como nos Conheceu:</strong> ${formData.referral}</p>
      
      <hr>
      <p>Recebido em: ${new Date().toLocaleString()}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao enviar email'
    };
  }
}
