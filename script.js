// Game State
let gameState = {
    shoreCoins: 1250,
    premiumCoins: 50,
    playerName: 'CoconutKing99',
    playersOnline: 12,
    selectedTab: 'skins',
    characterRotation: 0,
    musicEnabled: true,
    attackCooldown: 0,
    maxCooldown: 3000, // 3 seconds in milliseconds
    selectedSkin: 'default',
    selectedWeapon: 'fists'
};

// DOM Elements
const buyCoinsBtn = document.getElementById('buyCoins');
const editNameBtn = document.getElementById('editName');
const musicToggleBtn = document.getElementById('musicToggle');
const readyBtn = document.getElementById('readyBtn');
const attackBtn = document.getElementById('attackBtn');
const cooldownFill = document.getElementById('cooldownFill');
const cooldownText = document.getElementById('cooldownText');
const shopModal = document.getElementById('shopModal');
const nameModal = document.getElementById('nameModal');
const tabs = document.querySelectorAll('.tab');
const character = document.getElementById('character');
const customizationPanel = document.getElementById('customizationPanel');
const gameScreen = document.getElementById('gameScreen');
const exitGameBtn = document.getElementById('exitGame');

// Game instance
let currentGame = null;

// Initialize
updateUI();
setupEventListeners();

function setupEventListeners() {
    // Buy Coins Button
    buyCoinsBtn.addEventListener('click', () => {
        openModal(shopModal);
    });

    // Edit Name Button
    editNameBtn.addEventListener('click', () => {
        openModal(nameModal);
    });

    // Music Toggle
    musicToggleBtn.addEventListener('click', () => {
        gameState.musicEnabled = !gameState.musicEnabled;
        musicToggleBtn.style.opacity = gameState.musicEnabled ? '1' : '0.5';
        showNotification(gameState.musicEnabled ? '🎵 Music On' : '🔇 Music Off');
    });

    // Ready Button
    readyBtn.addEventListener('click', () => {
        readyBtn.style.background = 'linear-gradient(135deg, #95E1D3, #4ECDC4)';
        readyBtn.textContent = '✅ SEARCHING FOR MATCH...';
        setTimeout(() => {
            showNotification('🎮 Match found! Starting game...');
            readyBtn.style.background = 'linear-gradient(135deg, var(--tropical-orange), var(--sunset-pink))';
            readyBtn.textContent = '▶️ READY TO PLAY';
            
            // Start the game!
            startGame();
        }, 2000);
    });

    // Exit Game Button
    exitGameBtn.addEventListener('click', () => {
        exitGame();
    });

    // Attack Button with Cooldown
    attackBtn.addEventListener('click', () => {
        if (gameState.attackCooldown === 0) {
            // Execute attack
            showNotification(`💥 ${gameState.selectedWeapon} attack!`);
            attackBtn.disabled = true;
            gameState.attackCooldown = gameState.maxCooldown;
            
            // Start cooldown animation
            startCooldown();
        }
    });

    // Tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            selectTab(tabName);
        });
    });

    // Character Rotation
    character.addEventListener('click', () => {
        gameState.characterRotation += 90;
        character.style.transform = `rotateY(${gameState.characterRotation}deg)`;
    });

    // Modal Close Buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').style.display = 'none';
        });
    });

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Shop Purchase Buttons
    document.querySelectorAll('.purchase-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const shopItem = e.target.closest('.shop-item');
            const amount = shopItem.querySelector('.amount').textContent;
            showNotification(`✨ Purchased ${amount}!`);
            const coins = parseInt(amount.match(/\d+/)[0]);
            gameState.premiumCoins += coins;
            updateUI();
            setTimeout(() => {
                shopModal.style.display = 'none';
            }, 500);
        });
    });

    // Name Change Buttons
    document.getElementById('freeChange').addEventListener('click', () => {
        showNotification('⏰ Free change available in 13 days');
    });

    document.getElementById('instantChange').addEventListener('click', () => {
        const newName = document.getElementById('newName').value.trim();
        if (newName && newName.length >= 3) {
            if (gameState.shoreCoins >= 500) {
                gameState.shoreCoins -= 500;
                gameState.playerName = newName;
                updateUI();
                showNotification('✅ Name changed successfully!');
                nameModal.style.display = 'none';
                document.getElementById('newName').value = '';
            } else {
                showNotification('❌ Not enough Shore Coins!');
            }
        } else {
            showNotification('❌ Name must be at least 3 characters');
        }
    });

    // Item Selection
    document.querySelectorAll('.item').forEach(item => {
        item.addEventListener('click', () => {
            if (!item.classList.contains('locked')) {
                document.querySelectorAll('.item').forEach(i => i.style.borderColor = 'var(--palm-green)');
                item.style.borderColor = 'var(--tropical-orange)';
                const itemName = item.dataset.item;
                
                // Store selected items
                if (gameState.selectedTab === 'skins') {
                    gameState.selectedSkin = itemName;
                } else if (gameState.selectedTab === 'weapons') {
                    gameState.selectedWeapon = itemName;
                }
                
                showNotification(`✨ ${itemName.charAt(0).toUpperCase() + itemName.slice(1)} equipped!`);
            } else {
                showNotification('🔒 Item locked! Purchase or level up to unlock');
            }
        });
    });

    // Simulate players joining/leaving
    setInterval(() => {
        gameState.playersOnline = Math.max(5, Math.min(20, gameState.playersOnline + Math.floor(Math.random() * 3) - 1));
        updateUI();
    }, 5000);
}

function startCooldown() {
    const startTime = Date.now();
    const endTime = startTime + gameState.maxCooldown;
    
    const updateCooldown = () => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        const progress = ((gameState.maxCooldown - remaining) / gameState.maxCooldown) * 100;
        
        cooldownFill.style.width = progress + '%';
        
        if (remaining > 0) {
            const seconds = (remaining / 1000).toFixed(1);
            cooldownText.textContent = `Cooldown: ${seconds}s`;
            requestAnimationFrame(updateCooldown);
        } else {
            gameState.attackCooldown = 0;
            cooldownFill.style.width = '100%';
            cooldownText.textContent = 'Ready!';
            attackBtn.disabled = false;
            showNotification('⚡ Attack ready!');
        }
    };
    
    updateCooldown();
}

function startGame() {
    // Show game screen
    gameScreen.classList.add('active');
    
    // Reset game stats
    document.getElementById('playerHealth').textContent = '100';
    document.getElementById('playerScore').textContent = '0';
    document.getElementById('gameTimer').textContent = '60';
    
    // Create and start game
    currentGame = new Game();
    currentGame.start();
}

function exitGame() {
    // Hide game screen
    gameScreen.classList.remove('active');
    
    // Stop game
    if (currentGame) {
        currentGame.stop();
        currentGame = null;
    }
    
    showNotification('👋 Thanks for playing!');
}

function selectTab(tabName) {
    gameState.selectedTab = tabName;
    
    // Update tab styles
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });

    // Update customization panel content
    updateCustomizationPanel(tabName);
}

function updateCustomizationPanel(tabName) {
    const panels = {
        skins: {
            title: '👕 Select Your Skin',
            items: [
                { icon: '�‍♂️', name: 'Surfer', locked: false },
                { icon: '🤿', name: 'Diver', locked: false },
                { icon: '🏖️', name: 'Beach Bum', locked: false },
                { icon: '🦜', name: 'Parrot', locked: false },
                { icon: '�', name: 'Shark', locked: true, req: '500 coins' },
                { icon: '🐢', name: 'Turtle', locked: true, req: 'Lvl 5' }
            ]
        },
        powers: {
            title: '⚡ Select Your Power',
            items: [
                { icon: '⚡', name: 'Speed', locked: false },
                { icon: '💪', name: 'Strength', locked: false },
                { icon: '🛡️', name: 'Shield', locked: false },
                { icon: '🔥', name: 'Fire', locked: true, req: '800 coins' },
                { icon: '❄️', name: 'Ice', locked: true, req: 'Lvl 8' },
                { icon: '🌪️', name: 'Wind', locked: true, req: '1000 coins' }
            ]
        },
        weapons: {
            title: '🥥 Select Your Weapon',
            items: [
                { icon: '✊', name: 'Fists', locked: false },
                { icon: '🥥', name: 'Coconut Bomb', locked: false },
                { icon: '🏐', name: 'Beach Ball', locked: false },
                { icon: '🪃', name: 'Boomerang', locked: false },
                { icon: '🔱', name: 'Trident', locked: true, req: '600 coins' },
                { icon: '💦', name: 'Water Gun', locked: true, req: 'Lvl 10' }
            ]
        },
        accessories: {
            title: '🎩 Select Accessory',
            items: [
                { icon: '🎩', name: 'Hat', locked: false },
                { icon: '😎', name: 'Shades', locked: false },
                { icon: '👑', name: 'Crown', locked: true, req: '2000 coins' },
                { icon: '🎀', name: 'Bow', locked: false },
                { icon: '🌺', name: 'Lei', locked: true, req: 'Lvl 15' },
                { icon: '⛑️', name: 'Helmet', locked: true, req: '1500 coins' }
            ]
        },
        emotes: {
            title: '💃 Select Emote',
            items: [
                { icon: '💃', name: 'Dance', locked: false },
                { icon: '👋', name: 'Wave', locked: false },
                { icon: '🎉', name: 'Party', locked: false },
                { icon: '😂', name: 'Laugh', locked: true, req: '300 coins' },
                { icon: '😱', name: 'Scream', locked: true, req: 'Lvl 3' },
                { icon: '🏆', name: 'Victory', locked: true, req: '500 coins' }
            ]
        },
        more: {
            title: '⚙️ Settings & More',
            items: [
                { icon: '🔊', name: 'Sound', locked: false },
                { icon: '📊', name: 'Stats', locked: false },
                { icon: '🏆', name: 'Achievements', locked: false },
                { icon: '👥', name: 'Friends', locked: false },
                { icon: '📖', name: 'Tutorial', locked: false },
                { icon: '❓', name: 'Help', locked: false }
            ]
        }
    };

    const panelData = panels[tabName] || panels.skins;
    
    customizationPanel.innerHTML = `
        <h3>${panelData.title}</h3>
        <div class="items-grid">
            ${panelData.items.map(item => `
                <div class="item ${item.locked ? 'locked' : ''}" data-item="${item.name.toLowerCase()}">
                    ${item.icon} ${item.name}
                    ${item.locked ? `<br><small>${item.req}</small>` : ''}
                </div>
            `).join('')}
        </div>
    `;

    // Re-attach item click events
    customizationPanel.querySelectorAll('.item').forEach(item => {
        item.addEventListener('click', () => {
            if (!item.classList.contains('locked')) {
                customizationPanel.querySelectorAll('.item').forEach(i => i.style.borderColor = 'var(--palm-green)');
                item.style.borderColor = 'var(--tropical-orange)';
                const itemName = item.dataset.item;
                
                // Store selected items
                if (gameState.selectedTab === 'skins') {
                    gameState.selectedSkin = itemName;
                } else if (gameState.selectedTab === 'weapons') {
                    gameState.selectedWeapon = itemName;
                }
                
                showNotification(`✨ ${itemName.charAt(0).toUpperCase() + itemName.slice(1)} equipped!`);
            } else {
                showNotification('🔒 Item locked! Purchase or level up to unlock');
            }
        });
    });
}

function updateUI() {
    document.getElementById('shoreCoins').textContent = gameState.shoreCoins.toLocaleString();
    document.getElementById('premiumCoins').textContent = gameState.premiumCoins;
    document.getElementById('playerName').textContent = gameState.playerName;
    document.getElementById('playersOnline').textContent = gameState.playersOnline;
}

function openModal(modal) {
    modal.style.display = 'block';
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 25px;
        border-radius: 15px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-weight: bold;
        color: var(--dark-text);
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('🏝️ Showdown Shores Prototype Loaded!');
console.log('Welcome to the lobby, ' + gameState.playerName + '!');
