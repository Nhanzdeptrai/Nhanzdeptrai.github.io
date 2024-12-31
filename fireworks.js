const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
const timerDisplay = document.getElementById("timer");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle class
class Particle {
    constructor(x, y, color, size, speed, angle) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.speed = speed;
        this.angle = angle;
        this.life = 100;
    }

    update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        this.size *= 0.96;
        this.life--;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

const particles = [];

// Generate random color
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
}

// Create a firework
function createFirework(x, y) {
    const numParticles = 100;
    for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        const color = getRandomColor();
        const size = Math.random() * 2 + 1;
        particles.push(new Particle(x, y, color, size, speed, angle));
    }
}

// Start fireworks display
function startFireworks() {
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Randomly create fireworks
        if (Math.random() < 0.02) {
            createFirework(Math.random() * canvas.width, Math.random() * canvas.height);
        }

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();
            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// Get the time until midnight
function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Set time to midnight (00:00)

    const timeDifference = midnight - now;
    return timeDifference;
}

// Countdown and check if it's midnight
function updateTimer() {
    const timeUntilMidnight = getTimeUntilMidnight();
    const hours = Math.floor(timeUntilMidnight / 3600000);
    const minutes = Math.floor((timeUntilMidnight % 3600000) / 60000);
    const seconds = Math.floor((timeUntilMidnight % 60000) / 1000);

    // Format the timer as HH:MM:SS
    timerDisplay.textContent = `Time until midnight: ${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // If it's midnight, start fireworks
    if (timeUntilMidnight <= 0) {
        timerDisplay.textContent = "It's Midnight! 🎆";
        startFireworks();
    }
}

// Update the timer every second
setInterval(updateTimer, 1000);
updateTimer(); // Run immediately once
