document.addEventListener('DOMContentLoaded', () => {
    // Ventanas y navegación
    document.getElementById('settingsApp').onclick = () => {
        document.getElementById('settingsModal').style.display = 'flex';
    };
    // Cerrar ventana
    document.getElementById('settings-close').onclick = () => {
        document.getElementById('settingsModal').style.display = 'none';
    };
    // Cambio de sección (cubre usuarios)
    document.querySelectorAll('.settings-sidebar li').forEach(btn => {
        btn.onclick = function() {
            document.querySelectorAll('.settings-sidebar li').forEach(b=>b.classList.remove('active'));
            this.classList.add('active');
            const sectionId = 'settings-' + this.dataset.settingsSection;
            document.querySelectorAll('.settings-section').forEach(sec=>
                sec.style.display = sec.id === sectionId ? 'block' : 'none'
            );
        }
    });

    // --- CONFIGURACIONES ADICIONALES ---
    const configFields = [
        {key: 'language', el: 'language-selector', def: 'es'},
        {key: 'hourFormat', el: 'hour-format', def: '24'},
        {key: 'blockScreenshots', el: 'block-screenshots', def: false, type:'checkbox'},
        {key: 'allowCamera', el: 'allow-camera', def: true, type:'checkbox'}
    ];

    configFields.forEach(field => {
        const el = document.getElementById(field.el);
        if (!el) return;

        if (field.type === 'checkbox') {
            el.onchange = saveSettings;
        } else {
            el.oninput = saveSettings;
        }
    });
    // --- GESTIÓN DE USUARIOS ---
    function renderUsers() {
        const userList = document.getElementById('user-list');
        if (!userList) return;
        userList.innerHTML = '';
        const users = getUsers();
        if (users.length === 0) {
            userList.innerHTML = '<p style="text-align:center; color:#aaa">No hay usuarios aún.</p>';
        } else {
            users.forEach(user => {
                const div = document.createElement('div');
                div.className = 'user-card';
                div.innerHTML = `
                    <img src="assets/img/icons/mmm.png" alt="${user.username}" class="user-avatar">
                    <div class="user-meta">
                        <span class="user-name">${user.username}</span>
                        <span class="user-email">${user.useremail}</span>
                        <span class="user-type">${user.usertype}</span>
                    </div>
                    <button class="user-btn" disabled>Activo</button>
                `;
                userList.appendChild(div);
            });
        }
    }

    function getUsers() {
        const stored = localStorage.getItem('ubuntuUsers');
        if (!stored) return [
            {
                username: "mmm",
                useremail: "admin@ubuntu.com",
                userpassword: "1234",
                usertype: "Usuario principal"
            }
        ];
        try {
            const out = JSON.parse(stored);
            return Array.isArray(out) ? out : [];
        } catch {
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem('ubuntuUsers', JSON.stringify(users));
    }

    const addUserForm = document.getElementById('add-user-form');
    if(addUserForm){
        addUserForm.onsubmit = function(e){
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const useremail = document.getElementById('useremail').value.trim();
            const userpassword = document.getElementById('userpassword').value.trim();
            const usertype = document.getElementById('usertype').value;
            const error = document.getElementById('user-error');
            error.style.display = 'none';
            // Validaciones simples
            if (!username || !useremail || !userpassword || !usertype) {
                error.textContent = "Todos los campos son obligatorios";
                error.style.display = 'inline';
                return;
            }
            if (!/^[^@]+@[^@]+\.[a-z]{2,}$/i.test(useremail)) {
                error.textContent = "Email inválido";
                error.style.display = 'inline';
                return;
            }
            if (userpassword.length < 4) {
                error.textContent = "La contraseña debe tener al menos 4 caracteres";
                error.style.display = 'inline';
                return;
            }
            // Si el email ya existe
            const users = getUsers();
            if (users.some(u => u.useremail === useremail)) {
                error.textContent = "Ya existe un usuario con ese email";
                error.style.display = 'inline';
                return;
            }
            users.push({ username, useremail, userpassword, usertype });
            saveUsers(users);
            renderUsers();
            addUserForm.reset();
        };
    }

    // —— DRAG Movilidad (como terminal) ——
    const settingsModal = document.getElementById('settingsModal');
    const settingsHeader = document.getElementById('settingsHeader');
    let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0, dragging = false;

    settingsHeader.onmousedown = function(e) {
        dragging = true;
        mouseX = e.clientX;
        mouseY = e.clientY;
        // get current window position
        const rect = settingsModal.getBoundingClientRect();
        offsetX = mouseX - rect.left;
        offsetY = mouseY - rect.top;
        document.onmousemove = dragSettingsModal;
        document.onmouseup = stopDragSettingsModal;
    };

    function dragSettingsModal(e) {
        if (!dragging) return;
        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;
        // Mantener la ventana dentro de la pantalla
        newLeft = Math.max(0, Math.min(window.innerWidth - settingsModal.offsetWidth, newLeft));
        newTop = Math.max(12, Math.min(window.innerHeight - settingsModal.offsetHeight, newTop));
        settingsModal.style.left = newLeft + 'px';
        settingsModal.style.top = newTop + 'px';
    }
    function stopDragSettingsModal() {
        dragging = false;
        document.onmousemove = null;
        document.onmouseup = null;
    }

    // Función para aplicar el tamaño de fuente
    function applyFontSize(size) {
        document.body.style.fontSize = size + 'px';
    }

    // Guardar preferencias en localStorage
    function saveSettings() {
        const size = document.getElementById('font-size-range').value;
        applyFontSize(size);
        
        const settings = {
            darkMode: document.getElementById('toggle-dark').checked,
            fontSize: size,
            highContrast: document.getElementById('toggle-contrast').checked,
            notif: document.getElementById('toggle-notif')?.checked || false
        };
        
        // Guardar configuraciones adicionales
        configFields.forEach(field => {
            const el = document.getElementById(field.el);
            if(!el) return;
            if(field.type === 'checkbox')
                settings[field.key] = el.checked;
            else
                settings[field.key] = el.value;
        });
        
        localStorage.setItem('ubuntuSettings', JSON.stringify(settings));
    }
    
    // Cargar preferencias guardadas
    function loadSettings() {
        const savedSettings = localStorage.getItem('ubuntuSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // Aplicar modo oscuro
            document.getElementById('toggle-dark').checked = !!settings.darkMode;
            document.body.classList.toggle('dark-mode-ubuntu', settings.darkMode);
            
            // Aplicar tamaño de fuente
            document.getElementById('font-size-range').value = settings.fontSize || 16;
            applyFontSize(settings.fontSize || 16);
            
            // Aplicar contraste
            document.getElementById('toggle-contrast').checked = !!settings.highContrast;
            document.body.classList.toggle('alt-contrast', settings.highContrast);
            
            // Aplicar notificaciones
            const notifToggle = document.getElementById('toggle-notif');
            if (notifToggle) {
                notifToggle.checked = !!settings.notif;
            }
            
            // Aplicar configuraciones adicionales
            configFields.forEach(field => {
                const el = document.getElementById(field.el);
                if(!el) return;
                if(field.type === 'checkbox')
                    el.checked = settings[field.key] !== undefined ? !!settings[field.key] : field.def;
                else
                    el.value = settings[field.key] || field.def;
            });
        }
    }
    
    // Guardar cambios cuando se modifican las preferencias
    document.getElementById('toggle-dark').addEventListener('change', saveSettings);
    document.getElementById('font-size-range').addEventListener('input', saveSettings);
    document.getElementById('toggle-contrast').addEventListener('change', saveSettings);
    
    const notifToggle = document.getElementById('toggle-notif');
    if (notifToggle) {
        notifToggle.addEventListener('change', saveSettings);
    }
    
    // Cargar preferencias al iniciar
    loadSettings();
    renderUsers();
});
