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
  const [code, setCode] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [result, setResult] = useState<"win" | "lose" | null>(null);

  const headerColor = TEAM_COLORS[id as string] || "bg-black";

  const startGame = () => {
    setStarted(true);
    setStartTime(Date.now());
    setCode([]);
  };

  const pressNumber = (num: string) => {
    if (code.length >= 6) return;
    setCode([...code, num]);
  };

  const clearCode = () => {
    setCode([]);
  };

  const submitCode = async () => {
    if (code.length !== 6 || !startTime) return;

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    const res = await fetch("/api/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId: id,
        code: code.join(""),
        timeTaken,
      }),
    });

    const data = await res.json();
    setResult(data.success ? "win" : "lose");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header
        className={`h-20 flex items-center justify-center text-white text-3xl font-bold ${headerColor}`}
      >
        {id} Team
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8 bg-white px-4">
        {/* START BUTTON */}
        {!started && (
          <button
            onClick={startGame}
            className="px-12 py-5 text-2xl bg-black text-white rounded-lg"
          >
            ▶ START GAME
          </button>
        )}

        {/* GAME UI */}
        {started && (
          <>
            {/* CODE DISPLAY */}
            <div className="flex gap-3 text-3xl font-extrabold text-black">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-14 sm:w-14 sm:h-16
                             border-2 border-black
                             flex items-center justify-center
                             bg-white rounded"
                >
                  {code[i] ?? ""}
                </div>
              ))}
            </div>

            {/* NUMBER PAD */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  onClick={() => pressNumber(String(n))}
                  className="w-20 h-16 sm:w-24 sm:h-20
                             text-3xl font-extrabold
                             bg-gray-300 text-black
                             rounded-xl shadow-md active:scale-95"
                >
                  {n}
                </button>
              ))}

              <button
                onClick={clearCode}
                className="w-20 h-16 sm:w-24 sm:h-20
                           text-xl font-bold
                           bg-red-600 text-white
                           rounded-xl shadow-md active:scale-95"
              >
                Clear
              </button>

              <button
                onClick={() => pressNumber("0")}
                className="w-20 h-16 sm:w-24 sm:h-20
                           text-3xl font-extrabold
                           bg-gray-300 text-black
                           rounded-xl shadow-md active:scale-95"
              >
                0
              </button>

              <button
                onClick={submitCode}
                className="w-20 h-16 sm:w-24 sm:h-20
                           text-xl font-bold
                           bg-green-600 text-white
                           rounded-xl shadow-md active:scale-95"
              >
                OK
              </button>
            </div>
          </>
        )}
      </main>

      {/* RESULT POPUP */}
      {result && (
        <div
          className={`fixed inset-0 z-50
            flex flex-col items-center justify-center
            text-center px-6 text-white
            ${result === "win" ? "bg-green-600" : "bg-red-600"}`}
          onClick={() => setResult(null)}
        >
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
            {result === "win"
              ? "🎉 CONGRATULATIONS 🎉"
              : "❌ WRONG CODE ❌"}
          </h1>

          <p className="text-lg sm:text-2xl opacity-90">
            Tap anywhere to continue
          </p>
        </div>
      )}
    </div>
  );
}
