import './globals.css'; // This line is the "Power Switch" for your CSS

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}