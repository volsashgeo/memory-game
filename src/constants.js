export const TOTAL_PAIRS = 8;
export const TOTAL_CARDS = TOTAL_PAIRS * 2;
export const MISMATCH_DELAY = 1000;

export const STORAGE_KEY = "memory_game_leaderboard";
export const LEADERBOARD_LIMIT = 10;

const SRC_DIR = new URL("./", import.meta.url);
export const ASSETS_DIR = new URL("../assets/", SRC_DIR);
export const CARDS_DIR = new URL("cards/", ASSETS_DIR);

export function assetUrl(fileName) {
  return new URL(fileName, CARDS_DIR).href;
}
