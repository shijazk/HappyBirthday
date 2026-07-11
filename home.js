// =============================================
//   PREMIUM BIRTHDAY PAGE — home.js
// =============================================

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ===== CONFIGURATION =====
    // CUSTOMIZE: Set the birthday date (format: 'Month Day, Year HH:MM:SS')
    const birthdayDate = new Date('July 12, 2000 00:00:00').getTime();

    // CUSTOMIZE: Change this greeting message
    const greetingText = "Hey Henna! You're one of the most amazing people I've ever known! 💖";

    // CUSTOMIZE: Change floating elements if desired
    const floatingElements = ['💖', '✨', '🌸', '💫', '💕', '🌹', '⭐'];

    // ===== DOM ELEMENTS =====
    const loadingScreen   = document.getElementById('loading-screen');
    const countdownSection = document.getElementById('countdown-section');
    const birthdayContent  = document.getElementById('birthday-content');
    const cursor           = document.querySelector('.cursor');
    const cursorRing       = document.querySelector('.cursor-ring');
    const bgMusic          = document.getElementById('bgMusic');
    const musicToggle      = document.getElementById('musicToggle');
    const musicIcon        = musicToggle ? musicToggle.querySelector('.music-icon') : null;
    const canvas           = document.getElementById('particle-canvas');

    // ===== STATE =====
    let birthdayAnimationsStarted = false;
    let charIndex = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = window.innerWidth / 2;
    let ringY  = window.innerHeight / 2;

    // =============================================
    // LOADING SCREEN
    // =============================================
    window.addEventListener('load', function () {
        setTimeout(function () {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 1200);
    });

    // =============================================
    // CANVAS PARTICLE SYSTEM — Twinkling Stars
    // =============================================
    (function initParticles() {
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 130;

        function resizeCanvas() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function randomBetween(a, b) {
            return a + Math.random() * (b - a);
        }

        function createParticle() {
            return {
                x:        Math.random() * canvas.width,
                y:        Math.random() * canvas.height,
                radius:   randomBetween(0.4, 1.8),
                alpha:    randomBetween(0.1, 0.9),
                deltaAlpha: randomBetween(0.003, 0.012) * (Math.random() > 0.5 ? 1 : -1),
                hue:      Math.random() > 0.6 ? randomBetween(330, 360) : randomBetween(40, 60),
                speed:    randomBetween(0.05, 0.2),
                angle:    Math.random() * Math.PI * 2,
            };
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(createParticle());
            }
        }

        function drawParticle(p) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
            grad.addColorStop(0, `hsla(${p.hue}, 80%, 90%, 1)`);
            grad.addColorStop(1, `hsla(${p.hue}, 80%, 90%, 0)`);
            ctx.fillStyle = grad;
            ctx.fill();

            // Cross sparkle for larger stars
            if (p.radius > 1.2) {
                ctx.strokeStyle = `hsla(${p.hue}, 80%, 90%, ${p.alpha * 0.6})`;
                ctx.lineWidth = 0.4;
                ctx.beginPath();
                ctx.moveTo(p.x - p.radius * 2.5, p.y);
                ctx.lineTo(p.x + p.radius * 2.5, p.y);
                ctx.moveTo(p.x, p.y - p.radius * 2.5);
                ctx.lineTo(p.x, p.y + p.radius * 2.5);
                ctx.stroke();
            }
            ctx.restore();
        }

        function updateParticle(p) {
            p.alpha += p.deltaAlpha;
            if (p.alpha <= 0.05 || p.alpha >= 0.95) {
                p.deltaAlpha *= -1;
            }

            // Gentle drift
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;

            // Wrap edges
            if (p.x < -5)              p.x = canvas.width + 5;
            if (p.x > canvas.width + 5)  p.x = -5;
            if (p.y < -5)              p.y = canvas.height + 5;
            if (p.y > canvas.height + 5) p.y = -5;
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                updateParticle(p);
                drawParticle(p);
            });
            requestAnimationFrame(animateCanvas);
        }

        resizeCanvas();
        initParticles();
        animateCanvas();

        window.addEventListener('resize', function () {
            resizeCanvas();
            initParticles();
        });
    })();

    // =============================================
    // CUSTOM CURSOR WITH TRAILING RING
    // =============================================
    if (cursor) {
        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top  = mouseY + 'px';
        });

        // Smooth trailing ring
        if (cursorRing) {
            function animateRing() {
                ringX += (mouseX - ringX) * 0.12;
                ringY += (mouseY - ringY) * 0.12;
                cursorRing.style.left = ringX + 'px';
                cursorRing.style.top  = ringY + 'px';
                requestAnimationFrame(animateRing);
            }
            animateRing();
        }

        // Cursor scale on interactive elements
        const interactiveEls = document.querySelectorAll('button, a, .music-toggle');
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
                if (cursorRing) cursorRing.style.borderColor = 'rgba(255, 215, 0, 0.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                if (cursorRing) cursorRing.style.borderColor = 'rgba(247, 183, 211, 0.5)';
            });
        });
    }

    // =============================================
    // MUSIC CONTROL
    // =============================================
    function toggleMusic() {
        if (!bgMusic) return;

        if (bgMusic.paused) {
            const savedTime = localStorage.getItem('musicPosition');
            if (savedTime) bgMusic.currentTime = parseFloat(savedTime);

            bgMusic.play().then(function () {
                if (musicToggle) musicToggle.classList.add('playing');
                if (musicIcon) {
                    musicIcon.innerHTML = '<i data-lucide="music"></i>';
                    lucide.createIcons();
                }
                localStorage.setItem('musicPlaying', 'true');
            }).catch(function (err) {
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

    if (musicToggle) musicToggle.addEventListener('click', toggleMusic);

    if (bgMusic) {
        bgMusic.addEventListener('timeupdate', function () {
            if (!bgMusic.paused) localStorage.setItem('musicPosition', bgMusic.currentTime);
        });
        window.addEventListener('beforeunload', function () {
            if (!bgMusic.paused) localStorage.setItem('musicPosition', bgMusic.currentTime);
        });
    }

    function startMusic() {
        if (bgMusic && localStorage.getItem('musicPlaying') !== 'false') {
            const savedTime = localStorage.getItem('musicPosition');
            if (savedTime) bgMusic.currentTime = parseFloat(savedTime);

            bgMusic.play().then(function () {
                if (musicToggle) musicToggle.classList.add('playing');
                if (musicIcon) {
                    musicIcon.innerHTML = '<i data-lucide="music"></i>';
                    lucide.createIcons();
                }
                localStorage.setItem('musicPlaying', 'true');
            }).catch(function (err) {
                console.log('Autoplay blocked:', err);
                if (musicIcon) {
                    musicIcon.innerHTML = '<i data-lucide="volume-x"></i>';
                    lucide.createIcons();
                }
            });
        }
    }

    startMusic();

    // Fallback: play on first interaction
    const playOnInteraction = () => {
        if (bgMusic && bgMusic.paused && localStorage.getItem('musicPlaying') !== 'false') {
            startMusic();
        }
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
    };
    document.addEventListener('click', playOnInteraction);
    document.addEventListener('touchstart', playOnInteraction);

    // =============================================
    // TYPING EFFECT
    // =============================================
    function typeGreeting() {
        const greetingEl = document.querySelector('#birthday-content .greeting');
        if (!greetingEl) return;

        if (charIndex < greetingText.length) {
            greetingEl.textContent += greetingText.charAt(charIndex);
            charIndex++;
            setTimeout(typeGreeting, 55);
        }
    }

    // =============================================
    // FLOATING ELEMENTS
    // =============================================
    function createFloating() {
        const el = document.createElement('div');
        el.className = 'floating';
        el.textContent = floatingElements[Math.floor(Math.random() * floatingElements.length)];
        el.style.left     = Math.random() * 100 + 'vw';
        el.style.top      = (Math.random() * 60 + 40) + 'vh';
        el.style.fontSize = (Math.random() * 18 + 14) + 'px';
        el.style.zIndex   = '1';
        document.body.appendChild(el);

        gsap.to(el, {
            y:        -(Math.random() * 300 + 200),
            x:        Math.random() * 120 - 60,
            rotation: Math.random() * 360 - 180,
            duration: Math.random() * 5 + 6,
            opacity:  0.75,
            ease:     'none',
            onComplete: function () { el.remove(); }
        });
    }

    setInterval(createFloating, 1200);

    // =============================================
    // BIRTHDAY ANIMATIONS
    // =============================================
    function initBirthdayAnimations() {

        // Title reveal — stagger
        gsap.to('#birthday-content .main-title', {
            opacity: 1,
            duration: 1.2,
            y: 0,
            ease: 'power3.out',
            delay: 0.2,
        });

        // Button reveal
        gsap.to('#birthday-content .cta-button', {
            opacity: 1,
            duration: 1,
            ease: 'back.out(1.7)',
            delay: 0.8,
        });

        // Start typewriter after short delay
        setTimeout(typeGreeting, 600);

        // ===== BUTTON CLICK =====
        const ctaButton = document.getElementById('ctaBtn');
        if (ctaButton) {
            ctaButton.addEventListener('click', function () {
                if (bgMusic && bgMusic.paused && localStorage.getItem('musicPlaying') !== 'false') {
                    bgMusic.play().catch(function () {});
                    localStorage.setItem('musicPlaying', 'true');
                }

                // Premium exit animation
                gsap.to('.glass-card', {
                    scale: 1.04,
                    duration: 0.3,
                    ease: 'power2.out',
                    onComplete: function () {
                        gsap.to('body', {
                            opacity: 0,
                            duration: 0.8,
                            ease: 'power2.inOut',
                            onComplete: function () {
                                window.location.href = 'wishes.html';
                            }
                        });
                    }
                });
            });
        }
    }

    // =============================================
    // COUNTDOWN LOGIC
    // =============================================
    function updateCountdown() {
        const now      = new Date().getTime();
        const distance = birthdayDate - now;

        if (distance <= 0) {
            if (countdownSection) countdownSection.style.display = 'none';
            if (birthdayContent)  birthdayContent.style.display  = 'block';

            if (!birthdayAnimationsStarted) {
                birthdayAnimationsStarted = true;
                initBirthdayAnimations();
            }
            return;
        }

        const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl    = document.getElementById('days');
        const hoursEl   = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl)    daysEl.textContent    = String(days).padStart(2, '0');
        if (hoursEl)   hoursEl.textContent   = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

});
