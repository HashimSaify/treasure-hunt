"use client";

import { useEffect, useState } from "react";

const TEAM_NAMES: Record<string, string> = {
  jihaad: "Jihaad",
  adal: "Adal",
  yakeen: "Yakeen",
  sabar: "Sabar"
};

type TeamRow = {
  id: string;
  attemptsLeft: number;
  submissions: number;
  completed: boolean;
  time_taken: number | null;
  last_time_taken: number | null;
  teamName?: string;
};

export default function Admin() {
  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin", { cache: "no-store" });
      const data = await res.json();
      const teamsData = Array.isArray(data?.teams) ? data.teams : [];
      
      // Add team names to the team data
      const teamsWithNames = teamsData.map((team: TeamRow) => ({
        ...team,
        teamName: TEAM_NAMES[team.id] || team.id
      }));
      
      setTeams(teamsWithNames);
    } catch {
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const capitalize = (s: string) =>
    s ? `${s.charAt(0).toUpperCase()}${s.slice(1)}` : s;

  const incrementAttempts = async (teamId: string) => {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "increment", teamId, amount: 1 }),
    });
    await load();
  };

  const resetAll = async () => {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    });
    await load();
  };

  return (
    <main className="min-h-screen bg-gray-100 text-black p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <header className="flex items-center justify-end gap-4">
          <div className="flex gap-3">
            <button
              onClick={load}
              className="px-4 py-2 rounded bg-white border font-semibold"
            >
              Refresh
            </button>
            <button
              onClick={resetAll}
              className="px-4 py-2 rounded bg-red-600 text-white font-semibold"
            >
              Reset All
            </button>
          </div>
        </header>

        {loading && <p className="text-lg text-black">Loading…</p>}
        {error && <p className="text-lg text-red-600 font-semibold">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto bg-white rounded-lg border text-black">
            <table className="w-full text-left text-black">
              <thead className="bg-gray-50 border-b text-black">
                <tr>
                  <th className="p-4 text-black">Team</th>
                  <th className="p-4 text-black">Won</th>
                  <th className="p-4 text-black">Attempts Left</th>
                  <th className="p-4 text-black">Actions</th>
                  <th className="p-4 text-black">Attempts Used</th>
                  <th className="p-4 text-black">Time (s)</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((t) => (
                  <tr key={t.id} className="border-b last:border-b-0">
                    <td className="p-4 font-semibold">{t.teamName || capitalize(t.id)}</td>
                    <td className="p-4">
                      {t.completed ? (
                        <span className="font-bold text-green-700">Yes</span>
                      ) : (
                        <span className="font-bold text-gray-700">No</span>
                      )}
                    </td>
                    <td className="p-4">{t.attemptsLeft}</td>
                    <td className="p-4">
                      <button
                        onClick={() => incrementAttempts(t.id)}
                        className="px-3 py-2 rounded bg-blue-600 text-white font-semibold"
                      >
                        +1 Attempt
                      </button>
                    </td>
                    <td className="p-4">{t.submissions}</td>
                    <td className="p-4">{t.last_time_taken ?? t.time_taken ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
