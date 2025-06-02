import { Poppins } from "next/font/google";
import "./globals.css";
import PushNotificationsClient from "./PushNotificationClient";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Vitality",
  description: "Find Peace - Get Support - Thrive",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <PushNotificationsClient />
        {children}
      </body>
    </html>
  );
}
