import { Document } from "@langchain/core/documents";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { BaseMessage } from "@langchain/core/messages";
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable, RunnableConfig, RunnableSequence } from "@langchain/core/runnables";
import { MemoryVectorStore } from "langchain/vectorstores/memory";


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
    baseUrl: process.env.NEXT_PUBLIC_PUBLIC_URL,
    useMMap: true,
    keepAlive: '20m',
    model: 'mistral',
});
const outputParser = new StringOutputParser();
export const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    maxConcurrency: 5,
    keepAlive: '20m',
    requestOptions: {
        useMMap: true,
        numThread: 8,
        numGpu: 1,
    },
});
export const prompt = ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:
{context}
Question: {input}`)

ollama.pipe(outputParser);

