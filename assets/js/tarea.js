document.addEventListener('DOMContentLoaded', function() {
    const tasksIcon = document.getElementById('tasksIcon');
    const tasksModal = document.getElementById('tasksModal');
    const tasksClose = document.getElementById('tasks-modal-close');
    const newTaskInput = document.getElementById('new-task');
    const tasksList = document.getElementById('tasks-list');
    const tasksModalHeader = tasksModal.querySelector('.tasks-modal-header');

    if (tasksIcon && tasksModal && tasksClose) {
//Abre el modal de tareas
        tasksIcon.addEventListener('click', function(e) {
            e.preventDefault();
            tasksModal.style.display = 'block';
        });

//cierra el modal de tareas
        tasksClose.addEventListener('click', function() {
            tasksModal.style.display = 'none';
        });

//cierra el modal al hacer clic fuera
        window.addEventListener('click', function(e) {
            if (e.target === tasksModal) {
                tasksModal.style.display = 'none';
            }
        });
    }

//Función para actualizar localStorage con las tareas actuales
    function updateLocalStorage() {
        const tasks = [];
        tasksList.querySelectorAll('li span:nth-child(2)').forEach((span) => {
            tasks.push(span.textContent);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

//deja crear y agregar una tarea
    function addTask(taskText) {
//crea el elemento li
        const li = document.createElement('li');

//crea el "checkbox" simulado
        const checkbox = document.createElement('span');
        checkbox.classList.add('task-checkbox');

        const textSpan = document.createElement('span');
        textSpan.textContent = taskText;

        const deleteBtn = document.createElement('span');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'x';
        deleteBtn.addEventListener('click', function() {
            tasksList.removeChild(li);
            updateLocalStorage();
        });

        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(deleteBtn);

        tasksList.appendChild(li);

        checkbox.addEventListener('click', function() {
            checkbox.classList.toggle('checked');
            textSpan.classList.toggle('completed');
        });

        updateLocalStorage();
    }

    let guardarTasks = JSON.parse(localStorage.getItem('tasks'));
    if (!guardarTasks || guardarTasks.length === 0) {
        guardarTasks = ['Huevo', 'Pan', 'Tomate', 'Leche', 'Cereales'];
        localStorage.setItem('tasks', JSON.stringify(guardarTasks));
    }
    guardarTasks.forEach(task => {
        addTask(task);
    });

    if (newTaskInput && tasksList) {
        newTaskInput.addEventListener('keydown', function(e) {
            if (e.key === "Enter") {
                const taskText = newTaskInput.value.trim();
                if (taskText !== '') {
                    addTask(taskText);
                    newTaskInput.value = '';
                }
            }
        });
    }

    if (tasksModalHeader) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        tasksModalHeader.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            if (!tasksModal.style.left || !tasksModal.style.top) {
                const rect = tasksModal.getBoundingClientRect();
                tasksModal.style.left = rect.left + "px";
                tasksModal.style.top = rect.top + "px";
            }
            tasksModal.style.transform = 'none';
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
            tasksModal.style.top = (tasksModal.offsetTop - pos2) + "px";
            tasksModal.style.left = (tasksModal.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
});