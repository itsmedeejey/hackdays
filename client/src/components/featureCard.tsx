"use client";

import { Bot, Sparkles, MessageCircle } from "lucide-react";

export default function AiFeatureCard() {
  return (
    <div className="w-full flex justify-center px-4 mt-6">
      <div className="w-full max-w-5xl rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">

        {/* LEFT */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 text-white/90">
            <Bot size={18} />
            <span className="text-sm font-medium">AI Assistant</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold leading-snug">
            Talk. Discover. Get personalized instantly.
          </h2>

          <p className="mt-3 text-sm md:text-base text-white/90 max-w-lg">
            Use our AI chatbot to explore places, events, and services through
            conversation. Get recommendations tailored to your preferences,
            mood, and travel style — instantly.
          </p>

          <div className="flex gap-3 mt-6">
            <button className="px-5 py-2 rounded-xl bg-white text-green-700 text-sm font-medium hover:bg-gray-100 transition">
              Try AI Chat
            </button>
            <button className="px-5 py-2 rounded-xl border border-white/40 text-white text-sm font-medium hover:bg-white/10 transition">
              Get Personalized Picks
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <Feature
            icon={<MessageCircle size={18} />}
            title="Chat Naturally"
            desc="Ask like a human, get smart answers"
          />
          <Feature
            icon={<Sparkles size={18} />}
            title="Smart Recommendations"
            desc="Based on your interests & behavior"
          />
          <Feature
            icon={<Bot size={18} />}
            title="AI Powered"
            desc="Fast, contextual & evolving"
          />
          <Feature
            icon={<Sparkles size={18} />}
            title="Real-time Discovery"
            desc="Find things instantly"
          />
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 border border-white/20">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="text-xs text-white/80">{desc}</p>
    </div>
  );
}
