import React from 'react'
import './globals.css'

export const metadata = {
  title: 'MakeYourPDF - PDFs Made Simple',
  description: 'Generate professional PDFs in seconds. Transform your HTML templates and JSON data into beautiful PDFs with our powerful, developer-friendly generator.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
