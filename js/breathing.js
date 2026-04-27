class BreathingExercise {
  constructor() {
    this.circle = document.getElementById('breathCircle');
    this.instruction = document.getElementById('breathInstruction');
    this.phaseDetail = document.getElementById('breathPhaseDetail');
    this.counterDisplay = document.getElementById('breathCounter');
    this.startBtn = document.getElementById('breathStartBtn');
    this.startIcon = document.getElementById('startIcon');
    this.startText = document.getElementById('startText');
    this.patternSelect = document.getElementById('patternSelect');

    this.pattern = '4-7-8';
    this.patterns = {
      '4-7-8': { inhale: 4, hold: 7, exhale: 8 },
      '4-4-4': { inhale: 4, hold: 4, exhale: 4 }
    };
    this.cycles = 4;
    this.currentCycle = 0;
    this.isRunning = false;
    this.timeouts = [];
    this.phase = '';

    this.minScale = 0.5;
    this.maxScale = 1.4;

    this.startBtn.addEventListener('click', this.startStop.bind(this));
    this.patternSelect.addEventListener('change', this.updatePattern.bind(this));

    this.resetView();
  }

  updatePattern() {
    if (this.isRunning) return;
    this.pattern = this.patternSelect.value;
  }

  resetView() {
    this.circle.style.transform = `scale(${this.minScale})`;
    this.instruction.textContent = 'Inhala';
    this.phaseDetail.textContent = '';
    this.counterDisplay.textContent = `Ciclo 0/${this.cycles}`;
    this.currentCycle = 0;
    this.phase = 'inhale';
    this.startIcon.textContent = '▶';
    this.startText.textContent = 'Iniciar';
  }

  stop() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts = [];
    this.isRunning = false;
    this.circle.style.transition = 'transform 0.1s linear';
    this.circle.style.transform = `scale(${this.minScale})`;
    this.startIcon.textContent = '▶';
    this.startText.textContent = 'Iniciar';
    this.instruction.textContent = 'Inhala';
    this.phaseDetail.textContent = '';
    this.counterDisplay.textContent = `Ciclo 0/${this.cycles}`;
    this.currentCycle = 0;
    this.phase = 'inhale';
    this.startBtn.disabled = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startBtn.disabled = false;
    this.startIcon.textContent = '⏸️';
    this.startText.textContent = 'Pausar';
    this.currentCycle = 0;
    this.phase = 'inhale';

    const pattern = this.patterns[this.pattern];
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

    const pattern = this.patterns[this.pattern];

    // Inhala
    this.phase = 'inhale';
    this.instruction.textContent = 'Inhala';
    this.phaseDetail.textContent = `Inhala durante ${pattern.inhale}s`;
    this.animateScale(this.minScale, this.maxScale, pattern.inhale, () => {
      // Retiene
      this.phase = 'hold';
      this.instruction.textContent = 'Retén';
      this.phaseDetail.textContent = `Retén ${pattern.hold}s`;
      this.circle.style.transition = 'none';
      this.circle.style.transform = `scale(${this.maxScale})`;
      const holdTimeout = setTimeout(() => {
        // Exhala
        this.phase = 'exhale';
        this.instruction.textContent = 'Exhala';
        this.phaseDetail.textContent = `Exhala durante ${pattern.exhale}s`;
        this.animateScale(this.maxScale, this.minScale, pattern.exhale, () => {
          const nextCycleTimeout = setTimeout(() => {
            this.runCycle(cycleIndex + 1);
          }, 300);
          this.timeouts.push(nextCycleTimeout);
        });
      }, pattern.hold * 1000);
      this.timeouts.push(holdTimeout);
    });
  }

  animateScale(from, to, durationSec, callback) {
    if (!this.isRunning) {
      if (callback) callback();
      return;
    }
    this.circle.style.transition = `transform ${durationSec}s ease-in-out`;
    void this.circle.offsetWidth;
    this.circle.style.transform = `scale(${to})`;

    const timeout = setTimeout(() => {
      if (callback) callback();
    }, durationSec * 1000);
    this.timeouts.push(timeout);
  }

  startStop() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }
}

// Inicializar cuando el script se cargue, suponiendo que el DOM ya está listo
// (si usas 'defer' o lo pones al final del body)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new BreathingExercise());
} else {
  new BreathingExercise();
}