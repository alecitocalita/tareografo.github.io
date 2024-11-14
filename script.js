let tasks = [];

function addTask() {
    const taskName = document.getElementById('taskName').value;
    const dueDate = document.getElementById('dueDate').value;
    
    if (!taskName || !dueDate) {
        alert('Por favor, llena todos los campos');
        return;
    }
    
    const task = {
        id: Date.now(),
        name: taskName,
        dueDate: new Date(dueDate),
        expired: false
    };

    tasks.push(task);
    document.getElementById('taskName').value = '';
    document.getElementById('dueDate').value = '';
    renderTasks();
    checkNotifications();
}

function renderTasks() {
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = task.expired ? 'expired' : '';
        
        // Texto "Tarea Expirada" si la tarea está vencida
        const taskStatus = task.expired ? `<span class="task-status">Tarea Expirada</span>` : '';
        
        taskItem.innerHTML = `
            <span>${task.name} - ${task.dueDate.toLocaleDateString()} ${taskStatus}</span>
            <div class="task-actions">
                <button class="edit" onclick="editTask(${task.id})">Editar</button>
                <button onclick="deleteTask(${task.id})">Eliminar</button>
            </div>
        `;

        // Notificación para tareas que vencen mañana
        if (!task.expired && isDueTomorrow(task.dueDate)) {
            const notification = document.createElement('span');
            notification.className = 'notification';
            notification.innerText = '¡Vence Mañana!';
            taskItem.appendChild(notification);
        }

        taskList.appendChild(taskItem);
    });
}

function organizeTasksAI() {
    // Ordena las tareas en función de la fecha de entrega más cercana a la más lejana
    tasks.sort((a, b) => a.dueDate - b.dueDate);
    renderTasks();
    alert("Tareas organizadas con éxito de acuerdo a su proximidad de entrega.");
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    const newName = prompt('Edita el nombre de la tarea:', task.name);
    const newDueDate = prompt('Edita la fecha de entrega (YYYY-MM-DD):', task.dueDate.toISOString().split('T')[0]);

    if (newName) task.name = newName;
    if (newDueDate) task.dueDate = new Date(newDueDate);
    task.expired = isExpired(task.dueDate);

    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

function isExpired(dueDate) {
    const today = new Date();
    return dueDate < today;
}

function isDueTomorrow(dueDate) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return dueDate.toDateString() === tomorrow.toDateString();
}

function checkNotifications() {
    const today = new Date();
    tasks.forEach(task => {
        if (isDueTomorrow(task.dueDate)) {
            alert(`Recordatorio: La tarea "${task.name}" vence mañana`);
        }

        task.expired = isExpired(task.dueDate);
    });

    renderTasks();
}

setInterval(checkNotifications, 60000); // Verifica cada minuto
