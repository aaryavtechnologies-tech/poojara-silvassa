// High-performance canvas confetti & festive celebration particles
class ConfettiCannon {
    constructor(canvasId = 'confetti-canvas') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = canvasId;
            document.body.appendChild(this.canvas);
        }
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '99999';

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.active = false;
        this.animationFrame = null;
        this.resize();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    fire(durationMs = 4000) {
        this.resize();
        this.particles = [];
        this.active = true;

        const colors = [
            '#FFD700', '#FFA500', '#FF3366', '#00E5FF', 
            '#7C3AED', '#10B981', '#FF6B00', '#EC4899', 
            '#FBBF24', '#38BDF8', '#FFFFFF'
        ];

        const particleCount = 200;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 14 + 6;
            this.particles.push({
                x: centerX + (Math.random() * 80 - 40),
                y: centerY - 50 + (Math.random() * 60 - 30),
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 7,
                size: Math.random() * 9 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 12,
                gravity: 0.32,
                drag: 0.985,
                shape: Math.random() > 0.4 ? 'rect' : (Math.random() > 0.5 ? 'circle' : 'star'),
                opacity: 1,
                decay: Math.random() * 0.005 + 0.004
            });
        }

        const startTime = Date.now();
        const render = () => {
            const elapsed = Date.now() - startTime;
            this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.vx *= p.drag;
                p.vy *= p.drag;
                p.vy += p.gravity;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;
                p.opacity -= p.decay;

                if (p.opacity <= 0 || p.y > window.innerHeight + 50) {
                    this.particles.splice(i, 1);
                    continue;
                }

                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.globalAlpha = Math.max(0, p.opacity);
                this.ctx.fillStyle = p.color;

                if (p.shape === 'rect') {
                    this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                } else if (p.shape === 'circle') {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
                    this.ctx.fill();
                } else {
                    // Star shape
                    this.drawStar(0, 0, 5, p.size / 2, p.size / 4);
                }
                this.ctx.restore();
            }

            if (this.particles.length > 0 && elapsed < durationMs) {
                this.animationFrame = requestAnimationFrame(render);
            } else {
                this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                this.active = false;
            }
        };

        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.animationFrame = requestAnimationFrame(render);
    }

    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

window.confettiCannon = new ConfettiCannon();
