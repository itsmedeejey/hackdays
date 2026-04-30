"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/config/axios";
import { setTimeout } from "timers";
import { SendHorizontal } from 'lucide-react';

type Message = {
  id: number;
  text: string;
  role: "user" | "bot";
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [Isshowing, setIshowing] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/api/chat", {
        message: input
      });

      const data = res.data;

      const botMessage: Message = {
        id: Date.now() + 1,
        text: data.reply || "No response",
        role: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "Error occurred", role: "bot" },
      ]);
      console.log(err)
    } finally {
      setLoading(false);
    }
  };


  setTimeout(() => {
    setIshowing(false)
  }, 10000)


  //TODO:   add condition rendering on the talk to bohagi lable in timer
  return (
    <>

      {Isshowing ? (
        <div className="bg-white  fixed bottom-27 right-20 cursor-pointer z-50 p-2 w-fit rounded-l-full rounded-tr-full">
          talk to Bohagi
        </div>
      ) : (

        <div>
        </div>
      )}
      {/**/}
      {/* <img src="/japi.png" alt="bohagi" className=" fixed bottom-10 right-10  w-20 cursor-pointer z-50 " */}
      {/*   onClick={() => setIsOpen(true)} /> */}
      {/**/}
      <img src="/img/bohagi.jpg" alt="bohagi" className=" rounded-full fixed bottom-10 right-13  w-15 cursor-pointer z-50 "
        onClick={() => setIsOpen(true)} />


      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-10 right-13 w-90 h-[550px] bg-white shadow-xl rounded-2xl flex flex-col overflow-hidden z-50">

          {/* Header */}
          <div className=" text-white p-3 flex justify-between items-center bg-radial-[at_50%_99%] from-emerald-100 via-emerald-500 to-emerald-600 to-90%  ">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-white flex items-center justify-center ">
                <img
                  src="/img/bohagi.jpg"
                  alt="B"
                  className="h-full w-full object-cover "
                />
              </div>
              <div className="font-semibold text-sm">Bohagi</div>
            </div>            <button className="cursor-pointer" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-lg text-sm max-w-[75%] ${msg.role === "user"
                  ? "bg-black text-white ml-auto"
                  : "bg-gray-100 text-black"
                  }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="text-xs text-gray-500">Bohagi is typing...</div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-2 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask Bohagi..."
              className="flex-1 border rounded-full px-2 py-1 w-full text-sm"
            />
            <button
              onClick={sendMessage}
              className="text-white  rounded-lg cursor-pointer"
              disabled={loading}
            >

              <SendHorizontal color="blue" size={30} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
