let calculadoraModal = document.getElementById("calculadoraModal");
let calculadoraHeader = document.querySelector(".calculadora-header");

// Drag & drop
calculadoraHeader.onmousedown = function(event) {
    dragMouseDown(event);
};

function dragMouseDown(e) {
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
        calculadoraModal.style.top = (calculadoraModal.offsetTop - pos2) + "px";
        calculadoraModal.style.left = (calculadoraModal.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Mostrar y cerrar
function abrirCalculadora() {
    calculadoraModal.style.display = "block";
}
function cerrarCalculadora() {
    calculadoraModal.style.display = 'none';
}

// Lógica de la calculadora
let operacion = "";

function agregarNumero(num) {
    operacion += num;
    document.getElementById("calculadoraDisplay").value = operacion;
}

function calcular() {
    try {
        let resultado = eval(operacion);
        document.getElementById("calculadoraDisplay").value = resultado;
        operacion = resultado.toString();
    } catch (error) {
        document.getElementById("calculadoraDisplay").value = "Error";
        operacion = "";
    }
}

function limpiar() {
    operacion = "";
    document.getElementById("calculadoraDisplay").value = "";
}

// Cerrar con la X
document.getElementById('calculadoraClose').onclick = cerrarCalculadora;

// Manejo de teclado
document.addEventListener('keydown', function(e) {
    // Solo si la calculadora está visible
    if (calculadoraModal.style.display !== 'block') return;

    // Si está enfocado el input, evita doble entrada
    if (document.activeElement === document.getElementById('calculadoraDisplay')) return;

    // Números y punto
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        agregarNumero(e.key);
    }
    // Operadores
    if (['+', '-', '*', '/', '(', ')'].includes(e.key)) {
        agregarNumero(e.key);
    }
    // Enter o igual
    if (e.key === 'Enter' || e.key === '=') {
        calcular();
        e.preventDefault();
    }
    // Borrar (C)
    if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        limpiar();
        e.preventDefault();
    }
    // Retroceso (borrar último)
    if (e.key === 'Backspace') {
        operacion = operacion.slice(0, -1);
        document.getElementById("calculadoraDisplay").value = operacion;
        e.preventDefault();
    }
});