"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

const TEAM_COLORS: Record<string, string> = {
  jihaad: "bg-red-600",
  adal: "bg-blue-600",
  yakeen: "bg-green-600",
  sabar: "bg-yellow-400",
};

export default function TeamPage() {
  const { id } = useParams();

  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const bgColor = TEAM_COLORS[id as string] || "bg-black";

  const startGame = () => {
    setStarted(true);
    setStartTime(Date.now());
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const copy = [...otp];
    copy[index] = value;
    setOtp(copy);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const submit = async () => {
    if (otp.join("").length !== 6 || !startTime) {
      alert("Enter 6-digit code");
      return;
    }

    setSubmitting(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    const res = await fetch("/api/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId: id,
        code: otp.join(""),
        timeTaken,
      }),
    });

    const data = await res.json();
    setSubmitting(false);
    setResult(data.success ? "win" : "lose");
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center gap-8 text-white ${bgColor}`}
    >
      <h1 className="text-4xl font-bold capitalize">
        {id} Team
      </h1>

      {/* START BUTTON */}
      {!started && (
        <button
          onClick={startGame}
          className="px-12 py-5 text-2xl bg-black text-white rounded-lg shadow-lg"
        >
          ▶ START GAME
        </button>
      )}

      {/* OTP BOXES (AFTER START) */}
      {started && (
        <>
          <div className="flex gap-3">
            {otp.map((v, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                value={v}
                maxLength={1}
                inputMode="numeric"
                onChange={(e) => handleChange(e.target.value, i)}
                className="w-12 h-14 text-2xl text-center rounded bg-black text-white border border-white"
              />
            ))}
          </div>

          <button
            onClick={submit}
            disabled={submitting}
            className="px-10 py-4 text-xl bg-white text-black rounded disabled:opacity-50"
          >
            Submit
          </button>
        </>
      )}

      {/* RESULT POPUP */}
      {result && (
        <div
          className={`fixed inset-0 flex flex-col items-center justify-center text-4xl ${
            result === "win" ? "bg-green-700" : "bg-red-700"
          }`}
          onClick={() => setResult(null)}
        >
          {result === "win"
            ? "🎉 CONGRATULATIONS 🎉"
            : "❌ WRONG CODE ❌"}
          <p className="text-lg mt-6">(Tap anywhere)</p>
        </div>
      )}
    </main>
  );
}
