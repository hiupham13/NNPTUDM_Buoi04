// API Base URL
const API_BASE = '/api/v1';

// DOM Elements
const titleFilter = document.getElementById('titleFilter');
const slugFilter = document.getElementById('slugFilter');
const minPriceFilter = document.getElementById('minPriceFilter');
const maxPriceFilter = document.getElementById('maxPriceFilter');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const productGrid = document.getElementById('productGrid');
const productCount = document.getElementById('productCount');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const productModal = document.getElementById('productModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.querySelector('.close');

// Load products on page load
window.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

// Search button click
searchBtn.addEventListener('click', () => {
    loadProducts();
});

// Clear button click
clearBtn.addEventListener('click', () => {
    titleFilter.value = '';
    slugFilter.value = '';
    minPriceFilter.value = '';
    maxPriceFilter.value = '';
    loadProducts();
});

// Enter key to search
[titleFilter, slugFilter, minPriceFilter, maxPriceFilter].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadProducts();
        }
    });
});

// Close modal
closeModal.addEventListener('click', () => {
    productModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.style.display = 'none';
    }
});

// Main function to load products
async function loadProducts() {
    try {
        // Show loading
        showLoading();
        hideError();

        // Build query string
        const queryParams = new URLSearchParams();

        if (titleFilter.value.trim()) {
            queryParams.append('title', titleFilter.value.trim());
        }

        if (slugFilter.value.trim()) {
            queryParams.append('slug', slugFilter.value.trim());
        }

        if (minPriceFilter.value) {
            queryParams.append('minPrice', minPriceFilter.value);
        }

        if (maxPriceFilter.value) {
            queryParams.append('maxPrice', maxPriceFilter.value);
        }

        // Fetch products
        const url = `${API_BASE}/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Hide loading
        hideLoading();

        // Display products
        displayProducts(result.data, result.count);

    } catch (error) {
        hideLoading();
        showError(error.message);
        console.error('Error loading products:', error);
    }
}

// Display products in grid
function displayProducts(products, count) {
    productCount.textContent = `${count} sản phẩm`;

    if (products.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
                <h3 style="color: #999;">😔 Không tìm thấy sản phẩm nào</h3>
                <p style="color: #aaa; margin-top: 10px;">Hãy thử thay đổi bộ lọc của bạn</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <h3>${product.title}</h3>
            <div class="product-slug">🔗 ${product.slug}</div>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <div class="product-price">$${product.price}</div>
                <div class="product-category">${product.category.name}</div>
            </div>
        </div>
    `).join('');
}

// Show product detail in modal
async function showProductDetail(productId) {
    try {
        const response = await fetch(`${API_BASE}/products/${productId}`);
        if (!response.ok) {
            throw new Error('Product not found');
        }

        const result = await response.json();
        const product = result.data;

        modalBody.innerHTML = `
            <h2>${product.title}</h2>
            <p><strong>🔗 Slug:</strong> ${product.slug}</p>
            <p><strong>💰 Giá:</strong> <span style="color: #667eea; font-size: 1.3em; font-weight: bold;">$${product.price}</span></p>
            <p><strong>📁 Danh mục:</strong> ${product.category.name}</p>
            <p><strong>📝 Mô tả:</strong></p>
            <p style="line-height: 1.8; color: #555;">${product.description}</p>
            <p><strong>🆔 ID:</strong> ${product.id}</p>
        `;

        productModal.style.display = 'flex';
    } catch (error) {
        alert('Không thể tải thông tin sản phẩm: ' + error.message);
    }
}

// Helper functions
function showLoading() {
    loadingSpinner.style.display = 'block';
    productGrid.style.display = 'none';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
    productGrid.style.display = 'grid';
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

// Make function global for onclick
window.showProductDetail = showProductDetail;
