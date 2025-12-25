/**
 * PROJECT: Logi-Plex (logi-plex.blog)
 * VERSION: 3.0 (No-Word-Break Animation)
 * FEATURES: GSAP, Lenis, SplitType (Word focus), Lucide Icons
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК (LUCIDE) ---
    const initIcons = () => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };
    initIcons();


    // --- 2. ПЛАВНЫЙ СКРОЛЛ (LENIS) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);


    // --- 3. МОБИЛЬНОЕ МЕНЮ ---
    const burgerBtn = document.getElementById('burgerBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav__link');

    if (burgerBtn && menuOverlay) {
        const toggleMenu = () => {
            burgerBtn.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : '';
        };
        burgerBtn.addEventListener('click', toggleMenu);
        mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));
    }


    // --- 4. ДИНАМИЧЕСКИЙ ХЕДЕР ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header?.classList.add('header--scrolled');
        } else {
            header?.classList.remove('header--scrolled');
        }
    });


    // --- 5. GSAP АНИМАЦИИ (БЕЗ РАЗРЫВА СЛОВ) ---
    gsap.registerPlugin(ScrollTrigger);

    // Анимация заголовка Hero (Анимируем СЛОВА, а не буквы)
    const heroTitle = document.querySelector('#heroTitle');
    if (heroTitle) {
        // Разбиваем только на строки и слова, чтобы избежать разрыва слов
        const split = new SplitType(heroTitle, { 
            types: 'lines, words',
            lineClass: 'split-line' 
        });

        // Анимируем слова, выплывающие снизу
        gsap.from(split.words, {
            y: "100%",
            opacity: 0,
            duration: 1,
            stagger: 0.05,
            ease: "power4.out",
            delay: 0.5
        });
    }

    // Универсальная анимация появления карточек (Bento, Courses, Benefits)
    const animateFadeUp = (selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                delay: (index % 3) * 0.1,
                ease: "power2.out"
            });
        });
    };

    animateFadeUp('.bento-card');
    animateFadeUp('.course-card');
    animateFadeUp('.benefit-card');
    animateFadeUp('.feature-item');


    // --- 6. ИНТЕРАКТИВНЫЙ ПАРАЛЛАКС (МЫШЬ) ---
    document.addEventListener('mousemove', (e) => {
        const xPos = (e.clientX - window.innerWidth / 2) * 0.01;
        const yPos = (e.clientY - window.innerHeight / 2) * 0.01;

        const floating = document.querySelectorAll('.glass-stat, .orbit-item, .main-sphere');
        floating.forEach((el, i) => {
            const speed = (i + 1) * 1.5;
            gsap.to(el, {
                x: xPos * speed,
                y: yPos * speed,
                duration: 1,
                ease: "power2.out"
            });
        });
    });


    // --- 7. ЛОГИКА ФОРМЫ ---
    const contactForm = document.getElementById('contactForm');
    const phoneInput = document.getElementById('phoneInput');
    const captchaLabel = document.getElementById('captchaQuestion');
    const statusMsg = document.getElementById('formStatus');
    
    let answer;
    const generateCaptcha = () => {
        const a = Math.floor(Math.random() * 10);
        const b = Math.floor(Math.random() * 10);
        answer = a + b;
        if (captchaLabel) captchaLabel.innerText = `${a} + ${b} = ?`;
    };

    if (contactForm) {
        generateCaptcha();
        phoneInput?.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9+]/g, '');
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userVal = parseInt(document.getElementById('captchaInput').value);

            if (userVal !== answer) {
                statusMsg.innerText = "❌ Ошибка в капче!";
                statusMsg.style.color = "var(--error)";
                generateCaptcha();
                return;
            }

            statusMsg.innerText = "⌛ Отправка...";
            statusMsg.style.color = "var(--accent)";

            setTimeout(() => {
                statusMsg.innerText = "✅ Успешно отправлено!";
                statusMsg.style.color = "var(--success)";
                contactForm.reset();
                generateCaptcha();
            }, 1800);
        });
    }


    // --- 8. COOKIE POPUP ---
    const popup = document.getElementById('cookiePopup');
    const acceptBtn = document.getElementById('acceptCookies');

    if (popup && !localStorage.getItem('cookies_accepted')) {
        setTimeout(() => popup.classList.add('active'), 3000);
    }

    acceptBtn?.addEventListener('click', () => {
        localStorage.setItem('cookies_accepted', 'true');
        popup.classList.remove('active');
    });

});