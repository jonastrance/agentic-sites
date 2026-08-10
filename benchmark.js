const fs = require('fs');
const { JSDOM } = require('jsdom');
const { performance } = require('perf_hooks');

const html = fs.readFileSync('index.html', 'utf8');

// The functions in script.js aren't exported globally by default because they aren't attached to window.
// We can modify script.js temporarily to count renders for our benchmark, or we can just run it
// and replace the DOM element we are listening to.
// A simpler way: use a small html file that loads the script.

const htmlContent = `
<!DOCTYPE html>
<html>
<body>
    <input type="text" id="searchInput">
    <div id="servicesContainer"></div>
    <button class="filter-btn" data-filter="all">All</button>
    <script>
    let renderCount = 0;
    // We will intercept renderServices
    </script>
    <script src="file://${__dirname}/script.js"></script>
</body>
</html>
`;

// Another way is to just do a simple benchmark injecting counter in script.js
let scriptContent = fs.readFileSync('script.js', 'utf8');
scriptContent = scriptContent.replace('function renderServices(servicesToRender) {', 'function renderServices(servicesToRender) { window.renderCount = (window.renderCount || 0) + 1;');

const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;
const document = window.document;
window.renderCount = 0;

const script = document.createElement("script");
script.textContent = scriptContent;
document.body.appendChild(script);

// now init is called on DOMContentLoaded, we need to dispatch it
document.dispatchEvent(new window.Event('DOMContentLoaded'));

const searchInput = document.getElementById('searchInput');

const start = performance.now();
const typingSequence = "fast typing test for debounce".split('');
let currentVal = "";

typingSequence.forEach(char => {
    currentVal += char;
    searchInput.value = currentVal;
    searchInput.dispatchEvent(new window.Event('input'));
});

setTimeout(() => {
    const end = performance.now();
    console.log(`Typing sequence length: ${typingSequence.length}`);
    console.log(`Render Count: ${window.renderCount}`);
    console.log(`Time taken: ${end - start} ms`);
}, 500);
