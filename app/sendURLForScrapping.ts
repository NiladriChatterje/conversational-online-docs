'use server'
import { redirect } from "next/navigation";

export async function sendURLForEmbedding(formData: FormData) {
    'use server'
    console.log(process.env.NEXT_PUBLIC_BASE_URL_API)
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/api/get-answer?url=${formData.get('url')}`, {
            headers: {
                "Content-Type": 'text/plain',
            },
        });
        console.log('< message : ' + await response.text(), ', status : ' + response.status + ' >');
        if (response.status === 500)
            throw new Error(response.statusText)
    } catch (e: any | Error) {
        console.log(e.message);
        return;
    }

    redirect('/chat')
}