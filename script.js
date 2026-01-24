// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVEGAÇÃO MOBILE =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // ===== ANIMAÇÃO DOS NÚMEROS =====
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const current = parseInt(element.innerText);
        const increment = target > current ? 1 : -1;
        const speed = Math.min(50, Math.floor(2000 / target));
        
        let timer = setInterval(() => {
            element.innerText = current + increment;
            if (parseInt(element.innerText) === target) {
                clearInterval(timer);
            }
        }, speed);
    }
    
    function checkScrollForCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(number => {
            const position = number.getBoundingClientRect();
            if (position.top < window.innerHeight && position.bottom >= 0) {
                if (!number.classList.contains('animated')) {
                    number.classList.add('animated');
                    animateCounter(number);
                }
            }
        });
    }
    
    // ===== ANIMAÇÃO DAS BARRAS DE HABILIDADE =====
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
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
    
    // ===== FORMULÁRIO DE CONTATO =====
    const contactForm = document.getElementById('formContato');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const assunto = document.getElementById('assunto').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();
            
            // Validação
            if (!nome || !email || !assunto || !mensagem) {
                showMessage('Por favor, preencha todos os campos.', 'error');
                return;
            }
            
            // Validação de email simples
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Por favor, insira um email válido.', 'error');
                return;
            }
            
            // Simular envio
            showMessage('Enviando mensagem...', 'success');
            
            // Simular tempo de envio
            setTimeout(() => {
                showMessage('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
                contactForm.reset();
            }, 1500);
        });
    }
    
    function showMessage(text, type) {
        const messageDiv = document.getElementById('mensagemStatus');
        messageDiv.textContent = text;
        messageDiv.className = type;
        messageDiv.style.display = 'block';
        
        // Remover mensagem após 5 segundos
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
    
    // ===== BAIXAR CV =====
    const downloadCV = document.getElementById('downloadCV');
    if (downloadCV) {
        downloadCV.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Em um caso real, aqui seria o link para o arquivo PDF
            // Por enquanto, apenas uma simulação
            showMessage('Em breve disponível para download!', 'success');
        });
    }
    
    // ===== ATUALIZAR ANO NO RODAPÉ =====
    const currentYear = document.getElementById('anoAtual');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // ===== SCROLL ANIMAÇÕES =====
    function handleScrollAnimations() {
        checkScrollForCounters();
        checkScrollForSkills();
    }
    
    // Adicionar eventos de scroll
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Executar animações na carga inicial
    handleScrollAnimations();
    
    // ===== CÓDIGO DE EXEMPLO COM DESTAQUE DE SINTAXE =====
    function highlightCodeSnippet() {
        const codeElement = document.querySelector('.code-snippet code');
        if (codeElement) {
            let code = codeElement.textContent;
            
            // Destacar palavras-chave
            code = code.replace(/function/g, '<span class="keyword">function</span>');
            code = code.replace(/console\.log/g, '<span class="function">console.log</span>');
            code = code.replace(/return/g, '<span class="keyword">return</span>');
            
            // Destacar strings
            code = code.replace(/(".*?")/g, '<span class="string">$1</span>');
            
            codeElement.innerHTML = code;
        }
    }
    
    highlightCodeSnippet();
    
    // ===== BOTÃO VOLTAR AO TOPO =====
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
    
    // ===== EFETO DE DIGITAÇÃO NO TÍTULO =====
    function typeWriterEffect() {
        const titleElement = document.querySelector('.hero-title .highlight');
        if (!titleElement) return;
        
        const originalText = titleElement.textContent;
        titleElement.textContent = '';
        
        let i = 0;
        const typingSpeed = 100;
        
        function typeWriter() {
            if (i < originalText.length) {
                titleElement.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, typingSpeed);
            }
        }
        
        // Iniciar efeito após um breve delay
        setTimeout(typeWriter, 500);
    }
    
    // Iniciar efeito de digitação
    typeWriterEffect();
    
    // ===== ANIMAÇÃO DE CARDS AO SCROLL =====
    function animateCardsOnScroll() {
        const cards = document.querySelectorAll('.projeto-card, .stat-card, .skill-category');
        
        cards.forEach(card => {
            const cardPosition = card.getBoundingClientRect();
            if (cardPosition.top < window.innerHeight - 100) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Inicializar opacidade dos cards
    document.querySelectorAll('.projeto-card, .stat-card, .skill-category').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Adicionar evento de scroll para animar cards
    window.addEventListener('scroll', animateCardsOnScroll);
    
    // Executar uma vez no carregamento
    setTimeout(animateCardsOnScroll, 300);
});