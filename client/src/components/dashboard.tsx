"use client";

import { useState } from "react";
import UploadImageCard from "./uploadImageCard";
import Image from "next/image";
import api from "@/config/axios";

export default function DashBoard() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    postType: "PLACE",

    state: "",
    locationName: "",
    latitude: "",
    longitude: "",

    types: "",
    activities: "",

    startTime: "",
    endTime: "",

    price: "",
    budgetMin: "",
    budgetMax: "",
    contactInfo: "",
  })

  const [images, setImages] = useState<File[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type: "PLACE" | "EVENT" | "SERVICE") => {
    setForm((prev) => ({ ...prev, postType: type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.title || !form.description || !form.locationName || !form.state) {
      alert("Please fill all required fields");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("postType", form.postType);
    formData.append("state", form.state);

    formData.append(
      "location",
      JSON.stringify({
        name: form.locationName,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      })
    );

    if (form.postType === "PLACE") {
      formData.append(
        "metadata",
        JSON.stringify({
          types: form.types
            ? form.types.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
          activities: form.activities
            ? form.activities.split(",").map((a) => a.trim()).filter(Boolean)
            : [],
        })
      );
    }

    if (form.postType === "EVENT") {

      if (!form.startTime || !form.endTime) {
        alert("Please select start and end date");
        return;
      }

      if (form.endTime <= form.startTime) {
        alert("End date must be after start date");
        return;
      }
      formData.append(
        "event",
        JSON.stringify({
          startTime: form.startTime,
          endTime: form.endTime,
          budgetMin: form.budgetMin ? Number(form.budgetMin) : null,
          budgetMax: form.budgetMax ? Number(form.budgetMax) : null,
        })
      );
      formData.append(
        "metadata",
        JSON.stringify({
          types: form.types
            ? form.types.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
          activities: form.activities
            ? form.activities.split(",").map((a) => a.trim()).filter(Boolean)
            : [],
        })
      );
    }

    if (form.postType === "SERVICE") {
      formData.append(
        "service",
        JSON.stringify({
          price: form.price ? Number(form.price) : null,
          budgetMin: form.budgetMin ? Number(form.budgetMin) : null,
          budgetMax: form.budgetMax ? Number(form.budgetMax) : null,
          contactInfo: form.contactInfo || null,
        })
      );
    }

    images.forEach((file) => {
      formData.append("Images", file); // ✔ matches your backend
    });

    //debugingg
    console.log("Submitting:");
    for (const [k, v] of formData.entries()) {
      console.log(k, v);
    }

    try {
      setIsLoading(true)
      const res = await api.post("api/post/create", formData);
      console.log(res.data);

      // Reset form
      setForm({
        title: "",
        description: "",
        postType: "PLACE",
        state: "",
        locationName: "",
        latitude: "",
        longitude: "",
        types: "",
        activities: "",
        startTime: "",
        endTime: "",
        price: "",
        budgetMin: "",
        budgetMax: "",
        contactInfo: "",
      });

      setImages([]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">CONTRIBUTE</h2>

        {/* TYPE */}
        <div className="flex gap-5 justify-center">
          {["PLACE", "EVENT", "SERVICE"].map((type) => (
            <div
              key={type}
              onClick={() =>
                handleTypeChange(type as "PLACE" | "EVENT" | "SERVICE")
              }
              className={`cursor-pointer p-2 rounded-lg border ${form.postType === type
                ? "bg-green-300"
                : "hover:bg-green-200"
                }`}
            >
              {type}
            </div>
          ))}
        </div>

        {/* BASE */}
        <input
          name="title"
          value={form.title}
          placeholder="Title"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          value={form.description}
          placeholder="Description"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="locationName"
          value={form.locationName}
          placeholder="Place Name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="state"
          value={form.state}
          placeholder="State"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* PLACE */}
        {form.postType === "PLACE" && (
          <>
            <input
              name="types"
              value={form.types}
              placeholder="Eco, cultural..."
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="activities"
              value={form.activities}
              placeholder="Trekking, rafting..."
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </>
        )}

        {/* EVENT */}
        {form.postType === "EVENT" && (
          <>
            <input
              name="types"
              value={form.types}
              placeholder="Eco, cultural..."
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="activities"
              value={form.activities}
              placeholder="Trekking, rafting..."
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="budgetMin"
              value={form.budgetMin}
              placeholder="Min Budget"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="budgetMax"
              value={form.budgetMax}
              placeholder="Max Budget"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <h1>Starting date:</h1>
            <input
              type="date"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <h1>Ending date:</h1>
            <input
              type="date"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </>
        )}

        {/* SERVICE */}
        {form.postType === "SERVICE" && (
          <>
            <input
              name="price"
              value={form.price}
              placeholder="Fixed Price"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="budgetMin"
              value={form.budgetMin}
              placeholder="Min Budget"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="budgetMax"
              value={form.budgetMax}
              placeholder="Max Budget"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              name="contactInfo"
              placeholder="Contact (phone / email / link)"
              value={form.contactInfo}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </>
        )}

        {/* IMAGE */}
        <UploadImageCard onAction={(files) => setImages(files)} />

        {/* PREVIEW */}
        <div className="grid grid-cols-3 gap-2">
          {images.map((file, i) => (
            <Image
              key={i}
              src={URL.createObjectURL(file)}
              alt="preview"
              width={100}
              height={100}
              className="h-24 w-full object-cover rounded-lg"
            />
          ))}
        </div>

        {isLoading ?
          (
            <button className="bg-black text-white px-4 py-2 rounded w-full cursor-pointer">

              Uploading...please wait
            </button>
          ) : (
            <button className="bg-black text-white px-4 py-2 rounded w-full cursor-pointer">

              Upload
            </button>
          )
        }
      </form>
    </div >
  );
}
