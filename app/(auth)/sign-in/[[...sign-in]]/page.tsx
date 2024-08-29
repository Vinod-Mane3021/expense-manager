import { Loader2 } from 'lucide-react'
import { } from '@radix-ui/react-icons'
import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Image from 'next/image';

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full lg:flex flex-col px-4">
        <div className="text-center space-y-4 pt-16">
          <h1 className="font-bold text-3xl text-[#2E2A47]">Welcome Back!</h1>
          <p className="text-base text-[#7E8CA0]">Log in or Create account to get back to your dashboard!</p>
        </div>
        <div className='text-center text-sm space-y-2 mt-5 w-full flex justify-center'>
          <div className='w-fit py-1 px-4 bg-yellow-200 rounded-sm'>
            <p className='text-muted-foreground'>Note: use this credentials for demo</p>
            <p className='text-gray-600'>username: <span className='text-red-500 font-extrabold'>vinod3021</span></p>
            <p className='text-gray-600'>password: <span className='text-red-500 font-extrabold'>temp@129045</span></p>
          </div>
        </div>
        <div className="flex items-center justify-center mt-8">
          <ClerkLoaded>
            <SignIn path="/sign-in" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className='animate-spin text-muted-foreground' />
          </ClerkLoading>
        </div>
      </div>
      <div className='h-full bg-blue-600 hidden lg:flex items-center justify-center'>
        <Image src="/logo.svg" alt='Logo' height={100} width={100}/>
      </div>
    </div>
  );
}