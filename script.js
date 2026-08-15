// HTML escape function to prevent XSS
const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return String(text).replace(/[&<>"']/g, match => escapeMap[match]);
    if (!text) return '';
    return String(text).replace(/[&<>"']/g, function(match) {
        return escapeMap[match];
    });
}

// Service data
const services = [
    {
        name: "GitHub Copilot Workspace",
        icon: "🐙",
        category: "ide",
        description: "AI-powered development environment integrated with GitHub. Build entire applications from natural language descriptions with AI assistance throughout the development lifecycle.",
        features: [
            "Integrated with GitHub repositories",
            "Multi-file editing with AI",
            "Natural language to code generation",
            "Context-aware suggestions"
        ],
        pricing: "From $10/month (includes Copilot)",
        url: "https://github.com/features/copilot"
    },
    {
        name: "Cursor",
        icon: "⚡",
        category: "ide",
        description: "AI-first code editor built for pair programming with AI. Fork of VS Code with advanced AI capabilities including Composer for multi-file edits and chat-driven development.",
        features: [
            "Built on VS Code",
            "Multi-file AI editing (Composer)",
            "Tab autocomplete",
            "Codebase understanding",
            "Terminal command generation"
        ],
        pricing: "Free tier available, Pro from $20/month",
        url: "https://cursor.sh"
    },
    {
        name: "Windsurf by Codeium",
        icon: "🌊",
        category: "ide",
        description: "The world's first agentic IDE with Cascade for deep codebase understanding. Windsurf allows AI to autonomously edit across files while maintaining context and intent.",
        features: [
            "Cascade agentic flow system",
            "Multi-file autonomous editing",
            "Deep codebase understanding",
            "Copilot++ inline suggestions",
            "Built on VS Code"
        ],
        pricing: "Free tier available, Pro from $15/month",
        url: "https://codeium.com/windsurf"
    },
    {
        name: "Replit Agent",
        icon: "🤖",
        category: "web",
        description: "AI agent that builds full-stack applications directly in the browser. Deploy and host apps instantly with natural language prompts in Replit's cloud development environment.",
        features: [
            "Browser-based development",
            "Full-stack app deployment",
            "Instant hosting included",
            "Package management automation",
            "Collaborative coding"
        ],
        pricing: "From $25/month (Replit Core)",
        url: "https://replit.com/ai"
    },
    {
        name: "Bolt.new (StackBlitz)",
        icon: "⚡",
        category: "web",
        description: "Prompt-to-fullstack web app platform. Build, run, and deploy complete web applications directly in the browser with AI assistance, no local setup required.",
        features: [
            "Full-stack web apps in browser",
            "Instant preview and deployment",
            "WebContainers technology",
            "NPM package support",
            "Export to GitHub"
        ],
        pricing: "Free tier available, Premium from $20/month",
        url: "https://bolt.new"
    },
    {
        name: "v0 by Vercel",
        icon: "✨",
        category: "web",
        description: "AI-powered UI generation tool that creates React components from text prompts. Specializes in creating beautiful, production-ready interfaces using Shadcn UI and Tailwind CSS.",
        features: [
            "Text to React components",
            "Shadcn UI integration",
            "Tailwind CSS styling",
            "Iterative refinement",
            "Export to Next.js"
        ],
        pricing: "Free tier available, Premium from $20/month",
        url: "https://v0.dev"
    },
    {
        name: "Lovable (formerly GPT Engineer)",
        icon: "💜",
        category: "fullstack",
        description: "AI-powered full-stack development platform that builds complete applications from prompts. Supports modern frameworks and includes deployment capabilities.",
        features: [
            "Full-stack application generation",
            "React, Vue, and more",
            "Database integration",
            "One-click deployment",
            "Iterative development"
        ],
        pricing: "Starting from $20/month",
        url: "https://lovable.dev"
    },
    {
        name: "Webstudio",
        icon: "🎨",
        category: "web",
        description: "Open-source visual website builder with AI assistance. Create responsive websites with a visual interface enhanced by AI-powered suggestions and generation.",
        features: [
            "Visual website builder",
            "AI-powered design assistance",
            "Component library",
            "Responsive design",
            "Open source"
        ],
        pricing: "Free tier available, Pro from $20/month",
        url: "https://webstudio.is"
    },
    {
        name: "Devin by Cognition AI",
        icon: "🧠",
        category: "fullstack",
        description: "Autonomous AI software engineer that can plan, code, debug, and deploy entire applications. Operates independently with its own command line, browser, and development environment.",
        features: [
            "Fully autonomous coding",
            "End-to-end app development",
            "Planning and debugging",
            "Independent environment",
            "Real-time collaboration"
        ],
        pricing: "Contact for pricing (Enterprise)",
        url: "https://www.cognition-labs.com/devin"
    },
    {
        name: "Pythagora (GPT Pilot)",
        icon: "🐍",
        category: "fullstack",
        description: "AI developer that builds production-ready apps through conversation. Creates complete applications by discussing requirements and iteratively building features.",
        features: [
            "Conversational development",
            "Production-ready code",
            "Multiple framework support",
            "Git integration",
            "Testing automation"
        ],
        pricing: "Open source with paid plans from $30/month",
        url: "https://www.pythagora.ai"
    },
    {
        name: "Smol Developer",
        icon: "🔧",
        category: "fullstack",
        description: "AI agent that generates entire codebases from a single prompt. Focuses on creating minimal, functional applications with clean architecture.",
        features: [
            "Full codebase generation",
            "Multiple language support",
            "Clean architecture focus",
            "Open source",
            "Local or API usage"
        ],
        pricing: "Open source (bring your own API key)",
        url: "https://github.com/smol-ai/developer"
    },
    {
        name: "Continue.dev",
        icon: "🔄",
        category: "ide",
        description: "Open-source autopilot for VS Code and JetBrains. Brings ChatGPT-like experience directly into your IDE with codebase context awareness.",
        features: [
            "VS Code & JetBrains support",
            "Multiple LLM support",
            "Codebase indexing",
            "Custom commands",
            "Open source"
        ],
        pricing: "Free and open source",
        url: "https://continue.dev"
    },
    {
        name: "Tabnine",
        icon: "🎯",
        category: "ide",
        description: "AI code assistant with whole-line and full-function code completions. Trained on permissive open-source code with enterprise-ready features.",
        features: [
            "Multi-IDE support",
            "Whole-line completions",
            "Custom model training",
            "Privacy-focused",
            "Team collaboration"
        ],
        pricing: "Free tier available, Pro from $12/month",
        url: "https://www.tabnine.com"
    },
    {
        name: "Codeium",
        icon: "💫",
        category: "ide",
        description: "Free AI code completion tool supporting 70+ languages and 40+ IDEs. Offers advanced features including AI-powered search and chat.",
        features: [
            "70+ languages supported",
            "40+ IDE integrations",
            "AI chat and search",
            "Unlimited completions",
            "Always free for individuals"
        ],
        pricing: "Free for individuals, Teams from $15/user/month",
        url: "https://codeium.com"
    },
    {
        name: "Anysphere (Mojo)",
        icon: "🎪",
        category: "ide",
        description: "Next-generation AI coding assistant focused on deep code understanding and autonomous problem solving. Emphasizes agent-driven development workflows.",
        features: [
            "Deep code understanding",
            "Autonomous problem solving",
            "Multi-file awareness",
            "Advanced debugging",
            "VS Code integration"
        ],
        pricing: "Waitlist/Invite only",
        url: "https://www.anysphere.inc"
    },
    {
        name: "Magic.dev",
        icon: "🪄",
        category: "fullstack",
        description: "AI software engineer with superhuman code generation capabilities. Features LTM (Long-Term Memory) for massive codebase understanding up to millions of lines.",
        features: [
            "Million+ line codebase support",
            "Long-term memory (LTM)",
            "Autonomous coding",
            "Multi-file refactoring",
            "Production-ready output"
        ],
        pricing: "Contact for early access",
        url: "https://magic.dev"
    },
    {
        name: "Sweep",
        icon: "🧹",
        category: "fullstack",
        description: "AI junior developer that turns GitHub issues into pull requests. Handles bugs, small features, and refactoring tasks autonomously.",
        features: [
            "GitHub integration",
            "Issue to PR automation",
            "Code refactoring",
            "Test generation",
            "Documentation updates"
        ],
        pricing: "Free for open source, Teams from $480/month",
        url: "https://sweep.dev"
    },
    {
        name: "Fine",
        icon: "🎯",
        category: "ide",
        description: "AI development environment focused on helping teams ship software faster. Features AI agents that understand your entire codebase and workflow.",
        features: [
            "Team-first development",
            "Codebase-wide context",
            "Workflow automation",
            "Live collaboration",
            "IDE integration"
        ],
        pricing: "Starting from $32/user/month",
        url: "https://fine.dev"
    }
];

// DOM elements
const searchInput = document.getElementById('searchInput');
const servicesContainer = document.getElementById('servicesContainer');
const filterButtons = document.querySelectorAll('.filter-btn');

// Current filter
let currentFilter = 'all';

// Initialize
function init() {
    // Preprocess searchable text for better performance
    services.forEach(service => {
        service.searchableText = `
            ${service.name}
            ${service.description}
            ${service.features.join(' ')}
            ${service.pricing}
        `.toLowerCase();
    });
    
    renderServices(services);
    setupEventListeners();
}

// Render services
function renderServices(servicesToRender) {
    servicesContainer.innerHTML = '';
    
    if (servicesToRender.length === 0) {
        servicesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">No services found matching your criteria.</p>';
        return;
    }
    
    const fragment = document.createDocumentFragment();
    servicesToRender.forEach(service => {
        const card = createServiceCard(service);
        fragment.appendChild(card);
    });
    servicesContainer.appendChild(fragment);
}

// Create service card
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.category = service.category;
    
    const featuresHTML = service.features
        .map(feature => `<li>${escapeHtml(feature)}</li>`)
        .join('');
    
    const getSafeUrl = (url) => {
        try {
            const parsedUrl = new URL(url, window.location.origin !== 'null' ? window.location.origin : 'http://localhost');
            if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
                return url;
            }
            return '#';
        } catch (e) {
            return '#';
        }
    };

    const safeUrl = getSafeUrl(service.url);

    card.innerHTML = `
        <div class="service-header">
            <span class="service-icon">${service.icon}</span>
            <h3 class="service-name">${escapeHtml(service.name)}</h3>
        </div>
        <span class="service-category">${escapeHtml(getCategoryLabel(service.category))}</span>
        <p class="service-description">${escapeHtml(service.description)}</p>
        <ul class="service-features">
            ${featuresHTML}
        </ul>
        <div class="service-pricing">${escapeHtml(service.pricing)}</div>
        <a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer" class="service-link">Visit Website</a>
    `;
    
    return card;
}

// Get category label
function getCategoryLabel(category) {
    const labels = {
        'ide': 'IDE-Based',
        'web': 'Web-Based',
        'fullstack': 'Full-Stack'
    };
    return labels[category] || category;
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
            currentFilter = button.dataset.filter;
            applyFilters();
        });
    });
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    applyFilters(searchTerm);
}

// Apply filters
function applyFilters(searchTerm = '') {
    let filtered = services;
    
    // Apply category filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(service => service.category === currentFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(service => {
            return service.searchableText.includes(searchTerm);
        });
    }
    
    renderServices(filtered);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
