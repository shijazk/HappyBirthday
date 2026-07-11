// Initialize Lucide Icons on load
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Music control
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = musicToggle ? musicToggle.querySelector('.music-icon') : null;

function toggleMusic() {
    if (!bgMusic) return;

    if (bgMusic.paused) {
        const savedTime = localStorage.getItem('musicPosition');
        if (savedTime) {
            bgMusic.currentTime = parseFloat(savedTime);
        }
        bgMusic.play().then(function() {
            if (musicToggle) musicToggle.classList.add('playing');
            if (musicIcon) {
                musicIcon.innerHTML = '<i data-lucide="music"></i>';
                lucide.createIcons();
            }
            localStorage.setItem('musicPlaying', 'true');
        }).catch(function(err) {
            console.log('Music play failed:', err);
        });
    } else {
        bgMusic.pause();
        if (musicToggle) musicToggle.classList.remove('playing');
        if (musicIcon) {
            musicIcon.innerHTML = '<i data-lucide="volume-x"></i>';
            lucide.createIcons();
        }
        localStorage.setItem('musicPlaying', 'false');
    }
}

if (musicToggle) {
    musicToggle.addEventListener('click', toggleMusic);
}

if (bgMusic) {
    bgMusic.addEventListener('timeupdate', function() {
        if (!bgMusic.paused) {
            localStorage.setItem('musicPosition', bgMusic.currentTime);
        }
    });
    window.addEventListener('beforeunload', function() {
        if (!bgMusic.paused) {
            localStorage.setItem('musicPosition', bgMusic.currentTime);
        }
    });
}

function startMusic() {
    if (bgMusic && localStorage.getItem('musicPlaying') !== 'false') {
        const savedTime = localStorage.getItem('musicPosition');
        if (savedTime) {
            bgMusic.currentTime = parseFloat(savedTime);
        }
        bgMusic.play().then(function() {
            if (musicToggle) musicToggle.classList.add('playing');
            if (musicIcon) {
                musicIcon.innerHTML = '<i data-lucide="music"></i>';
                lucide.createIcons();
            }
            localStorage.setItem('musicPlaying', 'true');
        }).catch(function(err) {
            console.log('Music play failed/blocked, waiting for interaction:', err);
            if (musicIcon) {
                musicIcon.innerHTML = '<i data-lucide="volume-x"></i>';
                lucide.createIcons();
            }
        });
    }
}

// Try to play immediately
startMusic();

// Fallback: Play on first interaction if blocked
const playOnInteraction = () => {
    if (bgMusic && bgMusic.paused && localStorage.getItem('musicPlaying') !== 'false') {
        startMusic();
    }
    document.removeEventListener('click', playOnInteraction);
    document.removeEventListener('touchstart', playOnInteraction);
};
document.addEventListener('click', playOnInteraction);
document.addEventListener('touchstart', playOnInteraction);

// ===== CUSTOMIZE: Add your reasons here! =====
// Each reason has:
// - text: The message to display
// - icon: A Lucide icon name shown before the text
// - gif: Animation file to show (optional, use animation-1.gif or animation-2.gif)
const reasons = [
    {
        text: "Because you always know how to make me smile! 💖",
        icon: "sparkles",
        gif: "gif1.gif"
    },
    {
        text: "Because you're the best listener I know! 🌸",
        icon: "smile",
        gif: "gif2.gif"
    },
    {
        text: "Because your laugh is contagious! ✨",
        icon: "smile",
        gif: "gif1.gif"
    },
    {
        text: "Because you make every moment special! 🎂",
        icon: "heart",
        gif: "gif2.gif"
    },
    {
        text: "Because you're simply amazing! Here's to another wonderful year! 🎉",
        icon: "party-popper",
        gif: "gif1.gif"
    }
    // Add more reasons as needed!
];

// State management
let currentReasonIndex = 0;
const reasonsContainer = document.getElementById('reasons-container');
const shuffleButton = document.querySelector('.shuffle-button');
const reasonCounter = document.querySelector('.reason-counter');
let isTransitioning = false;

// Create reason card with gif
function createReasonCard(reason) {
    const card = document.createElement('div');
    card.className = 'reason-card';

    const text = document.createElement('div');
    text.className = 'reason-text';
    text.innerHTML = `<i data-lucide="${reason.icon}" class="reason-icon"></i> ${reason.text}`;

    const gifOverlay = document.createElement('div');
    gifOverlay.className = 'gif-overlay';
    gifOverlay.innerHTML = `<img src="${reason.gif}" alt="Celebration">`;

    card.appendChild(text);
    card.appendChild(gifOverlay);

    gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "back.out"
    });

    return card;
}

// Display new reason
function displayNewReason() {
    if (isTransitioning) return;
    isTransitioning = true;

    if (currentReasonIndex < reasons.length) {
        const card = createReasonCard(reasons[currentReasonIndex]);
        reasonsContainer.appendChild(card);
        
        // Render Lucide icons in card
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Update counter
        reasonCounter.textContent = `Reason ${currentReasonIndex + 1} of ${reasons.length}`;

        currentReasonIndex++;

        // Check if we should transform the button
        if (currentReasonIndex === reasons.length) {
            gsap.to(shuffleButton, {
                scale: 1.1,
                duration: 0.5,
                ease: "elastic.out",
                onComplete: () => {
                    // CUSTOMIZE: Change button text
                    shuffleButton.textContent = "Continue to Timeline 💫";
                    shuffleButton.classList.add('story-mode');
                    shuffleButton.addEventListener('click', () => {
                        gsap.to('body', {
                            opacity: 0,
                            duration: 1,
                            onComplete: () => {
                                window.location.href = 'timeline.html';
                            }
                        });
                    });
                }
            });
        }

        // Create floating elements
        createFloatingElement();

        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    } else {
        window.location.href = "timeline.html";
    }
}

// Initialize button click
shuffleButton.addEventListener('click', () => {
    gsap.to(shuffleButton, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1
    });
    displayNewReason();
});

// Floating elements function
function createFloatingElement() {
    const elements = ['🌸', '✨', '💖', '🦋', '⭐'];
    const element = document.createElement('div');
    element.className = 'floating';
    element.textContent = elements[Math.floor(Math.random() * elements.length)];
    element.style.left = Math.random() * window.innerWidth + 'px';
    element.style.top = Math.random() * window.innerHeight + 'px';
    element.style.fontSize = (Math.random() * 20 + 10) + 'px';
    document.body.appendChild(element);

    gsap.to(element, {
        y: -500,
        duration: Math.random() * 10 + 10,
        opacity: 0,
        onComplete: () => element.remove()
    });
}

// Custom cursor
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX - 15,
        y: e.clientY - 15,
        duration: 0.2
    });
});

// Create initial floating elements
setInterval(createFloatingElement, 2000);
