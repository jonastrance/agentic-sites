const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const scriptContent = fs.readFileSync(path.resolve(__dirname, './script.js'), 'utf8');

test('createServiceCard', async (t) => {
    let window, document;

    await t.beforeEach(() => {
        // Use a minimal HTML template with required elements to avoid script.js initialization errors
        const dom = new JSDOM("<!DOCTYPE html><html><body><input id='searchInput'/><div id='servicesContainer'></div></body></html>", { runScripts: 'dangerously' });
        window = dom.window;
        document = window.document;

        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.body.appendChild(script);
    });

    await t.test('should create a service card element with correct DOM structure', () => {
        const service = {
            name: "Test Service",
            icon: "🧪",
            category: "ide",
            description: "Test description",
            features: ["Feature 1", "Feature 2"],
            pricing: "Free",
            url: "https://test.com"
        };

        const card = window.createServiceCard(service);

        assert.strictEqual(card.tagName, 'DIV');
        assert.strictEqual(card.className, 'service-card');
        assert.strictEqual(card.dataset.category, 'ide');

        assert.strictEqual(card.querySelector('.service-name').textContent, 'Test Service');
        assert.strictEqual(card.querySelector('.service-description').textContent, 'Test description');
        assert.strictEqual(card.querySelector('.service-pricing').textContent, 'Free');

        const features = Array.from(card.querySelectorAll('.service-features li')).map(li => li.textContent);
        assert.deepStrictEqual(features, ["Feature 1", "Feature 2"]);

        const link = card.querySelector('a.service-link');
        assert.strictEqual(link.href, 'https://test.com/');
    });

    await t.test('should properly escape HTML to prevent XSS', () => {
        const service = {
            name: "<script>alert('XSS Name')</script>",
            icon: "🧪",
            category: "ide",
            description: "<script>alert('XSS Desc')</script>",
            features: ["<img src=x onerror=alert(1)>"],
            pricing: "<script>alert('XSS Price')</script>",
            url: 'javascript:alert("XSS")'
        };

        const card = window.createServiceCard(service);

        assert.strictEqual(card.querySelector('.service-name').innerHTML.includes('<script>'), false);
        assert.strictEqual(card.querySelector('.service-description').innerHTML.includes('<script>'), false);
        assert.strictEqual(card.querySelector('.service-pricing').innerHTML.includes('<script>'), false);
        assert.strictEqual(card.querySelector('.service-features li').innerHTML.includes('<img'), false);

        assert.strictEqual(card.querySelector('.service-name').textContent, "<script>alert('XSS Name')</script>");
    });
});

test('applyFilters via DOM events', async (t) => {
    let window, document;

    await t.beforeEach(() => {
        const dom = new JSDOM(`<!DOCTYPE html>
            <html>
            <body>
                <input id='searchInput'/>
                <button class='filter-btn' data-filter='all'>All</button>
                <button class='filter-btn' data-filter='ide'>IDE</button>
                <button class='filter-btn' data-filter='web'>Web</button>
                <div id='servicesContainer'></div>
            </body>
            </html>`, { runScripts: 'dangerously' });
        window = dom.window;
        document = window.document;

        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.body.appendChild(script);

        // Manually trigger initialization if DOMContentLoaded already fired or to ensure it's ready
        if (window.init) {
            window.init();
        }
    });

    await t.test('initial render shows all services', () => {
        const cards = document.querySelectorAll('.service-card');
        assert.ok(cards.length > 0, 'Should render initial services');
    });

    await t.test('filtering by category "ide" shows fewer services', () => {
        const initialCount = document.querySelectorAll('.service-card').length;

        const ideBtn = document.querySelector('button[data-filter="ide"]');
        ideBtn.click();

        const cards = document.querySelectorAll('.service-card');
        assert.ok(cards.length < initialCount, 'Should show fewer cards after filtering');

        const totalIDE = Array.from(cards).filter(c => c.dataset.category === 'ide').length;
        assert.strictEqual(cards.length, totalIDE, 'All visible cards should be in the "ide" category');
    });

    await t.test('searching for a specific term', () => {
        const searchInput = document.getElementById('searchInput');
        searchInput.value = 'GitHub Copilot Workspace';
        searchInput.dispatchEvent(new window.Event('input'));

        const cards = document.querySelectorAll('.service-card');
        assert.strictEqual(cards.length, 1, 'Should find exactly one matching service');
        assert.strictEqual(cards[0].querySelector('.service-name').textContent, 'GitHub Copilot Workspace');
    });

    await t.test('searching with an empty term shows category results', () => {
        // First filter to IDE
        const ideBtn = document.querySelector('button[data-filter="ide"]');
        ideBtn.click();

        const searchInput = document.getElementById('searchInput');
        // Type a search
        searchInput.value = 'Cursor';
        searchInput.dispatchEvent(new window.Event('input'));

        // Clear search
        searchInput.value = '';
        searchInput.dispatchEvent(new window.Event('input'));

        const cards = document.querySelectorAll('.service-card');
        const totalIDE = Array.from(cards).filter(c => c.dataset.category === 'ide').length;
        assert.ok(cards.length > 1, 'Should show all IDE category results again');
        assert.strictEqual(cards.length, totalIDE, 'Should only show IDE category results');
    });

    await t.test('no matches shows empty state', () => {
        const searchInput = document.getElementById('searchInput');
        searchInput.value = 'nonexistentxyz123';
        searchInput.dispatchEvent(new window.Event('input'));

        const cards = document.querySelectorAll('.service-card');
        assert.strictEqual(cards.length, 0, 'Should not show any cards');

        const container = document.getElementById('servicesContainer');
        assert.ok(container.innerHTML.includes('No services found matching your criteria.'), 'Should display empty state message');
    });
});
