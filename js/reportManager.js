class ReportManager {
    constructor() {
        this.orderManager = new OrderManager();
        this.setupEventListeners();
        this.setDefaultDate();
    }

    setDefaultDate() {
        const today = new Date();
        const todayFormatted = this.formatDateForInput(today);
        document.getElementById('report-date').value = todayFormatted;
        this.currentDate = today;
    }

    setupEventListeners() {
        document.getElementById('generate-report').addEventListener('click', () => this.generateReport());
        document.getElementById('export-report').addEventListener('click', () => this.exportToExcel());
        document.getElementById('report-date').addEventListener('change', (e) => {
            this.currentDate = new Date(e.target.value);
            this.generateReport();
        });
    }

    loadReport(date = null) {
        const targetDate = date || new Date();
        this.currentDate = targetDate;
        const inputDate = this.formatDateForInput(targetDate);
        document.getElementById('report-date').value = inputDate;
        this.generateReport();
    }

    formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatDateForDisplay(date) {
        return this.orderManager.getFullLocalDateTime(date.getTime()).date;
    }

    formatTimeForDisplay(timestamp) {
        return this.orderManager.getFullLocalDateTime(timestamp).time;
    }

    generateReport() {
        const selectedDate = document.getElementById('report-date').value;
        
        const salesData = this.orderManager.getSalesDataByDate(selectedDate);
        const orders = this.orderManager.getOrdersByDate(selectedDate);
        
        this.updateSummary(salesData, orders);
        this.updateSalesDetails(salesData);
        this.updateOrdersDetails(orders);
    }

    updateSummary(salesData, orders) {
        document.getElementById('daily-sales').textContent = `$${salesData.totalSales.toFixed(2)}`;
        document.getElementById('total-orders').textContent = salesData.totalOrders;
        
        const bestSeller = this.getBestSeller(salesData.products);
        document.getElementById('best-seller').textContent = bestSeller || '-';

        const avgOrderValue = salesData.totalOrders > 0 ? salesData.totalSales / salesData.totalOrders : 0;
        document.getElementById('avg-order-value').textContent = `$${avgOrderValue.toFixed(2)}`;
    }

    getBestSeller(products) {
        if (Object.keys(products).length === 0) return null;
        
        let bestProduct = null;
        let maxQuantity = 0;
        
        Object.values(products).forEach(product => {
            if (product.quantity > maxQuantity) {
                maxQuantity = product.quantity;
                bestProduct = product;
            }
        });
        
        return bestProduct ? `${bestProduct.name} (${bestProduct.quantity} unidades)` : null;
    }

    updateSalesDetails(salesData) {
        const detailsContainer = document.getElementById('sales-details');
        
        if (Object.keys(salesData.products).length === 0) {
            detailsContainer.innerHTML = '<div class="empty-order">No hay ventas para esta fecha</div>';
            return;
        }

        let html = `
            <div class="sales-header">
                <h4>Detalle de Productos Vendidos</h4>
            </div>
        `;

        Object.values(salesData.products)
            .sort((a, b) => b.quantity - a.quantity)
            .forEach(product => {
                html += `
                    <div class="sales-item">
                        <div class="sales-product">
                            <strong>${product.name}</strong>
                            <div class="sales-service">${product.serviceType}</div>
                        </div>
                        <div class="sales-quantity">${product.quantity} und</div>
                        <div class="sales-price">$${(product.total / product.quantity).toFixed(2)}</div>
                        <div class="sales-total">$${product.total.toFixed(2)}</div>
                    </div>
                `;
            });

        detailsContainer.innerHTML = html;
    }

    updateOrdersDetails(orders) {
        const ordersContainer = document.getElementById('orders-details');
        
        if (orders.length === 0) {
            ordersContainer.innerHTML = '<div class="empty-order">No hay pedidos para esta fecha</div>';
            return;
        }

        let html = `
            <div class="orders-header">
                <h4>Detalle de Pedidos</h4>
                <div class="orders-stats">
                    <span>Total Pedidos: ${orders.length}</span>
                </div>
            </div>
        `;

        orders.sort((a, b) => b.timestamp - a.timestamp)
            .forEach(order => {
                html += this.createOrderCard(order);
            });

        ordersContainer.innerHTML = html;
        this.setupOrderActions();
    }

    createOrderCard(order) {
        const dateTime = this.orderManager.getFullLocalDateTime(order.timestamp);
        
        return `
            <div class="order-card" data-order-id="${order.id}">
                <div class="order-card-header">
                    <div class="order-info">
                        <div class="order-id">Pedido #${order.id.slice(-6)}</div>
                        <div class="order-time">${dateTime.shortDate} - ${dateTime.time}</div>
                    </div>
                    <div class="order-total-card">$${order.total.toFixed(2)}</div>
                    <div class="order-actions">
                        <button class="btn btn-small btn-info view-order" title="Ver detalles">
                            👁️
                        </button>
                        <button class="btn btn-small btn-warning edit-order" title="Modificar pedido">
                            ✏️
                        </button>
                        <button class="btn btn-small btn-danger cancel-order" title="Cancelar pedido">
                            ❌
                        </button>
                    </div>
                </div>
                <div class="order-items-preview">
                    ${order.items.slice(0, 2).map(item => `
                        <div class="order-preview-item">
                            ${item.quantity}x ${item.productName}
                        </div>
                    `).join('')}
                    ${order.items.length > 2 ? `<div class="more-items">+${order.items.length - 2} más</div>` : ''}
                </div>
                <div class="order-card-details" style="display: none;">
                    <div class="order-items-detailed">
                        ${order.items.map(item => `
                            <div class="order-detailed-item">
                                <div class="item-info">
                                    <div class="item-name">${item.productName}</div>
                                    <div class="item-details">
                                        ${item.serviceType} | ${item.quantity} x $${item.price.toFixed(2)}
                                        ${item.notes ? `<br><small>Notas: ${item.notes}</small>` : ''}
                                    </div>
                                </div>
                                <div class="item-total">$${item.total.toFixed(2)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    setupOrderActions() {
        document.querySelectorAll('.view-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderCard = e.target.closest('.order-card');
                const details = orderCard.querySelector('.order-card-details');
                details.style.display = details.style.display === 'none' ? 'block' : 'none';
            });
        });

        document.querySelectorAll('.edit-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.closest('.order-card').dataset.orderId;
                this.editOrder(orderId);
            });
        });

        document.querySelectorAll('.cancel-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.closest('.order-card').dataset.orderId;
                this.cancelOrder(orderId);
            });
        });
    }

    editOrder(orderId) {
        const orders = this.orderManager.orders;
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
            alert('Pedido no encontrado');
            return;
        }

        if (confirm('¿Estás seguro de que quieres modificar este pedido? Se eliminará del sistema y podrás recrearlo.')) {
            this.orderManager.orders = orders.filter(o => o.id !== orderId);
            this.orderManager.saveOrders();
            this.orderManager.updateSalesDataAfterCancellation(order);
            this.generateReport();
            alert('Pedido eliminado. Ahora puedes recrearlo en la pantalla de pedidos.');
        }
    }

    cancelOrder(orderId) {
        if (!confirm('¿Estás seguro de que quieres CANCELAR este pedido? Esta acción no se puede deshacer.')) {
            return;
        }

        if (this.orderManager.cancelOrder(orderId)) {
            this.generateReport();
            alert('Pedido cancelado exitosamente.');
        } else {
            alert('Error: Pedido no encontrado.');
        }
    }

    exportToExcel() {
        const selectedDate = document.getElementById('report-date').value;
        this.orderManager.generateExcelReport(selectedDate);
    }
}