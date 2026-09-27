const { performance } = require('perf_hooks');

// Before
function getCategoryLabelBefore(category) {
    const labels = {
        'ide': 'IDE-Based',
        'web': 'Web-Based',
        'fullstack': 'Full-Stack'
    };
    return labels[category] || category;
}

// After
const CATEGORY_LABELS = {
    'ide': 'IDE-Based',
    'web': 'Web-Based',
    'fullstack': 'Full-Stack'
};

function getCategoryLabelAfter(category) {
    return CATEGORY_LABELS[category] || category;
}

const ITERATIONS = 10000000;
const categories = ['ide', 'web', 'fullstack', 'unknown'];

// Warmup
for (let i=0; i<100000; i++) {
    getCategoryLabelBefore(categories[i % 4]);
    getCategoryLabelAfter(categories[i % 4]);
}

const startBefore = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    getCategoryLabelBefore(categories[i % 4]);
}
const endBefore = performance.now();

const startAfter = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    getCategoryLabelAfter(categories[i % 4]);
}
const endAfter = performance.now();

console.log(`Before: ${(endBefore - startBefore).toFixed(2)}ms`);
console.log(`After: ${(endAfter - startAfter).toFixed(2)}ms`);
const improvement = ((endBefore - startBefore) - (endAfter - startAfter)) / (endBefore - startBefore) * 100;
console.log(`Improvement: ${improvement.toFixed(2)}%`);
