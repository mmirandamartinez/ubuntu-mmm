document.addEventListener('DOMContentLoaded', function() {
    const fileSystem = {
        "/": ["bin", "boot", "dev", "etc", "home", "lib", "media", "mnt", "opt", "proc", "root", "run", "sbin", "srv", "sys", "tmp", "usr", "var"],
        "/home": ["mmm"],
        "/home/mmm": ["Escritorio", "Documentos", "Descargas", "Imagenes", "Musica"],
        "/home/mmm/Escritorio": ["comandos.txt"],
        "/home/mmm/Documentos": ["cv.pdf", "secreto"],
        "/home/mmm/Documentos/secreto": ["nohaynada"],
        "/home/mmm/Documentos/secreto/nohaynada": ["aquinohaynada"],
        "/home/mmm/Documentos/secreto/nohaynada/aquinohaynada": ["secretito.txt"],
        "/home/mmm/Descargas": ["Rogue_Tower.exe", "imagen.png"],
        "/home/mmm/Imagenes": ["foto.jpg", "mmm.ico", "lil.gif"],
        "/home/mmm/Musica": ["labamba.mp3", "lacasaporeltejado.mp3", "pincesitakelly.mp3"],
    };

    let currentPath = "/home/mmm";
    let editingMode = false;
    let currentNanoFile = "";
    let editingBuffer = "";
    let currentUser = "mmm"; 
    const rootPassword = "toor"; // contraseña de root (simulada)
    let expectingPassword = false;
    const restrictedDirs = {
        "root": ["/bin", "/root"], 
    };

    const fileContents = {
        "/home/mmm/Documentos/cv.pdf": "https://mmirandamartinez.com/assets/Manuel_Miranda_Martínez.pdf",
        "/home/mmm/Documentos/secreto/nohaynada/aquinohaynada/secretito.txt": "01001000 01101111 01101100 01100001 00101100 00100000 01100010 01110101 01100101 01101110 01100001 01110011 00101110 00001010 01010011 01100101 01100111 01110101 01110010 01100001 01101101 01100101 01101110 01110100 01100101 00100000 01100101 01110011 01110100 11000011 10100001 01110011 00100000 01110100 01110010 01100001 01100100 01110101 01100011 01101001 01100101 01101110 01100100 01101111 00100000 01100101 01110011 01110100 01101111 00100000 01100100 01100101 00100000 01100010 01101001 01101110 01100001 01110010 01101001 01101111 00100000 01100001 00100000 01110100 01100101 01111000 01110100 01101111 00101100 00100000 01111001 00100000 01101100 01101111 00100000 11000011 10111110 01101110 01101001 01100011 01101111 00100000 01110001 01110101 01100101 00100000 01110001 01110101 01100101 01110010 01101001 01100001 00100000 01100100 01100101 01100011 01101001 01110010 00100000 01100101 01110011 00111010 00100000 01100111 01110010 01100001 01100011 01101001 01100001 01110011 00100000 01110000 01101111 01110010 00100000 01110100 01110101 00100000 01110100 01101001 01100101 01101101 01110000 01101111 00101110 00001010 01001110 01101111 00100000 01101000 01100001 01111001 00100000 01101110 01100001 01100100 01100001 00100000 01110010 01100101 01100001 01101100 01101101 01100101 01101110 01110100 01100101 00100000 01101001 01101101 01110000 01101111 01110010 01110100 01100001 01101110 01110100 01100101 00100000 01100101 01101110 00100000 01100101 01110011 01110100 01100101 00100000 01101101 01100101 01101110 01110011 01100001 01101010 01100101 00101100 00100000 01100011 01101111 01101101 01101111 00100000 01111010 01100001 00100000 01100101 01110011 01110100 01100001 01110010 11000011 10100001 01110011 00100000 01110110 01101001 01100101 01101110 01100100 01101111 00101100 00100000 01110000 01100101 01110010 01101111 00100000 01100010 01110101 01100101 01101110 01101111 E2 80 A6 00100000 01100111 01110010 01100001 01100011 01101001 01100001 01110011 00100000 01110000 01101111 01110010 00100000 01110110 01101001 01110011 01101001 01110100 01100001 01110010 00100000 01101101 01101001 00100000 01110000 01100001 01100111 01101001 01101110 01100001 00100000 01111001 00100000 01110100 01101111 01101101 01100001 01110010 01110100 01100101 00100000 01110101 01101110 00100000 01101101 01101111 01101101 01100101 01101110 01110100 01101111 00100000 01110000 01100001 01110010 01100001 00100000 01110110 01100101 01110010 01101100 01100001 00101110 00100000 110000A1 01010101 01101110 00100000 01110011 01100001 01101100 01110101 01100100 01101111 00100001",
        "/home/mmm/Imagenes/lil.gif": "assets/img/content/lil.gif",
        "/home/mmm/Descargas/image.png": "assets/img/content/imagen.png",
        "/home/mmm/Descargas/setup.exe": "assets/img/content/setup.exe",
        "/home/mmm/Imagenes/fotos.jpg": "assets/img/content/foto.jpg",
        "/home/mmm/Imagenes/mmm.gif": "assets/img/icons/mmm.ico",
        "/home/mmm/Escritorio/comandos.txt": "Comando\tDescripción\n" +
            "ls\tLista los archivos y carpetas en el directorio actual.\n" +
            "cd carpeta\tCambia al directorio indicado. Si es cd .. sube un nivel.\n" +
            "pwd\tMuestra la ruta completa del directorio actual.\n" +
            "mkdir nombre\tCrea un nuevo directorio en la ruta actual.\n" +
            "rmdir nombre\tElimina un directorio vacío.\n" +
            "rm nombre\tElimina un archivo o carpeta solo si está vacío.\n" +
            "echo texto\tMuestra texto en pantalla.\n" +
            "echo texto archivo\tCrea o sobreescribe un archivo con el texto indicado.\n" +
            "nano archivo\tEntra en modo de edición para escribir en un archivo, sales con :y.\n" +
            "clear\tLimpia toda la pantalla del terminal."
                .split("\n")
                .map(line => `<p>${line}</p>`)
                .join(""),
    };

    window.fileContents = fileContents; 

    const terminalIcon = document.querySelector('.icon img[alt="Terminal"]');
    const terminalModal = document.getElementById('terminalModal');
    const terminalClose = document.getElementById('terminal-close');

    if (terminalIcon) {
        terminalIcon.addEventListener('click', function(event) {
            event.stopPropagation();
            terminalModal.classList.add('active');
        });
    }

    if (terminalClose) {
        terminalClose.addEventListener('click', function() {
            terminalModal.classList.remove('active');
        });
    }

    const modalHeader = terminalModal.querySelector('.terminal-modal-header');
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    modalHeader.onmousedown = dragMouseDown;

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
        terminalModal.style.top = (terminalModal.offsetTop - pos2) + "px";
        terminalModal.style.left = (terminalModal.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.querySelector('.terminal-output');

    function appendOutput(text) {
        const p = document.createElement('p');
        p.textContent = text;
        terminalOutput.appendChild(p);
        p.scrollIntoView({ behavior: 'smooth' });
    }

    function showPrompt() {
        appendOutput(`${currentPath} $ `);
    }

    // Función auxiliar para actualizar la lista del directorio padre
    function updateParentListing(parentPath, itemName, action = "add") {
        if (!fileSystem[parentPath]) return;
        if (action === "add") {
            if (!fileSystem[parentPath].includes(itemName)) {
                fileSystem[parentPath].push(itemName);
            }
        } else if (action === "remove") {
            fileSystem[parentPath] = fileSystem[parentPath].filter(item => item !== itemName);
        }
    }

    function checkPermissions(path) {
        if (currentUser !== "root" && restrictedDirs.root.some(dir => path.startsWith(dir))) {
            return false;
        }
        return true;
    }

    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === "Enter") {
            if (editingMode) {
                let command = terminalInput.value;
                terminalInput.value = '';
                if (command.trim() === ":y") {
                    fileContents[currentNanoFile] = editingBuffer;
                    const lastSlashIndex = currentNanoFile.lastIndexOf('/');
                    const directory = currentNanoFile.substring(0, lastSlashIndex) || "/";
                    const filename = currentNanoFile.substring(lastSlashIndex + 1);
                    if (fileSystem[directory] && !fileSystem[directory].includes(filename)) {
                        fileSystem[directory].push(filename);
                    }
                    appendOutput(`Archivo ${filename} guardado con contenido: ${editingBuffer}`);
                    editingMode = false;
                    currentNanoFile = "";
                    editingBuffer = "";
                    showPrompt();
                } else {
                    editingBuffer += command + "\n";
                }
            } else {
                const command = terminalInput.value.trim();
                appendOutput(`${currentPath} $ ${command}`);
                processCommand(command);
                terminalInput.value = '';
                if (!editingMode) {
                    showPrompt();
                }
            }
        } else if (e.key === "Tab") {
            e.preventDefault();
            completeCommand();
        }
    });

    function completeCommand() {
        const currentInput = terminalInput.value.trim();
        const currentDir = fileSystem[currentPath] || [];
        const matchedItems = currentDir.filter(item => item.startsWith(currentInput));

        if (matchedItems.length === 1) {
            terminalInput.value = matchedItems[0] + " ";
        } else if (matchedItems.length > 1) {
            appendOutput(matchedItems.join("   "));
        }
    }

    function processCommand(command) {
        if (command === "") return;

        if (command === "ls") {
            const items = fileSystem[currentPath] || [];
            appendOutput(items.join("   "));
        }
        else if (command.startsWith("cd ")) {
            const folder = command.substring(3).trim();
            if (!checkPermissions(folder)) {
                appendOutput(`bash: cd: ${folder}: Permiso denegado`);
                return;
            }
            const adminDirs = ["bin", "boot", "dev", "etc", "lib", "media", "mnt", "opt", "proc", "root", "run", "sbin", "srv", "sys", "tmp", "usr", "var"];
            if (adminDirs.includes(folder)) {
                appendOutput(`bash: cd: ${folder}: Se requieren privilegios de administrador`);
            } else if (folder === "..") {
                if (currentPath !== "/") {
                    const parts = currentPath.split("/");
                    parts.pop();
                    currentPath = parts.length === 1 ? "/" : parts.join("/");
                }
            } else {
                let newPath = currentPath === "/" ? "/" + folder : currentPath + "/" + folder;
                if (fileSystem[newPath]) {
                    currentPath = newPath;
                } else {
                    appendOutput(`bash: cd: ${folder}: No existe el directorio`);
                }
            }
        }
        else if (command === "pwd") {
            appendOutput(currentPath);
        }
        else if (command.startsWith("mkdir ")) {
            const dirName = command.substring(6).trim();
            let newDir = currentPath === "/" ? "/" + dirName : currentPath + "/" + dirName;
            if (!fileSystem[newDir]) {
                fileSystem[newDir] = [];
                updateParentListing(currentPath, dirName, "add");
                appendOutput(`Directorio ${dirName} creado`);
                showLs();  
            } else {
                appendOutput(`bash: mkdir: no se puede crear el directorio: El directorio ya existe`);
            }
        }
        else if (command.startsWith("rm ")) {
            const fileName = command.substring(3).trim();
            let fullPath = currentPath === "/" ? "/" + fileName : currentPath + "/" + fileName;

            if (fileSystem[currentPath] && fileSystem[currentPath].includes(fileName)) {

                if (fileSystem.hasOwnProperty(fullPath)) {
                    appendOutput(`bash: rm: ${fileName} es un directorio`);
                } else {
                    delete fileContents[fullPath];
                    updateParentListing(currentPath, fileName, "remove");
                    appendOutput(`Archivo ${fileName} eliminado`);
                    showLs();  
                }
            } else {
                appendOutput(`bash: rm: No existe el archivo`);
            }
        }
        else if (command.startsWith("rmdir ")) {
            const dirName = command.substring(6).trim();
            let fullPath = currentPath === "/" ? "/" + dirName : currentPath + "/" + dirName;
            if (fileSystem[currentPath] && fileSystem[currentPath].includes(dirName)) {
                if (fileSystem.hasOwnProperty(fullPath)) {
                    if (fileSystem[fullPath].length === 0) {
                        delete fileSystem[fullPath];
                        updateParentListing(currentPath, dirName, "remove");
                        appendOutput(`Directorio ${dirName} eliminado`);
                        showLs();  
                    } else {
                        appendOutput(`bash: rmdir: El directorio no está vacío`);
                    }
                } else {
                    appendOutput(`bash: rmdir: ${dirName} no es un directorio`);
                }
            } else {
                appendOutput(`bash: rmdir: El directorio no existe`);
            }
        }
        else if (command.startsWith("echo")) {
            const parts = command.split(">");
            if (parts.length > 1) {
                const text = parts[0].trim().substring(5).trim();
                const fileName = parts[1].trim();
                let fullPath = currentPath === "/" ? "/" + fileName : currentPath + "/" + fileName;
                fileContents[fullPath] = text;
                updateParentListing(currentPath, fileName, "add");
                appendOutput(`Texto "${text}" guardado en el archivo ${fileName}`);
                showLs();  
            } else {
                appendOutput(command.substring(5).trim());
            }
        }
        else if (command.startsWith("nano")) {
            const fileName = command.substring(5).trim();
            let fullPath = currentPath === "/" ? "/" + fileName : currentPath + "/" + fileName;
            editingMode = true;
            currentNanoFile = fullPath;
            editingBuffer = fileContents[fullPath] || "";
            appendOutput(`nano: Editando ${fileName}. Escriba su contenido y use ":y" para guardar y salir.`);
        }
        else if (command.startsWith("cat ")) {
            const fileName = command.substring(4).trim();
            let fullPath = currentPath === "/" ? "/" + fileName : currentPath + "/" + fileName;
            if (fileSystem[currentPath] && fileSystem[currentPath].includes(fileName)) {
                const imgExtensions = [".png", ".jpg", ".jpeg", ".gif", ".ico", ".pdf"];
                const binaryExtensions = [".exe"];
                if (imgExtensions.some(ext => fileName.toLowerCase().endsWith(ext))) {
                    const img = document.createElement("img");
                    const src = fileContents.hasOwnProperty(fullPath) && fileContents[fullPath].trim().length > 0 
                                ? fileContents[fullPath].trim() 
                                : `.${currentPath}/${fileName}`;
                    img.src = src;
                    img.alt = fileName;
                    terminalOutput.appendChild(img);
                    img.scrollIntoView({ behavior: 'smooth' });
                } else if (binaryExtensions.some(ext => fileName.toLowerCase().endsWith(ext))) {
                    appendOutput(`cat: ${fileName}: archivo binario no se puede mostrar`);
                } else if (fileSystem.hasOwnProperty(fullPath)) {
                    appendOutput(`cat: ${fileName}: es un directorio`);
                } else {
                    appendOutput(fileContents.hasOwnProperty(fullPath) ? fileContents[fullPath] : "");
                }
            } else {
                appendOutput(`cat: ${fileName}: No existe el archivo`);
            }
        }
        else if (command.startsWith("grep ")) {
            const [_, pattern, file] = command.match(/grep "(.+)" (.+)/) || [];
            if (!pattern || !file) {
                appendOutput("Uso: grep \"patrón\" archivo");
                return;
            }
            const fullPath = `${currentPath}/${file}`.replace('//', '/');
            if (fileContents[fullPath]) {
                const lines = fileContents[fullPath].split('\n');
                const matches = lines.filter(line => line.includes(pattern));
                appendOutput(matches.join('\n'));
            } else {
                appendOutput(`grep: ${file}: No existe el archivo`);
            }
        }
        else if (command.startsWith("chmod ")) {
            appendOutput("chmod: Permisos simulados (no implementados en esta versión)");
        }
        else if (command === "su root" || command === "sudo su" || command === "sudo -i") {
            appendOutput("Contraseña:");
            expectingPassword = true;
            // El próximo input será tratado como contraseña
        }
        else if (expectingPassword) {
            if (command === rootPassword) {
                currentUser = "root";
                currentPath = "/root"; // Cambia al directorio de root
                appendOutput("root@ubuntu:~#");
            } else {
                appendOutput("su: Autenticación fallida");
            }
            expectingPassword = false;
        }
        else if (command === "exit" || command === "logout") {
            if (currentUser === "root") {
                currentUser = "mmm";
                currentPath = "/home/mmm";
                appendOutput("mmm@ubuntu:~$");
            }
        }
        else if (command === "clear") {
            terminalOutput.innerHTML = "";
        }
        else {
            appendOutput(`bash: ${command}: comando no encontrado`);
        }
        
    }

    function showLs() {
        const items = fileSystem[currentPath] || [];
        appendOutput(items.join("   "));
    }

    showPrompt();
    window.currentPath = currentPath;
    window.fileSystem = fileSystem;
});
