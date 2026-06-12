import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Prompt Compressor <onboarding@resend.dev>',
      to: 'd.sethnadagamage@gmail.com',
      subject: 'New Support Message',
      text: message,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Support route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
