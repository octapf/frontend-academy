import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

/** Pesos alineados a usos típicos: cuerpo 400, énfasis 500, títulos 700, texto suave 300. */
const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
  weight: ["400", "500", "600", "700"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
const metadataBase =
  appUrl && URL.canParse(appUrl)
    ? new URL(appUrl)
    : new URL("http://localhost:3000");

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Frontend Academy",
    template: "%s · Frontend Academy",
  },
  description:
    "Plataforma de aprendizaje: módulos React y TypeScript, referencia, ejercicios con tests en servidor y progreso persistido.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Frontend Academy",
    title: "Frontend Academy",
    description:
      "Lecciones, práctica y progreso en frontend — módulos, glosario y ejercicios.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontend Academy",
    description:
      "Lecciones, práctica y progreso en frontend — módulos, glosario y ejercicios.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${roboto.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
