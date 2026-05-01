// Preset scenarios for the simulator

function loadPreset(preset) {
    bodies = [];
    
    if (preset === 'solar') {
        loadSolarSystem();
    } else if (preset === 'binary') {
        loadBinaryStars();
    } else if (preset === 'galaxy') {
        loadGalaxyCollision();
    } else if (preset === 'chaos') {
        loadChaosSystem();
    }
}

function loadSolarSystem() {
    const sun = new Body(canvas.width / 2, canvas.height / 2, 0, 0, 1e6, '#FDB813');
    bodies.push(sun);

    // Mercury
    bodies.push(new Body(
        canvas.width / 2 + 80, canvas.height / 2, 0, 5, 3.8e5, '#8C7853'
    ));

    // Venus
    bodies.push(new Body(
        canvas.width / 2 + 120, canvas.height / 2, 0, 3.5, 9.2e5, '#FFC649'
    ));

    // Earth
    bodies.push(new Body(
        canvas.width / 2 + 160, canvas.height / 2, 0, 2.98, 5.97e5, '#4A90E2'
    ));

    // Mars
    bodies.push(new Body(
        canvas.width / 2 + 200, canvas.height / 2, 0, 2.4, 6.4e5, '#E27B58'
    ));

    // Jupiter
    bodies.push(new Body(
        canvas.width / 2 + 280, canvas.height / 2, 0, 1.3, 1.9e6, '#C88B3A'
    ));

    // Saturn
    bodies.push(new Body(
        canvas.width / 2 + 350, canvas.height / 2, 0, 0.95, 5.7e5, '#FAD5A5'
    ));
}

function loadBinaryStars() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const separation = 150;

    // Star 1 (blue)
    bodies.push(new Body(
        centerX - separation / 2, centerY, 0, 2, 1e6, '#00BFFF'
    ));

    // Star 2 (red)
    bodies.push(new Body(
        centerX + separation / 2, centerY, 0, -2, 1e6, '#FF6B6B'
    ));

    // Add some planets orbiting the system
    for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const radius = 80 + Math.random() * 40;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Orbital velocity
        const v = Math.sqrt(G * 2e6 / radius);
        const vx = -Math.sin(angle) * v * 0.8;
        const vy = Math.cos(angle) * v * 0.8;
        
        bodies.push(new Body(x, y, vx, vy, 1e5, '#90EE90'));
    }
}

function loadGalaxyCollision() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Galaxy 1 (left)
    createGalaxy(centerX - 150, centerY - 100, 1, 2, '#FFD700');
    
    // Galaxy 2 (right, moving towards Galaxy 1)
    createGalaxy(centerX + 150, centerY + 100, -1, -1.5, '#FF69B4');
}

function createGalaxy(centerX, centerY, vx, vy, color) {
    // Central supermassive black hole
    bodies.push(new Body(centerX, centerY, vx, vy, 5e6, color));

    // Stars orbiting the center
    for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 50 + Math.random() * 80;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Circular orbital velocity + random component
        const v = Math.sqrt(G * 5e6 / radius);
        const vx_orb = -Math.sin(angle) * v * (0.6 + Math.random() * 0.4);
        c
