import { Document } from "@langchain/core/documents";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { BaseMessage } from "@langchain/core/messages";
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable, RunnableConfig, RunnableSequence } from "@langchain/core/runnables";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Readable, Transform } from "node:stream";


type abc = {
    context: Document[], answer: string
} & {
    [key: string]: unknown;
}

type EnitirePackage = {
    splitDocs?: Document[];
    vectorstore?: MemoryVectorStore;
    documentChain?: RunnableSequence<Record<string, unknown>, string>;
    retrievalChain?: Runnable<{ input: string; chat_history?: string | BaseMessage[] | undefined; } & { [key: string]: unknown; },
        abc
        , RunnableConfig>;
};

export const Package: EnitirePackage = {};

export const ollama = new ChatOllama({
    baseUrl: 'http://localhost:11434',
    useMMap: true,
    model: 'mistral',
});
const outputParser = new StringOutputParser();
export const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    maxConcurrency: 5,
    keepAlive: '5m',
    requestOptions: {
        useMMap: true,
        numThread: 8,
        numGpu: 1,
    },
});
export const prompt = ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:
{context}
Question: {input}`)

export const extractString = new Transform({
    transform(chunk, encoding, callback) {
        callback(null, chunk.answer)
    },
})

ollama.pipe(outputParser);

