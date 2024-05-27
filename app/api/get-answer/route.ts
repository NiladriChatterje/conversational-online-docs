'use server'
import { NextRequest, NextResponse } from "next/server";
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { MemoryVectorStore } from "langchain/vectorstores/memory";


type Document = {
    pageContent: string;
    metadata: {
        source: String;
        loc?: object
    }
}

let splitDocs: any[];

export async function POST(req: NextRequest) {

    const textFeed = await req.text();

    const ollama = new ChatOllama({
        baseUrl: 'http://localhost:11434',
        model: 'mistral',
    });
    const outputParser = new StringOutputParser();


    const messages = [new SystemMessage('You are a very knowledgable person'),
    new HumanMessage('what is NoSQL')
    ]

    const chain = ollama.pipe(outputParser)
    const stream = await chain.stream(messages)

    for await (const chunk of stream)
        process.stdout.write(chunk);

    return NextResponse.json({ message: stream })
}


//Get embeddings
export async function GET(request: NextRequest) {
    const { nextUrl: { searchParams } } = request
    console.log("Route JS : \n", searchParams.get('url'))
    try {
        const text: string = searchParams.get('url') ?? '';
        const loader = new CheerioWebBaseLoader(text);

        const result = await loader.load()
        const splitter = new RecursiveCharacterTextSplitter();
        splitDocs = await splitter.splitDocuments(result);
        console.log(splitDocs);


        return new NextResponse('parsed', { status: 200, statusText: "ok" });
    } catch (e: any) {
        console.log(e.message);
        return new NextResponse('error encountered', { status: 500, statusText: '<< cheerio failed to parse >>' });
    }
}