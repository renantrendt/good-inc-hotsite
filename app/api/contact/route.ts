import { NextResponse } from 'next/server';
import { sendFormNotification } from '@/utils/mailer';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    
    // Validação básica
    if (!formData.name || !formData.email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      );
    }

    // Envia o email
    const result = await sendFormNotification(formData);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Erro ao enviar email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Email enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
