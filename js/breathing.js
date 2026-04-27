class BreathingExercise {
    constructor() {
        // Elementos DOM
        this.circle = document.getElementById('breathCircle');
        this.wavesContainer = document.getElementById('breathWaves');
        this.timerDisplay = document.getElementById('breathTimer');
        this.instruction = document.getElementById('breathInstruction');
        this.phaseDetail = document.getElementById('breathPhaseDetail');
        this.counterDisplay = document.getElementById('breathCounter');
        this.startBtn = document.getElementById('breathStartBtn');
        this.startIcon = document.getElementById('startIcon');
        this.startText = document.getElementById('startText');
        this.patternSelect = document.getElementById('patternSelect');
        this.postActions = document.getElementById('postBreathActions');
        this.breathSummary = document.getElementById('breathSummary');

        // Patrones con metáforas
        this.patterns = {
            '4-7-8': { inhale: 4, hold: 7, exhale: 8 },
            '4-4-4': { inhale: 4, hold: 4, exhale: 4 },
            '4-4-4-4': { inhale: 4, hold: 4, exhale: 4, hold2: 4 }, // cuadrado
            '4-6': { inhale: 4, hold: 0, exhale: 6 },
            '5-5': { inhale: 5, hold: 0, exhale: 5 },
            '4-2-6': { inhale: 4, hold: 2, exhale: 6 }
        };

        this.pattern = '4-7-8';
        this.cycles = 4;
        this.currentCycle = 0;
        this.isRunning = false;
        this.timeouts = [];
        this.phase = '';

        // Escala del círculo
        this.minScale = 0.6;
        this.maxScale = 1.5;

        // Cargar preferencia guardada
        const savedPattern = localStorage.getItem('breathPattern');
        if (savedPattern && this.patterns[savedPattern]) {
            this.pattern = savedPattern;
            this.patternSelect.value = savedPattern;
        }

        // Eventos
        this.startBtn.addEventListener('click', () => this.startStop());
        this.patternSelect.addEventListener('change', () => this.updatePattern());

        // Configurar botón post-respiración
        const linkBtn = document.getElementById('linkToMoodBtn');
        if (linkBtn) {
            linkBtn.addEventListener('click', () => {
                const moodSection = document.getElementById('moodSection');
                if (moodSection) moodSection.scrollIntoView({ behavior: 'smooth' });
            });
        }

        this.resetView();
    }

    updatePattern() {
        if (this.isRunning) return;
        this.pattern = this.patternSelect.value;
        localStorage.setItem('breathPattern', this.pattern);
    }

    resetView() {
        this.circle.style.transition = 'transform 0.3s ease, background 0.3s, box-shadow 0.3s';
        this.circle.style.transform = `scale(1)`;
        this.circle.className = 'breath-circle';
        this.instruction.textContent = 'Inhala';
        this.phaseDetail.textContent = '';
        this.timerDisplay.textContent = '';
        this.counterDisplay.textContent = `Ciclo 0/${this.cycles}`;
        this.currentCycle = 0;
        this.phase = 'inhale';
        this.startIcon.innerHTML = '▶️';
        this.startText.textContent = 'Iniciar';
        this.clearWaves();
        if (this.postActions) this.postActions.style.display = 'none';
        if (this.breathSummary) this.breathSummary.innerHTML = '';
    }

    clearWaves() {
        if (this.wavesContainer) {
            this.wavesContainer.innerHTML = '';
        }
    }

    stop() {
        // Limpiar todos los temporizadores
        this.timeouts.forEach(t => {
            if (t.clear) t.clear();
            else clearTimeout(t);
        });
        this.timeouts = [];
        this.isRunning = false;

        this.circle.style.transition = 'transform 0.3s ease, background 0.3s, box-shadow 0.3s';
        this.circle.style.transform = `scale(1)`;
        this.circle.className = 'breath-circle';
        this.timerDisplay.textContent = '';
        this.startIcon.innerHTML = '▶️';
        this.startText.textContent = 'Iniciar';
        this.instruction.textContent = 'Inhala';
        this.phaseDetail.textContent = '';
        this.counterDisplay.textContent = `Ciclo 0/${this.cycles}`;
        this.currentCycle = 0;
        this.phase = 'inhale';
        this.startBtn.disabled = false;

        this.clearWaves();
        this.showSessionSummary();
        if (this.postActions) this.postActions.style.display = 'block';
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.startBtn.disabled = false;
        this.startIcon.innerHTML = '⏸️';
        this.startText.textContent = 'Pausar';
        this.currentCycle = 0;
        this.phase = 'inhale';
        this.clearWaves();
        if (this.postActions) this.postActions.style.display = 'none';
        if (this.breathSummary) this.breathSummary.innerHTML = '';

        this.runCycle(0);
    }

    runCycle(cycleIndex) {
        if (!this.isRunning) return;
        if (cycleIndex >= this.cycles) {
            this.stop();
            return;
        }
        this.currentCycle = cycleIndex + 1;
        this.counterDisplay.textContent = `Ciclo ${this.currentCycle}/${this.cycles}`;

        const p = this.patterns[this.pattern];
        const hasHold2 = p.hold2 !== undefined;
        const phases = hasHold2
            ? ['inhale', 'hold', 'exhale', 'hold2']
            : (p.hold > 0 ? ['inhale', 'hold', 'exhale'] : ['inhale', 'exhale']);

        let phaseIndex = 0;

        const executePhase = () => {
            if (!this.isRunning) return;
            if (phaseIndex >= phases.length) {
                // pequeña pausa entre ciclos
                const pauseTimeout = setTimeout(() => this.runCycle(cycleIndex + 1), 400);
                this.timeouts.push(pauseTimeout);
                return;
            }

            const phase = phases[phaseIndex];
            this.phase = phase;
            this.updateCircleAppearance(phase);

            let duration = 0;
            switch (phase) {
                case 'inhale':
                    duration = p.inhale;
                    this.instruction.textContent = 'Inhala';
                    this.phaseDetail.textContent = `Inhala ${duration}s`;
                    this.animateScale(this.minScale, this.maxScale, duration);
                    break;
                case 'hold':
                case 'hold2':
                    duration = phase === 'hold' ? p.hold : p.hold2;
                    this.instruction.textContent = phase === 'hold' ? 'Retén' : 'Sostén';
                    this.phaseDetail.textContent = `Retén ${duration}s`;
                    this.animateScale(this.maxScale, this.maxScale, duration);
                    break;
                case 'exhale':
                    duration = p.exhale;
                    this.instruction.textContent = 'Exhala';
                    this.phaseDetail.textContent = `Exhala ${duration}s`;
                    this.animateScale(this.maxScale, this.minScale, duration);
                    break;
            }

            // Generar ondas al inicio de la fase y luego cada 1.5s mientras dure
            this.spawnWave(phase);
            const waveInterval = setInterval(() => {
                if (!this.isRunning) {
                    clearInterval(waveInterval);
                    return;
                }
                this.spawnWave(phase);
            }, 1500);
            // Guardar referencia para limpiar
            this.timeouts.push({ clear: () => clearInterval(waveInterval) });

            // Temporizador regresivo
            this.startCountdown(duration, () => {
                phaseIndex++;
                executePhase();
            });
        };

        executePhase();
    }

    updateCircleAppearance(phase) {
        this.circle.classList.remove('inhale', 'hold', 'exhale');
        if (phase === 'inhale') this.circle.classList.add('inhale');
        else if (phase === 'hold' || phase === 'hold2') this.circle.classList.add('hold');
        else if (phase === 'exhale') this.circle.classList.add('exhale');
    }

    animateScale(from, to, durationSec) {
        this.circle.style.transition = `transform ${durationSec}s ease-in-out`;
        void this.circle.offsetWidth; // forzar reflow
        this.circle.style.transform = `scale(${to})`;
    }

    startCountdown(seconds, callback) {
        let remaining = seconds;
        this.timerDisplay.textContent = remaining;
        const interval = setInterval(() => {
            remaining--;
            if (remaining >= 0) {
                this.timerDisplay.textContent = remaining;
            }
            if (remaining <= 0) {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 1000);
        this.timeouts.push({ clear: () => clearInterval(interval) });
    }

    spawnWave(phase) {
        if (!this.wavesContainer || !this.isRunning) return;
        const wave = document.createElement('div');
        wave.className = 'wave';
        if (phase === 'inhale') wave.classList.add('inhale-wave');
        else if (phase === 'hold' || phase === 'hold2') wave.classList.add('hold-wave');
        else if (phase === 'exhale') wave.classList.add('exhale-wave');

        this.wavesContainer.appendChild(wave);

        // Eliminar al terminar animación (3-4s)
        wave.addEventListener('animationend', () => {
            wave.remove();
        });
    }

    showSessionSummary() {
        // Guardar en historial
        const history = JSON.parse(localStorage.getItem('breathHistory') || '[]');
        history.push({
            date: new Date().toLocaleString('es-CO', { hour12: false, dateStyle: 'short', timeStyle: 'short' }),
            pattern: this.pattern,
            cycles: this.cycles
        });
        if (history.length > 20) history.shift();
        localStorage.setItem('breathHistory', JSON.stringify(history));

        if (this.breathSummary) {
            this.breathSummary.innerHTML = `🌿 Has completado ${this.cycles} ciclos de ${this.pattern}. ¡Tú generas tu calma!`;
        }
    }

    startStop() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }
}

// Inicializar al cargar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BreathingExercise());
} else {
    new BreathingExercise();
}