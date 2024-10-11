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
}

// Call showLoading on page load
showLoading();

async function fetchPrices() {
    try {
        const response = await fetch(
            'https://api.allorigins.win/get?url=' +
            encodeURIComponent('http://92.118.8.202:8888/api/data')
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const { contents } = await response.json();
        const data = JSON.parse(contents);

        // Check if data fields are available and apply animations only if values changed
        if (previousData) {
            if (previousData.price_8num_ton !== data.price_8num_ton) {
                animateChange(document.getElementById('shardify-line'));
            }
            if (previousData.price_getgems_ton !== data.price_getgems_ton) {
                animateChange(document.getElementById('getgems-line'));
            }
            if (previousData.price_fragment_ton !== data.price_fragment_ton) {
                animateChange(document.getElementById('fragment-line'));
            }
        }

        // Update price elements only if the fields are present
        if (data.price_8num_ton != null) {
            document.getElementById('shardify-ton').textContent = `${parseFloat(data.price_8num_ton).toFixed(2)} TON`;
        }
        if (data.price_8num_USDT != null) {
            document.getElementById('shardify-usd').textContent = `${parseFloat(data.price_8num_USDT).toFixed(2)} USD`;
        }
        if (data.price_getgems_ton != null) {
            document.getElementById('getgems-ton').textContent = `${parseFloat(data.price_getgems_ton).toFixed(2)} TON`;
        }
        if (data.price_getgems_USDT != null) {
            document.getElementById('getgems-usd').textContent = `${parseFloat(data.price_getgems_USDT).toFixed(2)} USD`;
        }
        if (data.price_fragment_ton != null) {
            document.getElementById('fragment-ton').textContent = `${parseFloat(data.price_fragment_ton).toFixed(2)} TON`;
        }
        if (data.price_fragment_USDT != null) {
            document.getElementById('fragment-usd').textContent = `${parseFloat(data.price_fragment_USDT).toFixed(2)} USD`;
        }

        // Update links if present in the data
        if (data.link_getgems) {
            document.querySelectorAll('.link_wrapper a')[1].setAttribute('href', data.link_getgems);
        }
        if (data.link_fragment) {
            document.querySelectorAll('.link_wrapper a')[2].setAttribute('href', data.link_fragment);
        }

        // Save the current data for comparison on the next fetch
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
    setInterval(fetchPrices, 10000); // Update every 10 seconds
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
