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
            id: 'order-' + Date.now(),
            items: [...orderItems],
            total: orderItems.reduce((sum, item) => sum + item.total, 0),
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('es-ES'),
            status: 'completed'
        };

        this.orders.push(order);
        this.saveOrders();
        this.updateSalesData(order);
        
        console.log('Pedido guardado:', order);
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
        console.log('Datos de ventas actualizados para:', today);
    }

    getOrdersByDate(date) {
        const targetDate = new Date(date).toLocaleDateString('es-ES');
        return this.orders.filter(order => {
            const orderDate = new Date(order.timestamp).toLocaleDateString('es-ES');
            return orderDate === targetDate;
        });
    }

    getSalesDataByDate(date) {
        const targetDate = new Date(date).toLocaleDateString('es-ES');
        const salesData = JSON.parse(localStorage.getItem('salesData')) || {};
        return salesData[targetDate] || {
            totalSales: 0,
            totalOrders: 0,
            products: {}
        };
    }

    getAllSalesData() {
        return JSON.parse(localStorage.getItem('salesData')) || {};
    }

    // Método para generar reporte Excel
    generateExcelReport(date) {
        const salesData = this.getSalesDataByDate(date);
        const orders = this.getOrdersByDate(date);
        
        // Crear contenido CSV
        let csvContent = "REPORTE DE VENTAS - LAS BOLAS DEL TORO\n";
        csvContent += `Fecha: ${new Date(date).toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}\n\n`;
        
        // Resumen
        csvContent += "RESUMEN DEL DÍA\n";
        csvContent += `Total Ventas,$${salesData.totalSales.toFixed(2)}\n`;
        csvContent += `Total Pedidos,${salesData.totalOrders}\n`;
        csvContent += `Valor Promedio por Pedido,$${salesData.totalOrders > 0 ? (salesData.totalSales / salesData.totalOrders).toFixed(2) : '0.00'}\n\n`;
        
        // Productos vendidos
        csvContent += "PRODUCTOS VENDIDOS\n";
        csvContent += "Producto,Servicio,Cantidad,Precio Unitario Promedio,Total\n";
        
        Object.values(salesData.products)
            .sort((a, b) => b.quantity - a.quantity)
            .forEach(product => {
                const unitPrice = product.total / product.quantity;
                csvContent += `"${product.name}","${product.serviceType}",${product.quantity},$${unitPrice.toFixed(2)},$${product.total.toFixed(2)}\n`;
            });
        
        csvContent += "\n";
        
        // Detalle de pedidos
        csvContent += "DETALLE DE PEDIDOS\n";
        csvContent += "ID Pedido,Fecha,Hora,Total,Items Detallados\n";
        
        orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .forEach(order => {
                const orderDate = new Date(order.timestamp).toLocaleDateString('es-ES');
                const orderTime = new Date(order.timestamp).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                });
                const itemsSummary = order.items.map(item => 
                    `${item.quantity}x ${item.productName} (${item.serviceType}) - $${item.total.toFixed(2)}`
                ).join('; ');
                
                csvContent += `"${order.id}","${orderDate}","${orderTime}",$${order.total.toFixed(2)},"${itemsSummary}"\n`;
            });
        
        // Crear y descargar archivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const fileName = `reporte_ventas_${new Date(date).toISOString().split('T')[0]}.csv`;
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('Reporte exportado:', fileName);
    }

    // Métodos adicionales para estadísticas
    getCompleteSalesData(date) {
        const targetDate = new Date(date).toLocaleDateString('es-ES');
        const salesData = this.getSalesDataByDate(date);
        const orders = this.getOrdersByDate(date);
        
        return {
            date: targetDate,
            summary: salesData,
            orders: orders,
            statistics: {
                averageOrderValue: salesData.totalOrders > 0 ? salesData.totalSales / salesData.totalOrders : 0,
                bestSellingProduct: this.getBestSellingProduct(salesData.products),
                peakHour: this.getPeakHour(orders)
            }
        };
    }

    getBestSellingProduct(products) {
        if (!products || Object.keys(products).length === 0) return null;
        
        let bestProduct = null;
        let maxQuantity = 0;
        
        Object.values(products).forEach(product => {
            if (product.quantity > maxQuantity) {
                maxQuantity = product.quantity;
                bestProduct = product;
            }
        });
        
        return bestProduct;
    }

    getPeakHour(orders) {
        if (!orders || orders.length === 0) return null;
        
        const hours = {};
        orders.forEach(order => {
            const hour = new Date(order.timestamp).getHours();
            hours[hour] = (hours[hour] || 0) + 1;
        });
        
        return Object.keys(hours).reduce((a, b) => hours[a] > hours[b] ? a : b);
    }

    // Método para cancelar pedido
    cancelOrder(orderId) {
        const orderIndex = this.orders.findIndex(order => order.id === orderId);
        if (orderIndex === -1) return false;

        const cancelledOrder = this.orders[orderIndex];
        this.orders.splice(orderIndex, 1);
        this.saveOrders();
        
        // Actualizar datos de ventas
        this.updateSalesDataAfterCancellation(cancelledOrder);
        
        return true;
    }

    updateSalesDataAfterCancellation(order) {
        const orderDate = new Date(order.timestamp).toLocaleDateString('es-ES');
        const salesData = JSON.parse(localStorage.getItem('salesData')) || {};
        
        if (salesData[orderDate]) {
            // Restar del total de ventas
            salesData[orderDate].totalSales -= order.total;
            salesData[orderDate].totalOrders -= 1;
            
            // Restar productos individuales
            order.items.forEach(item => {
                const productKey = `${item.productName}-${item.serviceType}`;
                if (salesData[orderDate].products[productKey]) {
                    salesData[orderDate].products[productKey].quantity -= item.quantity;
                    salesData[orderDate].products[productKey].total -= item.total;
                    
                    // Si la cantidad llega a 0, eliminar el producto
                    if (salesData[orderDate].products[productKey].quantity <= 0) {
                        delete salesData[orderDate].products[productKey];
                    }
                }
            });
            
            localStorage.setItem('salesData', JSON.stringify(salesData));
        }
    }
}