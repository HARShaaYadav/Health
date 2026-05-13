import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'Luna Health AI - Intelligent Menstrual Cycle Tracking',
  description: 'AI-powered menstrual cycle prediction and women\'s health tracking with adaptive learning, irregular cycle support, and personalized insights.',
  keywords: 'menstrual cycle, period tracker, fertility tracking, women\'s health, AI prediction, PCOS support',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased bg-gradient-to-br from-lavender-50 via-white to-peach-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 min-h-screen">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            },
            success: {
              iconTheme: {
                primary: '#a855f7',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
