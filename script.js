// --- YouTube Iframe Player API ---
// Video IDs for each page - REPLACE THESE WITH YOUR ACTUAL VIDEO IDS
var videoIdMusicZone = 'xBYxWUECdoA'; // Example: Rick Astley
var videoIdNostalgia = 'x-VUVDNDdZs'; // Example: Relaxing Piano Music
var videoIdGarden = 'FuHa9J8tkcY';   // Example: Nature Sounds

// This function creates an <iframe> (YouTube player) after the API code downloads.
function onYouTubeIframeAPIReady() {
    function createPlayer(playerId, videoId, pageName, statusElementId) {
        const playerDiv = document.getElementById(playerId);
        if (playerDiv) {
            new YT.Player(playerId, {
                height: '1', 
                width: '1',
                videoId: videoId,
                playerVars: {
                    'autoplay': 1, 'controls': 0, 'showinfo': 0, 'rel': 0, 
                    'loop': 1, 'playlist': videoId, 'mute': 1,
                    'modestbranding': 1, 'iv_load_policy': 3, 'playsinline': 1
                },
                events: {
                    'onReady': function(event) { onPlayerReady(event, pageName, document.getElementById(statusElementId)); },
                    'onStateChange': function(event) { onPlayerStateChange(event, pageName, document.getElementById(statusElementId)); },
                    'onError': function(event) { onPlayerError(event, pageName, document.getElementById(statusElementId)); }
                }
            });
        }
    }

    createPlayer('youtube-player', videoIdMusicZone, '音樂律動區', 'youtube-autoplay-status');
    createPlayer('youtube-player-nostalgia', videoIdNostalgia, '懷舊回憶角', 'youtube-autoplay-status-nostalgia');
    createPlayer('youtube-player-garden', videoIdGarden, '園藝治療區', 'youtube-autoplay-status-garden');
}

function onPlayerReady(event, pageName, statusEl) {
    const targetPlayer = event.target;
    if (statusEl) {
        statusEl.innerHTML = `🎵 ${pageName} YouTube 音樂嘗試自動播放 (靜音)...<br>點擊頁面任何位置嘗試開啟聲音。`;
    }

    let hasInteracted = false; 
    document.body.addEventListener('click', function onYouTubeFirstInteraction() {
        if (!hasInteracted && targetPlayer && typeof targetPlayer.isMuted === 'function' && targetPlayer.isMuted()) {
            if (typeof targetPlayer.unMute === 'function') {
                hasInteracted = true; 
                targetPlayer.unMute();
                if (targetPlayer.getVolume && targetPlayer.getVolume() < 10) { 
                    targetPlayer.setVolume(50); 
                }
                if (statusEl) statusEl.textContent = `🎶 ${pageName} YouTube 音樂正在播放...`;
            }
        }
    }, { once: true });
}

function onPlayerStateChange(event, pageName, statusEl) {
    const targetPlayer = event.target;
    if (event.data == YT.PlayerState.PLAYING && statusEl) {
        if (targetPlayer.isMuted && targetPlayer.isMuted()) {
             if (statusEl.innerHTML.includes('點擊頁面')) { 
                statusEl.innerHTML = `🎵 ${pageName} YouTube 音樂已自動播放 (靜音)。<br>點擊頁面任何位置嘗試開啟聲音。`;
             }
        } else {
            statusEl.textContent = `🎶 ${pageName} YouTube 音樂正在播放...`;
        }
    }
}

function onPlayerError(event, pageName, statusEl) {
    console.error(`YouTube Player Error (${pageName}):`, event.data);
    if (statusEl) {
        let errorMessage = `抱歉，載入 ${pageName} YouTube 音樂時發生錯誤。`;
        switch (event.data) {
            case 2: errorMessage = '錯誤：影片 ID 無效。'; break;
            case 5: errorMessage = '錯誤：HTML5 播放器發生問題。'; break;
            case 100: errorMessage = '錯誤：找不到指定的影片。'; break;
            case 101: case 150: errorMessage = '錯誤：此影片的擁有者不允許嵌入播放。'; break;
        }
        statusEl.textContent = errorMessage;
    }
}

// Language Choice function needs to be globally accessible if called by onclick in HTML
window.checkLanguageChoice = function(choice, isCorrect, button) {
    const langFeedbackEl = document.getElementById('language-feedback'); 
    const langSentenceBlankEl = document.querySelector('#language-sentence .blank'); 
    if (langFeedbackEl && langSentenceBlankEl) {
        if (button && button.parentElement) {
            Array.from(button.parentElement.children).forEach(btn => {
                if(btn.tagName === 'BUTTON') btn.disabled = true;
            }); 
            button.style.fontWeight = 'bold'; 
        }
        langSentenceBlankEl.textContent = choice; 
        langFeedbackEl.style.display = 'block'; 
        if (isCorrect) {
            langFeedbackEl.innerHTML = `「${choice}」很合適！對許多人來說這很直覺。但對於部分失智長輩，即使是簡單的詞語也可能一時想不起來，或用錯詞彙。`;
        } else {
            langFeedbackEl.innerHTML = `「${choice}」在這個情境下可能不太常見。有時長輩可能會說出不合邏輯或不相關的詞語，這反映了他們在語言組織上的困難。`;
        }
        langFeedbackEl.innerHTML += `<br>當長輩表達有困難時，耐心傾聽、給予鼓勵和非口語的理解（如微笑、點頭）都非常重要。「記憶花園」的照護夥伴都受過友善溝通技巧的培訓。`;
    }
};


document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation ---
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const mainNav = document.getElementById('main-nav');
    if (menuToggleBtn && mainNav) { 
        menuToggleBtn.addEventListener('click', () => { 
            mainNav.classList.toggle('active'); 
            const isExpanded = mainNav.classList.contains('active'); 
            menuToggleBtn.setAttribute('aria-expanded', isExpanded); 
            menuToggleBtn.innerHTML = isExpanded ? '&#10005;' : '&#9776;'; 
        }); 
    }

    // Smooth scroll & active link (Only for index.html with sections)
    if (document.body.contains(document.getElementById('hero-section'))) { 
        const navLinks = document.querySelectorAll('#main-nav a[href^="index.html#"], #main-nav a[href^="#"]'); 
        const headerOffset = document.querySelector('header') ? document.querySelector('header').offsetHeight : 60; 
        navLinks.forEach(anchor => { 
            anchor.addEventListener('click', function (e) { 
                let targetId = this.getAttribute('href'); 
                if (!targetId.startsWith("#") && targetId.includes("index.html#")) { 
                    if (mainNav && mainNav.classList.contains('active')) { mainNav.classList.remove('active'); if (menuToggleBtn) { menuToggleBtn.setAttribute('aria-expanded', 'false'); menuToggleBtn.innerHTML = '&#9776;'; } } return; 
                } 
                e.preventDefault(); 
                targetId = targetId.replace("index.html", ""); 
                const targetElement = document.querySelector(targetId); 
                if (targetElement) { 
                    const elementPosition = targetElement.getBoundingClientRect().top; 
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset; 
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' }); 
                    navLinks.forEach(link => link.classList.remove('active')); 
                    this.classList.add('active'); 
                    if (mainNav && mainNav.classList.contains('active')) { mainNav.classList.remove('active'); if (menuToggleBtn) { menuToggleBtn.setAttribute('aria-expanded', 'false'); menuToggleBtn.innerHTML = '&#9776;'; } } 
                } 
            }); 
        }); 
        const sections = document.querySelectorAll('main section[id]'); 
        window.addEventListener('scroll', () => { 
            let current = ''; 
            sections.forEach(section => { 
                const sectionTop = section.offsetTop; 
                if (pageYOffset >= sectionTop - headerOffset - 50) { current = section.getAttribute('id'); } 
            }); 
            navLinks.forEach(link => { 
                link.classList.remove('active'); 
                const href = link.getAttribute('href'); 
                if (href.endsWith("#" + current) || href === "index.html#" + current) { link.classList.add('active'); } 
            }); 
        }); 
    }

    // --- Simulation 1: Visual Blur (if elements exist on the current page) ---
    const toggleBlurBtn = document.getElementById('toggle-blur-btn');
    const visualImg = document.getElementById('visual-simulation-img');
    const visualFeedback = document.getElementById('visual-feedback');
    if (toggleBlurBtn && visualImg && visualFeedback) {
        let isBlurred = false;
        if (visualImg.src && visualImg.src !== window.location.href && !visualImg.src.endsWith('#')) { 
            visualImg.classList.add('blurred');
            isBlurred = true;
            toggleBlurBtn.textContent = '移除視覺模糊';
        } else {
            toggleBlurBtn.textContent = '模擬視覺模糊';
        }
        toggleBlurBtn.addEventListener('click', () => { 
            isBlurred = !isBlurred; 
            visualImg.classList.toggle('blurred', isBlurred); 
            toggleBlurBtn.textContent = isBlurred ? '移除視覺模糊' : '模擬視覺模糊'; 
            visualFeedback.style.display = 'block'; 
            if (isBlurred) { 
                visualFeedback.innerHTML = `畫面變得模糊了，是不是有些不習慣？這模擬了部分失智長輩可能經歷的視覺退化或感知困難。在「記憶花園」，我們透過高對比的環境色彩、清晰的圖示指引，來幫助長輩們更容易辨識環境。`; 
            } else { 
                visualFeedback.innerHTML = `畫面恢復清晰了。對長輩友善的視覺設計，能大大提升他們的自主性與安全感。`; 
            } 
        });
    }

    // --- Simulation 2: Memory Test (if elements exist) ---
    const startMemoryTestBtn = document.getElementById('start-memory-test-btn');
    if (startMemoryTestBtn) {
        const memoryItemsDisplay = document.getElementById('memory-items-display');
        const memoryOptionsContainer = document.getElementById('memory-options-container');
        const memoryFeedbackSim2 = document.getElementById('memory-feedback'); 
        const memoryScoreDisplay = document.getElementById('memory-score-display');

        if (memoryItemsDisplay && memoryOptionsContainer && memoryFeedbackSim2 && memoryScoreDisplay) {
            const memoryItemsPool = [{name:"蘋果",img:"🍎"},{name:"書本",img:"📚"},{name:"雨傘",img:"☂️"},{name:"鑰匙",img:"🔑"},{name:"貓咪",img:"🐈"},{name:"太陽",img:"☀️"},{name:"時鐘",img:"⏰"},{name:"杯子",img:"☕"}];
            let itemsToRemember = [];
            let currentRecallOptions = [];
            let userMemoryScore = 0;
            let itemsClickedCount = 0;
            const NUM_ITEMS_TO_SHOW = 3;
            const NUM_OPTIONS_TO_CHOOSE = 6;

            function shuffleArray(array) { for(let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } }
            
            startMemoryTestBtn.addEventListener('click', () => {
                startMemoryTestBtn.disabled = true; startMemoryTestBtn.textContent = '記憶中...';
                memoryItemsDisplay.textContent = ''; memoryOptionsContainer.innerHTML = ''; memoryOptionsContainer.style.display = 'none';
                memoryFeedbackSim2.style.display = 'none'; memoryScoreDisplay.textContent = '';
                userMemoryScore = 0; itemsClickedCount = 0;
                shuffleArray(memoryItemsPool); itemsToRemember = memoryItemsPool.slice(0, NUM_ITEMS_TO_SHOW);
                let i = 0;
                function showNextItem() {
                    if (i < itemsToRemember.length) {
                        memoryItemsDisplay.innerHTML = `<span style="font-size:3rem;">${itemsToRemember[i].img}</span><br/>${itemsToRemember[i].name}`;
                        i++; setTimeout(showNextItem, 2000);
                    } else {
                        memoryItemsDisplay.textContent = '時間到！'; setTimeout(promptForRecall, 1500);
                    }
                }
                showNextItem();
            });

            function promptForRecall() {
                memoryItemsDisplay.textContent = '請選出您記得的物品：';
                let distractors = memoryItemsPool.filter(poolItem => !itemsToRemember.some(rememberItem => rememberItem.name === poolItem.name)).slice(0, NUM_OPTIONS_TO_CHOOSE - itemsToRemember.length);
                currentRecallOptions = [...itemsToRemember, ...distractors];
                shuffleArray(currentRecallOptions);
                currentRecallOptions.forEach(item => {
                    const button = document.createElement('button');
                    button.innerHTML = `<span style="font-size:1.5rem;">${item.img}</span><br/>${item.name}`;
                    button.onclick = () => checkMemoryItem(item.name, button);
                    memoryOptionsContainer.appendChild(button);
                });
                memoryOptionsContainer.style.display = 'grid';
                startMemoryTestBtn.disabled = false; startMemoryTestBtn.textContent = '重新開始記憶挑戰';
            }

            function checkMemoryItem(selectedItemName, button) {
                button.disabled = true; itemsClickedCount++;
                const isCorrect = itemsToRemember.some(item => item.name === selectedItemName);
                if (isCorrect) { userMemoryScore++; button.classList.add('correct'); } else { button.classList.add('incorrect'); }
                memoryScoreDisplay.textContent = `已選 ${itemsClickedCount} 個，目前答對：${userMemoryScore} / ${itemsToRemember.length}`;
                const allOptionsButtons = Array.from(memoryOptionsContainer.children);
                const allCorrectItemsClickedOrFound = itemsToRemember.every(item => {
                    const btnForCorrect = allOptionsButtons.find(b => b.textContent.includes(item.name) && b.classList.contains('correct'));
                    return btnForCorrect; 
                });
                const allOptionsDisabled = allOptionsButtons.every(btn => btn.disabled);

                if (allOptionsDisabled || (userMemoryScore === itemsToRemember.length && allCorrectItemsClickedOrFound)) {
                    memoryFeedbackSim2.style.display = 'block';
                    let feedbackMsg = `您總共答對了 ${userMemoryScore} / ${itemsToRemember.length} 個物品。`;
                    if (userMemoryScore === itemsToRemember.length) { feedbackMsg += " 記憶力很棒！"; }
                    else if (userMemoryScore > 0) { feedbackMsg += " 不錯喔！"; }
                    else { feedbackMsg += " 別灰心，這只是個小測驗。"; }
                    feedbackMsg += ` 對於失智長輩，短期記憶的挑戰更為頻繁。在「記憶花園」，我們透過重複提醒、視覺輔助與規律作息，來支持長輩的日常生活。`;
                    memoryFeedbackSim2.innerHTML = feedbackMsg;
                    allOptionsButtons.forEach(btn => btn.disabled = true); 
                }
            }
        }
    }
    
    // --- Simulation 4: Orientation (if elements exist) ---
    const orientationMapContainer = document.getElementById('orientation-map-container');
    if (orientationMapContainer) {
        const orientationMapImg = document.getElementById('orientation-map-img');
        const orientationFeedbackSim4 = document.getElementById('orientation-feedback'); 
        if (orientationMapImg && orientationFeedbackSim4) {
            const mapHotspotsData = [{x:5,y:5,w:40,h:40,name:"A區: 入口",isTarget:false},{x:50,y:5,w:45,h:40,name:"B區: 餐廳",isTarget:false},{x:5,y:50,w:40,h:45,name:"C區: 休憩花園",isTarget:true},{x:50,y:50,w:45,h:45,name:"D區: 活動室",isTarget:false}];
            function renderHotspots() { 
                orientationMapContainer.querySelectorAll('.map-hotspot').forEach(el => el.remove()); 
                mapHotspotsData.forEach(data => { 
                    const spot = document.createElement('div'); spot.classList.add('map-hotspot'); 
                    spot.style.left = data.x + '%'; spot.style.top = data.y + '%'; 
                    spot.style.width = data.w + '%'; spot.style.height = data.h + '%'; 
                    spot.addEventListener('click', () => handleMapClick(data.isTarget, data.name, spot)); 
                    orientationMapContainer.appendChild(spot); 
                }); 
            }
            if (orientationMapImg.src && orientationMapImg.src !== window.location.href && !orientationMapImg.src.endsWith('#')) { 
                orientationMapImg.onload = renderHotspots;
                if (orientationMapImg.complete) { renderHotspots(); }
                window.addEventListener('resize', renderHotspots);
            }
            function handleMapClick(isCorrectLocation, areaName, clickedSpot) { 
                orientationFeedbackSim4.style.display = 'block'; 
                orientationMapContainer.querySelectorAll('.map-hotspot').forEach(spot => { 
                    spot.style.pointerEvents = 'none'; 
                    if (spot === clickedSpot) { 
                        spot.style.backgroundColor = isCorrectLocation ? 'rgba(0,255,0,0.3)' : 'rgba(255,0,0,0.3)'; 
                        spot.style.borderColor = isCorrectLocation ? 'rgba(0,128,0,0.7)' : 'rgba(128,0,0,0.7)'; 
                    } else { 
                        spot.style.borderColor = 'rgba(255,0,0,0)'; 
                    } 
                }); 
                if (isCorrectLocation) { 
                    orientationFeedbackSim4.innerHTML = `答對了！您找到了「休憩花園 (${areaName})」。對失智長輩來說，清晰的環境標示和熟悉的路徑非常重要。`; 
                    orientationFeedbackSim4.classList.remove('warning'); 
                } else { 
                    orientationFeedbackSim4.innerHTML = `您點擊的是「${areaName}」。找錯地方了呢！別擔心，這模擬了長輩在空間定向感上的困難，他們可能在熟悉的環境中迷路。在「記憶花園」，我們使用顏色區塊、特色地標和簡單動線來幫助長輩定位。`; 
                    orientationFeedbackSim4.classList.add('warning'); 
                } 
            }
        }
    }

    // --- AI Helper (Simplified Chatbot) ---
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const predefinedQBtns = document.querySelectorAll('.predefined-q-btn');

    if (chatWindow && userInput && sendBtn) {
        const qna = {
            "失智症是什麼": "失智症是一群症狀的總稱（症候群），並非單一疾病。它主要是腦部功能退化導致，影響記憶力、語言能力、判斷力、執行功能等多方面認知能力，嚴重程度足以影響日常生活。",
            "什麼是失智症": "失智症是一群症狀的總稱（症候群），並非單一疾病。它主要是腦部功能退化導致，影響記憶力、語言能力、判斷力、執行功能等多方面認知能力，嚴重程度足以影響日常生活。",
            "失智症症狀": "失智症的常見症狀包括：記憶力顯著衰退（尤其是短期記憶）、語言表達或理解困難、無法執行熟悉事務、對時間地點感到混淆、判斷力變差、抽象思考困難、東西放錯位置、情緒或個性改變、對事物失去興趣、活動力降低等。",
            "常見症狀": "失智症的常見症狀包括：記憶力顯著衰退（尤其是短期記憶）、語言表達或理解困難、無法執行熟悉事務、對時間地點感到混淆、判斷力變差、抽象思考困難、東西放錯位置、情緒或個性改變、對事物失去興趣、活動力降低等。",
            "如何預防失智症": "預防失智症可以從多方面著手：多動腦（如學習新事物、閱讀、玩益智遊戲）、規律運動、健康飲食（多蔬果、地中海飲食）、充足睡眠、維持社交活動、控制三高（高血壓、高血糖、高血脂）、避免頭部外傷、戒菸及避免過量飲酒。",
            "預防": "預防失智症可以從多方面著手：多動腦、規律運動、健康飲食、充足睡眠、維持社交活動、控制三高、避免頭部外傷、戒菸及避免過量飲酒。",
            "如何與失智者溝通": "與失智者溝通時，請保持耐心、語氣溫和、語速放慢、使用簡短清晰的句子。給予足夠時間回應，避免催促或糾正。多用肢體語言輔助，保持眼神接觸，並給予肯定與鼓勵。可利用熟悉的照片或物品引導話題。",
            "溝通技巧": "與失智者溝通時，請保持耐心、語氣溫和、語速放慢、使用簡短清晰的句子。給予足夠時間回應，避免催促或糾正。多用肢體語言輔助，保持眼神接觸，並給予肯定與鼓勵。",
            "記憶花園": "記憶花園致力於為失智長輩打造一個充滿尊嚴、互動與歸屬感的友善社區。我們結合AI科技、友善環境設計與社區參與，提供非藥物介入活動，如懷舊治療、音樂律動、園藝治療等，希望能延緩退化，提升長輩生活品質，並減輕家屬照護負擔。",
            "你好": "您好！很高興為您服務。", "哈囉": "哈囉！請問有什麼可以協助您的嗎？", "嗨": "嗨！有什麼我可以幫忙的嗎？",
            "謝謝": "不客氣！希望能幫助到您。"
        };
        function addMessage(message, type) { const messageDiv = document.createElement('div'); messageDiv.classList.add('chat-message', type + '-message'); messageDiv.textContent = message; chatWindow.appendChild(messageDiv); chatWindow.scrollTop = chatWindow.scrollHeight; }
        function getBotResponse(userMessage) { const lowerUserMessage = userMessage.toLowerCase().trim(); for (const keyword in qna) { if (lowerUserMessage.includes(keyword.toLowerCase())) { return qna[keyword]; } } if (lowerUserMessage.length > 0 && !lowerUserMessage.includes("謝謝") && !lowerUserMessage.includes("不客氣")) { return "抱歉，我不太理解您的問題。您可以試著換個方式問，或點選下方的常見問題按鈕。"; } return ""; }
        function handleUserQuery(query) { if (query.trim() === "") return; addMessage(query, 'user'); userInput.value = ""; setTimeout(() => { const botResponse = getBotResponse(query); if (botResponse) { addMessage(botResponse, 'bot'); } }, 500 + Math.random() * 500); }
        sendBtn.addEventListener('click', () => { handleUserQuery(userInput.value); });
        userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { handleUserQuery(userInput.value); } });
        predefinedQBtns.forEach(button => { button.addEventListener('click', () => { const question = button.getAttribute('data-question'); userInput.value = question; handleUserQuery(question); }); });
    }
});

// Global beforeunload listener to stop any active YouTube player
window.addEventListener('beforeunload', () => {
    function stopPlayerIfExists(playerId) {
        if (typeof YT !== 'undefined' && typeof YT.get === 'function') {
            const playerInstance = YT.get(playerId);
            if (playerInstance && typeof playerInstance.stopVideo === 'function' && 
                typeof playerInstance.getPlayerState === 'function' && 
                playerInstance.getPlayerState() !== YT.PlayerState.ENDED && 
                playerInstance.getPlayerState() !== YT.PlayerState.UNSTARTED) {
                playerInstance.stopVideo();
            }
        }
    }
    stopPlayerIfExists('youtube-player');
    stopPlayerIfExists('youtube-player-nostalgia');
    stopPlayerIfExists('youtube-player-garden');
});