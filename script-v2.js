// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    /* ==========================================================================
       LENIS SMOOTH SCROLL
       ========================================================================== */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom ease
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Keep ScrollTrigger in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    /* ==========================================================================
       CUSTOM CURSOR
       ========================================================================== */
    const cursor = document.getElementById("custom-cursor");
    const follower = document.getElementById("custom-cursor-follower");

    let mouseX = 0, mouseY = 0;
    let followX = 0, followY = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant cursor position
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    // Follower cursor lag effect
    function animateFollower() {
        // Linear interpolation: delay/lag effect
        followX += (mouseX - followX) * 0.1;
        followY += (mouseY - followY) * 0.1;

        follower.style.left = `${followX}px`;
        follower.style.top = `${followY}px`;

        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover states for cursor
    const interactiveElements = document.querySelectorAll("a, button, input, textarea, .btn, .timeline-content-box, .project-card, .skill-category-card, .strength-tag");
    interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            document.body.classList.add("hovering");
        });
        el.addEventListener("mouseleave", () => {
            document.body.classList.remove("hovering");
        });
    });

    /* ==========================================================================
       HEADER SCROLL CLASS
       ========================================================================== */
    const header = document.querySelector(".header");
    ScrollTrigger.create({
        start: "top -50px",
        onUpdate: (self) => {
            if (self.direction === 1) {
                header.classList.add("scrolled");
            } else if (self.scroll() === 0) {
                header.classList.remove("scrolled");
            }
        }
    });

    /* ==========================================================================
       HERO PARTICLES CANVAS
       ========================================================================== */
    const canvas = document.getElementById("hero-particles");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        // Mouse Move inside Hero
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener("mouseleave", () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                
                // Color configuration: Orange, Gray, White
                const randColor = Math.random();
                if (randColor < 0.4) {
                    this.color = "rgba(255, 102, 0, " + (Math.random() * 0.4 + 0.2) + ")"; // Orange shade
                } else if (randColor < 0.8) {
                    this.color = "rgba(255, 255, 255, " + (Math.random() * 0.3 + 0.1) + ")"; // White shade
                } else {
                    this.color = "rgba(85, 85, 85, " + (Math.random() * 0.4 + 0.1) + ")"; // Muted gray shade
                }

                this.density = (Math.random() * 30) + 10;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                // Natural movement
                this.x += this.vx;
                this.y += this.vy;

                // Bounce boundaries
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Mouse interactive force fields
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = forceDirectionX * force * this.density * 0.6;
                        let directionY = forceDirectionY * force * this.density * 0.6;
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }
        }

        function initParticles() {
            particles = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        // Handle Resize & Init
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        animateParticles();
    }

    /* ==========================================================================
       GSAP ANIMATIONS: TEXT & SECTION REVEALS
       ========================================================================== */
    
    // Page load transition
    gsap.from(".hero-title", {
        opacity: 0,
        y: 80,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.2
    });

    gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.5
    });

    gsap.from(".hero-roles", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.7
    });

    gsap.from(".hero-image-wrapper", {
        opacity: 0,
        scale: 0.95,
        duration: 1.8,
        ease: "power3.out",
        delay: 0.4
    });

    // Splitting text animations on scroll (About Pitch)
    const pitch = document.getElementById("about-pitch");
    if (pitch) {
        const text = pitch.textContent.trim();
        const words = text.split(" ");
        pitch.innerHTML = words.map(word => `<span class="reveal-word">${word}</span>`).join(" ");

        gsap.fromTo(".reveal-word", 
            { opacity: 0.2 },
            {
                opacity: 1,
                stagger: 0.05,
                scrollTrigger: {
                    trigger: "#about",
                    start: "top 75%",
                    end: "top 25%",
                    scrub: true,
                }
            }
        );
    }

    // Standard Fade-ins on scroll
    gsap.from(".about-description", {
        opacity: 0,
        y: 30,
        duration: 1,
        scrollTrigger: {
            trigger: ".about-description",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from(".about-extra-info", {
        opacity: 0,
        y: 40,
        duration: 1,
        scrollTrigger: {
            trigger: ".about-extra-info",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from(".career-objective-box", {
        opacity: 0,
        x: 40,
        duration: 1.2,
        scrollTrigger: {
            trigger: ".career-objective-box",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from(".strengths-box", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        scrollTrigger: {
            trigger: ".strengths-box",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    /* ==========================================================================
       GSAP ANIMATIONS: EXPERIENCE TIMELINE
       ========================================================================== */
    const timelineItems = document.querySelectorAll(".timeline-item");
    if (timelineItems.length > 0) {
        
        // Progress bar line animation
        gsap.fromTo(".timeline-progress", 
            { height: "0%" },
            { 
                height: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: ".timeline-container",
                    start: "top 25%",
                    end: "bottom 75%",
                    scrub: true
                }
            }
        );

        // Highlight items as you scroll
        timelineItems.forEach((item) => {
            gsap.from(item.querySelector(".timeline-content-box"), {
                opacity: 0.3,
                y: 50,
                duration: 0.8,
                scrollTrigger: {
                    trigger: item,
                    start: "top 75%",
                    end: "top 25%",
                    toggleActions: "play none none reverse",
                    onEnter: () => item.classList.add("active"),
                    onLeaveBack: () => item.classList.remove("active")
                }
            });
        });
    }

    /* ==========================================================================
       GSAP ANIMATIONS: PROJECTS HORIZONTAL SCROLL
       ========================================================================== */
    const projectsTrack = document.getElementById("projects-track");
    if (projectsTrack) {
        const slides = document.querySelectorAll(".project-slide");
        const totalSlides = slides.length;
        
        // Translate the container to the left by (totalSlides - 1) * 100vw
        const translationAmount = -((totalSlides - 1) * 100) / totalSlides;

        gsap.to(projectsTrack, {
            xPercent: -80, // 5 slides total. Moving left by 80% shows slides 1, 2, 3, 4 sequentially.
            ease: "none",
            scrollTrigger: {
                trigger: ".projects-pin-section",
                pin: true,
                scrub: 1,
                start: "top top",
                // Scroll length equal to 3.5 times the viewport height for comfortable horizontal scrolling speed
                end: () => "+=" + (window.innerHeight * 3.5),
                invalidateOnRefresh: true
            }
        });

        // Add subtle slide element scale and shift triggers
        slides.forEach((slide, i) => {
            if (i === 0) return; // skip intro
            const card = slide.querySelector(".project-card");
            
            gsap.from(card, {
                opacity: 0.6,
                scale: 0.95,
                duration: 1,
                scrollTrigger: {
                    trigger: slide,
                    containerAnimation: gsap.getById("projectsTrack"), // hook with container animation
                    start: "left 80%",
                    end: "left 20%",
                    scrub: true
                }
            });
        });
    }

    /* ==========================================================================
       GSAP ANIMATIONS: TECHNICAL SKILLS PROGRESS BARS
       ========================================================================== */
    const skillCategoryCards = document.querySelectorAll(".skill-category-card");
    if (skillCategoryCards.length > 0) {
        skillCategoryCards.forEach((card) => {
            const fills = card.querySelectorAll(".skill-progress-fill");
            
            gsap.fromTo(fills, 
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 1.5,
                    ease: "power3.out",
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    // Scroll trigger header anchors highlighting
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
        const id = section.getAttribute("id");
        const navAnchor = document.querySelector(`.nav-menu a[href="#${id}"]`);
        
        if (navAnchor) {
            ScrollTrigger.create({
                trigger: section,
                start: "top 50%",
                end: "bottom 50%",
                onEnter: () => navAnchor.classList.add("active"),
                onEnterBack: () => navAnchor.classList.add("active"),
                onLeave: () => navAnchor.classList.remove("active"),
                onLeaveBack: () => navAnchor.classList.remove("active")
            });
        }
    });

    // Logo & Scroll indicator button click scrolling
    const scrollDownBtn = document.getElementById("hero-scroll-btn");
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener("click", () => {
            lenis.scrollTo("#about");
        });
    }

    const navLinks = document.querySelectorAll(".nav-link, .logo");
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            lenis.scrollTo(targetId);
        });
    });

});
