const fs = require('fs');
const { JSDOM } = require('jsdom');
const { performance } = require('perf_hooks');

const html = fs.readFileSync('index.html', 'utf8');
let script = fs.readFileSync('script.js', 'utf8');

// we need to expose applyFilters, services, currentFilter, init to window for test
script = script + `
window.services = services;
window.applyFilters = applyFilters;
window.init = init;
Object.defineProperty(window, 'currentFilter', {
  get: () => currentFilter,
  set: (val) => currentFilter = val
});
`;

function runBenchmark(iterations, scriptContent) {
    const dom = new JSDOM(html, { runScripts: "dangerously" });
    const { window } = dom;

    // Mock for jsdom
    window.location.origin = 'http://localhost';

    // Evaluate script by attaching it to the document
    const scriptEl = window.document.createElement('script');
    scriptEl.textContent = scriptContent;
    window.document.body.appendChild(scriptEl);

    // Create large mock data
    const origServices = [...window.services];
    window.services.length = 0;
    // Lower scale to 100 instead of 1000 so it doesn't timeout
    for (let i = 0; i < 100; i++) {
        origServices.forEach(s => window.services.push({...s, name: s.name + ' ' + i}));
    }
    window.init(); // re-init

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        window.currentFilter = 'ide';
        window.applyFilters('ai');
        window.currentFilter = 'all';
        window.applyFilters('');
    }
    const end = performance.now();
    return end - start;
}

const time = runBenchmark(100, script);
console.log('Baseline time:', time, 'ms');
