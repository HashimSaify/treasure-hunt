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
  const [alreadyWon, setAlreadyWon] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);

  const headerColor = TEAM_COLORS[id as string] || "bg-black";
  const keypadDisabled = attemptsLeft === 0 || alreadyWon || result === "win";

  const startGame = () => {
    setStarted(true);
    setStartTime(Date.now());
    setCode([]);
  };

  const pressNumber = (num: string) => {
    if (code.length >= 6 || keypadDisabled) return;
    setCode((prev) => [...prev, num]);
  };

  const clearCode = () => {
    if (keypadDisabled) return;
    setCode([]);
  };

  const submitCode = async () => {
    if (code.length !== 6 || !startTime || keypadDisabled) return;

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

    setAttemptsLeft(data.attemptsLeft ?? attemptsLeft);

    if (data.alreadyWon) {
      setAlreadyWon(true);
      setResult("win");
      return;
    }

    setResult(data.success ? "win" : "lose");

    if (!data.success) {
      setCode([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header
        className={`h-20 flex items-center justify-center text-white text-3xl font-bold ${headerColor}`}
      >
        {id} Team
      </header>

      {/* MAIN */}
      <main className="flex-1 flex flex-col items-center justify-center gap-6 bg-white px-4">
        {!started && (
          <button
            onClick={startGame}
            className="px-12 py-5 text-2xl bg-black text-white rounded-lg"
          >
            ▶ START GAME
          </button>
        )}

        {started && (
          <>
            <p className="text-lg font-bold">
              Attempts left: {attemptsLeft}
            </p>

            {alreadyWon && (
              <p className="text-green-600 font-bold text-lg">
                🏆 You have already won the game
              </p>
            )}

            {attemptsLeft === 0 && !alreadyWon && (
              <p className="text-red-600 font-bold text-lg">
                ❌ No attempts left
              </p>
            )}

            {/* CODE DISPLAY */}
            <div className="flex gap-3 text-3xl font-extrabold">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-14 border-2 border-black flex items-center justify-center"
                >
                  {code[i] ?? ""}
                </div>
              ))}
            </div>

            {/* KEYPAD */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  disabled={keypadDisabled}
                  onClick={() => pressNumber(String(n))}
                  className={`w-20 h-16 text-3xl font-bold rounded-xl
                    ${
                      keypadDisabled
                        ? "bg-gray-200 text-gray-400"
                        : "bg-gray-300 text-black"
                    }`}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={clearCode}
                disabled={keypadDisabled}
                className={`w-20 h-16 text-xl font-bold rounded-xl
                  ${
                    keypadDisabled
                      ? "bg-gray-300 text-gray-400"
                      : "bg-red-600 text-white"
                  }`}
              >
                Clear
              </button>

              <button
                onClick={() => pressNumber("0")}
                disabled={keypadDisabled}
                className={`w-20 h-16 text-3xl font-bold rounded-xl
                  ${
                    keypadDisabled
                      ? "bg-gray-200 text-gray-400"
                      : "bg-gray-300 text-black"
                  }`}
              >
                0
              </button>

              <button
                onClick={submitCode}
                disabled={keypadDisabled}
                className={`w-20 h-16 text-xl font-bold rounded-xl
                  ${
                    keypadDisabled
                      ? "bg-gray-300 text-gray-400"
                      : "bg-green-600 text-white"
                  }`}
              >
                OK
              </button>
            </div>
          </>
        )}
      </main>

      {/* POPUP */}
      {result && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center text-white text-center px-6
            ${result === "win" ? "bg-green-600" : "bg-red-600"}`}
          onClick={() => setResult(null)}
        >
          <h1 className="text-3xl sm:text-5xl font-extrabold">
            {alreadyWon
              ? "🏆 You have already won the game 🏆"
              : result === "win"
              ? "🎉 Congratulations! You won the game 🎉"
              : "❌ Wrong code ❌"}
          </h1>
        </div>
      )}
    </div>
  );
}
