const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State
let frames = 0;
let score = 0;
let gameState = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
};

// UI Elements
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const scoreDisplay = document.getElementById('score-display');
const finalScoreSpan = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// Game Control Functions
function initGame() {
    score = 0;
    frames = 0;
    bird.reset();
    pipes.reset();
    scoreDisplay.innerText = score;
    gameState.current = gameState.getReady;
    
    startScreen.classList.remove('hidden');
    gameOverScreen.classList.add('hidden');
    scoreDisplay.classList.add('hidden'); // Hide score during get ready
}

function startGame() {
    gameState.current = gameState.game;
    startScreen.classList.add('hidden');
    scoreDisplay.classList.remove('hidden');
}

function gameOver() {
    gameState.current = gameState.over;
    finalScoreSpan.innerText = score;
    gameOverScreen.classList.remove('hidden');
}

// Event Listeners
document.addEventListener('keydown', function(evt) {
    if (evt.code === 'Space') {
        handleInput();
    }
});

canvas.addEventListener('click', function() {
    handleInput();
});

restartBtn.addEventListener('click', function() {
    initGame();
});

function handleInput() {
    switch (gameState.current) {
        case gameState.getReady:
            startGame();
            bird.flap();
            break;
        case gameState.game:
            bird.flap();
            break;
        case gameState.over:
            // Handled by restart button, but could also restart on click if desired
            break;
    }
}

// Game Objects

const bird = {
    animation: [0, 1, 2, 1],
    x: 50,
    y: 150,
    w: 34,
    h: 24,
    radius: 12,
    frame: 0,
    speed: 0,
    gravity: 0.25,
    jump: 4.6,
    rotation: 0,
    
    draw: function() {
        let birdCenter = {
            x: this.x + this.w/2,
            y: this.y + this.h/2
        };

        ctx.save();
        ctx.translate(birdCenter.x, birdCenter.y);
        
        // Rotation based on speed
        // Clamp rotation between -25 and 90 degrees
        if(this.speed < 0) this.rotation = -25 * Math.PI / 180;
        else {
             this.rotation += 2 * Math.PI / 180;
             if(this.rotation > 90 * Math.PI / 180) this.rotation = 90 * Math.PI / 180;
        }
        
        // If getting ready, no rotation
        if(gameState.current === gameState.getReady) this.rotation = 0;

        ctx.rotate(this.rotation);
        
        // Draw Bird Body (Simple Geometry)
        ctx.fillStyle = "#f1c40f"; // Yellow
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Eye
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(6, -6, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Pupil
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(8, -6, 2, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.fillStyle = "#e67e22";
        ctx.beginPath();
        ctx.moveTo(8, 2);
        ctx.lineTo(16, 6);
        ctx.lineTo(8, 10);
        ctx.fill();
        ctx.stroke();
        
        // Wing
        ctx.fillStyle = "#f39c12";
        ctx.beginPath();
        ctx.ellipse(-4, 4, 8, 5, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    },
    
    flap: function() {
        this.speed = -this.jump;
    },
    
    update: function() {
        // Flap animation speed
        const period = gameState.current === gameState.getReady ? 10 : 5;
        this.frame += frames % period === 0 ? 1 : 0;
        this.frame = this.frame % this.animation.length;
        
        if (gameState.current === gameState.getReady) {
            this.y = 150; // Steady hover
            // Bobbing effect
            this.y += Math.cos(frames/15) * 3;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;
            
            // Collision with floor
            if (this.y + this.h/2 >= canvas.height - fg.h) {
                this.y = canvas.height - fg.h - this.h/2;
                gameOver();
            }
            
            // Collision with ceiling (optional, but good for gameplay)
            if (this.y - this.radius <= 0) {
                this.y = this.radius;
                this.speed = 0;
            }
        }
    },
    
    reset: function() {
        this.speed = 0;
        this.rotation = 0;
        this.y = 150;
    }
}

const pipes = {
    position: [],
    w: 52,
    h: 400,
    gap: 100, // Space between pipes
    dx: 2,
    
    draw: function() {
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            let topY = p.y;
            let bottomY = p.y + this.h + this.gap;
            
            // Top Pipe
            ctx.fillStyle = "#2ecc71"; // Green
            ctx.fillRect(p.x, topY, this.w, this.h);
            ctx.strokeStyle = "#27ae60";
            ctx.lineWidth = 2;
            ctx.strokeRect(p.x, topY, this.w, this.h);
            
            // Top Pipe Cap
            ctx.fillStyle = "#2ecc71";
            ctx.fillRect(p.x - 2, topY + this.h - 20, this.w + 4, 20);
            ctx.strokeRect(p.x - 2, topY + this.h - 20, this.w + 4, 20);
            
            // Bottom Pipe
            ctx.fillStyle = "#2ecc71";
            ctx.fillRect(p.x, bottomY, this.w, this.h);
            ctx.strokeRect(p.x, bottomY, this.w, this.h);

            // Bottom Pipe Cap
            ctx.fillStyle = "#2ecc71";
            ctx.fillRect(p.x - 2, bottomY, this.w + 4, 20);
            ctx.strokeRect(p.x - 2, bottomY, this.w + 4, 20);
        }
    },
    
    update: function() {
        if(gameState.current !== gameState.game) return;
        
        // Add new pipe
        if(frames % 120 === 0) {
            this.position.push({
                x: canvas.width,
                y: -150 * (Math.random() + 1)
            });
        }
        
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            // Move pipes
            p.x -= this.dx;
            
            // Remove pipes that go off screen
            if(p.x + this.w <= 0){
                this.position.shift();
                score++;
                scoreDisplay.innerText = score;
                // Important: decrement i since array length changed
                i--;
                continue;
            }
            
            // Collision Detection logic
            
            // Pipe logic coordinates
            let birdLeft = bird.x - bird.radius;
            let birdRight = bird.x + bird.radius;
            let birdTop = bird.y - bird.radius;
            let birdBottom = bird.y + bird.radius;
            
            let pipeLeft = p.x;
            let pipeRight = p.x + this.w;
            let topPipeBottom = p.y + this.h;
            let bottomPipeTop = p.y + this.h + this.gap;
            
            // Check if bird is within pipe's horizontal area
            if(birdRight > pipeLeft && birdLeft < pipeRight) {
                // Check if bird hits top pipe or bottom pipe
                if(birdTop < topPipeBottom || birdBottom > bottomPipeTop) {
                    gameOver();
                }
            }
        }
    },
    
    reset: function() {
        this.position = [];
    }
}

// Foreground (Ground)
const fg = {
    h: 112,
    x: 0,
    dx: 2,
    
    draw: function() {
        ctx.fillStyle = "#ded895";
        ctx.fillRect(0, canvas.height - this.h, canvas.width, this.h);
        
        // Grass top
        ctx.fillStyle = "#73bf2e";
        ctx.fillRect(0, canvas.height - this.h, canvas.width, 12);
        ctx.strokeStyle = "#555";
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - this.h);
        ctx.lineTo(canvas.width, canvas.height - this.h);
        ctx.stroke();
    },
    
    update: function() {
        if(gameState.current === gameState.game) {
             // Moving ground effect (optional, not strictly visible with solid color but good for patterns)
             // We'll skip complex pattern logic for simplicity, just keeping static ground for now
        }
    }
}

// Background
const bg = {
    draw: function() {
        // Clouds (Simple circles)
        ctx.fillStyle = "#fff";
        // Just drawing a couple of static clouds for vibe
        ctx.beginPath();
        ctx.arc(100, 300, 30, 0, Math.PI * 2);
        ctx.arc(140, 300, 40, 0, Math.PI * 2);
        ctx.arc(180, 300, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(200, 100, 20, 0, Math.PI * 2);
        ctx.arc(230, 100, 30, 0, Math.PI * 2);
        ctx.arc(260, 100, 20, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Game Loop
function loop() {
    // Clear canvas
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    bg.draw();
    pipes.draw();
    pipes.update();
    
    fg.draw();
    fg.update();
    
    bird.draw();
    bird.update();
    
    frames++;
    requestAnimationFrame(loop);
}

// Start
initGame();
loop();