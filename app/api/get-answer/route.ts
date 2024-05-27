'use server'
import { NextResponse, type NextRequest } from "next/server";
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export async function POST(req: NextRequest) {
    // const loader = new CheerioWebBaseLoader(url);
    console.log("Route JS : \n", await req.text())
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


    // loader.load().then(async result => {
    //     const splitter = new RecursiveCharacterTextSplitter();
    //     const splitDocs = await splitter.splitDocuments(result);

    // }).catch(e => { console.log('error encountered parsing webpage') });

    return NextResponse.json({ message: stream })
}