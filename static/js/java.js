document.addEventListener('DOMContentLoaded', () => {
    // 1. TRADUCCIÓN DE IDIOMA Y REACCIÓN DE JUNABOT
    const toggleBtn = document.getElementById('toggle-lang');
    const langLabel = document.getElementById('lang-label');
    let currentLang = 'es';

    function updateLanguage() {
        const elementsToTranslate = document.querySelectorAll('[data-es][data-en]');
        elementsToTranslate.forEach(element => {
            element.innerHTML = element.getAttribute(`data-${currentLang}`);
        });

        const junabotOpts = document.querySelectorAll('.bot-opt-btn');
        junabotOpts.forEach(btn => {
            const text = btn.getAttribute(`data-q-${currentLang}`);
            if (text) btn.textContent = text;
        });

        const junabotChat = document.getElementById('junabot-chat');
        if (junabotChat && junabotChat.children.length === 1) {
            const firstMsg = junabotChat.querySelector('.bot-msg p');
            if (firstMsg) {
                firstMsg.innerHTML = currentLang === 'es'
                    ? 'Hola, soy <strong>JunaBot</strong>. 🤖 ¿En qué te puedo ayudar sobre la tecnología de JunaWeb?'
                    : 'Hi, I am <strong>JunaBot</strong>. 🤖 How can I help you with JunaWeb technology?';
            }
        }
    }

    toggleBtn?.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        langLabel.textContent = currentLang === 'es' ? 'English' : 'Español';
        updateLanguage();
    });

    // 2. TOGGLE DE TEMA DUAL (DARK / LIGHT)
    const toggleThemeBtn = document.getElementById('toggle-theme');
    toggleThemeBtn?.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });

    // 3. TERMINAL LOGS EN VIVO
    const terminalBody = document.getElementById('terminal-body');
    const mockLogs = [
        "scan_event: QR_VALIDATED [Student ID: 20849201] -> ACCESS GRANTED",
        "queue_monitor: Flow rate optimal (1.8s avg/person)",
        "kitchen_sync: Active meal count updated (Reservations: 412)",
        "scan_event: QR_VALIDATED [Student ID: 21940122] -> ACCESS GRANTED",
        "anti_spoofing: Blocked duplicated screenshot attempt [RUT 19382012-K]"
    ];

    let logIndex = 0;
    setInterval(() => {
        if (terminalBody) {
            const now = new Date();
            const timeStr = now.toTimeString().split(' ')[0];
            const newLog = document.createElement('div');
            newLog.className = 'terminal-line';
            newLog.innerHTML = `<span class="t-prefix">[${timeStr}]</span> ${mockLogs[logIndex]}`;
            terminalBody.appendChild(newLog);

            if (terminalBody.childNodes.length > 8) {
                terminalBody.removeChild(terminalBody.firstChild);
            }
            terminalBody.scrollTop = terminalBody.scrollHeight;
            logIndex = (logIndex + 1) % mockLogs.length;
        }
    }, 3500);

    // 4. SIMULADOR DE MODO OFFLINE (BILINGÜE)
    const toggleOfflineBtn = document.getElementById('toggle-offline-btn');
    const simCard = document.getElementById('offline-sim-card');
    const statusTitle = document.getElementById('status-title');
    const statusDesc = document.getElementById('status-desc');
    const metricLatency = document.getElementById('metric-latency');
    const metricStorage = document.getElementById('metric-storage');
    const btnOfflineText = document.getElementById('btn-offline-text');
    let isOffline = false;

    toggleOfflineBtn?.addEventListener('click', () => {
        isOffline = !isOffline;

        if (isOffline) {
            simCard.classList.add('is-offline');

            btnOfflineText.setAttribute('data-es', 'Restablecer Conexión (Online)');
            btnOfflineText.setAttribute('data-en', 'Restore Connection (Online)');

            statusTitle.setAttribute('data-es', 'Estado de Red: OFFLINE (Corte de Internet Activo)');
            statusTitle.setAttribute('data-en', 'Network Status: OFFLINE (Internet Cut Active)');

            statusDesc.setAttribute('data-es', 'El escáner sigue operando de forma autónoma con la base de datos local en caché. Las validaciones NO se detienen.');
            statusDesc.setAttribute('data-en', 'The scanner continues operating autonomously using the cached local database. Validations DO NOT stop.');

            metricStorage.setAttribute('data-es', '14 lecturas guardadas localmente');
            metricStorage.setAttribute('data-en', '14 scans saved locally');

            metricLatency.textContent = '0 ms (Local Mode)';
        } else {
            simCard.classList.remove('is-offline');

            btnOfflineText.setAttribute('data-es', 'Simular Corte de Internet');
            btnOfflineText.setAttribute('data-en', 'Simulate Internet Cut');

            statusTitle.setAttribute('data-es', 'Estado de Red: ONLINE (100% Conectado)');
            statusTitle.setAttribute('data-en', 'Network Status: ONLINE (100% Connected)');

            statusDesc.setAttribute('data-es', 'El escáner valida datos en tiempo real directo con los servidores centralizados del PAE / JUNAEB.');
            statusDesc.setAttribute('data-en', 'The scanner validates real-time data directly with central PAE / JUNAEB servers.');

            metricStorage.setAttribute('data-es', '0 lecturas pendientes (Sincronizado)');
            metricStorage.setAttribute('data-en', '0 pending scans (Synced)');

            metricLatency.textContent = '18 ms';
        }

        btnOfflineText.textContent = btnOfflineText.getAttribute(`data-${currentLang}`);
        statusTitle.textContent = statusTitle.getAttribute(`data-${currentLang}`);
        statusDesc.textContent = statusDesc.getAttribute(`data-${currentLang}`);
        metricStorage.textContent = metricStorage.getAttribute(`data-${currentLang}`);
    });

    // 5. LÓGICA ASISTENTE VIRTUAL "JUNABOT" (BILINGÜE)
    const junabotTrigger = document.getElementById('junabot-trigger');
    const junabotModal = document.getElementById('junabot-modal');
    const junabotClose = document.getElementById('junabot-close');
    const junabotChat = document.getElementById('junabot-chat');
    const junabotOpts = document.querySelectorAll('.bot-opt-btn');

    const botAnswers = {
        "¿Cómo funciona sin internet?": {
            es: "JunaWeb almacena un 'cálculo seguro' en la memoria del smartphone. Si el colegio pierde conexión, el escáner sigue leyendo y validando pases, guardando los registros para sincronizarlos automáticamente al volver el Wi-Fi.",
            en: "JunaWeb stores a secure cache in the smartphone's local storage. If the school loses connection, the scanner keeps validating passes and stores entries to sync automatically once Wi-Fi returns."
        },
        "¿Qué tan seguro es el QR?": {
            es: "Cada QR es dinámico e incluye un 'Timestamp' único. Al ser escaneado, la pantalla del trípode confirma la hora exacta e invalida el código al instante, haciendo imposible usar fotos o capturas reenviadas.",
            en: "Each QR code is dynamic and includes a unique timestamp. Upon scanning, the tripod station validates the exact time and instantly expires the code, making screenshots or photo-sharing useless."
        },
        "¿Cuánto cuesta instalar el trípode?": {
            es: "El costo es ultrabajo: solo requiere un smartphone estándar y un trípode convencional. No exige la instalación de molinetes industriales ni equipos caros.",
            en: "The cost is ultra-low: it only requires a standard smartphone and a conventional tripod. It does not require installing industrial turnstiles or expensive hardware."
        }
    };

    junabotTrigger?.addEventListener('click', () => {
        junabotModal?.classList.toggle('active');
    });

    junabotClose?.addEventListener('click', () => {
        junabotModal?.classList.remove('active');
    });

    junabotOpts.forEach(btn => {
        btn.addEventListener('click', () => {
            const keyEs = btn.getAttribute('data-q-es');
            const questionText = btn.textContent.trim();

            const answerObj = botAnswers[keyEs];
            const botReply = answerObj
                ? answerObj[currentLang]
                : (currentLang === 'es' ? "Lo siento, no encontré información." : "Sorry, I couldn't find information.");

            const userMsgDiv = document.createElement('div');
            userMsgDiv.className = 'user-msg';
            userMsgDiv.innerHTML = `<p>${questionText}</p>`;
            junabotChat.appendChild(userMsgDiv);
            junabotChat.scrollTop = junabotChat.scrollHeight;

            setTimeout(() => {
                const botMsgDiv = document.createElement('div');
                botMsgDiv.className = 'bot-msg';
                botMsgDiv.innerHTML = `<p class="typing-text">...</p>`;
                junabotChat.appendChild(botMsgDiv);
                junabotChat.scrollTop = junabotChat.scrollHeight;

                setTimeout(() => {
                    botMsgDiv.querySelector('p').innerHTML = botReply;
                    junabotChat.scrollTop = junabotChat.scrollHeight;
                }, 800);
            }, 300);
        });
    });

    // 6. SCROLL REVEAL
    const revealElements = document.querySelectorAll('.card, .stat-box, .section-title, .hero');
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 7. CONTADORES NUMÉRICOS ANIMADOS
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        const isThousandFormatted = counter.hasAttribute('data-format');
        const duration = 2000;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentCount = Math.floor(easeProgress * target);

            let formattedCount = currentCount;
            if (isThousandFormatted) {
                formattedCount = currentCount.toLocaleString('es-CL');
            }

            counter.textContent = `${formattedCount}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                let finalFormatted = target;
                if (isThousandFormatted) {
                    finalFormatted = target.toLocaleString('es-CL');
                }
                counter.textContent = `${finalFormatted}${suffix}`;
            }
        };

        requestAnimationFrame(updateCount);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(counter => counterObserver.observe(counter));

    // 8. SPOTLIGHT EFFECT EN TARJETAS
    document.querySelectorAll('.card, .stat-box').forEach(card => {
        const spotlight = document.createElement('div');
        spotlight.className = 'card-spotlight';
        card.appendChild(spotlight);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 9. LÓGICA ACORDEÓN FAQ
    const faqHeaders = document.querySelectorAll('.faq-header');

    faqHeaders.forEach(header => {
        header.addEventListener('click', (e) => {
            e.preventDefault();
            const currentItem = header.closest('.faq-item');
            const content = currentItem.querySelector('.faq-content');
            const isOpen = currentItem.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== currentItem) {
                    item.classList.remove('active');
                    const c = item.querySelector('.faq-content');
                    if (c) c.style.maxHeight = '0px';
                }
            });

            if (isOpen) {
                currentItem.classList.remove('active');
                content.style.maxHeight = '0px';
            } else {
                currentItem.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 30 + 'px';
            }
        });
    });

    // 10. LÓGICA MODAL DANTE CANALES
    const cardDante = document.getElementById('card-dante');
    const modalDante = document.getElementById('modal-dante');
    const closeDanteModal = document.getElementById('close-dante-modal');

    if (cardDante && modalDante) {
        cardDante.addEventListener('click', () => {
            modalDante.classList.add('active');
        });
    }

    if (closeDanteModal && modalDante) {
        closeDanteModal.addEventListener('click', () => {
            modalDante.classList.remove('active');
        });
    }

    if (modalDante) {
        modalDante.addEventListener('click', (e) => {
            if (e.target === modalDante) {
                modalDante.classList.remove('active');
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalDante?.classList.contains('active')) {
            modalDante.classList.remove('active');
        }
    });
});