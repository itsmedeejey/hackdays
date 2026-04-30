// app/(main)/layout.tsx
"use client"

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
      <Chatbot></Chatbot>
      {children}
    </div>
  );
}

