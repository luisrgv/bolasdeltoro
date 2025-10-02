class MenuManager {
    constructor() {
        this.editingCategory = null;
        this.editingProduct = null;
    }

    loadMenu() {
        const menuData = JSON.parse(localStorage.getItem('menuData'));
        const categoriesContainer = document.getElementById('menu-categories');
        
        categoriesContainer.innerHTML = '';
        
        menuData.categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.innerHTML = `
                <div class="category-header">
                    <div class="category-name">${category.name}</div>
                    <div class="category-actions">
                        <button class="btn btn-primary btn-small edit-category" data-id="${category.id}">Editar</button>
                        <button class="btn btn-danger btn-small delete-category" data-id="${category.id}">Eliminar</button>
                    </div>
                </div>
                <div class="products-list" id="products-${category.id}">
                    ${this.renderProducts(category.products, category.id)}
                </div>
            `;
            categoriesContainer.appendChild(categoryCard);
        });

        this.setupCategoryEvents();
    }

    renderProducts(products, categoryId) {
        if (products.length === 0) {
            return '<div class="empty-order">No hay productos en esta categoría</div>';
        }

        return products.map(product => `
            <div class="product-item ${product.available ? '' : 'product-unavailable'}">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-prices">
                        Servir: $${product.priceServir.toFixed(2)} | Llevar: $${product.priceLlevar.toFixed(2)}
                        ${!product.available ? ' | <span style="color: red;">No disponible</span>' : ''}
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-small edit-product" 
                            data-category="${categoryId}" 
                            data-id="${product.id}">Editar</button>
                    <button class="btn btn-danger btn-small delete-product" 
                            data-category="${categoryId}" 
                            data-id="${product.id}">Eliminar</button>
                </div>
            </div>
        `).join('');
    }

    setupCategoryEvents() {
        // Eventos para categorías
        document.querySelectorAll('.edit-category').forEach(btn => {
            btn.addEventListener('click', (e) => this.editCategory(e.target.dataset.id));
        });

        document.querySelectorAll('.delete-category').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteCategory(e.target.dataset.id));
        });

        // Eventos para productos
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', (e) => this.editProduct(e.target.dataset.category, e.target.dataset.id));
        });

        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteProduct(e.target.dataset.category, e.target.dataset.id));
        });
    }

    openCategoryModal(category = null) {
        this.editingCategory = category;
        const modal = document.getElementById('category-modal');
        const title = document.getElementById('category-modal-title');
        const nameInput = document.getElementById('category-name');
        
        if (category) {
            title.textContent = 'Editar Categoría';
            nameInput.value = category.name;
        } else {
            title.textContent = 'Agregar Categoría';
            nameInput.value = '';
        }
        
        modal.style.display = 'block';
    }

    closeCategoryModal() {
        document.getElementById('category-modal').style.display = 'none';
        this.editingCategory = null;
    }

    saveCategory() {
        const name = document.getElementById('category-name').value.trim();
        
        if (!name) {
            alert('Por favor ingresa un nombre para la categoría');
            return;
        }

        const menuData = JSON.parse(localStorage.getItem('menuData'));
        
        if (this.editingCategory) {
            // Editar categoría existente
            const category = menuData.categories.find(cat => cat.id === this.editingCategory.id);
            if (category) {
                category.name = name;
            }
        } else {
            // Agregar nueva categoría
            const newCategory = {
                id: Date.now().toString(),
                name: name,
                products: []
            };
            menuData.categories.push(newCategory);
        }

        localStorage.setItem('menuData', JSON.stringify(menuData));
        this.closeCategoryModal();
        this.loadMenu();
        restaurantApp.loadCategories(); // Actualizar en la pantalla de pedidos
    }

    editCategory(categoryId) {
        const menuData = JSON.parse(localStorage.getItem('menuData'));
        const category = menuData.categories.find(cat => cat.id === categoryId);
        
        if (category) {
            this.openCategoryModal(category);
        }
    }

    deleteCategory(categoryId) {
        if (!confirm('¿Estás seguro de eliminar esta categoría? Se eliminarán todos sus productos.')) {
            return;
        }

        const menuData = JSON.parse(localStorage.getItem('menuData'));
        menuData.categories = menuData.categories.filter(cat => cat.id !== categoryId);
        
        localStorage.setItem('menuData', JSON.stringify(menuData));
        this.loadMenu();
        restaurantApp.loadCategories(); // Actualizar en la pantalla de pedidos
    }

    openProductModal(categoryId = null, product = null) {
        this.editingProduct = product;
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('product-modal-title');
        const categorySelect = document.getElementById('product-category');
        
        // Cargar categorías en el select
        const menuData = JSON.parse(localStorage.getItem('menuData'));
        categorySelect.innerHTML = '';
        menuData.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });

        if (product) {
            title.textContent = 'Editar Producto';
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-price-servir').value = product.priceServir;
            document.getElementById('product-price-llevar').value = product.priceLlevar;
            document.getElementById('product-available').checked = product.available;
            categorySelect.value = categoryId;
        } else {
            title.textContent = 'Agregar Producto';
            document.getElementById('product-name').value = '';
            document.getElementById('product-price-servir').value = '';
            document.getElementById('product-price-llevar').value = '';
            document.getElementById('product-available').checked = true;
            categorySelect.value = categoryId || menuData.categories[0].id;
        }
        
        modal.style.display = 'block';
    }

    closeProductModal() {
        document.getElementById('product-modal').style.display = 'none';
        this.editingProduct = null;
    }

    saveProduct() {
        const name = document.getElementById('product-name').value.trim();
        const categoryId = document.getElementById('product-category').value;
        const priceServir = parseFloat(document.getElementById('product-price-servir').value);
        const priceLlevar = parseFloat(document.getElementById('product-price-llevar').value);
        const available = document.getElementById('product-available').checked;

        if (!name || !priceServir || !priceLlevar) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        const menuData = JSON.parse(localStorage.getItem('menuData'));
        const category = menuData.categories.find(cat => cat.id === categoryId);
        
        if (!category) {
            alert('Categoría no encontrada');
            return;
        }

        if (this.editingProduct) {
            // Editar producto existente
            const product = category.products.find(prod => prod.id === this.editingProduct.id);
            if (product) {
                product.name = name;
                product.priceServir = priceServir;
                product.priceLlevar = priceLlevar;
                product.available = available;
            }
        } else {
            // Agregar nuevo producto
            const newProduct = {
                id: Date.now().toString(),
                name: name,
                priceServir: priceServir,
                priceLlevar: priceLlevar,
                available: available
            };
            category.products.push(newProduct);
        }

        localStorage.setItem('menuData', JSON.stringify(menuData));
        this.closeProductModal();
        this.loadMenu();
        restaurantApp.loadCategories(); // Actualizar en la pantalla de pedidos
    }

    editProduct(categoryId, productId) {
        const menuData = JSON.parse(localStorage.getItem('menuData'));
        const category = menuData.categories.find(cat => cat.id === categoryId);
        
        if (category) {
            const product = category.products.find(prod => prod.id === productId);
            if (product) {
                this.openProductModal(categoryId, product);
            }
        }
    }

    deleteProduct(categoryId, productId) {
        if (!confirm('¿Estás seguro de eliminar este producto?')) {
            return;
        }

        const menuData = JSON.parse(localStorage.getItem('menuData'));
        const category = menuData.categories.find(cat => cat.id === categoryId);
        
        if (category) {
            category.products = category.products.filter(prod => prod.id !== productId);
            localStorage.setItem('menuData', JSON.stringify(menuData));
            this.loadMenu();
            restaurantApp.loadCategories(); // Actualizar en la pantalla de pedidos
        }
    }
}