import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Montserrat, Playfair_Display, Raleway } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Courier Inbox Designer",
  description: "Design and customize your Courier Inbox components",
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicon/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/favicon/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/favicon/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/favicon/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/favicon/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/favicon/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/favicon/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/favicon/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/favicon/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'apple-touch-icon-precomposed', url: '/favicon/apple-icon-precomposed.png' },
      { rel: 'apple-touch-icon', url: '/favicon/apple-icon.png' },
    ],
  },
  manifest: '/favicon/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/favicon/ms-icon-144x144.png" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        
        {/* Android Chrome */}
        <link rel="icon" type="image/png" sizes="36x36" href="/favicon/android-icon-36x36.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon/android-icon-48x48.png" />
        <link rel="icon" type="image/png" sizes="72x72" href="/favicon/android-icon-72x72.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon/android-icon-96x96.png" />
        <link rel="icon" type="image/png" sizes="144x144" href="/favicon/android-icon-144x144.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-icon-192x192.png" />
        
        {/* Microsoft Icons */}
        <link rel="icon" type="image/png" sizes="70x70" href="/favicon/ms-icon-70x70.png" />
        <link rel="icon" type="image/png" sizes="150x150" href="/favicon/ms-icon-150x150.png" />
        <link rel="icon" type="image/png" sizes="310x310" href="/favicon/ms-icon-310x310.png" />
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getThemePreference() {
                  if (typeof window !== 'undefined' && window.localStorage) {
                    const stored = localStorage.getItem('theme');
                    if (stored) return stored;
                  }
                  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                
                function applyTheme(theme) {
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                }
                
                // Apply initial theme
                const theme = getThemePreference();
                applyTheme(theme);
                
                // Listen for system theme changes
                if (typeof window !== 'undefined' && window.matchMedia) {
                  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                  mediaQuery.addEventListener('change', (e) => {
                    // Only update if user hasn't manually set a preference
                    if (!localStorage.getItem('theme')) {
                      applyTheme(e.matches ? 'dark' : 'light');
                    }
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${montserrat.variable} ${playfairDisplay.variable} ${raleway.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
