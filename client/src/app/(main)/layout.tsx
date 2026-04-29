// app/(main)/layout.tsx
"use client"

import NavBar from "@/components/navBar";
import { useAuth } from "@/hooks/useAuth";
import Chatbot from "@/components/chatBot";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  useAuth()

  return (
    <div  >
      <NavBar />
      <Chatbot></Chatbot>

      {children}
    </div>
  );
}

