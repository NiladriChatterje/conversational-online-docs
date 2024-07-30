'use client'
import { useRef } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useChat } from 'ai/react';
import toast from 'react-hot-toast';
import SVGArrow from '@/app/right-arrow.svg'
import { HiSpeakerWave } from "react-icons/hi2";
import PreLoader from '@/app/preloader.svg'

const Page = () => {
    const { messages, isLoading, input, error, handleSubmit, handleInputChange } = useChat({
        api: 'api/get-answer',
        streamMode: 'text',
    });
    const router = useRouter();
    console.log(messages)
    if (error) {
        console.log(error.message);
        setTimeout(() => {
            router.push('/')
        }, 2000)
    }
    const inputRef = useRef<HTMLInputElement | any>(null);
    return (
        <>
            <div className="flex min-h-screen flex-col items-center justify-center p-24 ">
                <div className="absolute z-[-1] flex place-items-center before:absolute 
                before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full 
                before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl 
                before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full 
                after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 
                after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent 
                before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] 
                after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]" />
                <nav className="fixed top-0 left-0 w-full p-5
                "><h2>ChatMe</h2></nav>
                <section className='h-[60vh] block scroll-smooth overflow-y-auto 
                overflow-x-clip rounded-md w-[85vw] relative sm:h-[75vh]
                md:w-[55vw] lg:w-[55vw]'>
                    {messages && messages.map(m => (
                        <div key={m.id} className={`flex flex-col 
                            w-full
                    ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <article
                                className={m.role === 'user' ?
                                    `relative w-max max-w-[55%] block border-none 
                                    border-2 text-wrap
                                    border-slate-100 bg-slate-900 py-2.5 mt-5 mb-5 px-5 me-2
                                    text-sm font-medium text-white bg-white rounded-lg
                                     border border-gray-200 hover:bg-gray-100 hover:text-blue-700 
                                     focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700
                                      dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 
                                      dark:hover:text-white dark:hover:bg-gray-700`
                                    :
                                    `relative block w-full h-max md:max-w-[65%]
                                    lg:max-w-[75%] rounded-lg mt-2 mr-[1px] text-wrap 
                                    py-2.5 px-5 text-sm font-medium text-justify`
                                }
                            >
                                {m.role === 'user' ? 'User: ' : 'AI: '}
                                {m.content}
                            </article>
                            <div
                                className='w-full px-5 py-2.5'
                            >
                                {messages.length !== 0 &&
                                    messages.length % 2 === 0 &&
                                    m.role === 'assistant' && !isLoading ? <><button
                                        onClick={() => {
                                            const speech = new SpeechSynthesisUtterance(messages[messages.length - 1].content);
                                            speechSynthesis.speak(speech);
                                        }}
                                        type="button" className="py-2.5 mt-5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">

                                        <HiSpeakerWave
                                            size={8}
                                            color='white'
                                        />
                                    </button></> : null}
                            </div>

                        </div>
                    ))}
                    {isLoading ?
                        <section className='w-full flex justify-center'>
                            <Image
                                src={PreLoader}
                                alt='Preloader'
                            />
                        </section>
                        : null}
                </section>
                <form
                    onSubmit={(e) => {
                        let flag = false;
                        try {
                            handleSubmit(e)
                        } catch (error: Error | any) {
                            flag = true
                            toast.error(error.message)
                        }
                        if (flag) router.push('/')
                    }
                    }
                    className='flex mb-5 p-2 justify-between max-h-10 md:max-h-15 lg:max-h-15 bg-slate-100 rounded-md min-w-[85vw] md:min-w-[55vw] lg:min-w-[55vw]'>
                    <input
                        ref={inputRef}
                        value={input}
                        disabled={isLoading}
                        onChange={e => {
                            isLoading ? e.preventDefault() :
                                handleInputChange(e)
                        }}
                        className='text-black focus:text-white max-h-8 md:max-h-15 lg:max-h-15 w-[90%] 
                        rounded-md focus:bg-blue-900 ease-in duration-100 focus:outline-none focus:border-r-2 focus:border-r-blue-700 px-10 py-[2.5px] bg-transparent' />
                    <button type='submit'
                        className='bg-transparent border-none flex items-center justify-center'>
                        <Image
                            className='cursor-pointer'
                            width={20}
                            src={SVGArrow}
                            alt=''
                        />
                    </button>
                </form>

            </div>
        </>
    )
}

export default Page