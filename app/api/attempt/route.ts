const WIN_CODE = "010320";

// 🔒 In-memory data (NO DATABASE)
const teams: Record<
  string,
  { attempts: number; completed: boolean; time_taken: number | null }
> = {
  jihaad: { attempts: 1, completed: false, time_taken: null },
  adal: { attempts: 1, completed: false, time_taken: null },
  yakeen: { attempts: 1, completed: false, time_taken: null },
  sabar: { attempts: 1, completed: false, time_taken: null },
};

export async function POST(req: Request) {
  const { teamId, code, timeTaken } = await req.json();

  const team = teams[teamId];

  if (!team || team.attempts <= 0) {
    return Response.json({ success: false });
  }

  const cleanCode = String(code).trim();
  const isWin = cleanCode === WIN_CODE;

  team.attempts -= 1;
  team.completed = isWin;
  team.time_taken = isWin ? timeTaken : null;

  return Response.json({ success: isWin });
}
