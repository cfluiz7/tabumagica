// Plataforma de Matemática - script.js
// Autor: Manus IA
// Data: 13 de Maio de 2025

document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.getElementById("nav-toggle");
    const mainNav = document.getElementById("main-nav");
    const navLinks = document.querySelectorAll(".nav-link");
    const contentSections = document.querySelectorAll(".content-section");
    const mainContentArea = document.getElementById("main-content-area");

    // --- Navegação --- 

    // Toggle do menu mobile
    if (navToggle && mainNav) {
        navToggle.addEventListener("click", () => {
            mainNav.classList.toggle("active");
            const isExpanded = mainNav.classList.contains("active");
            navToggle.setAttribute("aria-expanded", isExpanded.toString());
            if (isExpanded) {
                navToggle.setAttribute("aria-label", "Fechar menu");
            } else {
                navToggle.setAttribute("aria-label", "Abrir menu");
            }
        });
    }

    // Mostrar/Esconder Seções
    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove("active");
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add("active");
            mainContentArea.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            // Seção padrão se a ID não for encontrada (ex: home)
            const homeSection = document.getElementById("home-section");
            if (homeSection) homeSection.classList.add("active");
        }
        // Fecha o menu mobile ao clicar em um link
        if (mainNav && mainNav.classList.contains("active")) {
            mainNav.classList.remove("active");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Abrir menu");
        }
    }

    navLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const sectionId = link.dataset.section;
            if (sectionId === "fundamentos-redirect") { // Botão "Começar pelos Fundamentos"
                 // Redireciona para a primeira seção de fundamentos ou para a home se preferir
                showSection("soma-section"); 
            } else if (sectionId) {
                showSection(sectionId);
            }
        });
    });

    // Botões "Voltar"
    document.querySelectorAll(".btn-back").forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const targetSectionId = button.dataset.section;
            if (targetSectionId) {
                showSection(targetSectionId);
            } else {
                showSection("home-section"); // Padrão para voltar para home
            }
        });
    });

    // Mostrar seção inicial (home)
    showSection("home-section");

    // --- Sistema de Treino --- 
    const trainingQuestionText = document.getElementById("training-question-text");
    const trainingAnswerInput = document.getElementById("training-answer");
    const submitTrainingAnswerBtn = document.getElementById("submit-training-answer");
    const generateTrainingQuestionBtn = document.getElementById("generate-training-question");
    const trainingFeedbackText = document.getElementById("training-feedback-text");

    let currentTrainingQuestion = {};

    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateTrainingQuestion() {
        const operations = ["soma", "subtracao", "multiplicacao", "divisao"];
        const selectedOperation = operations[generateRandomNumber(0, operations.length - 1)];
        
        let num1, num2, question, answer;

        switch (selectedOperation) {
            case "soma":
                num1 = generateRandomNumber(1, 50);
                num2 = generateRandomNumber(1, 50);
                question = `${num1} + ${num2} = ?`;
                answer = num1 + num2;
                break;
            case "subtracao":
                num1 = generateRandomNumber(10, 100);
                num2 = generateRandomNumber(1, num1 -1); // Garante resultado positivo
                question = `${num1} - ${num2} = ?`;
                answer = num1 - num2;
                break;
            case "multiplicacao":
                num1 = generateRandomNumber(1, 12);
                num2 = generateRandomNumber(1, 12);
                question = `${num1} x ${num2} = ?`;
                answer = num1 * num2;
                break;
            case "divisao":
                // Garante divisão exata para simplificar inicialmente
                answer = generateRandomNumber(1, 10);
                num2 = generateRandomNumber(1, 10);
                num1 = answer * num2;
                question = `${num1} ÷ ${num2} = ?`;
                break;
            default:
                return; // Não deve acontecer
        }

        currentTrainingQuestion = { question, answer };
        if (trainingQuestionText) trainingQuestionText.textContent = question;
        if (trainingAnswerInput) trainingAnswerInput.value = "";
        if (trainingFeedbackText) trainingFeedbackText.textContent = "";
        if (trainingAnswerInput) trainingAnswerInput.focus();
    }

    if (submitTrainingAnswerBtn) {
        submitTrainingAnswerBtn.addEventListener("click", () => {
            if (!trainingAnswerInput || !trainingFeedbackText) return;
            const userAnswer = parseInt(trainingAnswerInput.value);
            if (isNaN(userAnswer)) {
                trainingFeedbackText.textContent = "Por favor, insira um número.";
                trainingFeedbackText.className = "training-feedback text-warning";
                return;
            }

            if (userAnswer === currentTrainingQuestion.answer) {
                trainingFeedbackText.textContent = "Correto! 🎉";
                trainingFeedbackText.className = "training-feedback feedback-correct";
                // Adicionar alguma animação ou som de acerto
            } else {
                trainingFeedbackText.textContent = `Incorreto. A resposta era ${currentTrainingQuestion.answer}. Tente outra!`;
                trainingFeedbackText.className = "training-feedback feedback-incorrect";
                // Adicionar alguma animação ou som de erro
            }
        });
    }
    
    if (trainingAnswerInput) {
        trainingAnswerInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Impede o envio de formulário, se houver
                submitTrainingAnswerBtn.click();
            }
        });
    }

    if (generateTrainingQuestionBtn) {
        generateTrainingQuestionBtn.addEventListener("click", generateTrainingQuestion);
        // Gerar primeira questão ao carregar a seção de treino (se visível)
        // Isso pode ser melhorado para gerar apenas quando a seção se torna ativa
    }

    // --- Área de Rabisco (Canvas) ---
    const canvas = document.getElementById("scribbleCanvas");
    const clearCanvasBtn = document.getElementById("clear-canvas-btn");
    let ctx, painting = false;

    if (canvas) {
        ctx = canvas.getContext("2d");
        // Definir tamanho do canvas via CSS para responsividade,
        // mas o width/height do elemento precisa ser setado para correta resolução do desenho
        // canvas.width = canvas.offsetWidth;
        // canvas.height = canvas.offsetHeight;
        // Para simplificar, usaremos os valores fixos do HTML por enquanto, mas o ideal é ajustar dinamicamente

        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.strokeStyle = "var(--text-dark)";

        function startPosition(e) {
            painting = true;
            draw(e);
        }
        function endPosition() {
            painting = false;
            ctx.beginPath(); // Para não conectar o próximo traço
        }
        function draw(e) {
            if (!painting) return;
            
            // Ajustar coordenadas do mouse para o canvas
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }

        canvas.addEventListener("mousedown", startPosition);
        canvas.addEventListener("mouseup", endPosition);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseout", endPosition); // Para parar de desenhar se o mouse sair
        
        // Touch events
        canvas.addEventListener("touchstart", startPosition);
        canvas.addEventListener("touchend", endPosition);
        canvas.addEventListener("touchmove", draw);
    }

    if (clearCanvasBtn && ctx) {
        clearCanvasBtn.addEventListener("click", () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    }
    
    // Inicializar primeira questão de treino se a seção estiver visível
    // (melhorar para quando a seção se torna ativa)
    if (document.getElementById("treino-section") && document.getElementById("treino-section").classList.contains("active")){
        generateTrainingQuestion();
    }

});

