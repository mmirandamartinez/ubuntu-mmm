document.addEventListener('DOMContentLoaded', function() {
    const storeIcon = document.getElementById('storeIcon');
    const storeModal = document.getElementById('storeModal');
    const storeClose = document.getElementById('store-modal-close');

    if (storeIcon && storeModal) {
        storeIcon.addEventListener('click', function(e) {
            e.preventDefault();
            storeModal.style.display = 'block';
        });
    }

    if (storeClose && storeModal) {
        storeClose.addEventListener('click', function() {
            storeModal.style.display = 'none';
        });
    }

    const storeModalHeader = storeModal.querySelector('.store-modal-header');
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (storeModalHeader) {
        storeModalHeader.style.cursor = 'move';
        storeModalHeader.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        storeModal.style.top = (storeModal.offsetTop - pos2) + "px";
        storeModal.style.left = (storeModal.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    // Función para mostrar el mensaje de confirmación personalizado
    function showCustomConfirm(message) {
        return new Promise((resolve) => {
            let modal = document.getElementById('customConfirmModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'customConfirmModal';
                modal.className = 'power-modal';
                modal.innerHTML = `
                    <div class="power-modal-content">
                        <div class="power-modal-header">
                            <span class="power-modal-title"></span>
                        </div>
                        <div class="power-modal-body">
                            <p id="customConfirmMessage"></p>
                        </div>
                        <div class="power-modal-actions">
                            <button id="power-modal-confirm">Sí</button>
                            <button id="power-modal-cancel">No</button>
                        </div>
                    </div>`;
                document.body.appendChild(modal);
            }
            modal.querySelector('#customConfirmMessage').innerText = message;
            modal.classList.add('active');
            modal.querySelector('#power-modal-confirm').onclick = function() {
                modal.classList.remove('active');
                resolve(true);
            }
            modal.querySelector('#power-modal-cancel').onclick = function() {
                modal.classList.remove('active');
                resolve(false);
            }
        });
    }

    // Funcionalidad para instalar una aplicación con confirmación personalizada
    const installButtons = document.querySelectorAll('.install-button, .install-button-small');
    installButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();

            // Si la aplicación ya fue instalada, no se permite reinstalar
            if (button.classList.contains('installed')) return;

            const confirmed = await showCustomConfirm("¿Estás seguro de instalar esta aplicación?");
            if (confirmed) {
                // Buscar la tarjeta (puede ser .app-card o .featured-app)
                const card = button.closest('.app-card, .featured-app');
                if (card) {
                    let appName = "";
                    // Obtener el nombre de la aplicación a partir de la imagen o título
                    const img = card.querySelector('img');
                    if (img && img.alt) {
                        appName = img.alt.toLowerCase();
                    } else {
                        const titleElem = card.querySelector('h1, h3');
                        if (titleElem) {
                            appName = titleElem.innerText.toLowerCase();
                        }
                    }
                    // Función auxiliar para capitalizar
                    function capitalize(s) {
                        return s.charAt(0).toUpperCase() + s.slice(1);
                    }
                    
                    // Actualizar estado global para Discord, Spotify y Tetris
                    if (["discord", "spotify", "tetris"].includes(appName)) {
                        if (window.installedApps) {
                            window.installedApps[capitalize(appName)] = true;
                            if (typeof window.refreshAppsGrid === "function") {
                                window.refreshAppsGrid();
                            }
                            // Mostrar el icono en el header si es Tetris
                            if (appName === "tetris") {
                                const tetrisIcon = document.getElementById("tetrisIcon");
                                if (tetrisIcon) tetrisIcon.style.display = "";
                            }
                        }
                    }
                    
                    const headerTopIcons = document.querySelector('.top-icons');
                    
                    if (appName === "vlc" || appName.includes("vlc media player")) {
                        const newIconLink = document.createElement('a');
                        newIconLink.href = "#";
                        newIconLink.className = "icon";
                        newIconLink.innerHTML = `<img src="assets/img/icons/VLC.png" alt="VLC">`;
                        newIconLink.addEventListener('click', function(e){
                            e.preventDefault();
                            const vlcModal = document.getElementById("vlcModal");
                            if(vlcModal) {
                                vlcModal.style.display = "block";
                            }
                        });
                        headerTopIcons.appendChild(newIconLink);
                    } else if (appName === "discord") {
                        const newIconLink = document.createElement('a');
                        newIconLink.href = "#";
                        newIconLink.className = "icon";
                        newIconLink.innerHTML = `<img src="assets/img/icons/Discord.png" alt="Discord">`;
                        newIconLink.addEventListener('click', function(e) {
                            e.preventDefault();
                            const discordModal = document.getElementById("discordModal");
                            if(discordModal) {
                                discordModal.style.display = "block";
                            }
                        });
                        headerTopIcons.appendChild(newIconLink);
                    } else if (appName === "spotify") {
                        const newIconLink = document.createElement('a');
                        newIconLink.href = "#";
                        newIconLink.className = "icon";
                        newIconLink.innerHTML = `<img src="assets/img/icons/spotify.png" alt="Spotify">`;
                        newIconLink.addEventListener('click', function(e){
                            e.preventDefault();
                            const spotifyModal = document.getElementById("spotifyModal");
                            if(spotifyModal) {
                                spotifyModal.style.display = "block";
                            }
                        });
                        headerTopIcons.appendChild(newIconLink);
                    }
                    // Marcar el botón como instalado
                    button.classList.add('installed');
                    button.disabled = true;
                    button.innerText = "Instalada";
                }
            }
        });
    });

    // Mostrar/ocultar el icono de Tetris en el header según instalación al cargar
    const tetrisIcon = document.getElementById("tetrisIcon");
    if (tetrisIcon && window.installedApps) {
        tetrisIcon.style.display = window.installedApps.Tetris ? "" : "none";
    }

    // Agregar funcionalidad para cerrar el modal de Spotify
    const spotifyClose = document.getElementById("spotify-close");
    const spotifyModal = document.getElementById("spotifyModal");
    if (spotifyClose && spotifyModal) {
        spotifyClose.addEventListener('click', function() {
            spotifyModal.style.display = "none";
        });
    }

    // Agregar funcionalidad para hacer draggable el modal de Spotify
    const spotifyModalHeader = spotifyModal.querySelector(".spotify-modal-header");

    if (spotifyModalHeader) {
        spotifyModalHeader.style.cursor = 'move';
        spotifyModalHeader.onmousedown = function(e) {
            e.preventDefault();
            let pos3 = e.clientX,
                pos4 = e.clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        
            function elementDrag(e) {
                let pos1 = pos3 - e.clientX,
                    pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                spotifyModal.style.top = (spotifyModal.offsetTop - pos2) + "px";
                spotifyModal.style.left = (spotifyModal.offsetLeft - pos1) + "px";
            }
        
            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        };
    }

    const categoryLinks = document.querySelectorAll('.categories-bar nav a');
    const sectionTitle = document.querySelector('.app-grid-container .section-title');
    const appCards = document.querySelectorAll('.app-card');

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Actualiza la clase activa de la categoría
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const category = link.getAttribute('data-category');

            // Actualiza el título de la sección
            if (category === 'todo') {
                sectionTitle.innerText = "Selecciones de los editores";
            } else {
                let catTitle = category.replace('-', ' ');
                catTitle = catTitle.charAt(0).toUpperCase() + catTitle.slice(1);
                sectionTitle.innerText = catTitle;
            }

            // Filtra las tarjetas de aplicaciones
            appCards.forEach(card => {
                if (category === "todo" || card.getAttribute('data-category') === category) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });

            // Desplaza la vista suavemente hacia el grid de aplicaciones
            document.querySelector('.app-grid-container').scrollIntoView({ behavior: "smooth" });
        });
    });
});
