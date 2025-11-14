// Credits Page Interactive Elements

// Confetti effect on load
window.addEventListener('load', () => {
    createConfetti();
    
    // Add click effects to team members
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('click', () => {
            celebrateMember(member);
        });
    });
});

function createConfetti() {
    const colors = ['#FF6B35', '#4ECDC4', '#95E1D3', '#FF9ECD', '#FFD700'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.zIndex = '1000';
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            const fallDuration = 3000 + Math.random() * 2000;
            const rotation = Math.random() * 360;
            const drift = (Math.random() - 0.5) * 200;
            
            confetti.animate([
                { 
                    transform: `translateY(0) translateX(0) rotate(0deg)`,
                    opacity: 1
                },
                { 
                    transform: `translateY(${window.innerHeight + 20}px) translateX(${drift}px) rotate(${rotation}deg)`,
                    opacity: 0.5
                }
            ], {
                duration: fallDuration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            setTimeout(() => {
                confetti.remove();
            }, fallDuration);
        }, i * 50);
    }
}

function celebrateMember(member) {
    const name = member.querySelector('.member-name').textContent;
    
    // Create celebration particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.textContent = ['⭐', '✨', '🎉', '🎊', '💫'][Math.floor(Math.random() * 5)];
        particle.style.position = 'fixed';
        particle.style.fontSize = '30px';
        particle.style.zIndex = '1000';
        particle.style.pointerEvents = 'none';
        
        const rect = member.getBoundingClientRect();
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 20;
        const distance = 100 + Math.random() * 100;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        
        particle.animate([
            { 
                transform: 'translate(0, 0) scale(0) rotate(0deg)',
                opacity: 1
            },
            { 
                transform: `translate(${endX}px, ${endY}px) scale(1.5) rotate(${Math.random() * 360}deg)`,
                opacity: 0
            }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    
    // Show message
    showCelebrationMessage(`🌟 ${name} is awesome! 🌟`);
}

function showCelebrationMessage(text) {
    const message = document.createElement('div');
    message.textContent = text;
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.fontSize = '48px';
    message.style.fontWeight = 'bold';
    message.style.color = 'white';
    message.style.textShadow = '4px 4px 8px rgba(0, 0, 0, 0.5)';
    message.style.zIndex = '10000';
    message.style.pointerEvents = 'none';
    message.style.textAlign = 'center';
    
    document.body.appendChild(message);
    
    message.animate([
        { 
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 0
        },
        { 
            transform: 'translate(-50%, -50%) scale(1.2)',
            opacity: 1,
            offset: 0.5
        },
        { 
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 1,
            offset: 0.7
        },
        { 
            transform: 'translate(-50%, -50%) scale(0.5)',
            opacity: 0
        }
    ], {
        duration: 2000,
        easing: 'ease-in-out'
    });
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Random floating emoji generator
setInterval(() => {
    const emojis = ['🎮', '🏝️', '🌊', '☀️', '⭐', '🎉', '💫', '✨'];
    const emoji = document.createElement('div');
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.position = 'fixed';
    emoji.style.left = Math.random() * window.innerWidth + 'px';
    emoji.style.bottom = '-50px';
    emoji.style.fontSize = '40px';
    emoji.style.zIndex = '1';
    emoji.style.pointerEvents = 'none';
    
    document.body.appendChild(emoji);
    
    emoji.animate([
        { 
            transform: 'translateY(0) rotate(0deg)',
            opacity: 0.7
        },
        { 
            transform: `translateY(-${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`,
            opacity: 0
        }
    ], {
        duration: 5000 + Math.random() * 3000,
        easing: 'linear'
    });
    
    setTimeout(() => {
        emoji.remove();
    }, 8000);
}, 2000);

console.log('🏝️ Showdown Shores Credits Page Loaded!');
console.log('🎮 Created by: Vedika, Navya, Ayan, Akshaj, Melvin, Midhun');
console.log('📅 Date: November 13, 2025');
console.log('⭐ JOM School Challenge 2025 ⭐');
