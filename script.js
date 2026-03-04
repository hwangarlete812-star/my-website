document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');

    function enterWebsite() {
        if (splashScreen) {
            splashScreen.classList.add('hidden');
            // 在动画结束后将其从 DOM 中移除，以优化性能
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 800); // 这里的延迟应与 CSS 中的 transition 时间一致
        }
    }

    // 添加一次性事件监听器
    window.addEventListener('click', enterWebsite, { once: true });
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            enterWebsite();
        }
    }, { once: true });

    const slides = [
        'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1554034483-04fda0d3507b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ];

    let currentSlide = 0;
    const carouselContainer = document.querySelector('.hero-carousel');
    const dotsContainer = document.querySelector('.carousel-dots');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const slide = entry.target;
                slide.style.backgroundImage = slide.dataset.bg;
                observer.unobserve(slide);
            }
        });
    });

    slides.forEach((slide, index) => {
        const slideElement = document.createElement('div');
        slideElement.classList.add('slide');
        slideElement.dataset.bg = `url('${slide}')`;
        if (index === 0) {
            slideElement.classList.add('active');
            slideElement.style.backgroundImage = `url('${slide}')`;
        } else {
            observer.observe(slideElement);
        }
        carouselContainer.appendChild(slideElement);

        const dotElement = document.createElement('div');
        dotElement.classList.add('dot');
        if (index === 0) {
            dotElement.classList.add('active');
        }
        dotElement.addEventListener('click', () => {
            changeSlide(index);
        });
        dotsContainer.appendChild(dotElement);
    });

    const slideElements = document.querySelectorAll('.slide');
    const dotElements = document.querySelectorAll('.dot');

    function changeSlide(index) {
        slideElements[currentSlide].classList.remove('active');
        dotElements[currentSlide].classList.remove('active');
        currentSlide = index;
        slideElements[currentSlide].classList.add('active');
        dotElements[currentSlide].classList.add('active');
    }

    function nextSlide() {
        let newIndex = currentSlide + 1;
        if (newIndex >= slides.length) {
            newIndex = 0;
        }
        changeSlide(newIndex);
    }

    let slideInterval = setInterval(nextSlide, 5000);

    carouselContainer.addEventListener('mouseover', () => {
        clearInterval(slideInterval);
    });

    carouselContainer.addEventListener('mouseout', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });

    // AI Companion
    const aiIcon = document.getElementById('ai-icon');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatBody = document.querySelector('.chat-body');
    const chatInput = document.querySelector('.chat-input textarea');
    const sendButton = document.querySelector('.chat-input button');

    // 存储对话历史
    let conversationHistory = [];

    // AI 配置
    const AITutor = {
        name: "HwangArlete812",
        skills: ["Python", "React", "生成式 AI"],
        contact: "您可以在页面底部找到他的社交媒体链接。"
    };

    // 系统提示，用于指导 AI 的行为
    const systemPrompt = `你是一个个人网站的 AI 助手。你的名字叫“小助手”。你的任务是友好、自然地回答用户的问题。网站的主人是 ${AITutor.name}。

关于网站主人的核心信息如下：
- 身份：他是一名AI训练入门学习者，师从行业资深AI训练师。
- 学习方向：他正在学习数据清洗、标注和质量把控，并实践轻量级对话模型的微调。他的目标是掌握Prompt工程和小型模型训练流程，并最终将技能应用于垂直领域的智能助手开发。
- 日常学习：他每天都会与导师沟通，并通过整理训练日志来记录参数调整的效果，持续积累实操经验。

请根据这些信息回答关于网站主人的问题。对于其他通用问题，请像一个聪明的助手一样回答。请保持回答简洁、亲切。`;

    conversationHistory.push({ role: "system", content: systemPrompt });

    aiIcon.addEventListener('click', () => {
        chatWindow.classList.remove('hidden');
        aiIcon.classList.add('hidden');
        if (chatBody.children.length === 0) {
            appendMessage('你好！我是 [名字] 的私人助理。你可以问我关于他的工作经历、项目细节，或者聊聊他的兴趣爱好。', 'ai');
        }
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
        aiIcon.classList.remove('hidden');
    });

    function appendMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-bubble', sender);
        messageElement.textContent = text;
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    async function handleUserInput() {
        const userInput = chatInput.value.trim();
        if (userInput === '') return;

        appendMessage(userInput, 'user');
        conversationHistory.push({ role: "user", content: userInput });
        chatInput.value = '';
        autoResizeTextarea();

        // 显示“正在输入”提示
        const thinkingMessage = document.createElement('div');
        thinkingMessage.classList.add('chat-bubble', 'ai');
        thinkingMessage.textContent = '思考中...';
        chatBody.appendChild(thinkingMessage);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            const response = await fetch('https://aihubmix.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer sk-FrVBeeqZy0DJAYgx118c58D943Bb415eAc2542F06d12B180`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo", // 您可以根据 aihubmix 支持的模型进行更换
                    messages: conversationHistory
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            // 移除“正在输入”提示并显示 AI 回答
            chatBody.removeChild(thinkingMessage);
            appendMessage(aiResponse, 'ai');
            conversationHistory.push({ role: "assistant", content: aiResponse });

        } catch (error) {
            console.error("Error calling AI API:", error);
            chatBody.removeChild(thinkingMessage);
            appendMessage('抱歉，我好像遇到了一点网络问题，请稍后再试。', 'ai');
        }
    }

    sendButton.addEventListener('click', handleUserInput);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserInput();
        }
    });

    function autoResizeTextarea() {
        chatInput.style.height = 'auto';
        chatInput.style.height = chatInput.scrollHeight + 'px';
    }

    chatInput.addEventListener('input', autoResizeTextarea);

    // 新增：留言板功能
    const feedbackForm = document.getElementById('feedback-form');
    const commentsContainer = document.getElementById('comments-container');

    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止表单默认的提交行为

        const contactInput = document.getElementById('contact');
        const messageInput = document.getElementById('message');

        const contact = contactInput.value.trim();
        const message = messageInput.value.trim();

        if (message === '') {
            alert('反馈意见不能为空哦！');
            return;
        }

        const commentCard = document.createElement('div');
        commentCard.classList.add('comment-card');

        const messageP = document.createElement('p');
        messageP.textContent = message;

        const contactP = document.createElement('p');
        contactP.classList.add('comment-contact');
        contactP.textContent = `来自：${contact || '一位匿名的朋友'}`;

        commentCard.appendChild(messageP);
        commentCard.appendChild(contactP);

        commentsContainer.prepend(commentCard); // 使用 prepend 让新留言显示在最上面

        // 清空表单
        contactInput.value = '';
        messageInput.value = '';
    });

    // Social Hub
    const socialLinksContainer = document.querySelector('.social-links');
    const socialLinks = [
        { name: 'GitHub', url: '#', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg' },
        { name: 'LinkedIn', url: '#', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg' },
        { name: 'Twitter', url: '#', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/twitter.svg' }
    ];

    socialLinks.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.target = '_blank';
        linkElement.title = link.name;

        const iconElement = document.createElement('img');
        iconElement.src = link.icon;
        iconElement.alt = link.name;

        linkElement.appendChild(iconElement);
        socialLinksContainer.appendChild(linkElement);
    });

    // 新增：互动卡片点击事件
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const details = card.querySelector('.card-details');
            if (details.style.display === 'block') {
                details.style.display = 'none';
            } else {
                details.style.display = 'block';
            }
        });
    });
});
