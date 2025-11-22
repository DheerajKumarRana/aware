import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const secret = process.env.SHOPIFY_REVALIDATION_SECRET;
    const topic = req.headers.get('x-shopify-topic');
    const hmac = req.headers.get('x-shopify-hmac-sha256');

    if (!secret || !topic || !hmac) {
        return NextResponse.json({ message: 'Missing secret, topic, or hmac' }, { status: 400 });
    }

    // In a real app, verify the HMAC here to ensure request is from Shopify
    // const generatedHash = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
    // if (generatedHash !== hmac) return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });

    // We'll revalidate based on the topic
    // For now, we'll just revalidate everything or specific tags if we had them implemented
    console.log(`Revalidating for topic: ${topic}`);

    // Revalidate the collection page and home page
    revalidateTag('collections');
    revalidateTag('products');

    return NextResponse.json({ message: 'Revalidation triggered', now: Date.now() });
}
