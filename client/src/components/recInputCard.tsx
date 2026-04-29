"use client";

import { useState } from "react";
import TagInputCard from "./tagInputCard";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import api from "@/config/axios";
import { useRouter } from "next/navigation";


export default function RecInputCard() {
  const [tags, setTags] = useState<string[]>([]);
  const [stateName, setStateName] = useState("");

  const [budget, setBudget] = useState<number | "">("");

  const router = useRouter()
  const setRecommendation = useRecommendationStore(
    (state) => state.setRecommendation
  );
  const setResult = useRecommendationStore(state => state.setResult)

  const handleSubmit = async () => {
    const payload = {
      tags,
      state: stateName,
      budget,
    };

    setRecommendation(payload);

    console.log("Stored in Zustand:", payload);

    try {
      const res = await api.post("api/recommend", payload)
      setResult(res.data.data)
      console.log(res)
    } catch (err) {
      console.log(err)
    }

    router.push("/recommendation");
  };

  return (
    <div className="max-w-xl w-xl mx-auto p-5 border rounded-xl shadow-sm bg-white flex flex-col gap-6">

      <h2 className="text-lg font-semibold text-gray-700 text-center">
        Get Recommendations
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Select Interests
        </label>
        <TagInputCard selected={tags} setSelected={setTags} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Enter the name of the State you want recommendation from
        </label>
        <input
          type="text"
          value={stateName}
          placeholder="Enter the State Name eg. (Assam)"
          onChange={(e) => setStateName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Budget
        </label>
        <input
          type="number"
          placeholder="enter your budget"
          value={budget}
          onChange={(e) =>
            setBudget(e.target.value ? Number(e.target.value) : "")
          }
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white py-2 rounded-lg cursor-pointer"
      >
        Get Recommendations
      </button>
    </div>
  );
}
