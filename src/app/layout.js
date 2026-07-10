import Script from 'next/script';
import './globals.css'; // This line is the "Power Switch" for your CSS

import GlobalNavbar from '@/components/layout/GlobalNavbar';
import GlobalFooter from '@/components/layout/GlobalFooter';

import CookieBanner from '@/components/layout/CookieBanner';

export const metadata = {
  title: 'Learn Reps | Primary 1 Math Auto-marked Worksheets',
  description: 'Master the new Singapore MOE Syllabus with unlimited, auto-marked math worksheets for Primary 1 students. Focus on conceptual understanding and eliminate careless mistakes.',
  keywords: 'Primary 1 Math, Singapore MOE Syllabus, Auto-marked Worksheets, P1 math time worksheets, How to teach P1 time and duration Singapore',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script id="mathlive-config" strategy="beforeInteractive" dangerouslySetInnerHTML={{
          __html: `
            window.MathfieldElement = window.MathfieldElement || {};
            window.MathfieldElement.fontsDirectory = "https://unpkg.com/mathlive@0.109.1/dist/fonts/";
            window.MathfieldElement.soundsDirectory = "https://unpkg.com/mathlive@0.109.1/dist/sounds/";
          `
        }} />
        <GlobalNavbar />
        {children}
        <GlobalFooter />
        <CookieBanner />
      </body>
    </html>
  );
}