
document.addEventListener('DOMContentLoaded', function() {
    const gridIcon = document.querySelector('.grid-icon');
    const appsModal = document.getElementById('appsModal');
    const curtain = document.getElementById('curtain');
    const appItems = document.querySelectorAll('.apps-grid .app-item');
    const appsContainer = appsModal ? appsModal.querySelector('.apps-container') : null;
    let searchInput = null;

    // Estado de instalación para Discord, Spotify y Tetris - ahora global
    window.installedApps = window.installedApps || {
        "Discord": false,
        "Spotify": false,
        "Tetris": false
    };
    
    // Mapeo de modales por nombre de app
    const modalsByApp = {
        "Navegador": document.getElementById('firefoxModal'),
        "Tareas": document.getElementById('tasksModal'),
        "Carpeta": document.getElementById('filesModal'),
        "Tienda": document.getElementById('storeModal'),
        "Calculadora": document.getElementById('calculadoraModal'),
        "Spotify": document.getElementById('spotifyModal'),
        "Discord": document.getElementById('discordModal'),
        "Snake": document.getElementById('snakeModal'),
        "Tetris": document.getElementById('tetrisModal')
        // Visual Studio eliminado
    };

    // Función para crear o asegurar el input de búsqueda en la cabecera del modal
    function ensureSearchInput() {
        if (!appsContainer) return;
        if (appsContainer.querySelector('.apps-search-bar')) return; // ya existe

        // Crear div envoltorio para centrar
        const searchDiv = document.createElement('div');
        searchDiv.className = 'apps-search-bar';
        searchDiv.style.margin = '0 auto 16px auto';

        // Crear input de búsqueda
        searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Buscar app...';
        searchInput.className = 'apps-search-input';
        searchInput.autocomplete = 'off';

        searchDiv.appendChild(searchInput);

        // Insertar el buscador ANTES de las imágenes de cabecera
        const headerInline = appsContainer.querySelector('.apps-header-inline');
        if (headerInline) {
            appsContainer.insertBefore(searchDiv, headerInline);
        } else {
            // Fallback: antes de la grilla
            const appsGrid = appsContainer.querySelector('.apps-grid');
            if (appsGrid) {
                appsContainer.insertBefore(searchDiv, appsGrid);
            }
        }
    }

    // Función para crear o asegurar los botones de filtro en la cabecera del modal
    function ensureFilterButtons() {
        if (!appsContainer) return;
        if (appsContainer.querySelector('.apps-filter-bar')) return; // ya existen

        const filterDiv = document.createElement('div');
        filterDiv.className = 'apps-filter-bar';

        // Botón "Frecuentes"
        const btnFrecuentes = document.createElement('button');
        btnFrecuentes.textContent = 'Frecuentes';
        btnFrecuentes.className = 'apps-filter-btn';
        btnFrecuentes.dataset.filter = 'frecuentes';

        // Botón "Todas"
        const btnAll = document.createElement('button');
        btnAll.textContent = 'Todas';
        btnAll.className = 'apps-filter-btn active'; // <-- Ahora empieza activo
        btnAll.dataset.filter = 'all';

        filterDiv.appendChild(btnFrecuentes);
        filterDiv.appendChild(btnAll);

        appsContainer.appendChild(filterDiv);

        filterDiv.addEventListener('click', function(e) {
            if (e.target.classList.contains('apps-filter-btn')) {
                filterDiv.querySelectorAll('.apps-filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                filterAppsByCategory(e.target.dataset.filter);
            }
        });

        // Aplica el filtro "Todas" al iniciar
        filterAppsByCategory('all');
    }

    // Filtrado por categoría
    function filterAppsByCategory(category) {
        const items = document.querySelectorAll('.apps-grid .app-item');
        items.forEach(item => {
            const appName = item.querySelector('p').textContent.trim();
            // Solo mostrar si está instalado (para Discord, Spotify y Tetris)
            if ((appName === "Discord" || appName === "Spotify" || appName === "Tetris") && !window.installedApps[appName]) {
                item.style.display = 'none';
                return;
            }
            if (category === 'all') {
                // Mostrar todas las instaladas
                item.style.display = '';
            } else if (category === 'frecuentes') {
                // Solo Navegador, Tareas, Carpeta
                if (["Navegador", "Tareas", "Carpeta"].includes(appName)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            }
        });
        // Aplica filtro de texto si hay búsqueda
        if (searchInput && searchInput.value.trim() !== '') {
            filterApps();
        }
    }

    // Lógica de filtrado en tiempo real
    function filterApps() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const currentAppItems = document.querySelectorAll('.apps-grid .app-item');
        // Detecta filtro activo
        const activeFilter = appsContainer.querySelector('.apps-filter-btn.active')?.dataset.filter || 'all';

        currentAppItems.forEach(item => {
            const appName = item.querySelector('p').textContent.trim();
            const appNameLower = appName.toLowerCase();
            let visible = appNameLower.includes(query);

            // Solo mostrar si está instalado (para Discord, Spotify y Tetris)
            if ((appName === "Discord" || appName === "Spotify" || appName === "Tetris") && !window.installedApps[appName]) {
                visible = false;
            }

            // Aplica filtro de categoría
            if (activeFilter === 'frecuentes' && !["Navegador", "Tareas", "Carpeta"].includes(appName)) {
                visible = false;
            }

            item.style.display = visible ? "" : "none";
        });
    }

    // Función global para refrescar la visibilidad de apps según instalación
    window.refreshAppsGrid = function() {
        // Si hay texto en el buscador, aplicar el filtro completo
        if (searchInput && searchInput.value.trim() !== '') {
            filterApps();
            return;
        }
        
        // Si no hay búsqueda, solo aplicar filtro de instalación
        const currentAppItems = document.querySelectorAll('.apps-grid .app-item');
        currentAppItems.forEach(item => {
            const appName = item.querySelector('p').textContent.trim();
            // Discord, Spotify y Tetris sólo aparecen si están instalados
            if ((appName === "Discord" || appName === "Spotify" || appName === "Tetris")) {
                item.style.display = window.installedApps[appName] ? "" : "none";
            } else {
                item.style.display = ""; // asegurar que los otros sí aparecen
            }
        });
    };
    
    // Inicializar input y eventos cada vez que se abre el modal
    function setupSearchFeature() {
        ensureSearchInput();
        ensureFilterButtons();
        if (searchInput) {
            searchInput.value = '';
            searchInput.removeEventListener('input', filterApps); // evitar dobles
            searchInput.addEventListener('input', filterApps);
        }
    }

    // Inicialización de la grilla
    window.refreshAppsGrid();

    // Mapeo entre el nombre de la aplicación y el id del icono en el header.
    const appHeaderMapping = {
        "Navegador": "firefoxIcon",
        "Tareas": "tasksIcon",
        "Carpeta": "folderIcon",
        "Tienda": "storeIcon",
        // Terminal sigue en el header, pero NO se abre desde el grid
        //"Terminal": "terminalIcon",
        "Discord": "discordIcon",   // solo si está instalado
        "Spotify": "spotifyIcon"    // solo si está instalado (o se crea al instalar)
    };

    // Función que simula el clic sobre el ícono del header según la aplicación.
    function simulateHeaderClick(appName) {
        if (appName === "Tareas") {
            document.getElementById('tasksModal').style.display = 'block';
            return;
        }
        if (appName === "Carpeta") {
            // Ejecuta el mismo código que el click del header
            window.currentFilePath = "/home/mmm";
            if (typeof updateFilesModal === "function") updateFilesModal();
            document.getElementById('filesModal').style.display = 'block';
            return;
        }
        if (appName === "Tienda") {
            document.getElementById('storeModal').style.display = 'block';
            return;
        }
        if (appName === "Navegador") {
            document.getElementById('firefoxModal').style.display = 'block';
            return;
        }
        if (appName === "Snake") {
            window.abrirSnake();
            return;
        }
    }

    // Función para abrir el modal correspondiente
    function openModalForApp(appName) {
        // Oculta todos los modales primero
        Object.values(modalsByApp).forEach(modal => {
            if (modal) modal.style.display = 'none';
        });

        // Estas apps deben abrirse simulando el header, no mostrando modal directo
        if (["Navegador", "Tareas", "Carpeta", "Tienda"].includes(appName)) {
            simulateHeaderClick(appName);
            return;
        }

        // Ahora también permite abrir Tetris
        if (modalsByApp[appName]) {
            modalsByApp[appName].style.display = 'block';
        }
    }

    // Función que se ejecuta al hacer clic en un ítem de la grilla
    function handleAppClick(item) {
        const appName = item.querySelector('p').textContent.trim();
        // Ya no permitimos abrir Terminal desde aquí:
        if(appName === "Terminal") {
            alert("Abre el terminal únicamente desde el ícono lateral.");
            return;
        }
        // Discord, Spotify y Tetris sólo si están instalados
        if ((appName === "Discord" || appName === "Spotify" || appName === "Tetris") && !window.installedApps[appName]) {
            alert(appName + " no está instalado. Instálalo desde la tienda.");
            return;
        }
        // Cierra la interfaz de apps (modal y cortinilla)
        appsModal.style.display = 'none';
        curtain.style.display = 'none';
        
        // Abre el modal de Discord/Spotify/Tetris directamente, otros por el header
        openModalForApp(appName);
    }

    // Asigna el evento a cada ítem de la grilla
    appItems.forEach(item => {
        item.addEventListener('click', function() {
            handleAppClick(this);
        });
    });

    // Z-INDEX al frente de TODO (asegúrate de que el CSS lo tenga también)
    if (appsModal) {
        appsModal.style.zIndex = 6000;
    }
    if (curtain) {
        curtain.style.zIndex = 5900;
    }

    // Mostrar el modal de apps al pulsar el gridIcon (los "puntitos")
    if (gridIcon && appsModal && curtain) {
        let isTransitioning = false;
        let curtainTransitionHandler = null; // Guardamos el handler para poder eliminarlo siempre
        
        // Función de reset mejorada para ambos elementos y clases
        function resetAppsModal() {
            // Siempre elimina el handler de transición anterior
            if (curtainTransitionHandler) {
                curtain.removeEventListener('transitionend', curtainTransitionHandler);
                curtainTransitionHandler = null;
            }
            // Oculta ambos elementos
            appsModal.style.display = 'none';
            curtain.style.display = 'none';
            curtain.classList.remove('animate');
            // Forzar reflow para reiniciar correctamente la animación CSS
            // eslint-disable-next-line no-unused-expressions
            curtain.offsetWidth;
            isTransitioning = false;
        }

        gridIcon.addEventListener('click', function() {
            // Refrescamos la grilla cada vez que se abre el modal
            window.refreshAppsGrid();
            resetAppsModal();
            isTransitioning = true;
            curtain.style.display = 'block';
            // Forzar reflow antes de reiniciar la animación
            // eslint-disable-next-line no-unused-expressions
            curtain.offsetWidth;
            curtain.classList.add('animate');
            curtainTransitionHandler = function handler() {
                appsModal.style.display = 'block';
                curtain.classList.remove('animate');
                isTransitioning = false;
                curtain.removeEventListener('transitionend', handler);
                curtainTransitionHandler = null;
                // Configurar el buscador después de mostrar el modal
                setTimeout(setupSearchFeature, 10);
            };
            curtain.addEventListener('transitionend', curtainTransitionHandler);
        });
        
        // Inicializar el buscador en la carga inicial
        setTimeout(setupSearchFeature, 100);
    }

    // --- Animación de ampliación y cierre del modal de apps ---
    // Ahora SIN transición, solo cierra el modal al hacer clic en la imagen
    function animateAndCloseApps(img) {
        // Ocultar modal y cortinilla directamente, sin animación
        const appsModal = document.getElementById('appsModal');
        const curtain = document.getElementById('curtain');
        if (appsModal) appsModal.style.display = 'none';
        if (curtain) {
            curtain.style.display = 'none';
            curtain.classList.remove('animate');
        }
    }

    document.querySelectorAll('.apps-header, .apps-header2, .apps-header3').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            animateAndCloseApps(this);
        });
    });

    // Evento para el icono de Tetris en el header
    const tetrisIcon = document.getElementById('tetrisIcon');
    const tetrisModal = document.getElementById('tetrisModal');
    if (tetrisIcon && tetrisModal) {
        tetrisIcon.addEventListener('click', function(e) {
            e.preventDefault();
            tetrisModal.style.display = 'block';
        });
    }
});
