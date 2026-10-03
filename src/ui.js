import { TOTAL_PAIRS } from "./constants.js";
import { createElement } from "./dom.js";
import { createModal } from "./modal.js";

export function buildApp() {
  const body = document.body;

  const title = createElement("h1", {
    className: "header__title",
    textContent: "Игра «Найди пару»",
  });
  const newGameBtnHeader = createElement("button", {
    className: "btn",
    type: "button",
    textContent: "Новая игра",
  });
  const leaderboardBtn = createElement("button", {
    className: "btn btn--secondary",
    type: "button",
    textContent: "Таблица лидеров",
  });
  const headerButtons = createElement("div", { className: "header__buttons" }, [
    newGameBtnHeader,
    leaderboardBtn,
  ]);
  const header = createElement("header", { className: "header" }, [
    title,
    headerButtons,
  ]);

  const movesValue = createElement("span", { textContent: "0" });
  const pairsValue = createElement("span", {
    textContent: `0 из ${TOTAL_PAIRS}`,
  });
  const stats = createElement("div", { className: "stats" }, [
    createElement("div", { className: "stats__item" }, ["Ходы: ", movesValue]),
    createElement("div", { className: "stats__item" }, [
      "Найдено пар: ",
      pairsValue,
    ]),
  ]);

  const gameBoard = createElement("div", { className: "game-board" });

  const winTitle = createElement("h2", {
    className: "modal__title",
    textContent: "Победа!",
  });
  const winText = createElement("p", { className: "modal__text" });
  const winNewGameBtn = createElement("button", {
    className: "btn",
    type: "button",
    textContent: "Новая игра",
  });
  const winCloseBtn = createElement("button", {
    className: "btn btn--secondary",
    type: "button",
    textContent: "Закрыть",
  });
  const winButtons = createElement("div", { className: "modal__buttons" }, [
    winNewGameBtn,
    winCloseBtn,
  ]);
  const winModal = createModal();
  winModal.content.append(winTitle, winText, winButtons);

  const lbTitle = createElement("h2", {
    className: "modal__title",
    textContent: "Таблица лидеров",
  });
  const lbBody = createElement("div");
  const lbCloseBtn = createElement("button", {
    className: "btn btn--secondary",
    type: "button",
    textContent: "Закрыть",
  });
  const lbButtons = createElement("div", { className: "modal__buttons" }, [
    lbCloseBtn,
  ]);
  const lbModal = createModal();
  lbModal.content.append(lbTitle, lbBody, lbButtons);

  const wrapper = createElement("div", {
    className: "wrapper",
  });

  wrapper.append(header, stats, gameBoard, winModal.overlay, lbModal.overlay);
  body.append(wrapper);

  return {
    gameBoard,
    movesValue,
    pairsValue,
    newGameBtnHeader,
    leaderboardBtn,
    winModal,
    winText,
    winNewGameBtn,
    winCloseBtn,
    lbModal,
    lbBody,
    lbCloseBtn,
  };
}
