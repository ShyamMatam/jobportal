import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Suspense } from 'react'
import Loading from './loading'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Job Portal',
  description: 'Find your dream job or hire the perfect candidate',
}



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}


