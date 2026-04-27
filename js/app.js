// app.js - Carga el nombre guardado y maneja el saludo
document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const welcomeMessage = document.getElementById('welcomeMessage');

    // Cargar nombre guardado
    const savedName = localStorage.getItem('userName') || '';
    if (savedName) {
        nameInput.value = savedName;
        welcomeMessage.textContent = `¡Buenos días, ${savedName}!`;
    }

    // Guardar al escribir
    nameInput.addEventListener('input', () => {
        const name = nameInput.value.trim();
        localStorage.setItem('userName', name);
        if (name) {
            welcomeMessage.textContent = `¡Hola, ${name}!`;
        } else {
            welcomeMessage.textContent = '';
        }
    });

    // Opcional: saludo según hora del día
    function updateGreeting() {
        const hour = new Date().getHours();
        if (savedName) {
            if (hour < 12) welcomeMessage.textContent = `¡Buenos días, ${savedName}!`;
            else if (hour < 18) welcomeMessage.textContent = `¡Buenas tardes, ${savedName}!`;
            else welcomeMessage.textContent = `¡Buenas noches, ${savedName}!`;
        }
    }
    if (savedName) updateGreeting();
});