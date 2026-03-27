document.addEventListener("DOMContentLoaded", function() {
const snakeModal = document.getElementById("snakeModal");
const snakeHeader = document.getElementById("snakeHeader");
const snakeClose = document.getElementById("snakeClose");
const snakeCanvas = document.getElementById("snakeCanvas");
const snakeScoreSpan = document.getElementById("snakeScore");
const ctx = snakeCanvas.getContext("2d");
const box = 20;
let snake, direction, food, score, gameInterval, gameStarted = false;

const foodSVGinline = `<svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;"><circle cx="11" cy="11" r="10" fill="#f57c00" stroke="#e65100" stroke-width="2"/><circle cx="7" cy="7" r="3" fill="white" opacity="0.3"/><rect x="10" y="1" width="2" height="4" fill="#33691e"/><path d="M12 1 C15 0, 17 6, 12 5" fill="#558b2f"/></svg>`;
const trophySVG = `<svg width="20" height="20" viewBox="0 0 20 20" style="vertical-align:middle;" xmlns="http://www.w3.org/2000/svg"><g><ellipse cx="10" cy="18" rx="5" ry="2" fill="#bdbdbd"/><rect x="7" y="14" width="6" height="3" rx="1" fill="#bdbdbd"/><rect x="8" y="12" width="4" height="3" rx="1" fill="#ffd600"/><path d="M4 3a6 6 0 0 0 12 0" fill="#ffd600" stroke="#bdbdbd" stroke-width="1.5"/><rect x="3" y="2" width="14" height="3" rx="1.5" fill="#ffd600" stroke="#bdbdbd" stroke-width="1"/><path d="M3 5c0 3 2 6 7 6s7-3 7-6" fill="none" stroke="#bdbdbd" stroke-width="1.5"/></g></svg>`;

const snakeSkinSVG = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="#2e7d32"/><rect x="1" y="1" width="30" height="30" fill="#388e3c"/><circle cx="10" cy="10" r="2" fill="#43a047"/><circle cx="22" cy="22" r="2" fill="#43a047"/></svg>`;
const snakeBodySVG = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="#1565c0"/><rect x="1" y="1" width="30" height="30" fill="#1e88e5"/><circle cx="10" cy="10" r="2" fill="#64b5f6"/><circle cx="22" cy="22" r="2" fill="#64b5f6"/></svg>`;
const snakeHeadSVG = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="#1565c0"/><rect x="1" y="1" width="30" height="30" fill="#1e88e5"/><circle cx="10" cy="10" r="2" fill="#64b5f6"/><circle cx="22" cy="22" r="2" fill="#64b5f6"/><circle cx="10" cy="8" r="4" fill="white"/><circle cx="22" cy="8" r="4" fill="white"/><circle cx="10" cy="8" r="2.5" fill="black"/><circle cx="22" cy="8" r="2.5" fill="black"/></svg>`;
const foodSVG = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="10" fill="#f57c00" stroke="#e65100" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="white" opacity="0.3"/><rect x="15" y="5" width="2" height="4" fill="#33691e"/><path d="M17 5 C20 4, 22 10, 17 9" fill="#558b2f"/></svg>`;

const snakeSkinImg = new window.Image();
snakeSkinImg.src = 'data:image/svg+xml;base64,' + btoa(snakeSkinSVG);
const snakeBodyImg = new window.Image();
snakeBodyImg.src = 'data:image/svg+xml;base64,' + btoa(snakeBodySVG);
const snakeHeadImg = new window.Image();
snakeHeadImg.src = 'data:image/svg+xml;base64,' + btoa(snakeHeadSVG);
const foodImg = new window.Image();
foodImg.src = 'data:image/svg+xml;base64,' + btoa(foodSVG);

let foodReady = false;
foodImg.onload = function() { foodReady = true; };

let imagesLoaded = 0;
let record = localStorage.getItem("snakeRecord") ? parseInt(localStorage.getItem("snakeRecord")) : 0;

let startImg = new window.Image();
startImg.src = "proyectos/Ubuntu/assets/img/snake.png";

// Asigna el onload SOLO UNA VEZ
startImg.onload = function() {
    if (snakeModal.style.display === "block" && !gameStarted) {
        drawStartScreen();
    }
};

function drawStartScreen() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    if (startImg.complete && startImg.naturalWidth !== 0) {
        const imgW = Math.min(180, snakeCanvas.width * 0.8);
        const imgH = imgW;
        ctx.drawImage(
            startImg,
            (snakeCanvas.width - imgW) / 2,
            (snakeCanvas.height - imgH) / 2 - 30,
            imgW,
            imgH
        );
        ctx.fillStyle = "#4caf50";
        ctx.font = "bold 22px Ubuntu, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Comenzar juego", snakeCanvas.width / 2, snakeCanvas.height / 2 + imgH / 2 + 18);
        ctx.font = "16px Ubuntu, Arial, sans-serif";
        ctx.fillStyle = "#ffa726";
        ctx.fillText("🏆 Record: " + record, snakeCanvas.width / 2, snakeCanvas.height / 2 + imgH / 2 + 44);
    } else {
        // Mostrar mensaje de carga mientras la imagen no está lista
        ctx.fillStyle = "#fff";
        ctx.font = "bold 20px Ubuntu, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Cargando...", snakeCanvas.width / 2, snakeCanvas.height / 2);
    }
    snakeScoreSpan.style.visibility = "hidden";
    snakeCanvas.onclick = function() {
        if (!gameStarted) {
            snakeCanvas.onclick = null;
            startSnakeGame();
        }
    };
}

function updateScore() {
    snakeScoreSpan.innerHTML = `
        <span style="display:inline-flex;align-items:center;gap:10px;">
            <span>${foodSVGinline} ${score}</span>
            <span style="font-size:0.95em;margin-left:14px;display:inline-flex;align-items:center;gap:4px;">
                ${trophySVG} ${record}
            </span>
        </span>
    `;
}

function checkImagesReady() {
    imagesLoaded++;
    if (imagesLoaded === 3) {
        window.abrirSnake = function() {
            snakeModal.style.display = "block";
            clearInterval(gameInterval);
            gameStarted = false;
            drawStartScreen();
        };
    }
}
snakeBodyImg.onload = checkImagesReady;
snakeHeadImg.onload = checkImagesReady;
foodImg.onload = checkImagesReady;

function startSnakeGame() {
    if (imagesLoaded < 3) return;
    snake = [{x: 8, y: 8}];
    direction = "RIGHT";
    food = {
        x: Math.floor(Math.random() * 16),
        y: Math.floor(Math.random() * 16)
    };
    score = 0;
    gameStarted = true;
    snakeScoreSpan.style.visibility = "visible";
    updateScore();
    clearInterval(gameInterval);
    gameInterval = setInterval(drawSnakeGame, 180);
}

function drawSnakeGame() {
    for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? "#388e3c" : "#43a047";
            ctx.fillRect(x * box, y * box, box, box);
        }
    }

    if (imagesLoaded === 3) {
        for (let i = 0; i < snake.length; i++) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(snake[i].x * box, snake[i].y * box, box - 2, box - 2);
            ctx.clip();
            if (i === 0) {
                ctx.drawImage(snakeHeadImg, snake[i].x * box, snake[i].y * box, box - 2, box - 2);
            } else {
                ctx.drawImage(snakeBodyImg, snake[i].x * box, snake[i].y * box, box - 2, box - 2);
            }
            ctx.restore();
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(food.x * box, food.y * box, box - 2, box - 2);
        ctx.clip();
        ctx.drawImage(foodImg, food.x * box, food.y * box, box - 2, box - 2);
        ctx.restore();
    }

    let head = {x: snake[0].x, y: snake[0].y};
    if (direction === "LEFT") head.x--;
    if (direction === "RIGHT") head.x++;
    if (direction === "UP") head.y--;
    if (direction === "DOWN") head.y++;

    // Colisión con paredes o cuerpo
    if (
        head.x < 0 || head.x >= 16 || head.y < 0 || head.y >= 16 ||
        snake.some(seg => seg.x === head.x && seg.y === head.y)
    ) {
        clearInterval(gameInterval);
        snakeScoreSpan.style.visibility = "hidden";
        if (score > record) {
            record = score;
            localStorage.setItem("snakeRecord", record);
        }
        updateScore();
        gameStarted = false;
        drawStartScreen();
        return;
    }

    snake.unshift(head);

    // Comer comida
    if (head.x === food.x && head.y === food.y) {
        score++;
        if (score > record) {
            record = score;
            localStorage.setItem("snakeRecord", record);
        }
        updateScore();
        food = {
            x: Math.floor(Math.random() * 16),
            y: Math.floor(Math.random() * 16)
        };
    } else {
        snake.pop();
    }
}

// Controles teclado (flechas y WASD)
document.addEventListener("keydown", function(e) {
    if (snakeModal.style.display !== "block") return;

    if (!gameStarted && (e.key === " " || e.key === "Enter")) {
        startSnakeGame();
        return;
    }

    if (gameStarted) {
        if ((e.key === "ArrowLeft" || e.key === "a" || e.key === "A") && direction !== "RIGHT") direction = "LEFT";
        if ((e.key === "ArrowUp" || e.key === "w" || e.key === "W") && direction !== "DOWN") direction = "UP";
        if ((e.key === "ArrowRight" || e.key === "d" || e.key === "D") && direction !== "LEFT") direction = "RIGHT";
        if ((e.key === "ArrowDown" || e.key === "s" || e.key === "S") && direction !== "UP") direction = "DOWN";
    }
});

// Drag & drop ventana
snakeHeader.onmousedown = function(e) {
    e.preventDefault();
    let pos3 = e.clientX;
    let pos4 = e.clientY;

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;

    function elementDrag(e) {
        e.preventDefault();
        let pos1 = pos3 - e.clientX;
        let pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // Limitar dentro del viewport
        const modalRect = snakeModal.getBoundingClientRect();
        const winW = window.innerWidth;
        const winH = window.innerHeight;

        let newTop = snakeModal.offsetTop - pos2;
        let newLeft = snakeModal.offsetLeft - pos1;

        // Límites
        const minTop = 0;
        const minLeft = 0;
        const maxTop = winH - modalRect.height;
        const maxLeft = winW - modalRect.width;

        if (newTop < minTop) newTop = minTop;
        if (newLeft < minLeft) newLeft = minLeft;
        if (newTop > maxTop) newTop = maxTop;
        if (newLeft > maxLeft) newLeft = maxLeft;

        snakeModal.style.top = newTop + "px";
        snakeModal.style.left = newLeft + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
};

snakeHeader.ondragstart = function() {
    return false;
};
snakeClose.onclick = function() {
    snakeModal.style.display = "none";
    clearInterval(gameInterval);
};

});