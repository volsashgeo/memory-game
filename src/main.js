import { TOTAL_PAIRS } from "./constants.js";
import { createElement, formatDate } from "./dom.js";
import { buildApp } from "./ui.js";
import { createGame } from "./game.js";
import { loadLeaderboard, addLeaderboardEntry } from "./storage.js";

const ui = buildApp();

function updateStats({ moves, foundPairs }) {
  ui.movesValue.textContent = String(moves);
  ui.pairsValue.textContent = `${foundPairs} из ${TOTAL_PAIRS}`;
}

function showWinModal(moves) {
  ui.winText.textContent = "";
  const strong = createElement("strong", { textContent: String(moves) });
  ui.winText.append(
    document.createTextNode("Вы нашли все пары за "),
    strong,
    document.createTextNode(moves === 1 ? " ход." : " ходов."),
  );
  ui.winModal.open();
}

const game = createGame({
  board: ui.gameBoard,
  onStatsChange: updateStats,
  onWin: (moves) => {
    addLeaderboardEntry(moves);
    showWinModal(moves);
  },
});

function renderLeaderboard() {
  ui.lbBody.textContent = "";
  const entries = loadLeaderboard();

  if (entries.length === 0) {
    ui.lbBody.appendChild(
      createElement("p", {
        className: "empty-message",
        textContent: "Пока нет результатов",
      }),
    );
    return;
  }

  const table = createElement("table", { className: "leaderboard-table" });
  const thead = createElement("thead");
  const headTr = createElement("tr");
  for (const label of ["Место", "Ходы", "Дата"]) {
    headTr.appendChild(createElement("th", { textContent: label }));
  }
  thead.appendChild(headTr);

  const tbody = createElement("tbody");
  entries.forEach((entry, index) => {
    const row = createElement("tr");
    row.appendChild(createElement("td", { textContent: String(index + 1) }));
    row.appendChild(createElement("td", { textContent: String(entry.moves) }));
    row.appendChild(
      createElement("td", {
        textContent: formatDate(new Date(entry.timestamp)),
      }),
    );
    tbody.appendChild(row);
  });

  table.append(thead, tbody);
  ui.lbBody.appendChild(table);
}

function openLeaderboard() {
  renderLeaderboard();
  ui.lbModal.open();
}

function startNewGame() {
  if (ui.winModal.isOpen) ui.winModal.close();
  if (ui.lbModal.isOpen) ui.lbModal.close();

  game.startNewGame();
}

ui.newGameBtnHeader.addEventListener("click", () => game.startNewGame());
ui.winNewGameBtn.addEventListener("click", startNewGame);
ui.winCloseBtn.addEventListener("click", () => ui.winModal.close());
ui.leaderboardBtn.addEventListener("click", openLeaderboard);
ui.lbCloseBtn.addEventListener("click", () => ui.lbModal.close());

startNewGame();
