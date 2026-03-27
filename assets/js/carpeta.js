document.addEventListener('DOMContentLoaded', function() {

    window.currentFilePath = "/";

    const folderIcon = document.getElementById('folderIcon');
    const filesModal = document.getElementById('filesModal');
    const filesClose = document.getElementById('files-modal-close');
    const filesModalHeader = filesModal.querySelector('.files-modal-header');
    const filesList = document.getElementById('files-list');

//actualiza la lista de archivos y carpetas para que si se crea algo nuevo por terminal se puestre hay
    function updateFilesModal() {
        const filesList = document.getElementById("files-list");
        const currentPath = window.currentFilePath || "/home/mmm";
        const fs = window.fileSystem;
        filesList.innerHTML = "";

        if (currentPath !== "/home/mmm") {
//volver atrás
            const backLi = document.createElement("li");
            backLi.textContent = ".. (volver arriba)";
            backLi.classList.add("back-folder");
            filesList.appendChild(backLi);
            backLi.addEventListener("click", function() {
                let parts = currentPath.split("/").filter(Boolean);
                parts.pop();  
                window.currentFilePath = "/" + parts.join("/");
                if (window.currentFilePath === "/") {
                    window.currentFilePath = "/home/mmm";
                }
                updateFilesModal();
            });
        }

//archivos y carpetas
        const items = fs[currentPath] || [];
        items.forEach(item => {
            const li = document.createElement("li");
            const newPath = (currentPath === "/" ? "/" : currentPath + "/") + item;

            if (fs.hasOwnProperty(newPath)) {
                li.classList.add("folder");
                li.innerHTML = `<span style="margin-right:5px;">📁</span>${item}`;
            } else {
                li.classList.add("file-item");
                let iconHTML = `<span style="margin-right:5px;">📄</span>`; 
                const ext = item.split('.').pop().toLowerCase();
                if (["jpg", "jpeg", "png", "gif", "ico"].includes(ext)) {
                    iconHTML = `<span style="margin-right:5px;"><img src="assets/img/content/imagen.png" alt="imagen" style="width:16px;height:16px;"></span>`; 
                }
                else if (ext === "mp3") {
                    iconHTML = `<span style="margin-right:5px;"><img src="assets/img/icons/musica.png" alt="imagen" style="width:16px;height:16px;"></span>`;
                } else if (ext === "mp4") {
                    iconHTML = `<span style="margin-right:5px;"><img src="assets/img/icons/video.png" alt="imagen" style="width:16px;height:16px;"></span>`;
                } 
                else if (ext === "pdf") {
                    iconHTML = `<span style="margin-right:5px;"><img src="assets/img/icons/PDF.png" alt="imagen" style="width:16px;height:16px;"></span>`; 
                } else if (ext === "exe") {
                    iconHTML = `<span style="margin-right:5px;"><img src="assets/img/content/Rogue_Tower.jpg" alt="imagen" style="width:16px;height:16px;"></span>`; 
                }
                
                
                li.innerHTML = `${iconHTML}${item}`;
            }
            filesList.appendChild(li);

            li.addEventListener("click", function() {
                if (fs.hasOwnProperty(newPath)) {
                    window.currentFilePath = newPath;
                    updateFilesModal();
                } else {
//Abre archivo de texto o imagen dependiendo la extensión
                    const ext = item.split('.').pop().toLowerCase();
                    if (ext === "txt") {
                        openFileViewer("text", newPath, item);
                    } else if (["jpg", "jpeg", "png", "gif", "ico"].includes(ext)) {
                        openFileViewer("image", newPath, item);
                    } else {
                        alert("No se puede previsualizar el archivo: " + item);
                    }
                }
            });
        });

        if (items.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No hay archivos";
            li.classList.add("file-item");
            filesList.appendChild(li);
        }
    }

    window.updateFilesModal = updateFilesModal;

    if (folderIcon) {
        folderIcon.addEventListener('click', function(e) {
            e.preventDefault();
//Inicia en la carpeta del usuario mmm            
            window.currentFilePath = "/home/mmm"; 
            updateFilesModal();
            filesModal.style.display = 'block';
        });
    }

    if (filesClose) {
        filesClose.addEventListener('click', function() {
            filesModal.style.display = 'none';
        });
    }
    
//Deja mover el modal
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    filesModalHeader.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        filesModal.style.top = (filesModal.offsetTop - pos2) + "px";
        filesModal.style.left = (filesModal.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

//mostrando contenido de texto o imagen
    function openFileViewer(type, path, filename) {
        const viewer = document.getElementById("fileViewer");
        const viewerBody = document.getElementById("file-viewer-body");
        viewerBody.innerHTML = "";
        
        if (type === "text") {
            const content = (window.fileContents && window.fileContents[path]) ? window.fileContents[path] : "Contenido del archivo " + filename;
            const pre = document.createElement("pre");
            pre.textContent = content;
            viewerBody.appendChild(pre);
        } else if (type === "image") {
            const img = document.createElement("img");
            img.src = `assets/img/icons/${filename}`;
            img.alt = filename;
            img.style.maxWidth = "100%";
            img.style.height = "auto";document.addEventListener('DOMContentLoaded', function() {

    window.currentFilePath = "/";

    const folderIcon = document.getElementById('folderIcon');
    const filesModal = document.getElementById('filesModal');
    const filesClose = document.getElementById('files-modal-close');
    const filesModalHeader = filesModal.querySelector('.files-modal-header');
    const filesList = document.getElementById('files-list');

    function updateFilesModal() {
        const filesList = document.getElementById("files-list");
        const currentPath = window.currentFilePath || "/home/mmm";
        const fs = window.fileSystem;
        filesList.innerHTML = "";

        if (currentPath !== "/home/mmm") {
            const backLi = document.createElement("li");
            backLi.textContent = ".. (volver arriba)";
            backLi.classList.add("back-folder");
            filesList.appendChild(backLi);
            backLi.addEventListener("click", function() {
                let parts = currentPath.split("/").filter(Boolean);
                parts.pop();  
                window.currentFilePath = "/" + parts.join("/");
                if (window.currentFilePath === "/") {
                    window.currentFilePath = "/home/mmm";
                }
                updateFilesModal();
            });
        }

        const items = fs[currentPath] || [];
        items.forEach(item => {
            const li = document.createElement("li");
            const newPath = (currentPath === "/" ? "/" : currentPath + "/") + item;

            if (fs.hasOwnProperty(newPath)) {
                li.classList.add("folder");
                li.innerHTML = `<span style="margin-right:5px;">📁</span>${item}`;
            } else {
                li.classList.add("file-item");
                let iconHTML = `<span style="margin-right:5px;">📄</span>`; 
                const ext = item.split('.').pop().toLowerCase();
                if (["jpg", "jpeg", "png", "gif", "ico"].includes(ext)) {
                    iconHTML = `<span style="margin-right:5px;"><img src="/assets/img/imagen.png" alt="imagen" style="width:16px;height:16px;"></span>`; 
                }
                else if (ext === "mp3") {
                    iconHTML = `<span style="margin-right:5px;"><img src="/assets/img/musica.png" alt="musica" style="width:16px;height:16px;"></span>`;
                } else if (ext === "mp4") {
                    iconHTML = `<span style="margin-right:5px;"><img src="/assets/img/video.png" alt="video" style="width:16px;height:16px;"></span>`;
                } 
                else if (ext === "pdf") {
                    iconHTML = `<span style="margin-right:5px;"><img src="/assets/img/PDF.png" alt="PDF" style="width:16px;height:16px;"></span>`; 
                } else if (ext === "exe") {
                    iconHTML = `<span style="margin-right:5px;"><img src="/assets/img/Rogue_Tower.jpg" alt="ejecutable" style="width:16px;height:16px;"></span>`; 
                }
                
                li.innerHTML = `${iconHTML}${item}`;
            }
            filesList.appendChild(li);

            li.addEventListener("click", function() {
                if (fs.hasOwnProperty(newPath)) {
                    window.currentFilePath = newPath;
                    updateFilesModal();
                } else {
                    const ext = item.split('.').pop().toLowerCase();
                    if (ext === "txt") {
                        openFileViewer("text", newPath, item);
                    } else if (["jpg", "jpeg", "png", "gif", "ico"].includes(ext)) {
                        openFileViewer("image", newPath, item);
                    } else {
                        alert("No se puede previsualizar el archivo: " + item);
                    }
                }
            });
        });

        if (items.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No hay archivos";
            li.classList.add("file-item");
            filesList.appendChild(li);
        }
    }

    window.updateFilesModal = updateFilesModal;

    if (folderIcon) {
        folderIcon.addEventListener('click', function(e) {
            e.preventDefault();
            window.currentFilePath = "/home/mmm"; 
            updateFilesModal();
            filesModal.style.display = 'block';
        });
    }

    if (filesClose) {
        filesClose.addEventListener('click', function() {
            filesModal.style.display = 'none';
        });
    }
    
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    filesModalHeader.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        filesModal.style.top = (filesModal.offsetTop - pos2) + "px";
        filesModal.style.left = (filesModal.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function openFileViewer(type, path, filename) {
        const viewer = document.getElementById("fileViewer");
        const viewerBody = document.getElementById("file-viewer-body");
        viewerBody.innerHTML = "";
        
        if (type === "text") {
            const content = (window.fileContents && window.fileContents[path]) ? window.fileContents[path] : "Contenido del archivo " + filename;
            const pre = document.createElement("pre");
            pre.textContent = content;
            viewerBody.appendChild(pre);
        } else if (type === "image") {
            const img = document.createElement("img");
            img.src = `/assets/img/${filename}`;
            img.alt = filename;
            img.style.maxWidth = "100%";
            img.style.height = "auto";
            viewerBody.appendChild(img);
        }
        
        viewer.style.display = "flex";
    }

    const viewerClose = document.getElementById("file-viewer-close");
    viewerClose.addEventListener("click", function() {
        document.getElementById("fileViewer").style.display = "none";
    });
});
            viewerBody.appendChild(img);
        }
        
        viewer.style.display = "flex";
    }

//Cierra el visor al hacer click en el botón
    const viewerClose = document.getElementById("file-viewer-close");
    viewerClose.addEventListener("click", function() {
        document.getElementById("fileViewer").style.display = "none";
    });
});