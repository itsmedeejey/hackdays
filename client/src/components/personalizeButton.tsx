import Link from "next/link";

export default function Personalize() {

  return (
    <div>

      <Link href="/recommendation" className="block  text-white w-fit p-3 rounded-full text-center items-center justify-center  cursor-pointer  bg-radial-[at_50%_99%] from-emerald-100 via-emerald-500 to-emerald-600 to-90% hover:bg-radial-[at_70%_99%] duration-300 ease-in-out   hover:scale-[1.05] ">

        Get Personalized recommendations
      </Link>


    </div>

  )
}
