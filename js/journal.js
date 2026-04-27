// journal.js
class GratitudeJournal {
    constructor() {
        this.input = document.getElementById('gratitudeInput');
        this.saveBtn = document.getElementById('saveGratitudeBtn');
        this.list = document.getElementById('gratitudeList');

        this.loadEntries();
        this.saveBtn.addEventListener('click', () => this.addEntry());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.addEntry();
            }
        });
    }

    addEntry() {
        const text = this.input.value.trim();
        if (!text) return;
        const entries = this.getEntries();
        const entry = {
            id: Date.now(),
            date: new Date().toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long' }),
            text
        };
        entries.unshift(entry);
        localStorage.setItem('gratitudeEntries', JSON.stringify(entries));
        this.input.value = '';
        this.loadEntries();
    }

    getEntries() {
        return JSON.parse(localStorage.getItem('gratitudeEntries') || '[]');
    }

    loadEntries() {
        const entries = this.getEntries();
        this.list.innerHTML = '';
        if (entries.length === 0) {
            this.list.innerHTML = '<li style="color:var(--text-light)">Aún no has escrito nada. Un pequeño detalle puede iluminar el día.</li>';
            return;
        }
        entries.forEach(entry => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${entry.text} <small style="color:var(--text-light)">${entry.date}</small></span>
                <button class="delete-btn" data-id="${entry.id}">&#10006;</button>
            `;
            this.list.appendChild(li);
        });

        // Agregar listeners a los botones de eliminar
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.target.dataset.id);
                this.deleteEntry(id);
            });
        });
    }

    deleteEntry(id) {
        let entries = this.getEntries();
        entries = entries.filter(entry => entry.id !== id);
        localStorage.setItem('gratitudeEntries', JSON.stringify(entries));
        this.loadEntries();
    }
}

document.addEventListener('DOMContentLoaded', () => new GratitudeJournal());