document.addEventListener('DOMContentLoaded', function() {
//Configuración del menú de energía y apertura del modal
    const powerMenu = document.querySelector('.power-menu');
    const powerIcon = document.querySelector('.power-icon');
    const powerModal = document.getElementById('powerModal');
    const modalMessage = document.getElementById('power-modal-message');
    const modalCancel = document.getElementById('power-modal-cancel');
    const modalConfirm = document.getElementById('power-modal-confirm');

//muestra y oculta el menú al hacer clic en el ícono
    powerIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        powerMenu.classList.toggle('active');
    });

//Ocultar el menú al hacer clic fuera del menu
    document.addEventListener('click', function(e) {
        if (!powerMenu.contains(e.target)) {
            powerMenu.classList.remove('active');
        }
    });

//Abrir el modal con la acción seleccionada
    powerMenu.querySelectorAll('.submenu li a').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const action = event.target.textContent.trim();
            modalMessage.textContent = `¿Desea ${action.toLowerCase()} el sistema?`;
            powerModal.classList.add('active');
        });
    });

//Cerrar el modal
    modalCancel.addEventListener('click', function() {
        powerModal.classList.remove('active');
    });
    window.addEventListener('click', function(event) {
        if (event.target === powerModal) {
            powerModal.classList.remove('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const powerModal = document.getElementById('powerModal');
    const modalMessage = document.getElementById('power-modal-message');
    const modalConfirm = document.getElementById('power-modal-confirm');
    const modalCancel = document.getElementById('power-modal-cancel');

    function closeModal() {
        powerModal.classList.remove('active');
    }

    modalCancel.addEventListener('click', closeModal);

//ejecuta la acción simulada
    modalConfirm.addEventListener('click', function() {
        const message = modalMessage.textContent.toLowerCase();
        closeModal();

        if (message.includes("apagar")) {
//Simulación: Apagado del sistema
            console.log("Simulación: Apagando el sistema.");
            const blackout = document.createElement('div');
            blackout.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:#000; z-index:3000; display: flex; justify-content: center; align-items: center;";
            const powerButton = document.createElement('button');
            powerButton.innerHTML = '<img src="assets/img/icons/power.png" alt="Power" style="width:50px; height:50px;">';
            powerButton.style.cssText = "border:none; background:transparent; cursor:pointer;";
            blackout.appendChild(powerButton);
            document.body.appendChild(blackout);
            powerButton.addEventListener('click', function() {
                blackout.remove();
                console.log("Simulación: Sistema reactivado.");
            });
        } else if (message.includes("reiniciar")) {
//Simulación: Reinicio del sistema
            console.log("Simulación: Reiniciando el sistema.");
            const blackout = document.createElement('div');
            blackout.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:#000; z-index:3000;";
            document.body.appendChild(blackout);
            setTimeout(() => {
                blackout.remove();
                console.log("Simulación: Sistema apagado y reactivado.");
            }, 1500);
        } else if (message.includes("suspender")) {
//Simulación: Suspensión del sistema
            console.log("Simulación: Suspender el sistema.");
            const lockScreen = document.createElement('div');
            lockScreen.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:url('assets/img/content/fondo.jpg') no-repeat center/cover; z-index:2000; transition: transform 1s ease;";
            document.body.appendChild(lockScreen);
            setTimeout(() => {
                lockScreen.style.transform = "translateY(-100%)";
            }, 2000);
            lockScreen.addEventListener('transitionend', function() {
                lockScreen.remove();
                console.log("Simulación: Sistema reanudado tras la suspensión.");
            });
        } else if (message.includes("cerrar sesión")) {
//Simulación: Cierre de sesión
            console.log("Simulación: Cerrando sesión.");
            setTimeout(() => {
                window.location.href = "login";
            }, 1500);
        }
    });
});