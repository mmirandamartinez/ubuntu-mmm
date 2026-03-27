document.addEventListener('DOMContentLoaded', function() {
    const spotifyModal = document.getElementById("spotifyModal");
    const spotifyClose = document.getElementById("spotify-close");
    const spotifyModalBody = spotifyModal.querySelector(".spotify-modal-body");
    
    // Inyectar reproductor de Spotify en el cuerpo del modal
    if (spotifyModalBody) {
        spotifyModalBody.innerHTML = '<iframe class="spotify-player" src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M" allow="encrypted-media" allowtransparency="true"></iframe>';
    }
    
    // Función para cerrar el modal de Spotify
    if (spotifyClose && spotifyModal) {
        spotifyClose.addEventListener('click', function() {
            spotifyModal.style.display = "none";
        });
    }
    
    // Hacer que el modal de Spotify sea "draggable" (móvil arrastrable)
    const spotifyModalHeader = spotifyModal.querySelector(".spotify-modal-header");
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    if (spotifyModalHeader) {
        spotifyModalHeader.style.cursor = 'move';
        spotifyModalHeader.onmousedown = dragMouseDown;
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
        spotifyModal.style.top = (spotifyModal.offsetTop - pos2) + "px";
        spotifyModal.style.left = (spotifyModal.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
});
