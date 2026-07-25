/* ============================================
   PORTFOLIO - Interactive JavaScript
   Sabari Nathan | Aspiring Software Engineer Portfolio
   ============================================ */

(function () {
    'use strict';

    // =====================
    // PARTICLE BACKGROUND
    // =====================
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: undefined, y: undefined };
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = `hsla(${250 + Math.random() * 40}, 70%, 70%, ${this.opacity})`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x !== undefined) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.x -= dx * force * 0.01;
                    this.y -= dy * force * 0.01;
                }
            }

            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(108, 92, 231, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        animationId = requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Cursor glow
        const glow = document.getElementById('cursorGlow');
        if (glow) {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        }
    });

    // =====================
    // TYPEWRITER EFFECT
    // =====================
    const typewriterEl = document.getElementById('typewriter');
    const words = [
        'Aspiring Software Engineer',
        'Machine Learning Enthusiast',
        'Big Data Learner',
        'Web Developer',
        'AWS Cloud Learner',
        'Problem Solver'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeWriter() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(typeWriter, typeSpeed);
    }

    typeWriter();

    // =====================
    // NAVBAR SCROLL EFFECT
    // =====================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('.section, .hero');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // =====================
    // MOBILE MENU
    // =====================
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMobileMenu);
    mobileOverlay.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // =====================
    // SCROLL ANIMATIONS (Intersection Observer)
    // =====================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for sibling elements
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
        // Add staggered delay for grid items
        const parent = el.parentElement;
        if (parent && (parent.classList.contains('skills-grid') ||
            parent.classList.contains('projects-grid'))) {
            const siblings = Array.from(parent.querySelectorAll('.animate-on-scroll'));
            const siblingIndex = siblings.indexOf(el);
            el.dataset.delay = siblingIndex * 100;
        }
        scrollObserver.observe(el);
    });

    // =====================
    // SKILL BARS ANIMATION
    // =====================
    const skillBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, 300);
                });
                skillBarObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        skillBarObserver.observe(skillsGrid);
    }

    // =====================
    // COUNTER ANIMATION
    // =====================
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                        counter.textContent = Math.floor(target * eased);

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    }

                    requestAnimationFrame(updateCounter);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        counterObserver.observe(heroStats);
    }

    // =====================
    // TILT EFFECT ON CARDS (Desktop only)
    // =====================
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -5;
                const rotateY = (x - centerX) / centerX * 5;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // =====================
    // CONTACT FORM
    // =====================
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !message) return;

            // Loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simulate sending
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');

                // Reset after showing success
                setTimeout(() => {
                    submitBtn.classList.remove('success');
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 2500);
            }, 1500);
        });

        // Input focus animations
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function () {
                this.closest('.input-wrapper').classList.add('focused');
            });
            input.addEventListener('blur', function () {
                this.closest('.input-wrapper').classList.remove('focused');
            });
        });
    }

    // =====================
    // SMOOTH SCROLL for anchor links
    // =====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =====================
    // SCROLL INDICATOR HIDE
    // =====================
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }, { passive: true });
    }

    // =====================
    // PAGE LOAD ANIMATION
    // =====================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');

        // Trigger hero animations with stagger
        const heroElements = document.querySelectorAll('.hero .animate-on-scroll');
        heroElements.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, 200 + i * 150);
        });
    });

    // =====================
    // PREFERS REDUCED MOTION
    // =====================
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        cancelAnimationFrame(animationId);
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('visible');
        });
    }

})();

