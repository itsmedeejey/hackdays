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
  const [showForm, setShowForm] = useState(false);

  const router = useRouter();

  const recommendation = useRecommendationStore(
    (state) => state.state
  );
  const result = useRecommendationStore((state) => state.result);
  const setRecommendation = useRecommendationStore(
    (state) => state.setRecommendation
  );
  const setResult = useRecommendationStore((state) => state.setResult);

  const handleSubmit = async () => {
    const payload = {
      tags,
      state: stateName,
      budget,
    };

    setRecommendation(payload);

    try {
      const res = await api.post("api/recommend", payload);
      setResult(res.data.data);
    } catch (err) {
      console.log(err);
    }

    router.push("/recommendation");
  };

  if ((recommendation || result?.length) && !showForm) {
    return (
      <div className="max-w-xl w-xl mx-auto p-5 border rounded-xl shadow-sm bg-white flex flex-col gap-4 text-center">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white py-2 rounded-lg cursor-pointer"
        >
          Get New Recommendation
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl w-xl mx-auto p-5 border rounded-xl shadow-sm bg-white flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-gray-700 text-center">
        Get Recommendations
      </h2>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Select Interests
        </label>
        <TagInputCard selected={tags} setSelected={setTags} />
      </div>

      {/* State */}
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

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Budget
        </label>
        <input
          type="number"
          placeholder="Enter your budget"
          value={budget}
          onChange={(e) =>
            setBudget(e.target.value ? Number(e.target.value) : "")
          }
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white py-2 rounded-lg cursor-pointer"
      >
        Get Recommendations
      </button>

      {/* Optional Cancel (only if data exists) */}
      {(recommendation || result?.length) && (
        <button
          onClick={() => setShowForm(false)}
          className="text-sm text-gray-500"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
