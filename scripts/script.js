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
    document.getElementById('marketapp-ton').textContent = 'Loading...';
    document.getElementById('marketapp-usd').textContent = 'Loading...';
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

        // Check for data changes and animate if necessary
        if (previousData) {
            if (previousData.shardify.price_ton !== data.shardify.price_ton) {
                animateChange(document.getElementById('shardify-line'));
            }
            if (previousData.getgems.price_ton !== data.getgems.price_ton) {
                animateChange(document.getElementById('getgems-line'));
            }
            if (previousData.fragment.price_ton !== data.fragment.price_ton) {
                animateChange(document.getElementById('fragment-line'));
            }
            if (previousData.xrare.price_ton !== data.xrare.price_ton) {
                animateChange(document.getElementById('xrare-line'));
            }
            if (previousData.marketapp.price_ton !== data.marketapp.price_ton) {
                animateChange(document.getElementById('marketapp-line'));
            }
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
        if (data.marketapp && data.marketapp.price_ton != null) {
            document.getElementById('marketapp-ton').textContent = `${parseFloat(data.marketapp.price_ton).toFixed(2)} TON`;
        }
        if (data.marketapp && data.marketapp.price_usdt != null) {
            document.getElementById('marketapp-usd').textContent = `${parseFloat(data.marketapp.price_usdt).toFixed(2)} USD`;
        }

        // Update links if present in the data
        if (data.getgems && data.getgems.link) {
            document.querySelectorAll('.link_wrapper a')[1].setAttribute('href', data.getgems.link);
        }
        if (data.fragment && data.fragment.link) {
            document.querySelectorAll('.link_wrapper a')[2].setAttribute('href', data.fragment.link);
        }
        if (data.xrare && data.xrare.link) {
            document.querySelectorAll('.link_wrapper a')[3].setAttribute('href', data.xrare.link);
        }
        if (data.marketapp && data.marketapp.link) {
            document.querySelectorAll('.link_wrapper a')[4].setAttribute('href', data.marketapp.link);
        }

        // Save current data for subsequent comparisons
        previousData = data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Function to animate the change
function animateChange(element) {
    element.classList.add('line-change');
    setTimeout(() => {
        element.classList.remove('line-change');
    }, 500); // Duration of the animation in milliseconds
}

// Initialize and set interval for updates
window.onload = () => {
    fetchPrices(); // Initial fetch
    setInterval(fetchPrices, 60000); // Update every 60 seconds
};

// Script for modal window, update button, and manual data fetch
document.addEventListener('DOMContentLoaded', () => {
    const questionIcon = document.getElementById('questionIcon');
    const updateIcon = document.getElementById('updateIcon');
    const helpModal = document.getElementById('helpModal');
    const closeButton = document.getElementById('closeButton');
    const messageContainer = document.createElement('div'); // Container for the message
    messageContainer.className = 'message-container';
    document.body.appendChild(messageContainer);

    questionIcon.addEventListener('click', () => {
        helpModal.style.display = 'block';
    });

    updateIcon.addEventListener('click', async () => {
        // Add visual indication (e.g., animation or style change)
        updateIcon.classList.add('active');

        // Fetch prices manually
        await fetchPrices();

        // Remove visual indication after 200ms
        setTimeout(() => {
            updateIcon.classList.remove('active');
        }, 200);

        // Show confirmation message
        messageContainer.textContent = 'Current price received';
        messageContainer.classList.add('show');

        // Hide the message after 2 seconds
        setTimeout(() => {
            messageContainer.classList.remove('show');
        }, 2000);
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
