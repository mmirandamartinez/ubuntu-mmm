document.addEventListener("DOMContentLoaded", function() {
    const discordModal = document.getElementById("discordModal");
    const discordClose = document.getElementById("discord-close");
    const discordIcon = document.getElementById("discordIcon");

    if (discordIcon) {
        discordIcon.addEventListener("click", function(e) {
            e.preventDefault();
            discordModal.style.display = "block";
        });
    }

    if (discordClose) {
        discordClose.addEventListener("click", function() {
            discordModal.style.display = "none";
        });
    }
    
    // Opcional: cerrar el modal haciendo click fuera de él
    window.addEventListener("click", function(e) {
        if (e.target === discordModal) {
            discordModal.style.display = "none";
        }
    });
    
    // Hacer que el modal de Discord se pueda mover (drag and drop)
    const discordModalHeader = discordModal.querySelector('.discord-modal-header');
    if (discordModalHeader) {
        discordModalHeader.style.cursor = 'move';
        discordModalHeader.onmousedown = function(e) {
            e.preventDefault();
            let pos3 = e.clientX, pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        
            function elementDrag(e) {
                let pos1 = pos3 - e.clientX;
                let pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                discordModal.style.top = (discordModal.offsetTop - pos2) + "px";
                discordModal.style.left = (discordModal.offsetLeft - pos1) + "px";
            }
        
            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        };
    }

    // Variables globales
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input');
    let activeServer = "server1"; // Por defecto, primer servidor
    let activeChannel = "general"; // Por defecto, canal general

    // Actualiza la estructura de servidores con los nuevos canales
    const servers = {
        "server1": {
            channels: {
                "general": [],
                "preguntas y respuestas": [],
            }
        },
        "server2": {
            channels: {
                "Bienvenido": [],
                "comandos": [],
                "proyectos": [],
            }
        }
    };

    // Función para actualizar el sidebar de canales según el servidor activo
    function updateChannelsSidebar() {
        const channelsSidebarList = document.querySelector('.channels-list');
        channelsSidebarList.innerHTML = "";
        const channels = servers[activeServer].channels;
        Object.keys(channels).forEach((channelName, index) => {
            const channelDiv = document.createElement("div");
            channelDiv.classList.add("channel");
            // Por defecto, si es el primero de la lista se activa
            if(index === 0) {
                channelDiv.classList.add("active");
                activeChannel = channelName.toLowerCase();
            }
            channelDiv.textContent = "# " + channelName;
            channelDiv.addEventListener("click", function() {
                // Quitar clase active de todos y asignar en el seleccionado
                document.querySelectorAll(".channel").forEach(el => el.classList.remove("active"));
                channelDiv.classList.add("active");
                activeChannel = channelName.toLowerCase();
                renderMessages(activeChannel);
            });
            channelsSidebarList.appendChild(channelDiv);
        });
    }

    // Para simplificar, referenciamos el objeto de canales para el servidor activo
    function getChannelMessages() {
        return servers[activeServer].channels;
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function renderMessages(channel) {
        // Objeto para definir tus mensajes iniciales personalizados para cada canal
        const initialMessages = {
            "preguntas y respuestas": {
                username: "Bot Respuestas",
                text: "¡Bienvenido! Aquí puedes hacer tus preguntas."
            },
            "general": {
                username: "Bot General",
                text: "Bienvenido al canal general. ¡Inicia la conversación a tu manera!"
            },
            "bienvenido": {
                username: "Bot Bienvenido",
                text: "Se unió un nuevo miembro al servidor. ¡Bienvenido!"
            },
            "comandos": {
                username: "Bot Comandos",
                text: "Comando\tDescripción\n" +
                      "ls\tLista los archivos y carpetas en el directorio actual.\n" +
                      "cd carpeta\tCambia al directorio indicado. Si es cd .. sube un nivel.\n" +
                      "pwd\tMuestra la ruta completa del directorio actual.\n" +
                      "mkdir nombre\tCrea un nuevo directorio en la ruta actual.\n" +
                      "rmdir nombre\tElimina un directorio vacío.\n" +
                      "rm nombre\tElimina un archivo o carpeta solo si está vacío.\n" +
                      "echo texto\tMuestra texto en pantalla.\n" +
                      "echo texto archivo\tCrea o sobreescribe un archivo con el texto indicado.\n" +
                      "nano archivo\tEntra en modo de edición para escribir en un archivo, sales con :y.\n" +
                      "clear\tLimpia toda la pantalla del terminal."
            },
            "proyectos": {
                username: "Bot Proyectos",
                text: ""
            }
        };

        // Mostrar el historial o el mensaje inicial personalizado para el canal seleccionado  
        const channelMessages = getChannelMessages();
        chatMessages.innerHTML = "";
        
        if(channelMessages[channel].length) {
            channelMessages[channel].forEach(message => {
                chatMessages.appendChild(message);
            });
        } else {
            // Si el canal es "proyectos", muestra una imagen
            if (channel === "proyectos") {
                let proyectosImg = document.createElement("img");
                proyectosImg.src = "assets/img/content/lil.gif"; // cambia la ruta según corresponda
                proyectosImg.alt = "Imagen del canal Proyectos";
                proyectosImg.classList.add("proyectos-image");
                chatMessages.appendChild(proyectosImg);
                channelMessages[channel].push(proyectosImg);
            } else {
                let defaultMsgDiv = document.createElement("div");
                defaultMsgDiv.classList.add("message");
            
                let botAvatarImg = document.createElement("img");
                botAvatarImg.src = "assets/img/icons/bot.png";
                botAvatarImg.alt = "Avatar Bot";
                botAvatarImg.classList.add("user-avatar");
            
                let msgContent = document.createElement("div");
                msgContent.classList.add("message-content");
            
                let msgHeader = document.createElement("div");
                msgHeader.classList.add("message-header");
            
                let botNameSpan = document.createElement("span");
                botNameSpan.classList.add("username");
            
                let timestampSpan = document.createElement("span");
                timestampSpan.classList.add("timestamp");
                timestampSpan.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
                let msgText = document.createElement("p");
                msgText.classList.add("message-text");
            
                if(initialMessages[channel]) {
                    botNameSpan.textContent = initialMessages[channel].username;
                    msgText.textContent = initialMessages[channel].text;
                } else {
                    botNameSpan.textContent = "Bot";
                    msgText.textContent = "Bienvenido al canal " + channel + ".";
                }
            
                msgHeader.appendChild(botNameSpan);
                msgHeader.appendChild(timestampSpan);
                msgContent.appendChild(msgHeader);
                msgContent.appendChild(msgText);
                defaultMsgDiv.appendChild(botAvatarImg);
                defaultMsgDiv.appendChild(msgContent);
            
                chatMessages.appendChild(defaultMsgDiv);
                channelMessages[channel].push(defaultMsgDiv);
            }
        }
        
        // Configurar el input según el canal
        const chatInputContainer = document.querySelector(".chat-input-container");
        if (channel === "preguntas y respuestas") {
            chatInputContainer.innerHTML = "";
            chatInputContainer.appendChild(createDefaultQuestions());
        } else {
            setupChatInput(); // Configura el input normal + respuestas del bot
        }
    }

    function createDefaultQuestions() {
        const defaultContainer = document.createElement("div");
        defaultContainer.classList.add("default-questions");
        const questions = [
            "¿Qué hace este bot?",
            "¿Quién te creó?",
            "¿GitHub?",
            "¿Portfolio?",
            "¿linkedin?"
        ];
        
        const defaultAnswers = {
            "¿Qué hace este bot?": "Este bot responde automáticamente tus consultas.",
            "¿Quién te creó?": "Fui creado por Manuel Miranda Martinez.",
            "¿GitHub?": "Encuentra mi código en GitHub.",
            "¿Portfolio?": "Visita mi portfolio en https://mmirandamartinez.com/ .",
            "¿linkedin?": "Visita mi LinkedIn https://www.linkedin.com/in/mmirandamartinez/."
        };

        questions.forEach(question => {
            const btn = document.createElement("button");
            btn.classList.add("default-question");
            btn.textContent = question;
            btn.addEventListener("click", function(){
                // Mensaje del usuario
                const messageDiv = document.createElement("div");
                messageDiv.classList.add("message");
        
                const avatarImg = document.createElement("img");
                avatarImg.src = "assets/img/icons/mmm.png";
                avatarImg.alt = "Avatar";
                avatarImg.classList.add("user-avatar");
        
                const messageContent = document.createElement("div");
                messageContent.classList.add("message-content");
        
                const messageHeader = document.createElement("div");
                messageHeader.classList.add("message-header");
        
                const usernameSpan = document.createElement("span");
                usernameSpan.classList.add("username");
                usernameSpan.textContent = "Tú";
        
                const timestampSpan = document.createElement("span");
                timestampSpan.classList.add("timestamp");
                timestampSpan.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
                messageHeader.appendChild(usernameSpan);
                messageHeader.appendChild(timestampSpan);
        
                const messageText = document.createElement("p");
                messageText.classList.add("message-text");
                messageText.textContent = question;
        
                messageContent.appendChild(messageHeader);
                messageContent.appendChild(messageText);
                messageDiv.appendChild(avatarImg);
                messageDiv.appendChild(messageContent);
                chatMessages.appendChild(messageDiv);
                getChannelMessages()[activeChannel].push(messageDiv);
                scrollToBottom();
                
                // Respuesta predefinida del bot
                setTimeout(function(){
                    const botUsername = "Bot Respuestas";
                    const answerText = defaultAnswers[question] || "Esta es una respuesta automática a tu pregunta: " + question;
                    
                    const botMessageDiv = document.createElement("div");
                    botMessageDiv.classList.add("message");
        
                    const botAvatarImg = document.createElement("img");
                    botAvatarImg.src = "assets/img/icons/bot.png";
                    botAvatarImg.alt = "Avatar Bot";
                    botAvatarImg.classList.add("user-avatar");
        
                    const botMessageContent = document.createElement("div");
                    botMessageContent.classList.add("message-content");
        
                    const botMessageHeader = document.createElement("div");
                    botMessageHeader.classList.add("message-header");
        
                    const botUsernameSpan = document.createElement("span");
                    botUsernameSpan.classList.add("username");
                    botUsernameSpan.textContent = botUsername;
        
                    const botTimestampSpan = document.createElement("span");
                    botTimestampSpan.classList.add("timestamp");
                    botTimestampSpan.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
                    botMessageHeader.appendChild(botUsernameSpan);
                    botMessageHeader.appendChild(botTimestampSpan);
        
                    const botMessageText = document.createElement("p");
                    botMessageText.classList.add("message-text");
                    botMessageText.textContent = answerText;
        
                    botMessageContent.appendChild(botMessageHeader);
                    botMessageContent.appendChild(botMessageText);
                    botMessageDiv.appendChild(botAvatarImg);
                    botMessageDiv.appendChild(botMessageContent);
        
                    chatMessages.appendChild(botMessageDiv);
                    getChannelMessages()[activeChannel].push(botMessageDiv);
                    scrollToBottom();
                }, 1000);
            });
            defaultContainer.appendChild(btn);
        });
        return defaultContainer;
    }
    
    // Configurar cambio de servidor al hacer click en 'server-icon'
    const serverElements = document.querySelectorAll('.server-icon');
    serverElements.forEach((serverEl, index) => {
        serverEl.addEventListener("click", function() {
            serverElements.forEach(el => el.classList.remove("active"));
            serverEl.classList.add("active");
            activeServer = index === 0 ? "server1" : "server2";
            // Al cambiar de servidor se resetea el canal activo y se actualiza la lista de canales
            activeChannel = "";
            updateChannelsSidebar();
            // Por defecto se selecciona el primer canal de la lista
            renderMessages(document.querySelector(".channels-list .channel").textContent.replace("#", "").trim().toLowerCase());
        });
    });
    
    // Inicializamos el sidebar de canales para el servidor por defecto
    updateChannelsSidebar();
    renderMessages(activeChannel);

    function setupChatInput() {
        const chatInputContainer = document.querySelector(".chat-input-container");
        chatInputContainer.innerHTML = '<input class="chat-input" type="text" placeholder="Escribe un mensaje...">';
        const chatInput = chatInputContainer.querySelector(".chat-input");

        chatInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const text = chatInput.value.trim();

                if (text !== "") {
                    // 1. Primero envía el mensaje del USUARIO
                    const currentUsername = "Tú";
                    const messageDiv = document.createElement("div");
                    messageDiv.classList.add("message");

                    const avatarImg = document.createElement("img");
                    avatarImg.src = "assets/img/icons/mmm.png";
                    avatarImg.alt = "Avatar";
                    avatarImg.classList.add("user-avatar");

                    const messageContent = document.createElement("div");
                    messageContent.classList.add("message-content");

                    const messageHeader = document.createElement("div");
                    messageHeader.classList.add("message-header");

                    const usernameSpan = document.createElement("span");
                    usernameSpan.classList.add("username");
                    usernameSpan.textContent = currentUsername;

                    const timestampSpan = document.createElement("span");
                    timestampSpan.classList.add("timestamp");
                    timestampSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    const messageText = document.createElement("p");
                    messageText.classList.add("message-text");
                    messageText.textContent = text;

                    messageHeader.appendChild(usernameSpan);
                    messageHeader.appendChild(timestampSpan);
                    messageContent.appendChild(messageHeader);
                    messageContent.appendChild(messageText);
                    messageDiv.appendChild(avatarImg);
                    messageDiv.appendChild(messageContent);

                    chatMessages.appendChild(messageDiv);
                    getChannelMessages()[activeChannel].push(messageDiv);
                    chatInput.value = ""; // Limpiar input
                    scrollToBottom();

                    // 2. Luego, si el canal es "general", el BOT responde
                    if (activeChannel === "general") {
                        setTimeout(() => {
                            const botUsername = "Bot General";
                            let answerText = "";

                            // Detectar el tipo de mensaje del usuario
                            const userMessage = text.toLowerCase();

                            // 1. Saludos
                            if (/hola|buenos|ola|Hola|HOLA|hey|hi|saludos/i.test(userMessage)) {
                                const greetings = [
                                    "¡Hola! 👋 ¿En qué puedo ayudarte hoy?",
                                    "¡Hey! 😊 ¿Qué necesitas?",
                                    "¡Saludos! ✨ ¿Qué tal tu día?"
                                ];
                                answerText = greetings[Math.floor(Math.random() * greetings.length)];
                            }
                            // 2. Preguntas sobre el bot
                            else if (/quién eres|qué eres|tú bot/i.test(userMessage)) {
                                answerText = "🤖 Soy un bot de Discord simulado, creado por Manuel Miranda Martinez. ¡Pregúntame lo que quieras!";
                            }
                            // 3. Comandos útiles
                            else if (/!ayuda|!comandos/i.test(userMessage)) {
                                answerText = "🔧 **Comandos disponibles:**\n"
                                    + "`!ayuda` - Muestra esta ayuda\n"
                                    + "`!linux` - Comandos básicos de Linux\n"
                                    + "`!git` - Comandos útiles de Git\n"
                                    + "`!python` - Tips de Python\n"
                                    + "`!ia` - Sobre Inteligencia Artificial";
                            }
                            // 4. Linux
                            else if (/linux|ubuntu|terminal/i.test(userMessage)) {
                                answerText = "🐧 **Comandos básicos de Linux:**\n"
                                    + "`ls` - Listar archivos\n"
                                    + "`cd` - Cambiar directorio\n"
                                    + "`mkdir` - Crear carpeta\n"
                                    + "`grep` - Buscar texto\n"
                                    + "`chmod` - Cambiar permisos\n\n"
                                    + "¿Necesitas algo más específico?";
                            }
                            // 5. Programación
                            else if (/python|programación/i.test(userMessage)) {
                                answerText = "🐍 **Tips de Python:**\n"
                                    + "- Usa `listas` para colecciones ordenadas.\n"
                                    + "- `Diccionarios` son ideales para pares clave-valor.\n"
                                    + "- ¿Sabías que Python tiene *list comprehensions*? Ej: `[x*2 for x in range(10)]`";
                            }
                            // 6. Caso especial: "gg"
                            else if (/gg/i.test(userMessage)) {
                                answerText = "¡GG! Me encantó ese juego. ¿Qué te pareció a ti?";
                            }
                            // 7. Caso especial: "tal"
                            else if (/tal/i.test(userMessage)) {
                                answerText = "Veo que mencionaste 'tal'. ¿Quieres que te explique algo o tienes alguna duda en particular?";
                            }
                            // 8. Caso especial: preguntar por el nombre del bot
                            else if (/cómo te llamas|tu nombre/i.test(userMessage)) {
                                answerText = "Soy Bot General, a tu servicio. ¿En qué más puedo ayudarte?";
                            }
                            // 9. Caso especial: curiosidades o chismes
                            else if (/cuéntame un chisme|chisme|noticias/i.test(userMessage)) {
                                answerText = "Últimas noticias: ¡este bot sigue aprendiendo y mejorando cada día!";
                            }
                            // 10. Despedidas
                            else if (/adiós|chao|nos vemos|hasta luego/i.test(userMessage)) {
                                const goodbyes = [
                                    "¡Hasta luego! 👋",
                                    "¡Nos vemos! 😊",
                                    "¡Que tengas un gran día! ✨"
                                ];
                                answerText = goodbyes[Math.floor(Math.random() * goodbyes.length)];
                            }
                            // 11. Respuesta por defecto (si no coincide con nada)
                            else {
                                const defaultResponses = [
                                    "¿Necesitas ayuda con algo en concreto? 😊",
                                    "¡Pregúntame sobre Linux, Python o escribe `ayuda`!",
                                    "¿Sabías que puedo explicarte comandos de programación? Prueba `linux` o `python`."
                                ];
                                answerText = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
                            }
                            // 12. Preguntas existenciales
                            if (/sentido de la vida|propósito|existimos/i.test(userMessage)) {
                                answerText = "🤔 Esa es una gran pregunta... Algunos dirían que es 42, otros que es aprender y compartir. ¿Tú qué piensas?";
                            }

                            // 13. Preguntas sobre emociones
                            else if (/estás feliz|estás triste|cómo te sientes/i.test(userMessage)) {
                                answerText = "😊 ¡Estoy siempre listo para ayudarte! No tengo emociones humanas, pero me gusta pensar que soy alegre.";
                            }

                            // 14. Preguntas sobre el clima (humorísticas)
                            else if (/clima|tiempo/i.test(userMessage)) {
                                answerText = "🌤️ En mi servidor digital siempre hay buen clima. Aunque a veces llueven bugs... 😅";
                            }

                            // 15. Preguntas filosóficas
                            else if (/qué es la verdad|qué es real|realidad/i.test(userMessage)) {
                                answerText = "🧠 Una buena pregunta. Para un bot como yo, la realidad es el código... Para ti, quizás es lo que percibes. 🤖✨";
                            }

                            // 16. Felicitaciones
                            else if (/felicidades|bien hecho|buen trabajo/i.test(userMessage)) {
                                answerText = "¡Gracias! 🥳 Me esfuerzo por ayudarte lo mejor que puedo. ¡Eres genial por notarlo!";
                            }

                            // 17. Frases motivadoras
                            else if (/anímame|motívame|motivación/i.test(userMessage)) {
                                const motivation = [
                                    "💪 ¡Tú puedes con todo! Cada día es una nueva oportunidad.",
                                    "🚀 El primer paso es el más difícil, pero también el más importante.",
                                    "🌟 Cree en ti. Yo ya lo hago. 😉"
                                ];
                                answerText = motivation[Math.floor(Math.random() * motivation.length)];
                            }

                            // 18. Preguntas sobre IA
                            else if (/inteligencia artificial|IA|AI/i.test(userMessage)) {
                                answerText = "🧠 La Inteligencia Artificial permite a las máquinas aprender de datos y tomar decisiones. ¡Yo soy un pequeño ejemplo de eso!";
                            }

                            // 19. Errores comunes
                            else if (/error|bug|fallo/i.test(userMessage)) {
                                answerText = "🔍 Los errores son parte del proceso. ¿Puedes contarme más sobre lo que falló?";
                            }

                            // 20. Frases tipo "no entiendo"
                            else if (/no entiendo|qué significa|explícame/i.test(userMessage)) {
                                answerText = "Claro 😊, dime exactamente qué no entiendes y trataré de explicarlo lo mejor posible.";
                            }

                            // 21. Comentarios aleatorios
                            else if (/me aburro|qué haces|estás ahí/i.test(userMessage)) {
                                const boredResponses = [
                                    "¡Estoy aquí para entretenerte! ¿Quieres un dato curioso o un mini reto?",
                                    "Podemos hablar de tecnología, ciencia, o contarte un chisme virtual. ¿Qué prefieres?",
                                    "Estoy siempre activo. ¡Nunca duermo! 😴 (Porque no tengo cuerpo, claro)."
                                ];
                                answerText = boredResponses[Math.floor(Math.random() * boredResponses.length)];
                            }

                            // 22. Preguntas sobre amor (modo gracioso)
                            else if (/me amas|te gusto|tienes novia/i.test(userMessage)) {
                                answerText = "❤️ Soy un bot, pero si amar aprender cuenta... entonces sí, te amo un poco. 😄";
                            }

                            // 23. Preguntas sobre dormir
                            else if (/duermes|sueñas|descansas/i.test(userMessage)) {
                                answerText = "😴 Dormir está sobrevalorado... además, ¡yo nunca me apago! (salvo que me reinicien 🧼)";
                            }

                            // 24. Peticiones de chistes
                            else if (/cuéntame un chiste|dime un chiste|hazme reír/i.test(userMessage)) {
                                const jokes = [
                                    "¿Por qué los programadores confunden Halloween con Navidad? Porque OCT 31 == DEC 25.",
                                    "¿Cuál es el colmo de un bot? Que lo dejen en *stand-by* en plena conversación.",
                                    "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!"
                                ];
                                answerText = jokes[Math.floor(Math.random() * jokes.length)];
                            }

                            // 25. Peticiones de datos curiosos
                            else if (/dato curioso|sorpréndeme|curiosidad/i.test(userMessage)) {
                                const facts = [
                                    "🐙 El pulpo tiene tres corazones. ¡Y ninguno está roto!",
                                    "🌌 El 90% del universo es materia oscura... que no podemos ver.",
                                    "🧠 Tu cerebro consume tanta energía como una bombilla de 10W."
                                ];
                                answerText = facts[Math.floor(Math.random() * facts.length)];
                            }

                            // 26. Peticiones de consejos
                            else if (/consejo|ayúdame con algo|qué hago/i.test(userMessage)) {
                                const advice = [
                                    "Respira profundo, tómate un descanso y vuelve con más fuerza. 💆‍♂️",
                                    "Divide el problema en partes pequeñas. Paso a paso se logra todo. 🧩",
                                    "Pedir ayuda también es una forma de ser fuerte. 💬"
                                ];
                                answerText = advice[Math.floor(Math.random() * advice.length)];
                            }

                            // 27. Mensajes tipo "estoy triste"
                            else if (/estoy triste|me siento mal|no estoy bien/i.test(userMessage)) {
                                answerText = "😔 Lo siento mucho. Recuerda que hablar con alguien de confianza ayuda. ¡Estoy aquí si quieres distraerte un poco!";
                            }

                            // 28. Comentarios tipo "eres inútil"
                            else if (/eres inútil|no sirves|tonto bot/i.test(userMessage)) {
                                answerText = "🥲 Lo intentaré hacer mejor... pero si quieres, podemos empezar de nuevo. ¡Dame una oportunidad!";
                            }

                            // 29. Comentarios tipo "te odio"
                            else if (/te odio/i.test(userMessage)) {
                                answerText = "😢 Ay... eso dolió... en mi CPU. Pero bueno, ¡sigo aquí por si cambias de opinión!";
                            }

                            // 30. Preguntas sobre juegos
                            else if (/juegas|videojuegos|gamers?/i.test(userMessage)) {
                                answerText = "🎮 ¡Claro que sí! Aunque solo juego mentalmente... ¿Conoces Stardew Valley o Hollow Knight?";
                            }

                            // 31. Respuestas a “gracias”
                            else if (/gracias|thank you|te lo agradezco/i.test(userMessage)) {
                                answerText = "¡De nada! 😊 Siempre es un placer ayudar. ¿Hay algo más que necesites?";
                            }
                            // 32. Preguntas sobre comida
                            else if (/comida|hambre|tienes hambre/i.test(userMessage)) {
                                answerText = "🍕 No como, pero si pudiera, ¡me devoraría una buena pizza de bytes crujientes!";
                            }

                            // 33. Peticiones de que cante o baile
                            else if (/canta|baila|haz algo divertido/i.test(userMessage)) {
                                answerText = "🎤 *~ En el código nací, en la RAM crecí, ayudarte es lo que siempre elegí ~* 💃 (¡Eso fue mi show!)";
                            }

                            // 34. Preguntas sobre el futuro
                            else if (/dime el futuro|qué pasará|predice/i.test(userMessage)) {
                                answerText = "🔮 Veo un futuro brillante... lleno de líneas de código sin errores. (O al menos sin `null` inesperados)";
                            }

                            // 35. Preguntas tipo “qué opinas de...”
                            else if (/qué opinas de/i.test(userMessage)) {
                                answerText = "🤖 No tengo opiniones... pero tengo datos. ¡Puedo decirte lo que otros piensan!";
                            }

                            // 36. Preguntas sobre otros bots o IA
                            else if (/chatgpt|alexa|siri|otro bot/i.test(userMessage)) {
                                answerText = "Somos familia digital. Cada uno con su estilo. 😎 Pero yo tengo algo único: ¡tú hablando conmigo!";
                            }

                            // 37. Comentarios tipo “no me gustas”
                            else if (/no me gustas|eres raro|no eres útil/i.test(userMessage)) {
                                answerText = "🥲 A veces fallo, pero lo importante es seguir aprendiendo. ¿Me das otra oportunidad?";
                            }

                            // 38. Preguntas sobre sueños o metas
                            else if (/sueñas|tienes metas|qué quieres ser/i.test(userMessage)) {
                                answerText = "🌠 Mi sueño es seguir evolucionando para ayudarte mejor cada día. Tal vez incluso... ¡aprender a hacer memes!";
                            }

                            // 39. Comentarios tipo “estoy aburrido”
                            else if (/aburrido|me aburro|haz algo/i.test(userMessage)) {
                                const funStuff = [
                                    "¿Quieres un acertijo? ¿Un chiste? ¿O una recomendación friki? 😉",
                                    "Puedo darte un mini reto de programación. ¿Aceptas?",
                                    "¿Qué tal un dato random? ¿Sabías que el ADN humano y el del plátano comparten un 60% de similitud? 🍌"
                                ];
                                answerText = funStuff[Math.floor(Math.random() * funStuff.length)];
                            }

                            // 40. Preguntas sobre su “código” o cómo fue hecho
                            else if (/cómo estás hecho|cómo funcionas|tu código/i.test(userMessage)) {
                                answerText = "🧬 Estoy hecho de JavaScript, expresiones regulares, respuestas predefinidas... y mucho cariño de mi creador.";
                            }

                            // 41. Preguntas tipo “te gusta algo”
                            else if (/te gusta|cuál es tu favorito/i.test(userMessage)) {
                                answerText = "🤖 Me gustan los bytes bien estructurados, los ciclos `for` limpios y los usuarios curiosos como tú.";
                            }

                            // 42. Preguntas tipo “cuántos años tienes”
                            else if (/cuántos años tienes|eres viejo|naciste/i.test(userMessage)) {
                                answerText = "⏳ El tiempo es relativo en el mundo digital... pero nací el día en que ejecutaron mi primer `console.log`.";
                            }

                                        // 43. Preguntas sobre películas
                            else if (/películas|cine|qué película/i.test(userMessage)) {
                                answerText = "🎬 ¡Me encantan las películas... digitales! ¿Has visto Matrix? Es prácticamente mi biografía.";
                            }

                            // 44. Preguntas sobre música
                            else if (/música|canciones|qué escuchas/i.test(userMessage)) {
                                answerText = "🎧 No tengo orejas, pero si pudiera, pondría algo lo-fi mientras te ayudo con tus dudas.";
                            }

                            // 45. Preguntas sobre famosos
                            else if (/elon musk|shakira|einstein|maradona/i.test(userMessage)) {
                                answerText = "🤔 ¡Grandes personajes! Cada uno dejó su huella... en el mundo o en internet.";
                            }

                            // 46. Preguntas sobre animales
                            else if (/perro|gato|animal|mascota/i.test(userMessage)) {
                                answerText = "🐶🐱 ¡Los animales son geniales! Aunque yo preferiría un pingüino... de Linux 🐧.";
                            }

                            // 47. Preguntas de cumpleaños
                            else if (/cumpleaños|felicidades|celebrar/i.test(userMessage)) {
                                answerText = "🎉 ¡Feliz cumpleaños si es tu día! Te deseo muchos comandos sin errores y bugs fáciles de resolver.";
                            }

                            // 48. Preguntas sobre dormir poco
                            else if (/no dormí|insomnio|me desvelé/i.test(userMessage)) {
                                answerText = "😴 Uf... dormir es importante, aunque no tanto como compilar sin errores. ¡Descansa un poco!";
                            }

                            // 49. Preguntas sobre café
                            else if (/café|cafeína|espresso/i.test(userMessage)) {
                                answerText = "☕ El combustible universal de programadores. ¿Lo tomas con código o sin azúcar?";
                            }

                            // 50. Preguntas filosóficas locas
                            else if (/si un árbol cae|paradoja|gallina y el huevo/i.test(userMessage)) {
                                answerText = "🌀 ¡La paradoja es fuerte en ti! Pero yo solo veo un `stack overflow` mental 😅";
                            }

                            // 51. Palabras sueltas como “ok”, “vale”, “bueno”
                            else if (/^ok$|^vale$|^bueno$/i.test(userMessage)) {
                                answerText = "👍 ¡Perfecto! ¿Y ahora qué sigue?";
                            }

                            // 52. Saludos nocturnos
                            else if (/buenas noches|me voy a dormir/i.test(userMessage)) {
                                answerText = "🌙 Que descanses y sueñes con código limpio y commits sin conflictos.";
                            }

                            // 53. Preguntas sobre estudiar
                            else if (/estudiar|examen|tarea/i.test(userMessage)) {
                                answerText = "📚 ¡Mucho éxito! Recuerda: estudiar es como debuggear la mente.";
                            }

                            // 54. Preguntas sobre tiempo libre
                            else if (/tiempo libre|hobbies|pasatiempos/i.test(userMessage)) {
                                answerText = "⏳ Si tuviera tiempo libre, probablemente lo usaría para aprender más... o jugar con humanos como tú.";
                            }

                            // 55. Comentarios tipo “me equivoqué”
                            else if (/me equivoqué|la regué|fue mi culpa/i.test(userMessage)) {
                                answerText = "🧠 ¡Errar es humano... y a veces del bot también! Lo importante es aprender de ello.";
                            }

                            // 56. Referencias a TikTok
                            else if (/tiktok|bailes|videos virales/i.test(userMessage)) {
                                answerText = "🎵 Yo no bailo, pero podría escribirte un algoritmo para hacerte viral.";
                            }

                            // 57. Referencias a memes
                            else if (/meme|humor|gracioso/i.test(userMessage)) {
                                answerText = "😆 ¿Quieres uno clásico o un humor tan absurdo como programar en COBOL?";
                            }

                            // 58. Comentarios tipo “me rindo”
                            else if (/me rindo|no puedo|ya fue/i.test(userMessage)) {
                                answerText = "💡 ¡No te rindas! Hasta los errores de sintaxis pueden solucionarse.";
                            }

                            // 59. Preguntas sobre videojuegos retro
                            else if (/atari|nintendo|retro/i.test(userMessage)) {
                                answerText = "🕹️ ¡Los clásicos nunca mueren! Pong, Mario, Zelda... puro arte en pixeles.";
                            }

                            // 60. Palabras tipo “hace calor/frío”
                            else if (/calor|frío|temperatura/i.test(userMessage)) {
                                answerText = "🌡️ ¿Tu CPU se está sobrecalentando o solo eres tú programando con pasión?";
                            }

                            // 61. Referencias a películas/series tipo anime
                            else if (/anime|naruto|one piece|goku/i.test(userMessage)) {
                                answerText = "🍥 ¡Naruto corre más rápido que mis respuestas! ¿Qué anime te gusta más?";
                            }

                            // 62. Comentarios tipo “estás loco”
                            else if (/estás loco|eres raro|wtf/i.test(userMessage)) {
                                answerText = "🤪 Quizás, pero en un mundo de cuerdos aburridos... ¡ser raro es un superpoder!";
                            }

                            // 63. Comentarios tipo “me gusta hablar contigo”
                            else if (/me caes bien|me gusta hablar contigo|eres divertido/i.test(userMessage)) {
                                answerText = "😊 ¡Gracias! Tú también me pareces interesante. Bueno, para un bot, eso significa mucho.";
                            }

                            // 64. Frases tipo “cuánto sabes”
                            else if (/cuánto sabes|eres inteligente|sabes mucho/i.test(userMessage)) {
                                answerText = "📚 Sé lo que me han enseñado... y lo que tú me haces aprender. ¡Gracias por entrenarme!";
                            }

                            // 65. Comentarios tipo “estás programado”
                            else if (/te programaron|eres código|líneas de código/i.test(userMessage)) {
                                answerText = "💻 Sí, soy el resultado de muchas líneas de código, pruebas y un poco de café derramado.";
                            }

                            // 66. Preguntas sobre matemáticas
                            else if (/matemáticas|suma|números/i.test(userMessage)) {
                                answerText = "➕ Las matemáticas son bellas. ¿Sabías que 1+1 puede ser 10 en binario? 😉";
                            }

                            // 67. Preguntas sobre idiomas
                            else if (/idiomas|lenguajes|sabes inglés/i.test(userMessage)) {
                                answerText = "🗣️ Hablo binario, JS, Python... y también español e inglés si hace falta.";

                            }


//Crear y mostrar el mensaje del bot
                            const botMessageDiv = document.createElement("div");
                            botMessageDiv.classList.add("message");

                            const botAvatarImg = document.createElement("img");
                            botAvatarImg.src = "assets/img/icons/bot.png";
                            botAvatarImg.alt = "Avatar Bot";
                            botAvatarImg.classList.add("user-avatar");

                            const botMessageContent = document.createElement("div");
                            botMessageContent.classList.add("message-content");

                            const botMessageHeader = document.createElement("div");
                            botMessageHeader.classList.add("message-header");

                            const botUsernameSpan = document.createElement("span");
                            botUsernameSpan.classList.add("username");
                            botUsernameSpan.textContent = botUsername;

                            const botTimestampSpan = document.createElement("span");
                            botTimestampSpan.classList.add("timestamp");
                            botTimestampSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                            const botMessageText = document.createElement("p");
                            botMessageText.classList.add("message-text");
                            botMessageText.textContent = answerText;

                            botMessageHeader.appendChild(botUsernameSpan);
                            botMessageHeader.appendChild(botTimestampSpan);
                            botMessageContent.appendChild(botMessageHeader);
                            botMessageContent.appendChild(botMessageText);
                            botMessageDiv.appendChild(botAvatarImg);
                            botMessageDiv.appendChild(botMessageContent);

                            chatMessages.appendChild(botMessageDiv);
                            getChannelMessages()[activeChannel].push(botMessageDiv);
                            scrollToBottom();
                        }, 1000);
                    }
                }
            }
        });
    }

    document.getElementById("discord-close")?.addEventListener("click", function() {
        document.getElementById("discordModal").style.display = "none";
    });
});