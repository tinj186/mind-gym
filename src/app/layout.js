import Script from 'next/script';
import './globals.css'; // This line is the "Power Switch" for your CSS

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
        {children}
      </body>
    </html>
  );
}