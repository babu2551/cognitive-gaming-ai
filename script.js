const API_URL = "http://127.0.0.1:8000/predict";
const form = document.getElementById("assessment-form");
const resultPanel = document.getElementById("result-panel");
const profileStep = document.getElementById("profile-step");

const gameStep = document.getElementById("game-step");
const gameCard = document.getElementById("game-card");
const gameAction = document.getElementById("game-action");
const resetButton = document.getElementById("reset-button");
const gameCounter = document.getElementById("game-counter");
const progressBar = document.getElementById("progress-bar");

let gameIndex = 0;
let gameStartedAt = 0;
let sequence = [];
let sequenceInput = [];
const scores = {};

const games = [
    { name: "memory", title: "Remember the sequence", description: "Watch the tiles light up, then tap them in the same order.", button: "Show sequence" },
    { name: "attention", title: "Find the signal", description: "Tap the green target as quickly as you can. Ignore the decoys.", button: "Start attention game" },
    { name: "orientation", title: "Place the marker", description: "Choose the position shown by the prompt. Trust your first answer.", button: "Start orientation game" },
];

function renderGame() {
    const game = games[gameIndex];
    gameCounter.textContent = `Game ${gameIndex + 1} of ${games.length}`;
    progressBar.style.width = `${(gameIndex / games.length) * 100}%`;
    gameCard.innerHTML = `<p class="kicker">${game.name} challenge</p><h3>${game.title}</h3><p>${game.description}</p><div id="game-board" class="game-board"><span class="game-start-copy">Ready when you are.</span></div>`;
    gameAction.querySelector("span").textContent = game.button;
    gameAction.disabled = false;
    gameStartedAt = 0;
}

function startGame() {
    const name = games[gameIndex].name;
    gameAction.disabled = true;
    if (name === "memory") startMemory();
    if (name === "attention") startAttention();
    if (name === "orientation") startOrientation();
}

function startMemory() {
    sequence = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9));
    sequenceInput = [];
    const board = document.getElementById("game-board");
    board.innerHTML = Array.from({ length: 9 }, (_, index) => `<button class="tile" data-index="${index}" type="button"></button>`).join("");
    let step = 0;
    const reveal = setInterval(() => {
        document.querySelector(`[data-index="${sequence[step]}"]`).classList.add("active");
        setTimeout(() => document.querySelector(`[data-index="${sequence[step]}"]`)?.classList.remove("active"), 350);
        step += 1;
        if (step === sequence.length) { clearInterval(reveal); enableMemoryInput(); }
    }, 500);
}

function enableMemoryInput() {
    gameAction.querySelector("span").textContent = "Sequence shown";
    document.querySelectorAll(".tile").forEach((tile) => tile.addEventListener("click", () => {
        sequenceInput.push(Number(tile.dataset.index));
        tile.classList.add("picked");
        if (sequenceInput.length === sequence.length) finishMemory();
    }));
}

function finishMemory() {
    const correct = sequenceInput.filter((value, index) => value === sequence[index]).length;
    scores.memory = Math.round((correct / sequence.length) * 100);
    scores.daily = Math.min(100, scores.memory + 8);
    nextGame();
}

function startAttention() {
    const board = document.getElementById("game-board");
    board.innerHTML = `<button class="target" type="button" aria-label="Target"></button>`;
    const target = board.querySelector(".target");
    target.style.left = `${20 + Math.random() * 60}%`;
    target.style.top = `${20 + Math.random() * 55}%`;
    gameStartedAt = performance.now();
    target.addEventListener("click", () => {
        const reaction = Math.round(performance.now() - gameStartedAt);
        scores.reaction = Math.max(250, Math.min(3000, reaction));
        scores.attention = Math.round(Math.max(0, Math.min(100, 100 - (reaction - 250) / 20)));
        nextGame();
    });
}

function startOrientation() {
    const directions = ["North", "East", "South", "West"];
    const answer = directions[Math.floor(Math.random() * directions.length)];
    const board = document.getElementById("game-board");
    board.innerHTML = `<p class="direction-prompt">Pointing <strong>${answer}</strong></p><div class="direction-grid">${directions.map((direction) => `<button type="button" data-direction="${direction}">${direction[0]}</button>`).join("")}</div>`;
    board.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
        scores.orientation = button.dataset.direction === answer ? 100 : 25;
        nextGame();
    }));
}

function nextGame() {
    gameIndex += 1;
    if (gameIndex < games.length) renderGame();
    else submitAssessment();
}

async function submitAssessment() {
    progressBar.style.width = "100%";
    gameCard.innerHTML = `<p class="kicker">Assessment complete</p><h3>Reading your results...</h3><p>The model is combining your game performance with your profile.</p>`;
    gameAction.disabled = true;
    const payload = { Age: Number(document.getElementById("age").value), Education_Years: Number(document.getElementById("education").value), Memory_Score: scores.memory, Attention_Score: scores.attention, Reaction_Time_ms: scores.reaction, Orientation_Score: scores.orientation, Daily_Activity_Score: scores.daily };
    try {
        const response = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "The API rejected the assessment.");
        showResult(data);
    } catch (error) {
        showError(error.message.includes("fetch") ? "Make sure the FastAPI server is running on port 8000." : error.message);
        gameAction.disabled = false;
    }
}

document.getElementById("begin-button").addEventListener("click", () => {
    if (!form.reportValidity()) return;
    profileStep.classList.add("hidden"); gameStep.classList.remove("hidden"); renderGame();
});
gameAction.addEventListener("click", startGame);
resetButton.addEventListener("click", () => { gameIndex = 0; Object.keys(scores).forEach((key) => delete scores[key]); profileStep.classList.remove("hidden"); gameStep.classList.add("hidden"); resultPanel.className = "result-panel"; resultPanel.innerHTML = `<div class="result-placeholder"><span class="placeholder-line"></span><p>Awaiting assessment</p><span>Complete the games to see your classification.</span></div>`; });

function showResult(data) {
    const probability = Math.max(0, Math.min(1, Number(data.probability) || 0));
    const percent = Math.round(probability * 100);
    const isHigh = String(data.risk).toLowerCase() === "high";
    resultPanel.className = `result-panel ${isHigh ? "high-risk" : "low-risk"}`;
    resultPanel.innerHTML = `
    <div class="result-top"><p class="kicker">Classification result</p><span class="result-badge">${isHigh ? "Review advised" : "Lower risk"}</span></div>
    <div class="risk-word">${escapeHtml(data.risk)}</div>
    <p class="result-summary">The model classified this assessment as <strong>${escapeHtml(data.risk)} risk</strong>.</p>
    <div class="probability-row"><span>Model confidence</span><strong>${percent}%</strong></div>
    <div class="meter"><span style="width: ${percent}%"></span></div>
    <div class="result-detail"><span>Prediction label</span><strong>${Number(data.prediction)}</strong></div>
    <p class="disclaimer">This result is not a diagnosis. Discuss concerns with a qualified healthcare professional.</p>`;
}

function showError(message) {
    resultPanel.className = "result-panel error-state";
    resultPanel.innerHTML = `<div class="result-placeholder"><span class="placeholder-line"></span><p>Could not complete assessment</p><span>${escapeHtml(message)}</span></div>`;
}

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

form.addEventListener("submit", (event) => event.preventDefault());
