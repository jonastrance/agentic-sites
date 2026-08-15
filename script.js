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
let services = [];

// DOM elements
const searchInput = document.getElementById('searchInput');
const servicesContainer = document.getElementById('servicesContainer');
const filterButtons = document.querySelectorAll('.filter-btn');

// Current filter
let currentFilter = 'all';

// Initialize
async function init() {
    try {
        const response = await fetch('services.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        services = await response.json();
    } catch (error) {
        console.error("Could not load services data:", error);
        servicesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">Error loading services data. Please try again later.</p>';
        return;
    }

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
        <a href="${escapeHtml(service.url)}" target="_blank" rel="noopener noreferrer" class="service-link">Visit Website</a>
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
