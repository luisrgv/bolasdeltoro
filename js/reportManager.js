class ReportManager {
    constructor() {
        this.orderManager = new OrderManager();
    }

    loadReport(date = null) {
        const targetDate = date || new Date().toLocaleDateString('es-ES');
        document.getElementById('report-date').value = this.formatDateForInput(targetDate);
        
        this.generateReport(targetDate);
    }

    formatDateForInput(dateString) {
        const parts = dateString.split('/');
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }

    formatDateFromInput(inputDate) {
        const date = new Date(inputDate);
        return date.toLocaleDateString('es-ES');
    }

    generateReport(date = null) {
        const targetDate = date || new Date().toLocaleDateString('es-ES');
        const salesData = this.orderManager.getSalesDataByDate(targetDate);
        
        this.updateSummary(salesData);
        this.updateDetails(salesData);
    }

    updateSummary(salesData) {
        document.getElementById('daily-sales').textContent = `$${salesData.totalSales.toFixed(2)}`;
        document.getElementById('total-orders').textContent = salesData.totalOrders;
        
        const bestSeller = this.getBestSeller(salesData.products);
        document.getElementById('best-seller').textContent = bestSeller || '-';
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
        
        return bestProduct ? `${bestProduct.name} (${bestProduct.quantity} vendidos)` : null;
    }

    updateDetails(salesData) {
        const detailsContainer = document.getElementById('sales-details');
        
        if (Object.keys(salesData.products).length === 0) {
            detailsContainer.innerHTML = '<div class="empty-order">No hay ventas para esta fecha</div>';
            return;
        }

        detailsContainer.innerHTML = '';
        
        Object.values(salesData.products)
            .sort((a, b) => b.quantity - a.quantity)
            .forEach(product => {
                const salesItem = document.createElement('div');
                salesItem.className = 'sales-item';
                salesItem.innerHTML = `
                    <div class="sales-product">${product.name}</div>
                    <div class="sales-service">${product.serviceType}</div>
                    <div class="sales-quantity">${product.quantity} unidades</div>
                    <div class="sales-total">$${product.total.toFixed(2)}</div>
                `;
                detailsContainer.appendChild(salesItem);
            });
    }

    setupEventListeners() {
        document.getElementById('generate-report').addEventListener('click', () => {
            const dateInput = document.getElementById('report-date').value;
            const date = this.formatDateFromInput(dateInput);
            this.generateReport(date);
        });

        document.getElementById('export-report').addEventListener('click', () => {
            const dateInput = document.getElementById('report-date').value;
            const date = this.formatDateFromInput(dateInput);
            this.orderManager.generateExcelReport(date);
        });
    }
}

// Inicializar event listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const reportManager = new ReportManager();
    reportManager.setupEventListeners();
});