'use server'
import { NextRequest, NextResponse } from "next/server";
import { StreamingTextResponse, AIStream, } from "ai";
import { Readable, Transform } from "node:stream";
import { redirect } from 'next/navigation'
import { Document } from "@langchain/core/documents";
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { BaseMessage } from "@langchain/core/messages";
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { Runnable, RunnableConfig, RunnableSequence } from "@langchain/core/runnables";


let splitDocs: Document[];
let vectorstore: MemoryVectorStore;
let documentChain: RunnableSequence<Record<string, unknown>, string>;
let retrievalChain: Runnable<{ input: string; chat_history?: string | BaseMessage[] | undefined; } & { [key: string]: unknown; },
    {
        context: Document[];
        answer: string;
    } & {
        [key: string]: unknown;
    }
    , RunnableConfig>;
const ollama = new ChatOllama({
    baseUrl: 'http://localhost:11434',
    useMMap: true,
    model: 'mistral',
});
const outputParser = new StringOutputParser();
const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    maxConcurrency: 5,
    keepAlive: '5m',
    requestOptions: {
        useMMap: true,
        numThread: 8,
        numGpu: 1,
    },
});
const prompt = ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:
{context}
Question: {input}`)

const extractString = new Transform({
    transform(chunk, encoding, callback) {
        callback(null, chunk.answer)
    },
})

ollama.pipe(outputParser)

//start chat
export async function POST(req: NextRequest) {
    const textFeed = await req.text();
    console.log(retrievalChain)
    if (retrievalChain === undefined) {

        return NextResponse.json({ message: 'error' }, {
            status: 500,
            statusText: 'Retrieval chain unfortunately not loaded'
        });
    }
    console.log('\nquestion -- ', textFeed);
    const stream = await retrievalChain.stream({
        input: textFeed,
    });

    try {
        for await (const chunk of stream) {
            process.stdout.write(`${chunk.answer}`);
        }

    } catch (error: Error | any) {
        console.log(error.message)
    } finally {
    }


    return new StreamingTextResponse(stream);
    return new NextResponse('done', { status: 200 })
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
        console.log(splitDocs)
        vectorstore = await MemoryVectorStore.fromDocuments(
            splitDocs,
            embeddings
        );
        documentChain = await createStuffDocumentsChain({
            llm: ollama,
            prompt,
        });

        const retriever = vectorstore.asRetriever();

        retrievalChain = await createRetrievalChain({
            combineDocsChain: documentChain,
            retriever,
        });
        // console.log(retrievalChain);
        if (retrievalChain)
            return new NextResponse('parsed', { status: 200, statusText: "ok" });
        else throw new Error();
    } catch (e: any) {
        console.log(e.message);
        return new NextResponse('error encountered', { status: 500, statusText: '<< ollama server failed >>' });
    }
}