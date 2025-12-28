export const WIN_CODE = "010320";

export const TEAM_IDS = ["jihaad", "adal", "yakeen", "sabar"] as const;
export type TeamId = (typeof TEAM_IDS)[number];

export type TeamState = {
  attemptsLeft: number;
  submissions: number;
  completed: boolean;
  time_taken: number | null;
  last_time_taken: number | null;
};

const INITIAL_ATTEMPTS = 1;

const createInitialTeams = (): Record<TeamId, TeamState> => ({
  jihaad: {
    attemptsLeft: INITIAL_ATTEMPTS,
    submissions: 0,
    completed: false,
    time_taken: null,
    last_time_taken: null,
  },
  adal: {
    attemptsLeft: INITIAL_ATTEMPTS,
    submissions: 0,
    completed: false,
    time_taken: null,
    last_time_taken: null,
  },
  yakeen: {
    attemptsLeft: INITIAL_ATTEMPTS,
    submissions: 0,
    completed: false,
    time_taken: null,
    last_time_taken: null,
  },
  sabar: {
    attemptsLeft: INITIAL_ATTEMPTS,
    submissions: 0,
    completed: false,
    time_taken: null,
    last_time_taken: null,
  },
});

const GLOBAL_KEY = "__TREASURE_HUNT_TEAMS__";
const WINNING_TEAM_KEY = "__TREASURE_HUNT_WINNER__";

const globalStore = globalThis as unknown as {
  [GLOBAL_KEY]?: Record<TeamId, TeamState>;
  [WINNING_TEAM_KEY]?: TeamId | null;
};

const getWinningTeam = (): TeamId | null => {
  if (!(WINNING_TEAM_KEY in globalStore)) {
    globalStore[WINNING_TEAM_KEY] = null;
  }
  return globalStore[WINNING_TEAM_KEY] ?? null;
};

const setWinningTeam = (teamId: TeamId | null) => {
  globalStore[WINNING_TEAM_KEY] = teamId;
};

const getTeamsRef = (): Record<TeamId, TeamState> => {
  if (!globalStore[GLOBAL_KEY]) {
    globalStore[GLOBAL_KEY] = createInitialTeams();
  }
  return globalStore[GLOBAL_KEY];
};

export const isValidTeamId = (value: unknown): value is TeamId => {
  return typeof value === "string" && (TEAM_IDS as readonly string[]).includes(value);
};

export const getTeamsSnapshot = () => {
  const teams = getTeamsRef();
  return TEAM_IDS.map((id) => ({
    id,
    teamName: TEAM_NAMES[id] || id,
    ...teams[id],
  }));
};

export const getTeamSnapshot = (teamId: TeamId) => {
  const teams = getTeamsRef();
  return { 
    id: teamId, 
    teamName: TEAM_NAMES[teamId] || teamId,
    ...teams[teamId] 
  };
};

export const resetAllTeams = () => {
  globalStore[GLOBAL_KEY] = createInitialTeams();
  setWinningTeam(null);
};

export const incrementTeamAttempts = (teamId: TeamId, amount = 1) => {
  const teams = getTeamsRef();
  const safeAmount = Number.isFinite(amount) ? Math.floor(amount) : 1;
  const delta = safeAmount <= 0 ? 1 : safeAmount;
  teams[teamId].attemptsLeft += delta;
};

const TEAM_NAMES: Record<TeamId, string> = {
  jihaad: "Jihaad",
  adal: "Adal",
  yakeen: "Yakeen",
  sabar: "Sabar"
};

export function submitTeamCode(teamId: TeamId, code: string, timeTaken: number) {
  const teams = getTeamsRef();
  const team = teams[teamId];
  const winner = getWinningTeam();

  // If someone already won (including if it's a different team), prevent any further wins
  if (winner) {
    if (winner === teamId) {
      // This team already won, return success
      return { 
        success: true, 
        attemptsLeft: 0, 
        alreadyWon: true,
        winningTeam: TEAM_NAMES[teamId] || teamId
      };
    } else {
      // Another team already won, block this submission
      return { 
        success: false, 
        alreadyWon: true, 
        winningTeam: TEAM_NAMES[winner] || winner,
        attemptsLeft: team.attemptsLeft 
      };
    }
  }

  if (team.completed) {
    return { 
      success: true, 
      attemptsLeft: 0, 
      alreadyWon: true,
      winningTeam: TEAM_NAMES[teamId] || teamId
    };
  }

  if (team.attemptsLeft <= 0) {
    return { 
      success: false, 
      attemptsLeft: 0,
      winningTeam: undefined
    };
  }

  const cleanCode = String(code).trim();

  team.attemptsLeft -= 1;
  team.submissions += 1;
  team.last_time_taken = timeTaken;

  // Check if code is correct - we already verified there's no winner at the start
  if (cleanCode === WIN_CODE) {
    // Final check to ensure no winner was set (shouldn't happen, but safety check)
    const currentWinner = getWinningTeam();
    if (!currentWinner) {
      team.completed = true;
      team.time_taken = team.time_taken ?? timeTaken;
      team.last_time_taken = timeTaken;
      setWinningTeam(teamId);
      return { 
        success: true, 
        attemptsLeft: 0, 
        alreadyWon: false,
        winningTeam: TEAM_NAMES[teamId] || teamId
      };
    } else {
      // Someone else won (shouldn't happen, but handle it)
      return {
        success: false,
        alreadyWon: true,
        winningTeam: TEAM_NAMES[currentWinner] || currentWinner,
        attemptsLeft: team.attemptsLeft
      };
    }
  }
  
  return { 
    success: false, 
    attemptsLeft: team.attemptsLeft,
    winningTeam: undefined
  };
};
