const { performance } = require('perf_hooks');

const services = [];
for (let i = 0; i < 50000; i++) {
    services.push({
        category: i % 3 === 0 ? 'ide' : (i % 3 === 1 ? 'web' : 'fullstack'),
        searchableText: `name ${i} description ${i} ai tool features ${i} pricing ${i}`
    });
}

function originalApplyFilters(searchTerm = '', currentFilter = 'all') {
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
    return filtered;
}

function optimizedApplyFilters2(searchTerm = '', currentFilter = 'all') {
    if (currentFilter === 'all' && !searchTerm) {
        return services;
    }

    return services.filter(service => {
        if (currentFilter !== 'all' && service.category !== currentFilter) {
            return false;
        }
        if (searchTerm && !service.searchableText.includes(searchTerm)) {
            return false;
        }
        return true;
    });
}

function runBenchmark(fn, name) {
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
        fn('ai', 'ide');
        fn('', 'all');
        fn('tool', 'web');
        fn('features', 'all');
        fn('nonexistent', 'fullstack');
    }
    const end = performance.now();
    console.log(`${name}: ${end - start} ms`);
}

// Warm up
for(let i=0;i<10;i++) {
    originalApplyFilters('ai', 'ide');
    optimizedApplyFilters2('ai', 'ide');
}

runBenchmark(originalApplyFilters, 'Original');
runBenchmark(optimizedApplyFilters2, 'Optimized');
