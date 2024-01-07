import { EmailTemplate } from '@/components/Email';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST({email}:{email:string}) {
  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome!',
      react: EmailTemplate({ firstName: 'John' }),
      text: 'Welcome to our platform!', 
    });

    console.log("data--",data)
    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
