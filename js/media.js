(() => {
    "use strict";

    const mediaSoundToggle =
        document.querySelector('input[name="soundEnabled"]');

    const mediaGameView =
        document.getElementById("view-game");

    const mediaResultsView =
        document.getElementById("view-results");

    const mediaTarget =
        document.querySelector(".target");

    const backgroundMusic =
        new Audio("assets/audio/background-music.mp3");

    const letsGoSound =
        new Audio("assets/audio/lets-go.mp3");

    const coinSound =
        new Audio("assets/audio/coin.mp3");

    const gameOverSound =
        new Audio("assets/audio/game-over.mp3");

    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.15;

    letsGoSound.volume = 0.8;
    coinSound.volume = 0.8;
    gameOverSound.volume = 0.9;

    let soundEnabled = mediaSoundToggle
        ? mediaSoundToggle.checked
        : true;

    let gameWasVisible =
        mediaGameView?.classList.contains("view--active") ?? false;

    let resultsWereVisible =
        mediaResultsView?.classList.contains("view--active") ?? false;

    function playSound(audio) {
        if (!soundEnabled) {
            return;
        }

        audio.currentTime = 0;

        audio.play().catch((error) => {
            console.warn("Le son n’a pas pu être joué :", error);
        });
    }

    function playBackgroundMusic() {
        if (!soundEnabled || !backgroundMusic.paused) {
            return;
        }

        backgroundMusic.play().catch(() => {
        });
    }

    function stopBackgroundMusic() {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }

    function stopAllSounds() {
        const audioFiles = [
            backgroundMusic,
            letsGoSound,
            coinSound,
            gameOverSound
        ];

        audioFiles.forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    document.addEventListener(
        "pointerdown",
        playBackgroundMusic,
        { once: true }
    );

    document.addEventListener(
        "keydown",
        playBackgroundMusic,
        { once: true }
    );

    if (mediaSoundToggle) {
        mediaSoundToggle.addEventListener("change", () => {
            soundEnabled = mediaSoundToggle.checked;

            if (soundEnabled) {
                playBackgroundMusic();
            } else {
                stopAllSounds();
            }
        });
    }

    if (mediaTarget) {
        mediaTarget.addEventListener("click", () => {
            const gameIsVisible =
                mediaGameView?.classList.contains("view--active");

            if (gameIsVisible && !mediaTarget.disabled) {
                playSound(coinSound);
            }
        });
    }

    if (mediaGameView && mediaResultsView) {
        const viewObserver = new MutationObserver(() => {
            const gameIsVisible =
                mediaGameView.classList.contains("view--active");

            const resultsAreVisible =
                mediaResultsView.classList.contains("view--active");

            if (gameIsVisible && !gameWasVisible) {
                stopBackgroundMusic();
                playSound(letsGoSound);
            }

            if (resultsAreVisible && !resultsWereVisible) {
                playSound(gameOverSound);
            }

            gameWasVisible = gameIsVisible;
            resultsWereVisible = resultsAreVisible;
        });

        viewObserver.observe(mediaGameView, {
            attributes: true,
            attributeFilter: ["class"]
        });

        viewObserver.observe(mediaResultsView, {
            attributes: true,
            attributeFilter: ["class"]
        });
    }
})();