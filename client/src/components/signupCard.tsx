import api from "@/config/axios";
import { useState } from "react";

import { useRouter } from "next/navigation"
import axios from "axios";

export default function SignUpCard() {

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const router = useRouter();

  const handleSignUp = async () => {
    try {

      setLoading(true)
      await api.post("api/auth/signup", {
        name: name,
        password: password,
        email: email
      })
      router.push("/")
    }
    catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.log(err)
        setError(err.response?.data?.message || "signup failed")
      } else {
        setError("Something went wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSignUp()
    }}
      className="kw-full max-w-xl bg-white p-8 rounded-2xl shadow-md border border-gray-200 flex flex-col gap-5"
    >
      <h1 className="text-gray-800 font-semibold text-2xl text-center">
        Enter your Details
      </h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Your Name"
        className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />


      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter Your Email"
        className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <input
        type="password"
        placeholder="Enter Your Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <button
        type="submit"
        className="cursor-pointer w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition text-white font-medium disabled:opacity-50"
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>

      <div className="text-center">
        Already have an acount? <a className="underline text-blue-500" href="/login">login up</a>

      </div>
    </form>
  );
}
