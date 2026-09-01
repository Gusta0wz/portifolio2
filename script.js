document.addEventListener('DOMContentLoaded', function() {

    // ===== 1. NAVEGAÇÃO MOBILE =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    function toggleMenu(forceClose = false) {
        if (!hamburger || !navMenu) return;
        const isActive = forceClose ? false : !hamburger.classList.contains('active');
        hamburger.classList.toggle('active', isActive);
        navMenu.classList.toggle('active', isActive);
        hamburger.setAttribute('aria-expanded', String(isActive));
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => toggleMenu());
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => toggleMenu(true));
    });

    // Fechar menu mobile ao clicar fora ou pressionar ESC
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                toggleMenu(true);
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleMenu(true);
    });

    // ===== 2. FEEDBACK DE MENSAGENS (FORMULÁRIO) =====
    let messageTimer = null;
    function showMessage(text, type) {
        const messageDiv = document.getElementById('mensagemStatus');
        if (!messageDiv) return;

        if (messageTimer) clearTimeout(messageTimer);

        messageDiv.textContent = text;
        messageDiv.className = type; // 'success' ou 'error'
        messageDiv.style.display = 'block';

        messageTimer = setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 6000);
    }

    // ===== 3. ANIMAÇÃO SUAVE DOS CONTADORES (requestAnimationFrame) =====
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'), 10);
        if (isNaN(target)) return;

        const duration = 1600; // 1.6 segundos para todas as contagens
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Curva easeOutCubic para desaceleração natural no final
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(easeProgress * target);

            element.textContent = currentCount;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    // ===== 4. ANIMAÇÃO DAS BARRAS DE HABILIDADE =====
    function animateSkillBars() {
        document.querySelectorAll('.skill-progress').forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            if (targetWidth) {
                bar.style.width = targetWidth + '%';
            }
        });
    }

    // ===== 5. REVELAÇÃO DE CARDS E ELEMENTOS COM INTERSECTION OBSERVER =====
    const cardsToAnimate = document.querySelectorAll('.projeto-card, .stat-card, .skill-category');
    cardsToAnimate.forEach(card => card.classList.add('reveal-item'));

    if ('IntersectionObserver' in window) {
        // Observador de revelação dos cards
        const cardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        cardsToAnimate.forEach(card => cardObserver.observe(card));

        // Observador dos contadores de estatísticas
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-number[data-count]').forEach(stat => statsObserver.observe(stat));

        // Observador da seção de habilidades
        const skillSection = document.getElementById('habilidades');
        if (skillSection) {
            const skillObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateSkillBars();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            skillObserver.observe(skillSection);
        }
    } else {
        // Fallback para navegadores legados
        cardsToAnimate.forEach(c => c.classList.add('revealed'));
        document.querySelectorAll('.stat-number[data-count]').forEach(s => animateCounter(s));
        animateSkillBars();
    }

    // ===== 6. FORMULÁRIO DE CONTATO (FORMSPREE) =====
    const contactForm = document.getElementById('formContato');
    const btnEnviar = document.getElementById('btnEnviar');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const assunto = document.getElementById('assunto').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();

            if (!nome || !email || !assunto || !mensagem) {
                showMessage('Por favor, preencha todos os campos.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Por favor, insira um email válido.', 'error');
                return;
            }

            if (btnEnviar) {
                btnEnviar.disabled = true;
                btnEnviar.textContent = 'Enviando...';
            }

            showMessage('Enviando mensagem, por favor aguarde...', 'success');

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showMessage('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
                    contactForm.reset();
                } else {
                    showMessage('Erro ao enviar mensagem. Tente novamente ou use o email direto.', 'error');
                }
            } catch (error) {
                showMessage('Erro de conexão. Verifique sua internet e tente novamente.', 'error');
            } finally {
                if (btnEnviar) {
                    btnEnviar.disabled = false;
                    btnEnviar.textContent = 'Enviar Mensagem';
                }
            }
        });
    }

    // ===== 7. ANO DINÂMICO NO RODAPÉ =====
    const currentYear = document.getElementById('anoAtual');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // ===== 8. DESTAQUE DE SINTAXE NO CODE SNIPPET =====
    function highlightCodeSnippet() {
        const codeElement = document.querySelector('.code-snippet code');
        if (!codeElement) return;

        let lines = codeElement.textContent.split('\n');
        let highlightedLines = lines.map(line => {
            // Destaca linha de comentário
            if (line.trim().startsWith('//')) {
                return `<span class="comment">${line}</span>`;
            }
            // Substituições de palavras-chave e strings
            let l = line;
            l = l.replace(/\bfunction\b/g, '<span class="keyword">function</span>');
            l = l.replace(/\breturn\b/g, '<span class="keyword">return</span>');
            l = l.replace(/console\.log/g, '<span class="function">console.log</span>');
            l = l.replace(/(\".*?\")/g, '<span class="string">$1</span>');
            return l;
        });

        codeElement.innerHTML = highlightedLines.join('\n');
    }
    highlightCodeSnippet();

    // ===== 9. BOTÃO VOLTAR AO TOPO =====
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    scrollTimeout = null;
                    if (window.scrollY > 300) {
                        backToTop.style.opacity = '1';
                        backToTop.style.visibility = 'visible';
                    } else {
                        backToTop.style.opacity = '0';
                        backToTop.style.visibility = 'hidden';
                    }
                }, 100);
            }
        }, { passive: true });
    }

    // ===== 10. EFEITO DE DIGITAÇÃO SUAVE =====
    function typeWriterEffect() {
        const titleElement = document.querySelector('.hero-title .highlight');
        if (!titleElement) return;

        const originalText = titleElement.textContent.trim() || 'Desenvolvedor';
        titleElement.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < originalText.length) {
                titleElement.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 120);
            }
        }
        setTimeout(typeWriter, 400);
    }
    typeWriterEffect();

});
