import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/organisms/Header'
import { LogoutSuccessModal } from '@/components/organisms/LogoutSuccessModal'
import { AuthProvider } from '@/lib/auth-context'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'ArchFlow',
  description: 'システム設計スキルを実践的に学ぶWebアプリケーション - エンジニアのための設計スキル向上プラットフォーム',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <LogoutSuccessModal />
        </AuthProvider>
      </body>
    </html>
  )
}
