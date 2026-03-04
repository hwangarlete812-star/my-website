document.addEventListener('DOMContentLoaded', function() {
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

    aiIcon.addEventListener('click', () => {
        chatWindow.classList.remove('hidden');
        aiIcon.classList.add('hidden');
        if (chatBody.children.length === 0) {
            const welcomeMessage = document.createElement('div');
            welcomeMessage.textContent = '你好！我是 [名字] 的私人助理。你可以问我关于他的工作经历、项目细节，或者聊聊他的兴趣爱好。';
            chatBody.appendChild(welcomeMessage);
        }
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
        aiIcon.classList.remove('hidden');
    });

    const knowledgeBase = {
        "工作经历": "他曾在 XYZ 公司担任软件工程师，主要负责前端开发。",
        "项目": "他独立开发了一个名为‘智能任务管理器’的 Web 应用，使用 React 和 Node.js 构建。",
        "技术栈": "他主要专注于 Python 和 React，最近还在研究生成式 AI 的应用。",
        "联系方式": "您可以在页面底部找到他的社交媒体链接，或者发送邮件到 [your-email@example.com]。"
    };

    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.chat-input button');

    function handleUserInput() {
        const userInput = chatInput.value.trim();
        if (userInput === '') return;

        const userMessage = document.createElement('div');
        userMessage.textContent = `你: ${userInput}`;
        chatBody.appendChild(userMessage);

        let response = '抱歉，我不太理解你的问题。你可以试试问我关于他的“工作经历”、“项目”或“技术栈”。';
        for (const key in knowledgeBase) {
            if (userInput.toLowerCase().includes(key.toLowerCase())) {
                response = knowledgeBase[key];
                break;
            }
        }

        const aiResponse = document.createElement('div');
        aiResponse.textContent = `AI: ${response}`;
        chatBody.appendChild(aiResponse);

        chatInput.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    sendButton.addEventListener('click', handleUserInput);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
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
});
