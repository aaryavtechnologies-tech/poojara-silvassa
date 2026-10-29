// Audio System using Web Audio API (Zero external dependencies, works offline)
class SoundFX {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.initOnFirstInteraction = this.initOnFirstInteraction.bind(this);
        
        // Browsers require user gesture to start AudioContext
        ['click', 'touchstart', 'keydown'].forEach(evt => {
            window.addEventListener(evt, this.initOnFirstInteraction, { once: true });
        });
    }

    initOnFirstInteraction() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Mechanical wheel tick sound (wood / plastic click peg)
    playTick(frequency = 580) {
        if (!this.enabled) return;
        this.resume();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'triangle';
            // Slight pitch variation for realistic wheel sound
            const pitch = frequency + (Math.random() * 80 - 40);
            osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.045);
        } catch (e) {
            console.warn('Audio tick error:', e);
        }
    }

    // Celebratory winner fanfare / chime
    playWinFanfare() {
        if (!this.enabled) return;
        this.resume();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            // Fanfare notes (G4, C5, E5, G5, C6)
            const notes = [
                { f: 392.00, t: 0.00, d: 0.12 },
                { f: 523.25, t: 0.12, d: 0.12 },
                { f: 659.25, t: 0.24, d: 0.14 },
                { f: 783.99, t: 0.38, d: 0.22 },
                { f: 1046.50, t: 0.60, d: 0.65 }
            ];

            notes.forEach(note => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(note.f, now + note.t);

                gain.gain.setValueAtTime(0.01, now + note.t);
                gain.gain.linearRampToValueAtTime(0.28, now + note.t + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + note.t + note.d);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + note.t);
                osc.stop(now + note.t + note.d + 0.05);
            });
        } catch (e) {
            console.warn('Fanfare audio error:', e);
        }
    }
}

window.soundFX = new SoundFX();
