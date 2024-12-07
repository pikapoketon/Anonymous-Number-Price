// Initialize previous data state
let previousData = null;

// Function to display "Loading..." initially
function showLoading() {
    document.getElementById('shardify-ton').textContent = 'Loading...';
    document.getElementById('shardify-usd').textContent = 'Loading...';
    document.getElementById('getgems-ton').textContent = 'Loading...';
    document.getElementById('getgems-usd').textContent = 'Loading...';
    document.getElementById('fragment-ton').textContent = 'Loading...';
    document.getElementById('fragment-usd').textContent = 'Loading...';
    document.getElementById('xrare-ton').textContent = 'Loading...';
    document.getElementById('xrare-usd').textContent = 'Loading...';
}

// Call showLoading on page load
showLoading();

async function fetchPrices() {
    try {
        const response = await fetch(
            `https://api.allorigins.win/get?url=${encodeURIComponent('http://92.118.8.202:8888/api/data')}&_=${new Date().getTime()}`
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const { contents } = await response.json();
        const data = JSON.parse(contents);

        // Extract and format the last update date
        if (data.general && data.general.last_update) {
            const lastUpdateUTC = new Date(
                new Date(data.general.last_update).getTime() - 3 * 60 * 60 * 1000 // Convert to UTC
            );

            const formattedDate = lastUpdateUTC.toISOString()
                .replace("T", " ")
                .replace(/\..+/, "");

            document.getElementById('last-update').textContent = `Last Update: ${formattedDate} (UTC)`;
        }

        // Update prices if data is available for each service
        if (data.shardify && data.shardify.price_ton != null) {
            document.getElementById('shardify-ton').textContent = `${parseFloat(data.shardify.price_ton).toFixed(2)} TON`;
        }
        if (data.shardify && data.shardify.price_usdt != null) {
            document.getElementById('shardify-usd').textContent = `${parseFloat(data.shardify.price_usdt).toFixed(2)} USD`;
        }
        if (data.getgems && data.getgems.price_ton != null) {
            document.getElementById('getgems-ton').textContent = `${parseFloat(data.getgems.price_ton).toFixed(2)} TON`;
        }
        if (data.getgems && data.getgems.price_usdt != null) {
            document.getElementById('getgems-usd').textContent = `${parseFloat(data.getgems.price_usdt).toFixed(2)} USD`;
        }
        if (data.fragment && data.fragment.price_ton != null) {
            document.getElementById('fragment-ton').textContent = `${parseFloat(data.fragment.price_ton).toFixed(2)} TON`;
        }
        if (data.fragment && data.fragment.price_usdt != null) {
            document.getElementById('fragment-usd').textContent = `${parseFloat(data.fragment.price_usdt).toFixed(2)} USD`;
        }
        if (data.xrare && data.xrare.price_ton != null) {
            document.getElementById('xrare-ton').textContent = `${parseFloat(data.xrare.price_ton).toFixed(2)} TON`;
        }
        if (data.xrare && data.xrare.price_usdt != null) {
            document.getElementById('xrare-usd').textContent = `${parseFloat(data.xrare.price_usdt).toFixed(2)} USD`;
        }

        // Update links if present in the data
        if (data.shardify && data.shardify.link) {
            document.getElementById('shardify-link').setAttribute('href', data.shardify.link);
        }
        if (data.getgems && data.getgems.link) {
            document.getElementById('getgems-link').setAttribute('href', data.getgems.link);
        }
        if (data.fragment && data.fragment.link) {
            document.getElementById('fragment-link').setAttribute('href', data.fragment.link);
        }
        if (data.xrare && data.xrare.link) {
            document.getElementById('xrare-link').setAttribute('href', data.xrare.link);
        }

        // Now, reorder the platform blocks based on price
        const parent = document.getElementById('platform-container');

        let platforms = [
            { id: 'shardify', element: document.getElementById('shardify-line'), price: parseFloat(data.shardify.price_ton) || Infinity },
            { id: 'getgems', element: document.getElementById('getgems-line'), price: parseFloat(data.getgems.price_ton) || Infinity },
            { id: 'fragment', element: document.getElementById('fragment-line'), price: parseFloat(data.fragment.price_ton) || Infinity },
            { id: 'xrare', element: document.getElementById('xrare-line'), price: parseFloat(data.xrare.price_ton) || Infinity }
        ];

        // Record the initial positions
        const positions = new Map();
        platforms.forEach(platform => {
            const rect = platform.element.getBoundingClientRect();
            positions.set(platform.id, rect);
        });

        // Sort the platforms based on price
        platforms.sort((a, b) => a.price - b.price);

        // Check if the order has changed
        let orderChanged = false;
        const currentOrder = Array.from(parent.children).map(child => child.id);
        const newOrder = platforms.map(p => p.element.id);
        if (currentOrder.join('') !== newOrder.join('')) {
            orderChanged = true;
        }

        // Re-append the elements in the new order
        platforms.forEach(platform => {
            parent.appendChild(platform.element);
        });

        if (orderChanged) {
            // Record the new positions
            platforms.forEach(platform => {
                const oldRect = positions.get(platform.id);
                const newRect = platform.element.getBoundingClientRect();

                const deltaY = oldRect.top - newRect.top;

                // Apply transform to move element back to old position
                platform.element.style.transition = 'none';
                platform.element.style.transform = `translateY(${deltaY}px)`;

                // Force reflow
                platform.element.getBoundingClientRect();

                // Animate to the new position
                platform.element.style.transition = 'transform 1.0s';
                platform.element.style.transform = '';
            });

            // Clean up after animation
            setTimeout(() => {
                platforms.forEach(platform => {
                    platform.element.style.transition = '';
                    platform.element.style.transform = '';
                });
            }, 500);
        }

        // Save current data for subsequent comparisons
        previousData = data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Initialize and set interval for updates
window.onload = () => {
    fetchPrices(); // Initial fetch
    setInterval(fetchPrices, 60000); // Update every 60 seconds
};
