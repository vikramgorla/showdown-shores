// Game.js - Showdown Shores Gameplay POC

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = false;
        this.setupCanvas();
        
        // Game state
        this.player = {
            x: 400,
            y: 300,
            size: 40,
            speed: 5,
            health: 100,
            maxHealth: 100,
            color: '#FF6B35',
            direction: 0
        };
        
        this.enemies = [];
        this.particles = [];
        this.projectiles = [];
        this.score = 0;
        this.gameTime = 60;
        this.attackCooldown = 0;
        this.maxCooldown = 3000;
        this.lastAttackTime = 0;
        
        // Input
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Touch controls
        this.touchJoystick = { active: false, startX: 0, startY: 0, currentX: 0, currentY: 0 };
        this.touchMove = { x: 0, y: 0 };
        
        // Setup controls
        this.setupControls();
        this.setupTouchControls();
        
        // Spawn enemies
        this.spawnEnemies();
    }
    
    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - 150; // Account for header/footer
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight - 150;
        });
    }
    
    setupControls() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key === ' ') {
                e.preventDefault();
                this.attack();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Mouse
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('click', () => {
            this.attack();
        });
    }
    
    setupTouchControls() {
        // Touch start - for joystick
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            // Left side = movement joystick
            if (x < this.canvas.width / 2) {
                this.touchJoystick.active = true;
                this.touchJoystick.startX = x;
                this.touchJoystick.startY = y;
                this.touchJoystick.currentX = x;
                this.touchJoystick.currentY = y;
            } else {
                // Right side = attack
                this.attack();
            }
        });
        
        // Touch move - update joystick
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.touchJoystick.active && e.touches.length > 0) {
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                this.touchJoystick.currentX = touch.clientX - rect.left;
                this.touchJoystick.currentY = touch.clientY - rect.top;
                
                // Calculate movement vector
                const dx = this.touchJoystick.currentX - this.touchJoystick.startX;
                const dy = this.touchJoystick.currentY - this.touchJoystick.startY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 80;
                
                if (distance > 0) {
                    const normalizedDistance = Math.min(distance, maxDistance) / maxDistance;
                    this.touchMove.x = (dx / distance) * normalizedDistance;
                    this.touchMove.y = (dy / distance) * normalizedDistance;
                }
            }
        });
        
        // Touch end - reset joystick
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchJoystick.active = false;
            this.touchMove.x = 0;
            this.touchMove.y = 0;
        });
        
        // Update mouse position for touch (for attack direction)
        this.canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = touch.clientX - rect.left;
            this.mouseY = touch.clientY - rect.top;
        }, { passive: false });
    }
    
    spawnEnemies() {
        // Spawn initial enemies
        for (let i = 0; i < 5; i++) {
            this.spawnEnemy();
        }
        
        // Spawn enemies periodically
        this.enemySpawnInterval = setInterval(() => {
            if (this.enemies.length < 10 && this.isRunning) {
                this.spawnEnemy();
            }
        }, 3000);
    }
    
    spawnEnemy() {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        switch(side) {
            case 0: x = Math.random() * this.canvas.width; y = -30; break;
            case 1: x = this.canvas.width + 30; y = Math.random() * this.canvas.height; break;
            case 2: x = Math.random() * this.canvas.width; y = this.canvas.height + 30; break;
            case 3: x = -30; y = Math.random() * this.canvas.height; break;
        }
        
        const enemyTypes = ['🦀', '🦞', '🐙', '🦑', '🐡'];
        
        this.enemies.push({
            x: x,
            y: y,
            size: 35,
            speed: 1 + Math.random() * 1.5,
            health: 50,
            maxHealth: 50,
            emoji: enemyTypes[Math.floor(Math.random() * enemyTypes.length)]
        });
    }
    
    attack() {
        const now = Date.now();
        if (now - this.lastAttackTime < this.maxCooldown) {
            return; // Still on cooldown
        }
        
        this.lastAttackTime = now;
        
        // Calculate direction to mouse
        const dx = this.mouseX - this.player.x;
        const dy = this.mouseY - this.player.y;
        const angle = Math.atan2(dy, dx);
        
        // Create projectile
        this.projectiles.push({
            x: this.player.x,
            y: this.player.y,
            vx: Math.cos(angle) * 8,
            vy: Math.sin(angle) * 8,
            size: 15,
            damage: 25,
            lifetime: 100
        });
        
        // Create particles
        for (let i = 0; i < 8; i++) {
            const pAngle = angle + (Math.random() - 0.5) * 0.5;
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: Math.cos(pAngle) * (2 + Math.random() * 2),
                vy: Math.sin(pAngle) * (2 + Math.random() * 2),
                size: 3 + Math.random() * 3,
                color: '#FFD700',
                lifetime: 20
            });
        }
        
        // Update cooldown UI
        this.updateCooldownUI();
    }
    
    updateCooldownUI() {
        const cooldownFill = document.getElementById('gameCooldownFill');
        const cooldownText = document.getElementById('gameCooldownText');
        const startTime = Date.now();
        
        const updateBar = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, this.maxCooldown - elapsed);
            const progress = ((this.maxCooldown - remaining) / this.maxCooldown) * 100;
            
            cooldownFill.style.width = progress + '%';
            
            if (remaining > 0) {
                cooldownText.textContent = (remaining / 1000).toFixed(1) + 's';
                requestAnimationFrame(updateBar);
            } else {
                cooldownText.textContent = 'Ready!';
                cooldownFill.style.width = '100%';
            }
        };
        
        updateBar();
    }
    
    update() {
        if (!this.isRunning) return;
        
        // Move player
        let moveX = 0;
        let moveY = 0;
        
        // Keyboard controls
        if (this.keys['arrowup'] || this.keys['w']) moveY -= 1;
        if (this.keys['arrowdown'] || this.keys['s']) moveY += 1;
        if (this.keys['arrowleft'] || this.keys['a']) moveX -= 1;
        if (this.keys['arrowright'] || this.keys['d']) moveX += 1;
        
        // Touch controls (override keyboard if active)
        if (this.touchJoystick.active) {
            moveX = this.touchMove.x;
            moveY = this.touchMove.y;
        } else if (moveX !== 0 && moveY !== 0) {
            // Normalize diagonal movement for keyboard only
            moveX *= 0.707;
            moveY *= 0.707;
        }
        
        this.player.x += moveX * this.player.speed;
        this.player.y += moveY * this.player.speed;
        
        // Keep player in bounds
        this.player.x = Math.max(this.player.size, Math.min(this.canvas.width - this.player.size, this.player.x));
        this.player.y = Math.max(this.player.size, Math.min(this.canvas.height - this.player.size, this.player.y));
        
        // Update player direction (face mouse)
        const dx = this.mouseX - this.player.x;
        const dy = this.mouseY - this.player.y;
        this.player.direction = Math.atan2(dy, dx);
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Move toward player
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist > 0) {
                enemy.x += (dx / dist) * enemy.speed;
                enemy.y += (dy / dist) * enemy.speed;
            }
            
            // Check collision with player
            const playerDist = Math.sqrt(
                Math.pow(this.player.x - enemy.x, 2) + 
                Math.pow(this.player.y - enemy.y, 2)
            );
            
            if (playerDist < this.player.size + enemy.size) {
                this.player.health = Math.max(0, this.player.health - 0.5);
                document.getElementById('playerHealth').textContent = Math.floor(this.player.health);
                
                if (this.player.health <= 0) {
                    this.gameOver();
                }
            }
            
            // Remove dead enemies
            if (enemy.health <= 0) {
                this.score += 10;
                document.getElementById('playerScore').textContent = this.score;
                this.enemies.splice(i, 1);
                
                // Explosion particles
                for (let j = 0; j < 15; j++) {
                    const angle = (Math.PI * 2 * j) / 15;
                    this.particles.push({
                        x: enemy.x,
                        y: enemy.y,
                        vx: Math.cos(angle) * (2 + Math.random() * 3),
                        vy: Math.sin(angle) * (2 + Math.random() * 3),
                        size: 4 + Math.random() * 4,
                        color: '#FF6B35',
                        lifetime: 30
                    });
                }
            }
        }
        
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            proj.x += proj.vx;
            proj.y += proj.vy;
            proj.lifetime--;
            
            // Check collision with enemies
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                const dist = Math.sqrt(
                    Math.pow(proj.x - enemy.x, 2) + 
                    Math.pow(proj.y - enemy.y, 2)
                );
                
                if (dist < enemy.size) {
                    enemy.health -= proj.damage;
                    this.projectiles.splice(i, 1);
                    break;
                }
            }
            
            // Remove old projectiles
            if (proj.lifetime <= 0 || 
                proj.x < 0 || proj.x > this.canvas.width ||
                proj.y < 0 || proj.y > this.canvas.height) {
                this.projectiles.splice(i, 1);
            }
        }
        
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // Gravity
            p.lifetime--;
            
            if (p.lifetime <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    draw() {
        // Clear canvas with gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.5, '#4ECDC4');
        gradient.addColorStop(1, '#F9F7F3');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw sand/ground
        this.ctx.fillStyle = 'rgba(249, 247, 243, 0.5)';
        this.ctx.beginPath();
        this.ctx.ellipse(this.canvas.width / 2, this.canvas.height / 2, 300, 200, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw particles
        this.particles.forEach(p => {
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.lifetime / 30;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        
        // Draw projectiles
        this.projectiles.forEach(proj => {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.strokeStyle = '#FF6B35';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(proj.x, proj.y, proj.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        });
        
        // Draw enemies
        this.enemies.forEach(enemy => {
            // Enemy emoji
            this.ctx.font = enemy.size * 2 + 'px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(enemy.emoji, enemy.x, enemy.y);
            
            // Health bar
            const barWidth = enemy.size * 2;
            const barHeight = 5;
            const healthPercent = enemy.health / enemy.maxHealth;
            
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.fillRect(enemy.x - barWidth/2, enemy.y - enemy.size - 10, barWidth, barHeight);
            this.ctx.fillStyle = '#2ecc71';
            this.ctx.fillRect(enemy.x - barWidth/2, enemy.y - enemy.size - 10, barWidth * healthPercent, barHeight);
        });
        
        // Draw player
        this.ctx.save();
        this.ctx.translate(this.player.x, this.player.y);
        this.ctx.rotate(this.player.direction);
        
        // Player emoji
        this.ctx.font = this.player.size * 2 + 'px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🏄‍♂️', 0, 0);
        
        this.ctx.restore();
        
        // Player health bar
        const playerBarWidth = this.player.size * 2;
        const playerBarHeight = 5;
        const playerHealthPercent = this.player.health / this.player.maxHealth;
        
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(this.player.x - playerBarWidth/2, this.player.y - this.player.size - 10, playerBarWidth, playerBarHeight);
        this.ctx.fillStyle = '#2ecc71';
        this.ctx.fillRect(this.player.x - playerBarWidth/2, this.player.y - this.player.size - 10, playerBarWidth * playerHealthPercent, playerBarHeight);
        
        // Draw touch joystick if active
        if (this.touchJoystick.active) {
            // Outer circle
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(this.touchJoystick.startX, this.touchJoystick.startY, 60, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Inner circle (joystick position)
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.beginPath();
            this.ctx.arc(this.touchJoystick.currentX, this.touchJoystick.currentY, 30, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Center dot
            this.ctx.fillStyle = 'rgba(78, 205, 196, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(this.touchJoystick.startX, this.touchJoystick.startY, 10, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    gameLoop() {
        this.update();
        this.draw();
        
        if (this.isRunning) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }
    
    start() {
        this.isRunning = true;
        this.gameLoop();
        
        // Timer
        this.timerInterval = setInterval(() => {
            this.gameTime--;
            document.getElementById('gameTimer').textContent = this.gameTime;
            
            if (this.gameTime <= 0) {
                this.gameOver();
            }
        }, 1000);
    }
    
    stop() {
        this.isRunning = false;
        clearInterval(this.enemySpawnInterval);
        clearInterval(this.timerInterval);
    }
    
    gameOver() {
        this.stop();
        alert(`🏝️ Game Over!\n\nYour Score: ${this.score}\nYou survived for ${60 - this.gameTime} seconds!\n\n${this.player.health > 0 ? '⏰ Time\'s up!' : '💔 You were defeated!'}`);
        document.getElementById('exitGame').click();
    }
}

// Export for use in main script
window.Game = Game;
