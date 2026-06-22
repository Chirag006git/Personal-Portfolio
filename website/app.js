document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Progress Bar
    const progressBar = document.querySelector('.scroll-progress-bar');
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
        
        // Dynamic Navbar Background
        const navbar = document.querySelector('.navbar-custom');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // 2. Dynamic Typing Effect
    const typeTarget = document.getElementById('typed-text');
    if (typeTarget) {
        const words = ['Computer Scientist', 'Webpage Designer', 'Python Developer', 'SQL Database Designer'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let delay = 150;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typeTarget.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                delay = 75; // speed up deleting
            } else {
                typeTarget.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                delay = 150;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                delay = 2000; // Pause at full word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 500; // Pause before typing next word
            }

            setTimeout(type, delay);
        }
        
        // Start typing
        setTimeout(type, 1000);
    }

    // 3. Project Grid Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                // Get display logic
                const category = card.getAttribute('data-category');
                
                // Add fade-out transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // 4. Scroll Reveal & Skill Bars Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const skillSection = document.querySelector('#skills');
    const skillFills = document.querySelectorAll('.skill-level-fill');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it's the skills section, animate the bars
                if (entry.target.id === 'skills') {
                    skillFills.forEach(fill => {
                        const targetLevel = fill.getAttribute('data-level');
                        fill.style.width = targetLevel + '%';
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        elementObserver.observe(el);
    });

    // Also observe the skills container specifically to animate skill levels
    if (skillSection) {
        elementObserver.observe(skillSection);
    }

    // 5. Active Navbar Link Highlighter on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link-custom');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // 6. Contact Form Submission & Toast
    const contactForm = document.getElementById('portfolioContactForm');
    const toast = document.getElementById('toast-notification');
    
    if (contactForm && toast) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check form validity
            if (!contactForm.checkValidity()) {
                e.stopPropagation();
                contactForm.classList.add('was-validated');
                return;
            }

            // Mock submission success
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            
            setTimeout(() => {
                // Show success toast
                toast.style.display = 'flex';
                
                // Reset button and form
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                contactForm.reset();
                contactForm.classList.remove('was-validated');

                // Hide toast after 4 seconds
                setTimeout(() => {
                    toast.style.animation = 'slideInRight 0.3s reverse forwards';
                    setTimeout(() => {
                        toast.style.display = 'none';
                        toast.style.animation = ''; // Reset animation style
                    }, 300);
                }, 4000);

            }, 1500);
        });
    }
    
    // Close navbar on mobile after selection
    const navItems = document.querySelectorAll('.nav-link-custom');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });
});
