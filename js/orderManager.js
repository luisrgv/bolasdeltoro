class OrderManager {
    constructor() {
        this.orders = this.loadOrders();
    }

    loadOrders() {
        const ordersData = localStorage.getItem('orders');
        return ordersData ? JSON.parse(ordersData) : [];
    }

    saveOrders() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }

    saveOrder(orderItems) {
        const order = {
            id: Date.now().toString(),
            items: [...orderItems],
            total: orderItems.reduce((sum, item) => sum + item.total, 0),
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('es-ES')
        };

        this.orders.push(order);
        this.saveOrders();
        this.updateSalesData(order);
    }

    updateSalesData(order) {
        const today = new Date().toLocaleDateString('es-ES');
        const salesData = JSON.parse(localStorage.getItem('salesData')) || {};
        
        if (!salesData[today]) {
            salesData[today] = {
                totalSales: 0,
                totalOrders: 0,
                products: {}
            };
        }

        // Actualizar totales del día
        salesData[today].totalSales += order.total;
        salesData[today].totalOrders += 1;

        // Actualizar ventas por producto
        order.items.forEach(item => {
            const productKey = `${item.productName}-${item.serviceType}`;
            
            if (!salesData[today].products[productKey]) {
                salesData[today].products[productKey] = {
                    name: item.productName,
                    serviceType: item.serviceType,
                    quantity: 0,
                    total: 0
                };
            }

            salesData[today].products[productKey].quantity += item.quantity;
            salesData[today].products[productKey].total += item.total;
        });

        localStorage.setItem('salesData', JSON.stringify(salesData));
    }

    getOrdersByDate(date) {
        return this.orders.filter(order => order.date === date);
    }

    getSalesDataByDate(date) {
        const salesData = JSON.parse(localStorage.getItem('salesData')) || {};
        return salesData[date] || {
            totalSales: 0,
            totalOrders: 0,
            products: {}
        };
    }

    getAllSalesData() {
        return JSON.parse(localStorage.getItem('salesData')) || {};
    }

    // Método para generar reporte Excel (simulado)
    generateExcelReport(date) {
        const salesData = this.getSalesDataByDate(date);
        
        // Crear contenido CSV (simulación de Excel)
        let csvContent = "Producto,Servicio,Cantidad,Total\n";
        
        Object.values(salesData.products).forEach(product => {
            csvContent += `"${product.name}","${product.serviceType}",${product.quantity},${product.total}\n`;
        });
        
        csvContent += `\nTotal Ventas:,${salesData.totalSales}\n`;
        csvContent += `Total Pedidos:,${salesData.totalOrders}\n`;
        
        // Crear y descargar archivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `reporte_ventas_${date.replace(/\//g, '-')}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}