import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "AUDMissions Admin Console",
  description: "Secure media management for Africa United for Discipleship and Missions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
