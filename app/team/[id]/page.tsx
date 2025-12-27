"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeamPage() {
  const { id } = useParams();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [startTime, setStartTime] = useState<number>(0);
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const copy = [...otp];
    copy[index] = value;
    setOtp(copy);

    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      (next as HTMLInputElement)?.focus();
    }
  };

  const submit = async () => {
  if (otp.join("").length !== 6) {
    alert("Enter 6-digit code");
    return;
  }

  setSubmitting(true);
  const timeTaken = Math.floor((Date.now() - startTime) / 1000);

  try {
    const res = await fetch("/api/attempt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ REQUIRED
      },
      body: JSON.stringify({
        teamId: id,
        code: otp.join(""),
        timeTaken,
      }),
    });

    const data = await res.json();
    setResult(data.success ? "win" : "lose");
  } catch (err) {
    alert("Something went wrong");
  } finally {
    setSubmitting(false); // ✅ ALWAYS RESET
  }
};


  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black text-white">
      <h1 className="text-3xl font-bold capitalize">{id} Team</h1>

      <div className="flex gap-3">
        {otp.map((v, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            value={v}
            maxLength={1}
            inputMode="numeric"
            onChange={(e) => handleChange(e.target.value, i)}
            className="w-12 h-14 text-2xl text-center border border-white bg-black text-white rounded"
          />
        ))}
      </div>

      <button
        onClick={submit}
        disabled={submitting}
        className="px-10 py-3 text-xl bg-white text-black rounded disabled:opacity-50"
      >
        Submit
      </button>

      {/* FULL SCREEN RESULT */}
      {result && (
        <div
          className={`fixed inset-0 flex flex-col items-center justify-center text-4xl ${
            result === "win" ? "bg-green-600" : "bg-red-600"
          }`}
          onClick={() => setResult(null)}
        >
          {result === "win" ? "🎉 CONGRATULATIONS 🎉" : "❌ WRONG CODE ❌"}
          <p className="text-lg mt-6">(Tap anywhere)</p>
        </div>
      )}
    </main>
  );
}
