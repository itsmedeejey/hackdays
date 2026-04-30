"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

const MAX_FILES = 5;
const MAX_SIZE_MB = 5;

export default function UploadImageCard({
  onAction,
}: {
  onAction: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const validateFiles = (files: File[]) => {
    if (files.length > MAX_FILES) {
      alert(`Max ${MAX_FILES} images allowed`);
      return false;
    }

    const oversized = files.find(
      (file) => file.size > MAX_SIZE_MB * 1024 * 1024
    );

    if (oversized) {
      alert(`Each image must be under ${MAX_SIZE_MB}MB`);
      return false;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    if (!validateFiles(files)) return;

    onAction(files);
  };

  //  Drag Events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);

    if (!validateFiles(files)) return;

    onAction(files);
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition
          ${isDragging ? "border-black bg-gray-100" : "border-gray-300"}`}
      >
        <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />

        <p className="text-sm text-gray-600">
          Click or drag & drop images
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Up to {MAX_FILES} images • Max {MAX_SIZE_MB}MB each
        </p>
      </div>
    </div>
  );
}
