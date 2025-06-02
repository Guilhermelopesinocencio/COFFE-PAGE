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


    // Elementos do DOM para login/cadastro
    const userIcon = document.querySelector('.user');
    const loginModal = document.querySelector('.login-modal');
    const registerModal = document.querySelector('.register-modal');
    const closeLoginBtn = document.querySelector('.close-login');
    const closeRegisterBtn = document.querySelector('.close-register');
    const showRegisterLink = document.querySelector('.show-register');
    const showLoginLink = document.querySelector('.show-login');




            // Abrir modal de login ao clicar no ícone de usuário
        userIcon.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });

        // Fechar modais
        closeLoginBtn.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });

        closeRegisterBtn.addEventListener('click', function() {
            registerModal.style.display = 'none';
        });

        // Alternar entre login e cadastro
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'flex';
        });

        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'flex';
        });

        // Fechar modais ao clicar fora
        window.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
            }
            if (e.target === registerModal) {
                registerModal.style.display = 'none';
            }
        });

        // Validação do formulário de cadastro
        const registerForm = document.getElementById('registerForm');
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }
            
            // Aqui você pode adicionar a lógica para enviar os dados de cadastro
            alert('Cadastro realizado com sucesso!');
            registerModal.style.display = 'none';
            loginModal.style.display = 'flex';
        });

        // Validação do formulário de login
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('login-username').value;

            // Aqui você pode adicionar a lógica para verificar o login
            alert('Login realizado com sucesso!');
            loginModal.style.display = 'none';
            
                // Atualizar ícone do usuário para mostrar que está logado
                userIcon.innerHTML = `
                    <img width="30" height="30" src="https://img.icons8.com/ios-filled/30/4CAF50/user.png" alt="user" />
                    <span class="username">${username}</span>
                `;

            // Armazenar o estado de login no localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);

        });

        // Simulação de login com redes sociais
        document.querySelectorAll('.social-icon').forEach(icon => {
            icon.addEventListener('click', function() {
                const socialNetwork = this.alt.replace('-logo', '').replace('-new', '');
                alert(`Você escolheu fazer login com ${socialNetwork}`);
            });
        });

                
            // Verificar se o usuário já está logado ao carregar a página
            function checkLoginStatus() {
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                const username = localStorage.getItem('username');
                
                if (isLoggedIn && username) {
                    document.querySelector('.user').innerHTML = `
                        <img width="30" height="30" src="https://img.icons8.com/ios-filled/30/4CAF50/user.png" alt="user" />
                        <span class="username">${username}</span>
                    `;
                }
            }



            // Adicione este evento após a definição do userIcon
            userIcon.addEventListener('click', function(e) {
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                
                if (isLoggedIn) {
                    // Se clicar quando já estiver logado, pode fazer logout
                    if (confirm('Deseja sair da sua conta?')) {
                        localStorage.removeItem('isLoggedIn');
                        localStorage.removeItem('username');
                        userIcon.innerHTML = '<img width="30" height="30" src="https://img.icons8.com/ios-filled/30/ffffff/user.png" alt="user" />';
                    }
                } else {
                    // Se não estiver logado, abre o modal de login
                    e.preventDefault();
                    loginModal.style.display = 'flex';
                }
            });







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

            // Feedback visual
            this.textContent = 'Adicionado!';
            this.style.backgroundColor = '#34a853';
            setTimeout(() => {
                this.textContent = 'Adicione ao Carrinho';
                this.style.backgroundColor = '';
            }, 1000);
        });
    });

    // Finalizar compra
    checkoutBtn.addEventListener('click', function () {
        if (cart.length > 0) {
            alert('Compra finalizada com sucesso! Obrigado por sua compra.');
            cart = [];
            updateCart();
            toggleCart();
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

        // Sempre mantém o carrinho aberto durante atualizações
        cartModal.style.display = 'block';

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
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" data-name="${item.name}" data-change="-1">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-name="${item.name}" data-change="1">+</button>
                    </div>
                </div>
                <div class="cart-item-price">
                    R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    ${item.originalPrice ? `<span class="original-price" style="text-decoration: line-through; color: #aaa; font-size: 1.2rem; display: block;">R$ ${(item.originalPrice * item.quantity).toFixed(2).replace('.', ',')}</span>` : ''}
                </div>
            `;

            cartItemsContainer.appendChild(cartItemElement);
        });

        // Adiciona eventos aos botões de quantidade
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function () {
                const name = this.getAttribute('data-name');
                const change = parseInt(this.getAttribute('data-change'));
                changeQuantity(name, change);
            });
        });

        // Atualizar total
        totalAmount.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function animateCartIcon() {
        cartIcon.classList.add('added');
        setTimeout(() => cartIcon.classList.remove('added'), 500);
    }

    function changeQuantity(name, change) {
        const itemIndex = cart.findIndex(item => item.name === name);

        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;

            if (cart[itemIndex].quantity <= 0) {
                // Remove o item do array
                cart.splice(itemIndex, 1);

                // Animação de remoção
                const itemElement = document.querySelector(`.cart-item:has([data-name="${name}"])`);
                if (itemElement) {
                    itemElement.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => {
                        updateCart(); // Atualiza o carrinho após a animação
                    }, 300);
                }
            } else {
                updateCart(); // Atualiza normalmente se não for remover
            }
        }
    }

    // Fechar carrinho ao clicar fora
    document.addEventListener('click', function (e) {
        if (!cartModal.contains(e.target) && !cartIcon.contains(e.target) && cartModal.style.display === 'block') {
            toggleCart();
        }
    });

    // Atualiza o carrinho ao carregar a página
    updateCart();
    checkLoginStatus();

});