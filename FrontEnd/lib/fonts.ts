import { Inter, Plus_Jakarta_Sans } from "next/font/google"

// Shared by the two root layouts (public site under app/[lang], admin under
// app/admin) and the global 404, which each render their own <html>.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

export const fontVariables = `${inter.variable} ${jakarta.variable}`
