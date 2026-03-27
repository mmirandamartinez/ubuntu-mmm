document.addEventListener('DOMContentLoaded', function() {
//Elementos principales del modal
    const firefoxModal = document.getElementById('firefoxModal');
    const firefoxClose = document.getElementById('firefox-close');
    const searchInput = document.getElementById('firefox-search-input');
    const searchButton = document.getElementById('firefox-search-button');
    const firefoxFrame = document.getElementById('firefox-frame');
    const firefoxModalHeader = firefoxModal.querySelector('.firefox-modal-header');
    const firefoxIcon = document.getElementById('firefoxIcon');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const favoritePages = document.getElementById('favoritePages');

//deja ver el modal al hacer click en el icono
    if (firefoxIcon) {
        firefoxIcon.addEventListener('click', function(e) {
            e.preventDefault();
            firefoxModal.style.display = 'block';
        });
    }

//cerrar la modal
    firefoxClose.addEventListener('click', function() {
        firefoxModal.style.display = 'none';
    });

//Cargar una URL en el iframe (agrega "http://" si es necesario)
    searchButton.addEventListener('click', function() {
        let url = searchInput.value.trim();
        if (url) {
            if (!/^https?:\/\//i.test(url)) {
                url = 'http://' + url;
            }
            firefoxFrame.src = url;
        }
    });

//buscar
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchButton.click();
        }
    });

//despiega la hamburgesa y muestra los favoritos
    hamburgerMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        favoritePages.style.display = favoritePages.style.display === 'block' ? 'none' : 'block';
    });
    
    document.addEventListener('click', function() {
        favoritePages.style.display = 'none';
    });
    
//Cargar la URL al hacer click en un favorito
    document.querySelectorAll('.favorite-pages ul li a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            firefoxFrame.src = url;
            favoritePages.style.display = 'none';
        });
    });
    
//Hacer que el modal se pueda mover
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    firefoxModalHeader.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

//Fijar posición inicial
        const rect = firefoxModal.getBoundingClientRect();
        firefoxModal.style.top = rect.top + "px";
        firefoxModal.style.left = rect.left + "px";
        firefoxModal.style.transform = 'none';
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

//Calcula y aplica el desplazamiento
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        firefoxModal.style.top = (firefoxModal.offsetTop - pos2) + "px";
        firefoxModal.style.left = (firefoxModal.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {

//Finaliza el arrastre eliminando eventos
        document.onmouseup = null;
        document.onmousemove = null;
    }
});