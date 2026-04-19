import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BebrasBolivia - Collaborative Platform',
  description: 'Bebras Bolivia Challenge Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
