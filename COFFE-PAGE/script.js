document.addEventListener('DOMContentLoaded', function () {
    // Carrega o carrinho do localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Elementos do DOM
    const cartIcon = document.querySelector('.cart-icon-container');
    const cartModal = document.querySelector('.cart-modal');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalAmount = document.querySelector('.total-amount');
    const closeCartBtn = document.querySelector('.close-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Abrir/fechar carrinho
    cartIcon.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);

    // Adicionar ao carrinho
    document.querySelectorAll('.menu .btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const box = this.closest('.box');
            const priceText = box.querySelector('.price').textContent;
            const price = parseFloat(priceText.split(' ')[1].replace('R$ ', '').replace(',', '.'));
            const originalPrice = priceText.includes('span') ? 
                parseFloat(box.querySelector('.price span').textContent.replace('R$ ', '').replace(',', '.')) : price;

            const item = {
                name: box.querySelector('h3').textContent,
                price: price,
                originalPrice: originalPrice,
                image: box.querySelector('img').src,
                quantity: 1
            };

            addToCart(item);
        });
    });

    // Finalizar compra
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            alert('Compra finalizada com sucesso! Obrigado por sua compra.');
            cart = [];
            updateCart();
        } else {
            alert('Seu carrinho está vazio!');
        }
    });

    // Funções
    function toggleCart() {
        cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
    }

    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.name === item.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(item);
        }
        
        updateCart();
        animateCartIcon();
    }

    function updateCart() {
        // Atualizar contador
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Atualizar itens no modal
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;

            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" width="50">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-quantity">
                        <button onclick="changeQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity('${item.name}', 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-price">
                    R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    ${item.originalPrice ? `<span class="original-price">R$ ${(item.originalPrice * item.quantity).toFixed(2).replace('.', ',')}</span>` : ''}
                </div>
            `;

            cartItemsContainer.appendChild(cartItemElement);
        });

        // Atualizar total
        totalAmount.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function animateCartIcon() {
        cartIcon.classList.add('added');
        setTimeout(() => cartIcon.classList.remove('added'), 500);
    }

    // Função global para mudar quantidade
    window.changeQuantity = function (name, change) {
        const item = cart.find(item => item.name === name);

        if (item) {
            item.quantity += change;

            if (item.quantity <= 0) {
                cart = cart.filter(i => i.name !== name);
            }

            updateCart();
        }
    };

    // Atualiza o carrinho ao carregar a página
    updateCart();
});