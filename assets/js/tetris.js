document.addEventListener('DOMContentLoaded', function() {
    const tetrisModal = document.getElementById('tetrisModal');
    const tetrisHeader = document.getElementById('tetrisHeader');
    const tetrisClose = document.getElementById('tetrisClose');
 
    let tetrisPos1 = 0, tetrisPos2 = 0, tetrisPos3 = 0, tetrisPos4 = 0;
 
    tetrisHeader.onmousedown = tetrisDragMouseDown;
 
    function tetrisDragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        tetrisPos3 = e.clientX;
        tetrisPos4 = e.clientY;
        document.onmouseup = tetrisCloseDragElement;
        document.onmousemove = tetrisElementDrag;
    }
 
    function tetrisElementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        tetrisPos1 = tetrisPos3 - e.clientX;
        tetrisPos2 = tetrisPos4 - e.clientY;
        tetrisPos3 = e.clientX;
        tetrisPos4 = e.clientY;
 
        const bodyRect = document.body.getBoundingClientRect();
        const modalRect = tetrisModal.getBoundingClientRect();
 
        let newTop = tetrisModal.offsetTop - tetrisPos2;
        let newLeft = tetrisModal.offsetLeft - tetrisPos1;
 
        const minTop = 0;
        const minLeft = 0;
        const maxTop = bodyRect.height - modalRect.height;
        const maxLeft = bodyRect.width - modalRect.width;
 
        if (newTop < minTop) newTop = minTop;
        if (newLeft < minLeft) newLeft = minLeft;
        if (newTop > maxTop) newTop = maxTop;
        if (newLeft > maxLeft) newLeft = maxLeft;
 
        tetrisModal.style.top = newTop + "px";
        tetrisModal.style.left = newLeft + "px";
    }
 
    function tetrisCloseDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
 
    tetrisHeader.ondragstart = function() {
        return false;
    };
 
    tetrisClose.onclick = function() {
        tetrisModal.style.display = "none";
    };
 
    // --- TETRIS GAME ---
    const canvas = document.getElementById('tetrisCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const scoreSpan = document.getElementById('tetrisScore');
    const recordSpan = document.getElementById('tetrisRecord');
    const startBtn = document.getElementById('tetrisStartBtn');
 
    const ROWS = 20;
    const COLS = 10;
    const BLOCK_SIZE = 20;
 
    const COLORS = [
        null,
        '#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF',
        '#FF8E0D', '#FFE138', '#3877FF',
        '#00BCD4' 
    ];
 
    const SHAPES = [
        [],
        [[1,1,1,1]], // I horizontal
        [[2,0,0],[2,2,2]], // J
        [[0,0,3],[3,3,3]], // L
        [[4,4],[4,4]],     // O
        [[0,5,5],[5,5,0]], // S
        [[0,6,0],[6,6,6]], // T
        [[7,7,0],[0,7,7]], // Z
        [[8],[8],[8],[8]]  // I 
    ];
 
    let arena, score, dropCounter, dropInterval, lastTime, gameOver, rafId, record;
    let player = { pos: {x: 0, y: 0}, matrix: null };
 
    function createMatrix(w, h) {
        const matrix = [];
        while (h--) matrix.push(new Array(w).fill(0));
        return matrix;
    }
 
    function collide(arena, player) {
        const m = player.matrix, o = player.pos;
        for (let y = 0; y < m.length; ++y)
            for (let x = 0; x < m[y].length; ++x)
                if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0)
                    return true;
        return false;
    }
 
    function merge(arena, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) arena[y + player.pos.y][x + player.pos.x] = value;
            });
        });
    }
 
    function rotate(matrix, dir) {
        // Transponer correctamente matrices no cuadradas
        const rows = matrix.length;
        const cols = matrix[0].length;
        const transposed = Array.from({ length: cols }, (_, c) =>
            Array.from({ length: rows }, (_, r) => matrix[r][c])
        );
        if (dir > 0) {
            transposed.forEach(row => row.reverse());
        } else {
            transposed.reverse();
        }
        matrix.length = 0;
        transposed.forEach(row => matrix.push(row));
    }
 
    function playerDrop() {
        player.pos.y++;
        if (collide(arena, player)) {
            player.pos.y--;
            merge(arena, player);
            playerReset();
            arenaSweep();
            updateScore();
            if (collide(arena, player)) {
                gameOver = true;
                showGameOver();
                startBtn.style.display = "";
                startBtn.textContent = "Volver a jugar";
            }
        }
        dropCounter = 0;
    }
 
    function playerMove(dir) {
        player.pos.x += dir;
        if (collide(arena, player)) player.pos.x -= dir;
    }
 
    function playerRotate(dir) {
        const pos = player.pos.x;
        let offset = 1;
        rotate(player.matrix, dir);
        // Permite hasta 4 desplazamientos laterales para wall kick
        while (collide(arena, player)) {
            player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (Math.abs(offset) > player.matrix[0].length) {
                rotate(player.matrix, -dir);
                player.pos.x = pos;
                return;
            }
        }
    }
 
    function arenaSweep() {
        let rowCount = 1;
        outer: for (let y = arena.length - 1; y >= 0; --y) {
            for (let x = 0; x < arena[y].length; ++x)
                if (arena[y][x] === 0) continue outer;
            const row = arena.splice(y, 1)[0].fill(0);
            arena.unshift(row);
            y++;
            score += rowCount * 10;
            rowCount *= 2;
        }
    }
 
    function playerReset() {
        const type = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
        player.matrix = SHAPES[type].map(row => row.slice());
        player.pos.y = 0;
        player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2);
        if (collide(arena, player)) {
            gameOver = true;
            showGameOver();
            startBtn.style.display = "";
            startBtn.textContent = "Volver a jugar";
        }
    }
 
    function drawMatrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    ctx.fillStyle = COLORS[value];
                    ctx.fillRect((x + offset.x) * BLOCK_SIZE, (y + offset.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    ctx.strokeStyle = "#222";
                    ctx.strokeRect((x + offset.x) * BLOCK_SIZE, (y + offset.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            });
        });
    }
 
    function drawArena() {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawMatrix(arena, {x:0, y:0});
        drawMatrix(player.matrix, player.pos);
    }
 
    function updateScore() {
        scoreSpan.textContent = score;
        if (score > record) {
            record = score;
            localStorage.setItem('tetrisRecord', record);
            recordSpan.textContent = record;
        }
    }
 
    function showGameOver() {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "24px Arial";
        ctx.fillText("GAME OVER", 30, 200);
    }
 
    function update(time = 0) {
        if (gameOver) return;
        const deltaTime = time - lastTime;
        lastTime = time;
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) playerDrop();
        drawArena();
        rafId = requestAnimationFrame(update);
    }
 
    // Controles
    document.addEventListener('keydown', function(e) {
        if (gameOver) return;
        if (tetrisModal.style.display === "none") return;
        if (document.activeElement && document.activeElement.tagName === "INPUT") return;
        if (e.key === "ArrowLeft" || e.key === "a") playerMove(-1);
        else if (e.key === "ArrowRight" || e.key === "d") playerMove(1);
        else if (e.key === "ArrowDown" || e.key === "s") playerDrop();
        else if (e.key === "ArrowUp" || e.key === "w" || e.key === " ") playerRotate(1);
    });
 
    function startTetris() {
        arena = createMatrix(COLS, ROWS);
        score = 0;
        dropCounter = 0;
        dropInterval = 500;
        lastTime = 0;
        gameOver = false;
        playerReset();
        updateScore();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (rafId) cancelAnimationFrame(rafId);
        drawArena();
        rafId = requestAnimationFrame(update);
        startBtn.style.display = "none";
    }
 
    // Botón comenzar/volver a jugar
    startBtn.onclick = function() {
        startTetris();
    };
 
    // Mostrar récord al cargar
    record = parseInt(localStorage.getItem('tetrisRecord')) || 0;
    recordSpan.textContent = record;
 
    // Iniciar juego cuando se abre el modal (opcional: solo muestra el botón)
    if (tetrisModal) {
        const observer = new MutationObserver(function() {
            if (tetrisModal.style.display !== "none") {
                startBtn.style.display = "";
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#fff";
                ctx.font = "20px Arial";
                ctx.fillText("Pulsa Comenzar", 30, 200);
            }
        });
        observer.observe(tetrisModal, { attributes: true, attributeFilter: ['style'] });
    }
});