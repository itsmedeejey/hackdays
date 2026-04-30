"use client";

import { useState } from "react";

type Props = {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
};

const TAGS = [
  "activities", "adventure", "ancient", "animal", "community",
  "cultural", "destination", "eco", "exploration", "green",
  "heritage", "historical", "history", "indigenous", "local",
  "monuments", "nature", "outdoor", "reserve", "sanctuary",
  "spotting", "sustainable", "tourism", "traditions", "travel",
  "wildlife"
];


export default function TagInputCard({ selected, setSelected }: Props) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = TAGS.filter(
    (tag) =>
      tag.toLowerCase().includes(input.toLowerCase()) &&
      !selected.includes(tag)
  );

  const addTag = (tag: string) => {
    setSelected((prev) => [...prev, tag]);
    setInput("");
    setOpen(false);
  };

  const removeTag = (tag: string) => {
    setSelected((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div className="w-full  relative">

      <div
        className="flex flex-wrap  items-center gap-2 border-2 border-blue-400 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-300"
        onClick={() => setOpen(true)}
      >
        {selected.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-md"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        ))}

        {/* Input */}
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="flex-1 outline-none min-w-30"
          placeholder="Search tags..."
        />
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-10 w-full border rounded-md mt-1 max-h-60 overflow-y-auto shadow bg-white">
          {filtered.map((tag) => (
            <div
              key={tag}
              onClick={() => addTag(tag)}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer capitalize"
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
