// Mapa de productos y precios
const preciosServir = {};
const preciosLlevar = {};

// Variables de estado
let pedidos = [];
let total = 0.0;
let selectedCategory = "Bolones Normales";
let selectedProduct = "";
let cantidad = 1;
let productos = [];
let esCompleto = true;
let servir = true;

// Inicializar los precios
function inicializarPrecios() {
    // Bolones Completos
    preciosServir["Bolón Jr de Chicharrón (Completo)"] = 2.50;
    preciosLlevar["Bolón Jr de Chicharrón (Completo)"] = 2.75;
    preciosServir["Bolón Jr de Queso (Completo)"] = 2.50;
    preciosLlevar["Bolón Jr de Queso (Completo)"] = 2.75;
    preciosServir["Bolón Jr Mixto (Completo)"] = 2.75;
    preciosLlevar["Bolón Jr Mixto (Completo)"] = 3.00;
    preciosServir["Bolón de Chicharrón (Completo)"] = 2.75;
    preciosLlevar["Bolón de Chicharrón (Completo)"] = 3.00;
    preciosServir["Bolón de Queso (Completo)"] = 2.75;
    preciosLlevar["Bolón de Queso (Completo)"] = 3.00;
    preciosServir["Bolón Mixto (Completo)"] = 3.00;
    preciosLlevar["Bolón Mixto (Completo)"] = 3.25;

    // Bolones Solos
    preciosServir["Bolón Jr de Chicharrón (Solo)"] = 1.75;
    preciosLlevar["Bolón Jr de Chicharrón (Solo)"] = 1.75;
    preciosServir["Bolón Jr de Queso (Solo)"] = 1.75;
    preciosLlevar["Bolón Jr de Queso (Solo)"] = 1.75;
    preciosServir["Bolón Jr Mixto (Solo)"] = 2.00;
    preciosLlevar["Bolón Jr Mixto (Solo)"] = 2.00;
    preciosServir["Bolón de Chicharrón (Solo)"] = 2.00;
    preciosLlevar["Bolón de Chicharrón (Solo)"] = 2.00;
    preciosServir["Bolón de Queso (Solo)"] = 2.00;
    preciosLlevar["Bolón de Queso (Solo)"] = 2.00;
    preciosServir["Bolón Mixto (Solo)"] = 2.25;
    preciosLlevar["Bolón Mixto (Solo)"] = 2.25;

    // Bolones Cremosos - Completos
    preciosServir["Bolón Cremoso Jr de Chicharrón (Completo)"] = 2.75;
    preciosLlevar["Bolón Cremoso Jr de Chicharrón (Completo)"] = 3.20;
    preciosServir["Bolón Cremoso Jr de Queso (Completo)"] = 2.75;
    preciosLlevar["Bolón Cremoso Jr de Queso (Completo)"] = 3.20;
    preciosServir["Bolón Cremoso Jr Mixto (Completo)"] = 3.00;
    preciosLlevar["Bolón Cremoso Jr Mixto (Completo)"] = 3.45;
    preciosServir["Bolón Cremoso de Chicharrón (Completo)"] = 3.00;
    preciosLlevar["Bolón Cremoso de Chicharrón (Completo)"] = 3.45;
    preciosServir["Bolón Cremoso de Queso (Completo)"] = 3.00;
    preciosLlevar["Bolón Cremoso de Queso (Completo)"] = 3.45;
    preciosServir["Bolón Cremoso Mixto (Completo)"] = 3.25;
    preciosLlevar["Bolón Cremoso Mixto (Completo)"] = 3.70;

    // Bolones Cremosos - Solos
    preciosServir["Bolón Cremoso Jr de Chicharrón (Solo)"] = 2.00;
    preciosLlevar["Bolón Cremoso Jr de Chicharrón (Solo)"] = 2.45;
    preciosServir["Bolón Cremoso Jr de Queso (Solo)"] = 2.00;
    preciosLlevar["Bolón Cremoso Jr de Queso (Solo)"] = 2.45;
    preciosServir["Bolón Cremoso Jr Mixto (Solo)"] = 2.25;
    preciosLlevar["Bolón Cremoso Jr Mixto (Solo)"] = 2.70;
    preciosServir["Bolón Cremoso de Chicharrón (Solo)"] = 2.25;
    preciosLlevar["Bolón Cremoso de Chicharrón (Solo)"] = 2.70;
    preciosServir["Bolón Cremoso de Queso (Solo)"] = 2.25;
    preciosLlevar["Bolón Cremoso de Queso (Solo)"] = 2.70;
    preciosServir["Bolón Cremoso Mixto (Solo)"] = 2.50;
    preciosLlevar["Bolón Cremoso Mixto (Solo)"] = 2.95;

    // Bolones Crunchy - Completos
    preciosServir["Bolón Crunchy de Chicharrón (Completo)"] = 3.00;
    preciosLlevar["Bolón Crunchy de Chicharrón (Completo)"] = 3.45;
    preciosServir["Bolón Crunchy de Queso (Completo)"] = 3.00;
    preciosLlevar["Bolón Crunchy de Queso (Completo)"] = 3.45;
    preciosServir["Bolón Crunchy Mixto (Completo)"] = 3.25;
    preciosLlevar["Bolón Crunchy Mixto (Completo)"] = 3.70;

    // Bolones Crunchy - Solos
    preciosServir["Bolón Crunchy de Chicharrón (Solo)"] = 2.25;
    preciosLlevar["Bolón Crunchy de Chicharrón (Solo)"] = 2.70;
    preciosServir["Bolón Crunchy de Queso (Solo)"] = 2.25;
    preciosLlevar["Bolón Crunchy de Queso (Solo)"] = 2.70;
    preciosServir["Bolón Crunchy Mixto (Solo)"] = 2.50;
    preciosLlevar["Bolón Crunchy Mixto (Solo)"] = 2.95;

    // Bolones Supremos - Completos
    preciosServir["Bolón Supremo de Chicharrón (Completo)"] = 3.55;
    preciosLlevar["Bolón Supremo de Chicharrón (Completo)"] = 4.00;
    preciosServir["Bolón Supremo de Queso (Completo)"] = 3.55;
    preciosLlevar["Bolón Supremo de Queso (Completo)"] = 4.00;
    preciosServir["Bolón Supremo Mixto (Completo)"] = 3.80;
    preciosLlevar["Bolón Supremo Mixto (Completo)"] = 4.25;

    // Bolones Supremos - Solos
    preciosServir["Bolón Supremo de Chicharrón (Solo)"] = 2.80;
    preciosLlevar["Bolón Supremo de Chicharrón (Solo)"] = 3.25;
    preciosServir["Bolón Supremo de Queso (Solo)"] = 2.80;
    preciosLlevar["Bolón Supremo de Queso (Solo)"] = 3.25;
    preciosServir["Bolón Supremo Mixto (Solo)"] = 3.05;
    preciosLlevar["Bolón Supremo Mixto (Solo)"] = 3.50;

    // Tigrillos
    preciosServir["Tigrillo Jr (Completo)"] = 3.50;
    preciosLlevar["Tigrillo Jr (Completo)"] = 3.95;
    preciosServir["Tigrillo (Completo)"] = 3.75;
    preciosLlevar["Tigrillo (Completo)"] = 4.20;
    preciosServir["Tigrillo Jr (Solo)"] = 2.75;
    preciosLlevar["Tigrillo Jr (Solo)"] = 3.20;
    preciosServir["Tigrillo (Solo)"] = 3.00;
    preciosLlevar["Tigrillo (Solo)"] = 3.45;

    // Patacones
    preciosServir["Patacones con Queso (Completo)"] = 2.50;
    preciosLlevar["Patacones con Queso (Completo)"] = 2.75;
    preciosServir["Patacones con Huevo (Completo)"] = 2.75;
    preciosLlevar["Patacones con Huevo (Completo)"] = 3.00;
    preciosServir["Patacones con Queso (Solo)"] = 2.00;
    preciosLlevar["Patacones con Queso (Solo)"] = 2.25;
    preciosServir["Patacones con Huevo (Solo)"] = 2.25;
    preciosLlevar["Patacones con Huevo (Solo)"] = 2.50;

    // Tortas de Bolones
    preciosServir["Torta Mini de Bolón de Queso"] = 3.75;
    preciosLlevar["Torta Mini de Bolón de Queso"] = 4.75;
    preciosServir["Torta Pequeña de Bolón de Queso"] = 8.00;
    preciosLlevar["Torta Pequeña de Bolón de Queso"] = 9.00;
    preciosServir["Torta Grande de Bolón de Queso"] = 13.00;
    preciosLlevar["Torta Grande de Bolón de Queso"] = 14.00;
    preciosServir["Torta Mini de Bolón Mixta"] = 4.25;
    preciosLlevar["Torta Mini de Bolón Mixta"] = 5.25;
    preciosServir["Torta Pequeña de Bolón Mixta"] = 9.00;
    preciosLlevar["Torta Pequeña de Bolón Mixta"] = 10.00;
    preciosServir["Torta Grande de Bolón Mixta"] = 14.50;
    preciosLlevar["Torta Grande de Bolón Mixta"] = 15.50;

    // Adicionales
    preciosServir["Huevo Frito"] = 0.50;
    preciosLlevar["Huevo Frito"] = 0.50;
    preciosServir["Batido"] = 1.50;
    preciosLlevar["Batido"] = 1.50;
}

// Actualizar la lista de productos según la categoría seleccionada y si es completo o solo
function actualizarProductos() {
    productos = []; // Limpiar la lista de productos antes de actualizar

    if (selectedCategory === "Bolones Normales") {
        if (esCompleto) {
            productos = [
                "Bolón Jr de Chicharrón (Completo)",
                "Bolón Jr de Queso (Completo)",
                "Bolón Jr Mixto (Completo)",
                "Bolón de Chicharrón (Completo)",
                "Bolón de Queso (Completo)",
                "Bolón Mixto (Completo)"
            ];
        } else {
            productos = [
                "Bolón Jr de Chicharrón (Solo)",
                "Bolón Jr de Queso (Solo)",
                "Bolón Jr Mixto (Solo)",
                "Bolón de Chicharrón (Solo)",
                "Bolón de Queso (Solo)",
                "Bolón Mixto (Solo)"
            ];
        }
    } else if (selectedCategory === "Bolones Cremosos") {
        if (esCompleto) {
            productos = [
                "Bolón Cremoso Jr de Chicharrón (Completo)",
                "Bolón Cremoso Jr de Queso (Completo)",
                "Bolón Cremoso Jr Mixto (Completo)",
                "Bolón Cremoso de Chicharrón (Completo)",
                "Bolón Cremoso de Queso (Completo)",
                "Bolón Cremoso Mixto (Completo)"
            ];
        } else {
            productos = [
                "Bolón Cremoso Jr de Chicharrón (Solo)",
                "Bolón Cremoso Jr de Queso (Solo)",
                "Bolón Cremoso Jr Mixto (Solo)",
                "Bolón Cremoso de Chicharrón (Solo)",
                "Bolón Cremoso de Queso (Solo)",
                "Bolón Cremoso Mixto (Solo)"
            ];
        }
    } else if (selectedCategory === "Bolones Crunchy") {
        if (esCompleto) {
            productos = [
                "Bolón Crunchy de Chicharrón (Completo)",
                "Bolón Crunchy de Queso (Completo)",
                "Bolón Crunchy Mixto (Completo)"
            ];
        } else {
            productos = [
                "Bolón Crunchy de Chicharrón (Solo)",
                "Bolón Crunchy de Queso (Solo)",
                "Bolón Crunchy Mixto (Solo)"
            ];
        }
    } else if (selectedCategory === "Bolones Supremos") {
        if (esCompleto) {
            productos = [
                "Bolón Supremo de Chicharrón (Completo)",
                "Bolón Supremo de Queso (Completo)",
                "Bolón Supremo Mixto (Completo)"
            ];
        } else {
            productos = [
                "Bolón Supremo de Chicharrón (Solo)",
                "Bolón Supremo de Queso (Solo)",
                "Bolón Supremo Mixto (Solo)"
            ];
        }
    } else if (selectedCategory === "TIGRILLOS") {
        if (esCompleto) {
            productos = [
                "Tigrillo Jr (Completo)",
                "Tigrillo (Completo)"
            ];
        } else {
            productos = [
                "Tigrillo Jr (Solo)",
                "Tigrillo (Solo)"
            ];
        }
    } else if (selectedCategory === "PATACONES") {
        if (esCompleto) {
            productos = [
                "Patacones con Queso (Completo)",
                "Patacones con Huevo (Completo)"
            ];
        } else {
            productos = [
                "Patacones con Queso (Solo)",
                "Patacones con Huevo (Solo)"
            ];
        }
    } else if (selectedCategory === "TORTAS DE BOLONES") {
        productos = [
            "Torta Mini de Bolón de Queso",
            "Torta Pequeña de Bolón de Queso",
            "Torta Grande de Bolón de Queso",
            "Torta Mini de Bolón Mixta",
            "Torta Pequeña de Bolón Mixta",
            "Torta Grande de Bolón Mixta"
        ];
    } else if (selectedCategory === "ADICIONALES") {
        productos = [
            "Huevo Frito",
            "Batido"
        ];
    }

    // Actualizar el dropdown de productos
    const productSelect = document.getElementById('product');
    productSelect.innerHTML = '';
    
    productos.forEach(product => {
        const option = document.createElement('option');
        option.value = product;
        option.textContent = product;
        productSelect.appendChild(option);
    });

    selectedProduct = productos.length > 0 ? productos[0] : "";
}

// Agregar el pedido y calcular el total
function agregarPedido() {
    const precio = servir
        ? preciosServir[selectedProduct] || 0.0
        : preciosLlevar[selectedProduct] || 0.0;

    const subtotal = precio * cantidad;
    total += subtotal;
    
    pedidos.push({
        producto: selectedProduct,
        cantidad: cantidad,
        precioUnitario: precio,
        total: subtotal,
    });

    actualizarResumenPedidos();
    guardarDatos();
}

// Eliminar un pedido agregado por error
function eliminarPedido(index) {
    total -= pedidos[index].total;
    pedidos.splice(index, 1);
    actualizarResumenPedidos();
    guardarDatos();
}

// Actualizar la vista del resumen de pedidos
function actualizarResumenPedidos() {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';
    
    pedidos.forEach((pedido, index) => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        
        orderItem.innerHTML = `
            <div>
                <strong>${pedido.producto}</strong>
                <div>x ${pedido.cantidad}</div>
            </div>
            <div>
                <strong>$${pedido.total.toFixed(2)}</strong>
                <button class="delete-btn" data-index="${index}">🗑️</button>
            </div>
        `;
        
        orderList.appendChild(orderItem);
    });
    
    // Agregar event listeners a los botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            eliminarPedido(index);
        });
    });
    
    document.getElementById('total').textContent = `Total: $${total.toFixed(2)}`;
}

// Guardar datos en localStorage
function guardarDatos() {
    const datos = {
        pedidos: pedidos,
        total: total
    };
    localStorage.setItem('restauranteMenu', JSON.stringify(datos));
}

// Cargar datos desde localStorage
function cargarDatos() {
    const datosGuardados = localStorage.getItem('restauranteMenu');
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        pedidos = datos.pedidos || [];
        total = datos.total || 0.0;
        actualizarResumenPedidos();
    }
}

// Inicializar la aplicación
function init() {
    inicializarPrecios();
    actualizarProductos();
    cargarDatos();
    
    // Event listeners
    document.getElementById('category').addEventListener('change', function() {
        selectedCategory = this.value;
        actualizarProductos();
    });
    
    document.getElementById('product').addEventListener('change', function() {
        selectedProduct = this.value;
    });
    
    document.getElementById('decrease').addEventListener('click', function() {
        if (cantidad > 1) {
            cantidad--;
            document.getElementById('quantity').textContent = cantidad;
        }
    });
    
    document.getElementById('increase').addEventListener('click', function() {
        cantidad++;
        document.getElementById('quantity').textContent = cantidad;
    });
    
    document.getElementById('completo').addEventListener('click', function() {
        esCompleto = true;
        document.getElementById('completo').classList.add('btn-active');
        document.getElementById('completo').classList.remove('btn-inactive');
        document.getElementById('solo').classList.add('btn-inactive');
        document.getElementById('solo').classList.remove('btn-active');
        actualizarProductos();
    });
    
    document.getElementById('solo').addEventListener('click', function() {
        esCompleto = false;
        document.getElementById('solo').classList.add('btn-active');
        document.getElementById('solo').classList.remove('btn-inactive');
        document.getElementById('completo').classList.add('btn-inactive');
        document.getElementById('completo').classList.remove('btn-active');
        actualizarProductos();
    });
    
    document.getElementById('servir').addEventListener('click', function() {
        servir = true;
        document.getElementById('servir').classList.add('btn-active');
        document.getElementById('servir').classList.remove('btn-inactive');
        document.getElementById('llevar').classList.add('btn-inactive');
        document.getElementById('llevar').classList.remove('btn-active');
    });
    
    document.getElementById('llevar').addEventListener('click', function() {
        servir = false;
        document.getElementById('llevar').classList.add('btn-active');
        document.getElementById('llevar').classList.remove('btn-inactive');
        document.getElementById('servir').classList.add('btn-inactive');
        document.getElementById('servir').classList.remove('btn-active');
    });
    
    document.getElementById('add-order').addEventListener('click', agregarPedido);
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);