'use client'
import { useRef, useState } from 'react'
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import SVGArrow from '@/app/right-arrow.svg'

const page = () => {
    const [loadedData, setLoadedData] = useState<object>();
    const inputRef = useRef<any>(null);

    async function query() {
        if (!inputRef.current.value) {
            toast.error('Empty field isn\'t queryable! ');
            return;
        }
        const textFeed = inputRef.current.value
        inputRef.current.value = '';
        const response = await fetch(`http://localhost:3000/api/get-answer`, {
            method: 'POST',
            headers: {
                "Content-Type": 'text/plain',
                "timeout": "30000"
            },
            body: textFeed
        });
        // const { message } = await response.json()

        console.log("response : ", response)
    }

    return (
        <>
            <Toaster />
            <div className="flex min-h-screen flex-col items-center justify-center p-24 ">
                <div className="absolute z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]" />
                <nav className="fixed top-0 left-0 w-100% p-5"><h2>ChatMe</h2></nav>
                <section className='min-h-[60vh] border-r-2 border-slate-100 border-r-slate-200 rounded-md min-w-[85vw] md:min-w-[55vw] lg:min-w-[55vw]'>

                </section>
                <section className='flex mt-5 p-2 justify-between max-h-10 md:max-h-15 lg:max-h-15 bg-slate-100 rounded-md min-w-[85vw] md:min-w-[55vw] lg:min-w-[55vw]'>
                    <input
                        ref={inputRef}
                        onKeyDown={e => { if (e.keyCode === 13) query() }}
                        className='text-black focus:text-white max-h-8 md:max-h-15 lg:max-h-15 w-[90%] rounded-md focus:bg-blue-900 ease-in duration-100 focus:outline-none focus:border-r-2 focus:border-r-blue-700 px-10 py-[2.5px] bg-transparent' />
                    <Image
                        className='cursor-pointer'
                        width={40}
                        src={SVGArrow}
                        onClick={query}
                        alt=''
                    />
                </section>

            </div>
        </>
    )
}

export default page