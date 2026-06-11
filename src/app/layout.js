import AuthProvider from "@/components/providers/session-provider";
import "./globals.css";
import Navbar from "@/components/navbar";
import { EB_Garamond, DM_Sans } from "next/font/google"
const garamond = EB_Garamond({ subsets: ["latin"], weight: ["400"] })
const dmSans = DM_Sans({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}