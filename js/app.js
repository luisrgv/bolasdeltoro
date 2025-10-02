// Aplicación principal - Coordina todas las funcionalidades
class RestaurantApp {
    constructor() {
        this.currentScreen = 'order-screen';
        this.currentOrder = [];
        this.esCompleto = true;
        this.servir = true;
        this.init();
    }

    init() {
        this.initializeData();
        this.setupEventListeners();
        this.showScreen('order-screen');
        this.updatePriceDisplay();
    }

    initializeData() {
        // Inicializar datos si no existen
        if (!localStorage.getItem('menuData')) {
            this.initializeCompleteMenu();
        }
        if (!localStorage.getItem('salesData')) {
            localStorage.setItem('salesData', JSON.stringify({}));
        }
        if (!localStorage.getItem('orders')) {
            localStorage.setItem('orders', JSON.stringify([]));
        }
    }

    initializeCompleteMenu() {
        const completeMenu = {
            categories: [
                {
                    id: 'bolones-normales',
                    name: 'Bolones Normales',
                    products: [
                        { id: 'bolon-jr-chicharron-completo', name: 'Bolón Jr de Chicharrón (Completo)', priceServir: 2.50, priceLlevar: 2.75, available: true },
                        { id: 'bolon-jr-queso-completo', name: 'Bolón Jr de Queso (Completo)', priceServir: 2.50, priceLlevar: 2.75, available: true },
                        { id: 'bolon-jr-mixto-completo', name: 'Bolón Jr Mixto (Completo)', priceServir: 2.75, priceLlevar: 3.00, available: true },
                        { id: 'bolon-chicharron-completo', name: 'Bolón de Chicharrón (Completo)', priceServir: 2.75, priceLlevar: 3.00, available: true },
                        { id: 'bolon-queso-completo', name: 'Bolón de Queso (Completo)', priceServir: 2.75, priceLlevar: 3.00, available: true },
                        { id: 'bolon-mixto-completo', name: 'Bolón Mixto (Completo)', priceServir: 3.00, priceLlevar: 3.25, available: true },
                        { id: 'bolon-jr-chicharron-solo', name: 'Bolón Jr de Chicharrón (Solo)', priceServir: 1.75, priceLlevar: 1.75, available: true },
                        { id: 'bolon-jr-queso-solo', name: 'Bolón Jr de Queso (Solo)', priceServir: 1.75, priceLlevar: 1.75, available: true },
                        { id: 'bolon-jr-mixto-solo', name: 'Bolón Jr Mixto (Solo)', priceServir: 2.00, priceLlevar: 2.00, available: true },
                        { id: 'bolon-chicharron-solo', name: 'Bolón de Chicharrón (Solo)', priceServir: 2.00, priceLlevar: 2.00, available: true },
                        { id: 'bolon-queso-solo', name: 'Bolón de Queso (Solo)', priceServir: 2.00, priceLlevar: 2.00, available: true },
                        { id: 'bolon-mixto-solo', name: 'Bolón Mixto (Solo)', priceServir: 2.25, priceLlevar: 2.25, available: true }
                    ]
                },
                {
                    id: 'bolones-cremosos',
                    name: 'Bolones Cremosos',
                    products: [
                        { id: 'bolon-cremoso-jr-chicharron-completo', name: 'Bolón Cremoso Jr de Chicharrón (Completo)', priceServir: 2.75, priceLlevar: 3.20, available: true },
                        { id: 'bolon-cremoso-jr-queso-completo', name: 'Bolón Cremoso Jr de Queso (Completo)', priceServir: 2.75, priceLlevar: 3.20, available: true },
                        { id: 'bolon-cremoso-jr-mixto-completo', name: 'Bolón Cremoso Jr Mixto (Completo)', priceServir: 3.00, priceLlevar: 3.45, available: true },
                        { id: 'bolon-cremoso-chicharron-completo', name: 'Bolón Cremoso de Chicharrón (Completo)', priceServir: 3.00, priceLlevar: 3.45, available: true },
                        { id: 'bolon-cremoso-queso-completo', name: 'Bolón Cremoso de Queso (Completo)', priceServir: 3.00, priceLlevar: 3.45, available: true },
                        { id: 'bolon-cremoso-mixto-completo', name: 'Bolón Cremoso Mixto (Completo)', priceServir: 3.25, priceLlevar: 3.70, available: true },
                        { id: 'bolon-cremoso-jr-chicharron-solo', name: 'Bolón Cremoso Jr de Chicharrón (Solo)', priceServir: 2.00, priceLlevar: 2.45, available: true },
                        { id: 'bolon-cremoso-jr-queso-solo', name: 'Bolón Cremoso Jr de Queso (Solo)', priceServir: 2.00, priceLlevar: 2.45, available: true },
                        { id: 'bolon-cremoso-jr-mixto-solo', name: 'Bolón Cremoso Jr Mixto (Solo)', priceServir: 2.25, priceLlevar: 2.70, available: true },
                        { id: 'bolon-cremoso-chicharron-solo', name: 'Bolón Cremoso de Chicharrón (Solo)', priceServir: 2.25, priceLlevar: 2.70, available: true },
                        { id: 'bolon-cremoso-queso-solo', name: 'Bolón Cremoso de Queso (Solo)', priceServir: 2.25, priceLlevar: 2.70, available: true },
                        { id: 'bolon-cremoso-mixto-solo', name: 'Bolón Cremoso Mixto (Solo)', priceServir: 2.50, priceLlevar: 2.95, available: true }
                    ]
                },
                {
                    id: 'bolones-crunchy',
                    name: 'Bolones Crunchy',
                    products: [
                        { id: 'bolon-crunchy-chicharron-completo', name: 'Bolón Crunchy de Chicharrón (Completo)', priceServir: 3.00, priceLlevar: 3.45, available: true },
                        { id: 'bolon-crunchy-queso-completo', name: 'Bolón Crunchy de Queso (Completo)', priceServir: 3.00, priceLlevar: 3.45, available: true },
                        { id: 'bolon-crunchy-mixto-completo', name: 'Bolón Crunchy Mixto (Completo)', priceServir: 3.25, priceLlevar: 3.70, available: true },
                        { id: 'bolon-crunchy-chicharron-solo', name: 'Bolón Crunchy de Chicharrón (Solo)', priceServir: 2.25, priceLlevar: 2.70, available: true },
                        { id: 'bolon-crunchy-queso-solo', name: 'Bolón Crunchy de Queso (Solo)', priceServir: 2.25, priceLlevar: 2.70, available: true },
                        { id: 'bolon-crunchy-mixto-solo', name: 'Bolón Crunchy Mixto (Solo)', priceServir: 2.50, priceLlevar: 2.95, available: true }
                    ]
                },
                {
                    id: 'bolones-supremos',
                    name: 'Bolones Supremos',
                    products: [
                        { id: 'bolon-supremo-chicharron-completo', name: 'Bolón Supremo de Chicharrón (Completo)', priceServir: 3.55, priceLlevar: 4.00, available: true },
                        { id: 'bolon-supremo-queso-completo', name: 'Bolón Supremo de Queso (Completo)', priceServir: 3.55, priceLlevar: 4.00, available: true },
                        { id: 'bolon-supremo-mixto-completo', name: 'Bolón Supremo Mixto (Completo)', priceServir: 3.80, priceLlevar: 4.25, available: true },
                        { id: 'bolon-supremo-chicharron-solo', name: 'Bolón Supremo de Chicharrón (Solo)', priceServir: 2.80, priceLlevar: 3.25, available: true },
                        { id: 'bolon-supremo-queso-solo', name: 'Bolón Supremo de Queso (Solo)', priceServir: 2.80, priceLlevar: 3.25, available: true },
                        { id: 'bolon-supremo-mixto-solo', name: 'Bolón Supremo Mixto (Solo)', priceServir: 3.05, priceLlevar: 3.50, available: true }
                    ]
                },
                {
                    id: 'tigrillos',
                    name: 'TIGRILLOS',
                    products: [
                        { id: 'tigrillo-jr-completo', name: 'Tigrillo Jr (Completo)', priceServir: 3.50, priceLlevar: 3.95, available: true },
                        { id: 'tigrillo-completo', name: 'Tigrillo (Completo)', priceServir: 3.75, priceLlevar: 4.20, available: true },
                        { id: 'tigrillo-jr-solo', name: 'Tigrillo Jr (Solo)', priceServir: 2.75, priceLlevar: 3.20, available: true },
                        { id: 'tigrillo-solo', name: 'Tigrillo (Solo)', priceServir: 3.00, priceLlevar: 3.45, available: true }
                    ]
                },
                {
                    id: 'patacones',
                    name: 'PATACONES',
                    products: [
                        { id: 'patacones-queso-completo', name: 'Patacones con Queso (Completo)', priceServir: 2.50, priceLlevar: 2.75, available: true },
                        { id: 'patacones-huevo-completo', name: 'Patacones con Huevo (Completo)', priceServir: 2.75, priceLlevar: 3.00, available: true },
                        { id: 'patacones-queso-solo', name: 'Patacones con Queso (Solo)', priceServir: 2.00, priceLlevar: 2.25, available: true },
                        { id: 'patacones-huevo-solo', name: 'Patacones con Huevo (Solo)', priceServir: 2.25, priceLlevar: 2.50, available: true }
                    ]
                },
                {
                    id: 'tortas-bolones',
                    name: 'TORTAS DE BOLONES',
                    products: [
                        { id: 'torta-mini-queso', name: 'Torta Mini de Bolón de Queso', priceServir: 3.75, priceLlevar: 4.75, available: true },
                        { id: 'torta-pequena-queso', name: 'Torta Pequeña de Bolón de Queso', priceServir: 8.00, priceLlevar: 9.00, available: true },
                        { id: 'torta-grande-queso', name: 'Torta Grande de Bolón de Queso', priceServir: 13.00, priceLlevar: 14.00, available: true },
                        { id: 'torta-mini-mixta', name: 'Torta Mini de Bolón Mixta', priceServir: 4.25, priceLlevar: 5.25, available: true },
                        { id: 'torta-pequena-mixta', name: 'Torta Pequeña de Bolón Mixta', priceServir: 9.00, priceLlevar: 10.00, available: true },
                        { id: 'torta-grande-mixta', name: 'Torta Grande de Bolón Mixta', priceServir: 14.50, priceLlevar: 15.50, available: true }
                    ]
                },
                {
                    id: 'adicionales',
                    name: 'ADICIONALES',
                    products: [
                        { id: 'huevo-frito', name: 'Huevo Frito', priceServir: 0.50, priceLlevar: 0.50, available: true },
                        { id: 'batido', name: 'Batido', priceServir: 1.50, priceLlevar: 1.50, available: true }
                    ]
                }
            ]
        };
        localStorage.setItem('menuData', JSON.stringify(completeMenu));
    }

    setupEventListeners() {
        // Navegación entre pantallas
        document.getElementById('new-order-btn').addEventListener('click', () => this.showScreen('order-screen'));
        document.getElementById('manage-menu-btn').addEventListener('click', () => {
            this.showScreen('menu-screen');
            menuManager.loadMenu();
        });
        document.getElementById('view-reports-btn').addEventListener('click', () => {
            this.showScreen('reports-screen');
            reportManager.loadReport();
        });

        // Controles de cantidad
        document.getElementById('increase').addEventListener('click', () => this.changeQuantity(1));
        document.getElementById('decrease').addEventListener('click', () => this.changeQuantity(-1));

        // Opciones de producto
        document.getElementById('completo').addEventListener('click', () => this.setProductOption(true));
        document.getElementById('solo').addEventListener('click', () => this.setProductOption(false));

        // Opciones de servicio
        document.getElementById('servir').addEventListener('click', () => this.setServiceOption(true));
        document.getElementById('llevar').addEventListener('click', () => this.setServiceOption(false));

        // Selectores de categoría y producto
        document.getElementById('category').addEventListener('change', () => this.onCategoryChange());
        document.getElementById('product').addEventListener('change', () => this.updatePriceDisplay());

        // Gestión de pedidos
        document.getElementById('add-order').addEventListener('click', () => this.addToOrder());
        document.getElementById('complete-order').addEventListener('click', () => this.completeOrder());
        document.getElementById('cancel-order').addEventListener('click', () => this.cancelOrder());

        // Modales
        this.setupModalEvents();

        // Reportes
        document.getElementById('generate-report').addEventListener('click', () => {
            const dateInput = document.getElementById('report-date').value;
            const date = reportManager.formatDateFromInput(dateInput);
            reportManager.generateReport(date);
        });

        document.getElementById('export-report').addEventListener('click', () => {
            const dateInput = document.getElementById('report-date').value;
            const date = reportManager.formatDateFromInput(dateInput);
            orderManager.generateExcelReport(date);
        });
    }

    setupModalEvents() {
        // Modal de categorías
        document.getElementById('add-category-btn').addEventListener('click', () => menuManager.openCategoryModal());
        document.getElementById('save-category').addEventListener('click', () => menuManager.saveCategory());
        document.getElementById('cancel-category').addEventListener('click', () => menuManager.closeCategoryModal());

        // Modal de productos
        document.getElementById('add-product-btn').addEventListener('click', () => menuManager.openProductModal());
        document.getElementById('save-product').addEventListener('click', () => menuManager.saveProduct());
        document.getElementById('cancel-product').addEventListener('click', () => menuManager.closeProductModal());

        // Cerrar modales al hacer clic en X
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Cerrar modales al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    showScreen(screenId) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Mostrar la pantalla seleccionada
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;

        // Inicializar la pantalla si es necesario
        if (screenId === 'order-screen') {
            this.loadCategories();
            this.updateOrderDisplay();
        }
    }

    loadCategories() {
        const menuData = JSON.parse(localStorage.getItem('menuData'));
        const categorySelect = document.getElementById('category');
        
        categorySelect.innerHTML = '';
        menuData.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });

        this.onCategoryChange();
    }

    onCategoryChange() {
        const categoryId = document.getElementById('category').value;
        const menuData = JSON.parse(localStorage.getItem('menuData'));
        const category = menuData.categories.find(cat => cat.id === categoryId);
        const productSelect = document.getElementById('product');
        
        productSelect.innerHTML = '';
        if (category) {
            // Filtrar productos según si es completo o solo
            const filteredProducts = category.products.filter(product => {
                if (category.name === 'TORTAS DE BOLONES' || category.name === 'ADICIONALES') {
                    return product.available;
                }
                return product.available && (
                    (this.esCompleto && product.name.includes('(Completo)')) ||
                    (!this.esCompleto && product.name.includes('(Solo)'))
                );
            });

            filteredProducts.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = product.name;
                option.dataset.priceServir = product.priceServir;
                option.dataset.priceLlevar = product.priceLlevar;
                productSelect.appendChild(option);
            });
        }

        this.updatePriceDisplay();
    }

    updatePriceDisplay() {
        const productSelect = document.getElementById('product');
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        
        if (selectedOption) {
            const price = this.servir ? selectedOption.dataset.priceServir : selectedOption.dataset.priceLlevar;
            document.getElementById('price-display').textContent = `Precio: $${parseFloat(price).toFixed(2)}`;
        } else {
            document.getElementById('price-display').textContent = 'Precio: $0.00';
        }
    }

    changeQuantity(change) {
        let quantity = parseInt(document.getElementById('quantity').textContent);
        quantity += change;
        
        if (quantity < 1) quantity = 1;
        if (quantity > 99) quantity = 99;
        
        document.getElementById('quantity').textContent = quantity;
    }

    setProductOption(isCompleto) {
        this.esCompleto = isCompleto;
        const completoBtn = document.getElementById('completo');
        const soloBtn = document.getElementById('solo');
        
        if (isCompleto) {
            completoBtn.classList.add('btn-active');
            completoBtn.classList.remove('btn-inactive');
            soloBtn.classList.add('btn-inactive');
            soloBtn.classList.remove('btn-active');
        } else {
            soloBtn.classList.add('btn-active');
            soloBtn.classList.remove('btn-inactive');
            completoBtn.classList.add('btn-inactive');
            completoBtn.classList.remove('btn-active');
        }
        
        this.onCategoryChange(); // Recargar productos según la opción
    }

    setServiceOption(isServir) {
        this.servir = isServir;
        const servirBtn = document.getElementById('servir');
        const llevarBtn = document.getElementById('llevar');
        
        if (isServir) {
            servirBtn.classList.add('btn-active');
            servirBtn.classList.remove('btn-inactive');
            llevarBtn.classList.add('btn-inactive');
            llevarBtn.classList.remove('btn-active');
        } else {
            llevarBtn.classList.add('btn-active');
            llevarBtn.classList.remove('btn-inactive');
            servirBtn.classList.add('btn-inactive');
            servirBtn.classList.remove('btn-active');
        }
        
        this.updatePriceDisplay();
    }

    addToOrder() {
        const productSelect = document.getElementById('product');
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        const quantity = parseInt(document.getElementById('quantity').textContent);
        const notes = document.getElementById('notes').value;
        
        if (!selectedOption) {
            alert('Por favor selecciona un producto');
            return;
        }

        const price = this.servir ? parseFloat(selectedOption.dataset.priceServir) : parseFloat(selectedOption.dataset.priceLlevar);
        const productName = selectedOption.textContent;
        const serviceType = this.servir ? 'Servir' : 'Llevar';
        
        const orderItem = {
            id: Date.now().toString(),
            productId: selectedOption.value,
            productName: productName,
            quantity: quantity,
            price: price,
            total: price * quantity,
            serviceType: serviceType,
            notes: notes,
            timestamp: new Date().toISOString()
        };

        this.currentOrder.push(orderItem);
        this.updateOrderDisplay();
        this.clearProductForm();
    }

    updateOrderDisplay() {
        const orderContainer = document.getElementById('current-order');
        const subtotalElement = document.getElementById('subtotal');
        
        if (this.currentOrder.length === 0) {
            orderContainer.innerHTML = '<div class="empty-order">No hay productos en el pedido</div>';
            subtotalElement.textContent = '0.00';
            return;
        }

        let subtotal = 0;
        orderContainer.innerHTML = '';

        this.currentOrder.forEach((item, index) => {
            subtotal += item.total;
            
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-item-info">
                    <div class="order-item-name">${item.productName}</div>
                    <div class="order-item-details">
                        ${item.quantity} x $${item.price.toFixed(2)} | ${item.serviceType}
                        ${item.notes ? `<br><small>Notas: ${item.notes}</small>` : ''}
                    </div>
                </div>
                <div class="order-item-actions">
                    <strong>$${item.total.toFixed(2)}</strong>
                    <button class="delete-btn" data-index="${index}">🗑️</button>
                </div>
            `;
            orderContainer.appendChild(orderItem);
        });

        // Agregar event listeners a los botones de eliminar
        orderContainer.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.removeOrderItem(index);
            });
        });

        subtotalElement.textContent = subtotal.toFixed(2);
    }

    removeOrderItem(index) {
        this.currentOrder.splice(index, 1);
        this.updateOrderDisplay();
    }

    clearProductForm() {
        document.getElementById('quantity').textContent = '1';
        document.getElementById('notes').value = '';
    }

    completeOrder() {
        if (this.currentOrder.length === 0) {
            alert('No hay productos en el pedido');
            return;
        }

        if (confirm('¿Confirmar pedido?')) {
            orderManager.saveOrder(this.currentOrder);
            this.currentOrder = [];
            this.updateOrderDisplay();
            alert('Pedido completado exitosamente!');
        }
    }

    cancelOrder() {
        if (this.currentOrder.length === 0) return;
        
        if (confirm('¿Cancelar el pedido actual?')) {
            this.currentOrder = [];
            this.updateOrderDisplay();
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.restaurantApp = new RestaurantApp();
    window.menuManager = new MenuManager();
    window.orderManager = new OrderManager();
    window.reportManager = new ReportManager();
});