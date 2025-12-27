const WIN_CODE = "010320";

// 🔒 Hard-coded server memory (NO DATABASE)
const teams: Record<
  string,
  { attempts: number; completed: boolean; time_taken: number | null }
> = {
  jihaad: { attempts: 5, completed: false, time_taken: null },
  adal: { attempts: 5, completed: false, time_taken: null },
  yakeen: { attempts: 5, completed: false, time_taken: null },
  sabar: { attempts: 5, completed: false, time_taken: null },
};

export async function POST(req: Request) {
  const { teamId, code, timeTaken } = await req.json();

  const team = teams[teamId];

  // ❌ Invalid team or no attempts left
  if (!team || team.attempts <= 0) {
    return Response.json({ success: false, attemptsLeft: 0 });
  }

  const cleanCode = String(code).trim();
  const isWin = cleanCode === WIN_CODE;

  // 🔽 Reduce attempt on EVERY submission
  team.attempts -= 1;

  if (isWin) {
    team.completed = true;
    team.time_taken = timeTaken;
  }

  return Response.json({
    success: isWin,
    attemptsLeft: team.attempts,
  });
}
