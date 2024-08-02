// Function to fetch and update prices
async function fetchPrices() {
    try {
        // Fetch data using AllOrigins to bypass CORS restrictions
        const response = await fetch(
            'https://api.allorigins.win/get?url=' +
            encodeURIComponent('https://pikapoketon.loca.lt/api/data')
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const { contents } = await response.json();
        const data = JSON.parse(contents);

        // Update price elements with fetched data
        document.getElementById('shardify-ton').textContent = `${parseFloat(data.price_8num_ton).toFixed(2)} TON`;
        document.getElementById('shardify-usd').textContent = `${parseFloat(data.price_8num_USDT).toFixed(2)} USD`;
        document.getElementById('getgems-ton').textContent = `${parseFloat(data.price_getgems_ton).toFixed(2)} TON`;
        document.getElementById('getgems-usd').textContent = `${parseFloat(data.price_getgems_USDT).toFixed(2)} USD`;

        // Update links with fetched data
        document.querySelectorAll('.link_wrapper a')[1].setAttribute('href', data.link_getgems);
        document.querySelectorAll('.link_wrapper a')[2].setAttribute('href', data.link_fragment);

        document.getElementById('fragment-ton').textContent = `${parseFloat(data.price_fragment_ton).toFixed(2)} TON`;
        document.getElementById('fragment-usd').textContent = `${parseFloat(data.price_fragment_USDT).toFixed(2)} USD`;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Initialize and set interval for updates
window.onload = () => {
    fetchPrices();
    setInterval(fetchPrices, 10000);
};

// Script for modal window and update button
document.addEventListener('DOMContentLoaded', () => {
    const questionIcon = document.getElementById('questionIcon');
    const updateIcon = document.getElementById('updateIcon');
    const helpModal = document.getElementById('helpModal');
    const closeButton = document.getElementById('closeButton');

    questionIcon.addEventListener('click', () => {
        helpModal.style.display = 'block';
    });

    updateIcon.addEventListener('click', () => {
        fetchPrices(); // Force update prices
    });

    closeButton.addEventListener('click', () => {
        helpModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === helpModal) {
            helpModal.style.display = 'none';
        }
    });
});
