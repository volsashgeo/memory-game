import { TOTAL_PAIRS, MISMATCH_DELAY,ASSETS_DIR } from "./constants.js";
import { createElement, shuffle } from "./dom.js";
import { CARD_IMAGES } from "./cards.js";

export function createGame({ board, onStatsChange, onWin }) {
  const state = {
    firstCard: null,
    secondCard: null,
    lockBoard: false,
    moves: 0,
    foundPairs: 0,
    mismatchTimer: null,
    gameOver: false,
    resultSaved: false,
  };

  function getStats() {
    return { moves: state.moves, foundPairs: state.foundPairs };
  }

  function notify() {
    onStatsChange?.(getStats());
  }

  function buildDeck() {
    const doubled = [];
    for (const image of CARD_IMAGES) doubled.push(image, image);
    return shuffle(doubled);
  }

  function createCardElement(image) {
    const backImg = createElement("img", {
      src: ASSETS_DIR + "/card-back.png",
      alt: "back",
      draggable: "false",
      width: 150,
      height: 150,
    });

    const backFace = createElement(
      "div",
      { className: "card__face card__face--back" },
      [backImg],
    );

    const src = image.src
      ? image.src
      : "data:image/svg+xml;utf8," + encodeURIComponent(image.svg);

    const img = createElement("img", {
      src,
      alt: image.label,
      draggable: "false",
    });
    const frontFace = createElement(
      "div",
      { className: "card__face card__face--front" },
      [img],
    );

    const card = createElement(
      "button",
      {
        className: "card",
        type: "button",
        "aria-label": "Закрытая карточка",
        dataset: { imageId: image.id },
      },
      [backFace, frontFace],
    );

    card.addEventListener("click", () => onCardClick(card));
    return card;
  }

  function getCardLabel(card) {
    const img = card.querySelector("img");
    return img ? img.alt : "";
  }

  function resetSelection() {
    state.firstCard = null;
    state.secondCard = null;
    state.lockBoard = false;
  }

  function clearMismatchTimer() {
    if (state.mismatchTimer !== null) {
      clearTimeout(state.mismatchTimer);
      state.mismatchTimer = null;
    }
  }

  function handleMatch() {
    const first = state.firstCard;
    const second = state.secondCard;
    first.classList.add("is-matched");
    second.classList.add("is-matched");
    first.disabled = true;
    second.disabled = true;

    state.foundPairs += 1;
    notify();
    resetSelection();

    if (state.foundPairs === TOTAL_PAIRS) endGame();
  }

  function handleMismatch() {
    state.lockBoard = true;
    const first = state.firstCard;
    const second = state.secondCard;

    state.mismatchTimer = setTimeout(() => {
      first.classList.remove("is-flipped");
      second.classList.remove("is-flipped");
      first.setAttribute("aria-label", "Закрытая карточка");
      second.setAttribute("aria-label", "Закрытая карточка");
      state.mismatchTimer = null;
      resetSelection();
    }, MISMATCH_DELAY);
  }

  function onCardClick(card) {
    if (state.gameOver || state.lockBoard) return;
    if (
      card.classList.contains("is-flipped") ||
      card.classList.contains("is-matched")
    )
      return;
    if (card === state.firstCard) return;

    if (state.firstCard === null) {
      state.firstCard = card;
      card.classList.add("is-flipped");
      card.setAttribute(
        "aria-label",
        `Открытая карточка: ${getCardLabel(card)}`,
      );
      return;
    }

    state.secondCard = card;
    card.classList.add("is-flipped");
    card.setAttribute("aria-label", `Открытая карточка: ${getCardLabel(card)}`);
    state.moves += 1;
    notify();

    if (state.firstCard.dataset.imageId === state.secondCard.dataset.imageId) {
      handleMatch();
    } else {
      handleMismatch();
    }
  }

  function endGame() {
    state.gameOver = true;
    if (!state.resultSaved) {
      state.resultSaved = true;
      onWin?.(state.moves);
    }
  }

  function startNewGame() {
    clearMismatchTimer();
    state.firstCard = null;
    state.secondCard = null;
    state.lockBoard = false;
    state.moves = 0;
    state.foundPairs = 0;
    state.gameOver = false;
    state.resultSaved = false;

    board.textContent = "";
    const fragment = document.createDocumentFragment();
    for (const image of buildDeck())
      fragment.appendChild(createCardElement(image));
    board.appendChild(fragment);

    notify();
  }

  return { startNewGame, getStats };
}
