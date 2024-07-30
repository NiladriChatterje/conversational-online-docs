'use server'
import { NextRequest, NextResponse } from "next/server";
// import { IterableReadableStream } from "@langchain/core/utils/stream";
import { StreamingTextResponse, } from "ai";
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import {
    prompt, ollama, embeddings, Package
} from '@/model';

//start chat
export async function POST(req: NextRequest) {
    const textFeed = await req.text();
    console.log(Package.retrievalChain)
    if (Package.retrievalChain === undefined) {

        return new NextResponse('Retrieval chain unfortunately not loaded', {
            status: 500,
            statusText: 'Retrieval chain unfortunately not loaded'
        });
    }
    console.log('\nquestion -- ', textFeed);

    const stream = await Package.retrievalChain.stream({
        input: textFeed,
    });
    const transform = new TransformStream({
        async transform(chunk, controller) {
            if (chunk.answer !== undefined) {
                controller.enqueue(`${chunk.answer}`);
                process.stdout.write(`${chunk.answer}`);
            }
        }
    })

    console.log("---Readable Stream generated")

    return new StreamingTextResponse(stream.pipeThrough(transform));
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
        Package.splitDocs = await splitter.splitDocuments(result);
        console.log(Package.splitDocs)
        if (Package.splitDocs.length === 0)
            return new NextResponse('<<Scrapping not allowed in this site>>', { status: 500 });
        Package.vectorstore = await MemoryVectorStore.fromDocuments(
            Package.splitDocs,
            embeddings
        );
        Package.documentChain = await createStuffDocumentsChain({
            llm: ollama,
            prompt,
        });
        const retriever = Package.vectorstore.asRetriever();

        Package.retrievalChain = await createRetrievalChain({
            combineDocsChain: Package.documentChain,
            retriever,
        });

        if (Package.retrievalChain)
            return new NextResponse('parsed', { status: 200, statusText: "ok" });
        else throw new Error();
    } catch (e: any) {
        console.log(e.message);
        return new NextResponse('error encountered', { status: 500, statusText: '<< ollama server failed >>' });
    }
}