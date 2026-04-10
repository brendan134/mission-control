import './globals.css';
import AppLayout from './AppLayout';

export const metadata = {
  title: 'Mission Control - Leader By Design',
  description: 'AI System Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}