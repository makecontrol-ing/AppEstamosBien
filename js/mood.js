// mood.js
class MoodTracker {
    constructor() {
        this.moodOptions = document.querySelectorAll('.mood-btn');
        this.feedback = document.getElementById('moodFeedback');
        this.streakInfo = document.getElementById('streakInfo');
        this.today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        this.loadMood();
        this.updateStreak();
        this.setupListeners();
    }

    setupListeners() {
        this.moodOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                const mood = btn.dataset.mood;
                this.saveMood(mood);
            });
        });
    }

    saveMood(mood) {
        const moods = JSON.parse(localStorage.getItem('moods') || '[]');
        // Eliminar entrada de hoy si existe (permitir cambiar)
        const filtered = moods.filter(m => m.date !== this.today);
        filtered.push({ date: this.today, mood });
        localStorage.setItem('moods', JSON.stringify(filtered));
        this.loadMood();
        this.updateStreak();
    }

    loadMood() {
        const moods = JSON.parse(localStorage.getItem('moods') || '[]');
        const todayMood = moods.find(m => m.date === this.today);
        if (todayMood) {
            // Marcar botón activo
            this.moodOptions.forEach(btn => {
                btn.classList.toggle('selected', btn.dataset.mood === todayMood.mood);
            });
            // Mensaje empoderador
            const messages = {
                energico: '¡Tu energía está brillando! A por el día.',
                tranquilo: 'Estás en equilibrio. Disfruta la calma.',
                cansado: 'Es un buen momento para una pausa amable.',
                esperanzado: 'Esa chispa de esperanza es todo lo que necesitas.'
            };
            this.feedback.textContent = messages[todayMood.mood] || '';
        } else {
            this.moodOptions.forEach(btn => btn.classList.remove('selected'));
            this.feedback.textContent = '';
        }
    }

    updateStreak() {
        const moods = JSON.parse(localStorage.getItem('moods') || '[]');
        if (moods.length === 0) {
            this.streakInfo.textContent = '';
            return;
        }
        // Ordenar por fecha descendente
        moods.sort((a,b) => b.date.localeCompare(a.date));
        let streak = 0;
        const today = new Date(this.today);
        let checkDate = new Date(today);

        // Si hoy no hay registro, la racha no se rompe, simplemente no cuenta hoy.
        if (moods[0].date !== this.today) {
            // No hay registro hoy, la racha se calcula desde ayer
            checkDate.setDate(checkDate.getDate() - 1);
        }

        for (let mood of moods) {
            const moodDate = new Date(mood.date);
            if (moodDate.toDateString() === checkDate.toDateString()) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        if (streak > 0) {
            this.streakInfo.textContent = `&#127807; ${streak} día${streak > 1 ? 's' : ''} seguido cuidándote`;
        } else {
            this.streakInfo.textContent = '';
        }
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => new MoodTracker());