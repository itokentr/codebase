import type { PropsWithChildren, ReactNode } from 'react';

export function HtmlRootLayout({ children }: PropsWithChildren): ReactNode {
  return (
    <html lang='ja'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=1440' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin=''
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,700&display=swap&text=LOGO'
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
