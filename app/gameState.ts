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

const globalStore = globalThis as unknown as {
  [GLOBAL_KEY]?: Record<TeamId, TeamState>;
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
    ...teams[id],
  }));
};

export const getTeamSnapshot = (teamId: TeamId) => {
  const teams = getTeamsRef();
  return { id: teamId, ...teams[teamId] };
};

export const resetAllTeams = () => {
  globalStore[GLOBAL_KEY] = createInitialTeams();
};

export const incrementTeamAttempts = (teamId: TeamId, amount = 1) => {
  const teams = getTeamsRef();
  const safeAmount = Number.isFinite(amount) ? Math.floor(amount) : 1;
  const delta = safeAmount <= 0 ? 1 : safeAmount;
  teams[teamId].attemptsLeft += delta;
};

export const submitTeamCode = (teamId: TeamId, code: string, timeTaken: number) => {
  const teams = getTeamsRef();
  const team = teams[teamId];

  if (team.completed) {
    return { success: true, attemptsLeft: team.attemptsLeft, alreadyWon: true };
  }

  if (team.attemptsLeft <= 0) {
    return { success: false, attemptsLeft: 0 };
  }

  const cleanCode = String(code).trim();
  const isWin = cleanCode === WIN_CODE;

  team.attemptsLeft -= 1;
  team.submissions += 1;
  team.last_time_taken = timeTaken;

  if (isWin) {
    team.completed = true;
    team.time_taken = timeTaken;
  }

  return { success: isWin, attemptsLeft: team.attemptsLeft };
};
