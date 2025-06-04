document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open after click
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // 2. Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) { // Ensure elements exist before adding listener
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 3. To-Do/Note-Taking App (Using localStorage)
    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note-btn');
    const noteList = document.getElementById('note-list');

    // Only run if elements exist
    if (noteInput && addNoteBtn && noteList) {
        // Load notes from localStorage
        const loadNotes = () => {
            const notes = JSON.parse(localStorage.getItem('afreenShahNotes')) || [];
            noteList.innerHTML = ''; // Clear current list
            notes.forEach((note, index) => {
                addNoteToDOM(note, index);
            });
        };

        // Add note to DOM
        const addNoteToDOM = (noteText, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${noteText}</span>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            noteList.appendChild(listItem);
        };

        // Add a new note
        addNoteBtn.addEventListener('click', () => {
            const noteText = noteInput.value.trim();
            if (noteText !== '') {
                const notes = JSON.parse(localStorage.getItem('afreenShahNotes')) || [];
                notes.push(noteText);
                localStorage.setItem('afreenShahNotes', JSON.stringify(notes));
                noteInput.value = ''; // Clear input
                loadNotes(); // Reload notes to update DOM
            }
        });

        // Delete a note
        noteList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const indexToDelete = parseInt(e.target.dataset.index);
                let notes = JSON.parse(localStorage.getItem('afreenShahNotes')) || [];
                notes.splice(indexToDelete, 1); // Remove the note
                localStorage.setItem('afreenShahNotes', JSON.stringify(notes));
                loadNotes(); // Reload notes
            }
        });

        // Initial load of notes when page loads
        loadNotes();
    }


    // 4. Product Page Filtering and Sorting
    const categoryFilter = document.getElementById('category-filter');
    const priceRange = document.getElementById('price-range');
    const currentPriceDisplay = document.getElementById('current-price-display');
    const sortBy = document.getElementById('sort-by');
    const productList = document.getElementById('product-list');

    
    if (categoryFilter && priceRange && currentPriceDisplay && sortBy && productList) {
       
        const productsData = [
            { id: 1, name: 'Laptop', category: 'electronics', price: 999, rating: 4.8, image: 'laptop_pro.jpg' },
            { id: 2, name: 'Vintage T-shirt', category: 'clothing', price: 60, rating: 4.2, image: 'vintage_tshirt.webp' },
            { id: 3, name: 'The Great Novel', category: 'books', price: 22, rating: 4.5, image: 'the_great_novel.jpg' },
            { id: 4, name: 'Headphones', category: 'electronics', price: 180, rating: 4.6, image: 'wireless_headphone.jpg' },
            { id: 5, name: ' Summer Dress', category: 'clothing', price: 75, rating: 4.0, image: 'summer_dress.webp' },
            { id: 6, name: 'Coding Book', category: 'books', price: 55, rating: 4.9, image: 'coding.jpg' },
            { id: 7, name: ' Smartphone', category: 'electronics', price: 1200, rating: 4.7, image: 'smartphone.jpg' },
            { id: 8, name: ' Winter Coat', category: 'clothing', price: 250, rating: 4.3, image: 'coat.png' },
            { id: 9, name: 'Sci-Fiction Book', category: 'books', price: 40, rating: 4.1, image: 'sci.jpg' },
            { id: 10, name: 'Smartwatch', category: 'electronics', price: 199, rating: 4.5, image: 'smartwatch.png' },
           
        ];

        let filteredProducts = [...productsData]; // Start with all products

        // Function to render products
        const renderProducts = (productsToRender) => {
            productList.innerHTML = ''; // Clear current products
            if (productsToRender.length === 0) {
                productList.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-color-light);">No products found matching your criteria.</p>';
                return;
            }
            productsToRender.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Category: ${product.category}</p>
                    <div class="product-info">
                        <span class="price">$${product.price}</span>
                        <span class="rating">Rating: ${product.rating} &#9733;</span>
                    </div>
                `;
                productList.appendChild(productCard);
            });
        };

        // Function to apply filters and sort
        const applyFiltersAndSort = () => {
            const selectedCategory = categoryFilter.value;
            const maxPrice = parseInt(priceRange.value);
            const sortCriteria = sortBy.value;

            // 1. Filter by Category
            filteredProducts = productsData.filter(product => {
                return selectedCategory === 'all' || product.category === selectedCategory;
            });

            // 2. Filter by Price
            filteredProducts = filteredProducts.filter(product => {
                return product.price <= maxPrice;
            });

            // 3. Sort
            if (sortCriteria === 'rating-desc') {
                filteredProducts.sort((a, b) => b.rating - a.rating);
            } else if (sortCriteria === 'rating-asc') {
                filteredProducts.sort((a, b) => a.rating - b.rating);
            } else if (sortCriteria === 'price-asc') {
                filteredProducts.sort((a, b) => a.price - b.price);
            } else if (sortCriteria === 'price-desc') {
                filteredProducts.sort((a, b) => b.price - a.price);
            }
            // 'default' means no specific sort needed as we start with original order

            renderProducts(filteredProducts);
        };

        // Event Listeners for controls
        categoryFilter.addEventListener('change', applyFiltersAndSort);
        sortBy.addEventListener('change', applyFiltersAndSort);

        priceRange.addEventListener('input', () => {
            currentPriceDisplay.textContent = `$${priceRange.value}`;
            applyFiltersAndSort();
        });

        // Initial render of products
        renderProducts(productsData); // Show all initially

        // Set initial max price display
        currentPriceDisplay.textContent = `$${priceRange.value}`;
    }

    // 5. Alert for Send Message Button
    const sendMessageBtn = document.getElementById('send-message-btn');
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', (e) => {
            // Prevent default form submission to show alert,
            // then you can decide to submit the form programmatically
            e.preventDefault();

            // Simple validation (can be enhanced)
            const form = sendMessageBtn.closest('form');
            if (form.checkValidity()) {
                alert('Your message has been sent successfully!');
                // Optionally, you can submit the form here after the alert:
                // form.submit();
            } else {
                alert('Please fill out all required fields before sending your message.');
            }
        });
    }
});