import Image from "next/image";
import { redirect } from 'next/navigation'
export default function Home() {

  // async function handleSubmit(formData: FormData) {
  //   'use server'
  //   redirect(`/chat?url=${formData.get('url')}`)
  // }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="absolute z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]" />
      <nav className="fixed top-0 left-0 w-100% p-5"><h2>ChatMe</h2></nav>
      <form action={'/chat'}>
        <label>Enter `URL` to chat with</label>
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
          <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">http://example.com|</span>
          <input type="text" name="url" autoComplete="username" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-white-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="URL Here" />
        </div>
        <input type="submit" />
      </form>
    </main>
  );
}
