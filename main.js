// Main simulation loop and interaction handling

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fill window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Global variables
let bodies = [];
let timeSpeed = 1;
let showTrails = true;
let paused = false;
let zoom = 1;
let panX = 0;
let panY = 0;

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

canvas.addEventListener('mousedown', (e) => {
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    isDragging = true;
});

canvas.addEventListener('mouseup', (e) => {
    if (isDragging) {
        const vx = (dragStartX - e.clientX) * 0.01;
        const vy = (dragStartY - e.clientY) * 0.01;
        const mass = 1e5;
        const color = '#' + Math.floor(Math.random()*16777215).toString(16);
        
        bodies.push(new Body(dragStartX, dragStartY, vx, vy, mass, color));
    }
    isDragging = false;
});

// Zoom with mouse wheel
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    zoom *= (1 - Math.sign(e.deltaY) * zoomSpeed);
    zoom = Math.max(0.1, Math.min(5, zoom));
});

// Pause/resume with spacebar
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        paused = !paused;
        e.preventDefault();
    }
});

function clearBodies() {
    bodies = [];
}

// FPS counter
let frameCount = 0;
let lastTime = Date.now();

function updateStats() {
    frameCount++;
    const currentTime = Date.now();
    
    if (currentTime - lastTime >= 1000) {
        document.getElementById('fps').textContent = frameCount;
        frameCount = 0;
        lastTime = currentTime;
    }
    
    document.getElementById('bodyCount').textContent = bodies.length;
}

// Main simulation step
function step(dt) {
    if (paused) return;

    dt *= timeSpeed;

    // Calculate forces and update velocities
    for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
            bodies[i].applyForce(bodies[j]);
            bodies[j].applyForce(bodies[i]);
        }
    }

    // Update positions
    for (let body of bodies) {
        body.update(dt);
        
        // Wrap around screen (optional)
        // if (body.x < 0) body.x = canvas.width;
        // if (body.x > canvas.width) body.x = 0;
        // if (body.y < 0) body.y = canvas.height;
        // if (body.y > canvas.height) body.y = 0;
    }

    // Remove bodies that are too far away
    bodies = bodies.filter(b => {
        return Math.abs(b.x) < 5000 && Math.abs(b.y) < 5000;
    });
}

// Drawing function
function draw() {
    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();

    // Apply zoom and pan
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2 + panX, -canvas.height / 2 + panY);

    // Draw all bodies
    for (let body of bodies) {
        body.draw(ctx);
    }

    // Draw dragging line
    if (isDragging) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(dragStartX, dragStartY);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    ctx.restore();
}

// Animation loop
let lastFrameTime = Date.now();
const targetDt = 1 / 60; // 60 FPS

function animate() {
    const now = Date.now();
    const deltaTime = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    // Cap delta time to prevent huge jumps
    const dt = Math.min(deltaTime, 0.033);

    step(dt);
    draw();
    updateStats();

    requestAnimationFrame(animate);
}

// Start with a preset
loadPreset('solar');
animate();
