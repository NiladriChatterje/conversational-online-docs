'use client'
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { useRef, useState } from 'react'


const page = (formData: { searchParams: { url: string } }) => {
    const { searchParams: { url } } = formData;
    const [loadedData, setLoadedData] = useState<object>();

    try {

        const loader = new CheerioWebBaseLoader(url);
        const chatgpt = new ChatOpenAI({});
        loader.load().then(async result => {
            const splitter = new RecursiveCharacterTextSplitter();
            const splitDocs = await splitter.splitDocuments(result);

            setLoadedData(splitDocs)
            console.log(splitDocs)
        });
    } catch (e) { }


    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="absolute z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]" />
            <nav className="fixed top-0 left-0 w-100% p-5"><h2>ChatMe</h2></nav>
        </div>
    )
}

export default page