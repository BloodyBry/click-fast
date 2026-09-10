"use strict";


const ALLOWED_MODES = ["classic", "precision"];
const ALLOWED_DURATIONS = [10, 20, 30];
const ALLOWED_DIFFICULTIES = ["easy", "medium", "hard"];


const TARGET_SIZES = {
    easy: 80,
    medium: 60,
    hard: 40
};

const MODE_LABELS = {
    classic: "Classique",
    precision: "Précision"
};

const DIFFICULTY_LABELS = {
    easy: "Facile",
    medium: "Moyen",
    hard: "Difficile"
};

const views = document.querySelectorAll(".view");
const configForm = document.getElementById("config-form");
const playerNameInput = document.getElementById("player-name");
const pseudoError = document.getElementById("pseudo-error");
const configError = document.getElementById("config-error");
const gameTitle = document.getElementById("game-title");
const gameSettingsSummary = document.getElementById("game-settings-summary");
const resultsPlayerName = document.getElementById("results-player-name");
const gameView = document.getElementById("view-game");
const arena = document.querySelector(".arena");
const target = document.querySelector(".target");
const targetSizeLabel = document.getElementById("target-size-label");
const scoreValue = document.getElementById("score-value");
const missesValue = document.getElementById("misses-value");
const missesHelp = document.getElementById("misses-help");
const accuracyRing = document.getElementById("accuracy-ring");
const accuracyValue = document.getElementById("accuracy-value");
const accuracyHelp = document.getElementById("accuracy-help");

let currentSettings = null;
let resizeTimeoutId = null;
let score = 0;
let misses = 0;

function showView(viewId) {
    const nextView = document.getElementById(viewId);

    if (!nextView) {
        return;
    }

    views.forEach((view) => {
        view.classList.remove("view--active");
    });

    nextView.classList.add("view--active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.addEventListener("click", (event) => {
    const navigationControl = event.target.closest("[data-view-target]");

    if (!navigationControl) {
        return;
    }

    event.preventDefault();

    const nextViewId = navigationControl.dataset.viewTarget;
    showView(nextViewId);

    if (nextViewId === "view-game" && currentSettings !== null) {
        prepareArena(currentSettings);
    }
});

function validatePseudo() {
    const cleanedPseudo = playerNameInput.value.trim();

    pseudoError.textContent = "";
    playerNameInput.removeAttribute("aria-invalid");

    if (cleanedPseudo.length < 2 || cleanedPseudo.length > 20) {
        pseudoError.textContent = "Le pseudo doit contenir entre 2 et 20 caractères.";
        playerNameInput.setAttribute("aria-invalid", "true");
        playerNameInput.focus();
        return null;
    }

    playerNameInput.value = cleanedPseudo;
    return cleanedPseudo;
}

function readAndValidateSettings() {
    const pseudo = validatePseudo();

    if (pseudo === null) {
        return null;
    }

    const formData = new FormData(configForm);
    const mode = formData.get("mode");
    const duration = Number(formData.get("duration"));
    const difficulty = formData.get("difficulty");
    const soundEnabled = formData.get("soundEnabled") === "on";

    const modeIsValid = ALLOWED_MODES.includes(mode);
    const durationIsValid = ALLOWED_DURATIONS.includes(duration);
    const difficultyIsValid = ALLOWED_DIFFICULTIES.includes(difficulty);

    if (!modeIsValid || !durationIsValid || !difficultyIsValid) {
        configError.textContent = "La configuration sélectionnée n'est pas valide.";
        return null;
    }

    return {
        pseudo,
        mode,
        duration,
        difficulty,
        soundEnabled
    };
}

function updateGameView(settings) {
    const modeLabel = MODE_LABELS[settings.mode];
    const difficultyLabel = DIFFICULTY_LABELS[settings.difficulty];

    gameTitle.textContent = settings.pseudo;
    gameSettingsSummary.textContent = `${modeLabel} · ${difficultyLabel} · ${settings.duration} s`;
    resultsPlayerName.textContent = `${settings.pseudo} !`;
}

function getRandomInteger(max) {
    return Math.floor(Math.random() * (max + 1));
}

function applyTargetSize(difficulty) {
    const targetSize = TARGET_SIZES[difficulty];

    target.style.setProperty("--target-size", `${targetSize}px`);
    targetSizeLabel.textContent = `Cible · ${targetSize} px`;
}

function moveTarget() {
    const maximumX = Math.max(0, arena.clientWidth - target.offsetWidth);
    const maximumY = Math.max(0, arena.clientHeight - target.offsetHeight);
    const randomX = getRandomInteger(maximumX);
    const randomY = getRandomInteger(maximumY);

    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
}

function calculateAccuracy() {
    const totalClicks = score + misses;

    if (totalClicks === 0) {
        return 0;
    }

    return (score / totalClicks) * 100;
}


function updateGameStats() {
    scoreValue.textContent = String(score).padStart(2, "0");

    if (currentSettings.mode === "classic") {
        missesValue.textContent = "—";
        missesHelp.textContent = "Non mesuré en Classique";
        accuracyValue.textContent = "—";
        accuracyHelp.textContent = "Non mesuré en Classique";
        accuracyRing.classList.add("accuracy-ring--disabled");
        accuracyRing.style.setProperty("--accuracy", "0%");
        return;
    }

    const totalClicks = score + misses;
    const accuracy = calculateAccuracy();
    const formattedAccuracy = accuracy.toFixed(1).replace(".", ",");
    const hitWord = score === 1 ? "réussite" : "réussites";
    const clickWord = totalClicks === 1 ? "clic" : "clics";

    missesValue.textContent = String(misses).padStart(2, "0");
    missesHelp.textContent = "clics hors cible";
    accuracyValue.textContent = `${formattedAccuracy} %`;
    accuracyHelp.textContent = `${score} ${hitWord} / ${totalClicks} ${clickWord}`;
    accuracyRing.classList.remove("accuracy-ring--disabled");
    accuracyRing.style.setProperty("--accuracy", `${accuracy}%`);
}

function resetGameStats() {
    score = 0;
    misses = 0;
    updateGameStats();
}

function prepareArena(settings) {
    resetGameStats();
    applyTargetSize(settings.difficulty);
    window.requestAnimationFrame(moveTarget);
}

configForm.addEventListener("submit", (event) => {
    event.preventDefault();

    configError.textContent = "";

    const settings = readAndValidateSettings();

    if (settings === null) {
        return;
    }

    currentSettings = settings;
    updateGameView(currentSettings);
    showView("view-game");
    prepareArena(currentSettings);
});

playerNameInput.addEventListener("input", () => {
    pseudoError.textContent = "";
    playerNameInput.removeAttribute("aria-invalid");
});

configForm.addEventListener("change", () => {
    configError.textContent = "";
});


target.addEventListener("click", (event) => {
    event.stopPropagation();

    if (currentSettings === null) {
        return;
    }

    score += 1;
    updateGameStats();
    moveTarget();
});


arena.addEventListener("click", () => {
    if (currentSettings === null || currentSettings.mode !== "precision") {
        return;
    }

    misses += 1;
    updateGameStats();
});


window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimeoutId);

    resizeTimeoutId = window.setTimeout(() => {
        const gameIsVisible = gameView.classList.contains("view--active");

        if (currentSettings !== null && gameIsVisible) {
            moveTarget();
        }
    }, 150);
});
