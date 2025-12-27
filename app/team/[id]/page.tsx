"use client";
import { useParams } from "next/navigation";

export default function TeamPage() {
  const { id } = useParams();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold capitalize">{id} Team</h1>
      <button className="mt-6 px-10 py-4 text-xl text-white bg-black rounded">
        START
      </button>
    </main>
  );
}
