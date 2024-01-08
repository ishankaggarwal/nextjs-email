import { EmailTemplate } from '@/components/Email';
import { Resend } from 'resend';
import { NextRequest } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(NextRequest: NextRequest) {
  console.log("inside POST request");
  try {
    const email = JSON.parse(await NextRequest.text()).email || '';
    //const name = JSON.parse(await NextRequest.text()).name || '';
    if(!email)return Response.json({status:400,error:"Invalid email"});
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome!',
      react: EmailTemplate({}),
      text: 'Welcome to our platform!', 
    });
    
    console.log("data--",data)
    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
