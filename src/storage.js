import { STORAGE_KEY, LEADERBOARD_LIMIT } from './constants.js';

export function loadLeaderboard() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.warn('Не удалось прочитать таблицу лидеров:', err);
        return [];
    }
}

export function saveLeaderboard(entries) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (err) {
        console.warn('Не удалось сохранить таблицу лидеров:', err);
    }
}

export function addLeaderboardEntry(moves) {
    const entries = loadLeaderboard();
    entries.push({ moves, timestamp: Date.now() });
    entries.sort((a, b) => a.moves - b.moves || a.timestamp - b.timestamp);
    const top = entries.slice(0, LEADERBOARD_LIMIT);
    saveLeaderboard(top);
    return top;
}