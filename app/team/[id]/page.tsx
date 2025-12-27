"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const TEAM_COLORS: Record<string, string> = {
  jihaad: "bg-red-600",
  adal: "bg-blue-600",
  yakeen: "bg-green-600",
  sabar: "bg-yellow-400",
};

export default function TeamPage() {
  const { id } = useParams();

  const teamId = Array.isArray(id) ? id[0] : String(id ?? "");

  const [started, setStarted] = useState(false);
  const [code, setCode] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [alreadyWonPopup, setAlreadyWonPopup] = useState(false);
  const [alreadyWon, setAlreadyWon] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(1);

  const headerColor = TEAM_COLORS[teamId] || "bg-black";
  const startButtonTextColor = teamId === "sabar" ? "text-black" : "text-white";
  const keypadDisabled = attemptsLeft === 0 || alreadyWon || result === "win";

  const teamName = teamId;
  const teamLabel = teamName
    ? `${teamName.charAt(0).toUpperCase()}${teamName.slice(1)}`
    : "Team";

  const refreshTeam = async () => {
    if (!teamId) return;
    const res = await fetch(`/api/team/${teamId}`, { cache: "no-store" });
    const data = await res.json();
    if (!data?.ok) return;

    const t = data.team;
    if (typeof t?.attemptsLeft === "number") {
      setAttemptsLeft(t.attemptsLeft);
    }

    setAlreadyWon(Boolean(t?.completed));
  };

  useEffect(() => {
    void refreshTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

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
        teamId,
        code: code.join(""),
        timeTaken,
      }),
    });

    const data = await res.json();

    if (typeof data?.attemptsLeft === "number") {
      setAttemptsLeft(data.attemptsLeft);
    }

    if (data.alreadyWon) {
      setAlreadyWonPopup(true);
      setAlreadyWon(true);
      setResult("win");
      return;
    }

    setResult(data.success ? "win" : "lose");

    if (data.success) {
      setAlreadyWonPopup(false);
      setAlreadyWon(true);
    }

    if (!data.success) {
      setCode([]);
    }
  };

  const closePopup = () => {
    setResult(null);
    setAlreadyWonPopup(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header
        className={`h-20 flex items-center justify-center text-white text-3xl font-bold ${headerColor}`}
      >
        {teamLabel} Team
      </header>

      {/* MAIN */}
      <main className="flex-1 flex flex-col items-center justify-center gap-6 bg-white px-4">
        {!started && (
          <button
            onClick={startGame}
            className={`px-12 py-5 text-2xl rounded-lg ${headerColor} ${startButtonTextColor}`}
          >
            ▶ START GAME
          </button>
        )}

        {started && (
          <>
            <button
              onClick={refreshTeam}
              className="px-6 py-2 rounded border bg-white text-black font-semibold"
            >
              Refresh
            </button>

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
            <div className="flex gap-3 text-3xl font-extrabold text-black">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-14 border-2 border-black bg-white flex items-center justify-center text-black"
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
          className={`fixed inset-0 z-50 flex flex-col items-center justify-between text-white text-center px-6 py-10
            ${result === "win" ? "bg-green-600" : "bg-red-600"}`}
        >
          <div />

          <h1 className="text-3xl sm:text-5xl font-extrabold">
            {result === "win"
              ? alreadyWonPopup
                ? "🏆 You have already won the game 🏆"
                : "🎉 Congratulations! You won the game 🎉"
              : "❌ Wrong code ❌"}
          </h1>

          <button
            onClick={closePopup}
            className="w-full max-w-md h-16 text-2xl font-extrabold rounded-xl bg-black/30 border-2 border-white"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
