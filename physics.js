// Gravitational constant (scaled for simulation)
const G = 6.674e-11 * 1e9; // Scaled for better visualization

class Body {
    constructor(x, y, vx, vy, mass, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.color = color;
        this.radius = Math.max(3, Math.log(mass) * 2);
        this.trail = [];
        this.maxTrailLength = 100;
    }

    // Calculate gravitational force from another body
    applyForce(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        
        // Avoid division by zero and extreme forces
        if (dist < 5) return;
        
        // Newton's law of gravitation: F = G * m1 * m2 / r^2
        const force = (G * this.mass * other.mass) / distSq;
        const fx = (force * dx) / dist;
        const fy = (force * dy) / dist;
        
        // F = ma, so a = F/m
        this.vx += fx / this.mass;
        this.vy += fy / this.mass;
    }

    // Update position based on velocity
    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Add to trail
        if (showTrails) {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        } else {
            this.trail = [];
        }
    }

    // Draw the body
    draw(ctx) {
        // Draw trail
        if (this.trail.length > 1) {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        }

        // Draw glow
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Calculate total kinetic energy
function calculateEnergy(bodies) {
    let total = 0;
    for (let body of bodies) {
        const v = Math.sqrt(body.vx * body.vx + body.vy * body.vy);
        total += 0.5 * body.mass * v * v;
    }
    return total;
}

// Calculate center of mass
function centerOfMass(bodies) {
    let totalMass = 0;
    let cmX = 0;
    let cmY = 0;
    
    for (let body of bodies) {
        totalMass += body.mass
