document.addEventListener('DOMContentLoaded', function() {

    // NAVEGAÇÃO MOBILE
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    // FUNÇÃO AUXILIAR — declarada antes dos listeners
    function showMessage(text, type) {
        const messageDiv = document.getElementById('mensagemStatus');
        if (!messageDiv) return;
        messageDiv.textContent = text;
        messageDiv.className = type;
        messageDiv.style.display = 'block';
        setTimeout(() => { messageDiv.style.display = 'none'; }, 5000);
    }

    // ANIMAÇÃO DOS CONTADORES — reescrita correta
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        if (isNaN(target)) return;

        let count = 0;
        const duration = 1500;
        const steps = 60;
        const stepTime = duration / steps;
        const increment = Math.ceil(target / steps);

        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                count = target;
                clearInterval(timer);
            }
            element.innerText = count;
        }, stepTime);
    }

    function checkScrollForCounters() {
        document.querySelectorAll('.stat-number[data-count]').forEach(number => {
            const position = number.getBoundingClientRect();
            if (position.top < window.innerHeight && position.bottom >= 0) {
                if (!number.classList.contains('animated')) {
                    number.classList.add('animated');
                    animateCounter(number);
                }
            }
        });
    }

    // BARRAS DE HABILIDADE
    function animateSkillBars() {
        document.querySelectorAll('.skill-progress').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width') + '%';
        });
    }

    function checkScrollForSkills() {
        const skillSection = document.getElementById('habilidades');
        if (skillSection) {
            const position = skillSection.getBoundingClientRect();
            if (position.top < window.innerHeight && position.bottom >= 0) {
                if (!skillSection.classList.contains('animated')) {
                    skillSection.classList.add('animated');
                    setTimeout(animateSkillBars, 300);
                }
            }
        }
    }

    // FORMULÁRIO — envio real via Formspree
    const contactForm = document.getElementById('formContato');
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

            showMessage('Enviando mensagem...', 'success');

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
                    showMessage('Erro ao enviar mensagem. Tente novamente ou envie por email.', 'error');
                }
            } catch (error) {
                showMessage('Erro de conexão. Verifique sua internet e tente novamente.', 'error');
            }
        });
    }

    // ANO NO RODAPÉ
    const currentYear = document.getElementById('anoAtual');
    if (currentYear) currentYear.textContent = new Date().getFullYear();

    // SCROLL ANIMAÇÕES
    function handleScrollAnimations() {
        checkScrollForCounters();
        checkScrollForSkills();
    }
    window.addEventListener('scroll', handleScrollAnimations);
    handleScrollAnimations();

    // DESTAQUE DE SINTAXE
    function highlightCodeSnippet() {
        const codeElement = document.querySelector('.code-snippet code');
        if (codeElement) {
            let code = codeElement.textContent;
            code = code.replace(/\bfunction\b/g, '<span class="keyword">function</span>');
            code = code.replace(/console\.log/g, '<span class="function">console.log</span>');
            code = code.replace(/\breturn\b/g, '<span class="keyword">return</span>');
            code = code.replace(/(\".*?\")/g, '<span class="string">$1</span>');
            codeElement.innerHTML = code;
        }
    }
    highlightCodeSnippet();

    // BOTÃO VOLTAR AO TOPO
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });
    }

    // EFEITO DE DIGITAÇÃO
    function typeWriterEffect() {
        const titleElement = document.querySelector('.hero-title .highlight');
        if (!titleElement) return;
        const originalText = titleElement.textContent;
        titleElement.textContent = '';
        let i = 0;
        function typeWriter() {
            if (i < originalText.length) {
                titleElement.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        setTimeout(typeWriter, 500);
    }
    typeWriterEffect();

    // ANIMAÇÃO DE CARDS AO SCROLL
    document.querySelectorAll('.projeto-card, .stat-card, .skill-category').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    function animateCardsOnScroll() {
        document.querySelectorAll('.projeto-card, .stat-card, .skill-category').forEach(card => {
            if (card.getBoundingClientRect().top < window.innerHeight - 100) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }
    window.addEventListener('scroll', animateCardsOnScroll);
    setTimeout(animateCardsOnScroll, 300);

});