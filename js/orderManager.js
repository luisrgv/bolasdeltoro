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
        const now = new Date();
        
        const order = {
            id: 'order-' + Date.now(),
            items: [...orderItems],
            total: orderItems.reduce((sum, item) => sum + item.total, 0),
            timestamp: now.getTime(), // Guardar como timestamp en milisegundos
            date: this.getLocalDateString(now),
            time: this.getLocalTimeString(now),
            status: 'completed'
        };

        this.orders.push(order);
        this.saveOrders();
        this.updateSalesData(order);
    }

    getLocalDateString(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    getLocalTimeString(date) {
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'p. m.' : 'a. m.';
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
    }

    getFullLocalDateTime(timestamp) {
        const date = new Date(timestamp);
        const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const monthName = months[date.getMonth()];
        const year = date.getFullYear();
        
        const time = this.getLocalTimeString(date);
        const shortDate = this.getLocalDateString(date);
        
        return {
            date: `${dayName} ${day} de ${monthName} de ${year}`,
            time: time,
            shortDate: shortDate
        };
    }

    updateSalesData(order) {
        const today = order.date;
        const salesData = JSON.parse(localStorage.getItem('salesData')) || {};
        
        if (!salesData[today]) {
            salesData[today] = {
                totalSales: 0,
                totalOrders: 0,
                products: {}
            };
        }

        salesData[today].totalSales += order.total;
        salesData[today].totalOrders += 1;

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
        const targetDate = this.formatDateForComparison(date);
        return this.orders.filter(order => {
            const orderDate = this.formatDateForComparison(order.date);
            return orderDate === targetDate;
        });
    }

    getSalesDataByDate(date) {
        const targetDate = this.formatDateForComparison(date);
        const salesData = JSON.parse(localStorage.getItem('salesData')) || {};
        return salesData[targetDate] || {
            totalSales: 0,
            totalOrders: 0,
            products: {}
        };
    }

    formatDateForComparison(dateInput) {
        if (!dateInput) return '';
        
        if (dateInput instanceof Date) {
            return this.getLocalDateString(dateInput);
        }
        
        if (dateInput.includes('/')) {
            return dateInput;
        }
        
        if (dateInput.includes('-')) {
            const [year, month, day] = dateInput.split('-');
            return `${day}/${month}/${year}`;
        }
        
        return dateInput;
    }

    formatInputDateToLatino(dateString) {
        if (!dateString) {
            return this.getLocalDateString(new Date());
        }
        
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    generateExcelReport(date) {
        const salesData = this.getSalesDataByDate(date);
        const orders = this.getOrdersByDate(date);
        const latinoDate = this.formatInputDateToLatino(date);
        
        let csvContent = "REPORTE DE VENTAS - LAS BOLAS DEL TORO\n";
        csvContent += `Fecha: ${this.getFullLocalDateTime(new Date(date).getTime()).date}\n\n`;
        
        csvContent += "RESUMEN DEL DÍA\n";
        csvContent += `Total Ventas,$${salesData.totalSales.toFixed(2)}\n`;
        csvContent += `Total Pedidos,${salesData.totalOrders}\n`;
        csvContent += `Valor Promedio por Pedido,$${salesData.totalOrders > 0 ? (salesData.totalSales / salesData.totalOrders).toFixed(2) : '0.00'}\n\n`;
        
        csvContent += "PRODUCTOS VENDIDOS\n";
        csvContent += "Producto,Servicio,Cantidad,Precio Unitario Promedio,Total\n";
        
        Object.values(salesData.products)
            .sort((a, b) => b.quantity - a.quantity)
            .forEach(product => {
                const unitPrice = product.total / product.quantity;
                csvContent += `"${product.name}","${product.serviceType}",${product.quantity},$${unitPrice.toFixed(2)},$${product.total.toFixed(2)}\n`;
            });
        
        csvContent += "\n";
        
        csvContent += "DETALLE DE PEDIDOS\n";
        csvContent += "ID Pedido,Fecha,Hora,Total,Items Detallados\n";
        
        orders.sort((a, b) => b.timestamp - a.timestamp)
            .forEach(order => {
                const dateTime = this.getFullLocalDateTime(order.timestamp);
                const itemsSummary = order.items.map(item => 
                    `${item.quantity}x ${item.productName} (${item.serviceType}) - $${item.total.toFixed(2)}`
                ).join('; ');
                
                csvContent += `"${order.id}","${dateTime.shortDate}","${dateTime.time}",$${order.total.toFixed(2)},"${itemsSummary}"\n`;
            });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const fileName = `reporte_ventas_${latinoDate.replace(/\//g, '-')}.csv`;
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    getAllSalesData() {
        return JSON.parse(localStorage.getItem('salesData')) || {};
    }

    getCompleteSalesData(date) {
        const targetDate = this.formatInputDateToLatino(date);
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

    cancelOrder(orderId) {
        const orderIndex = this.orders.findIndex(order => order.id === orderId);
        if (orderIndex === -1) return false;

        const cancelledOrder = this.orders[orderIndex];
        this.orders.splice(orderIndex, 1);
        this.saveOrders();
        
        this.updateSalesDataAfterCancellation(cancelledOrder);
        return true;
    }

    updateSalesDataAfterCancellation(order) {
        const orderDate = order.date;
        const salesData = JSON.parse(localStorage.getItem('salesData')) || {};
        
        if (salesData[orderDate]) {
            salesData[orderDate].totalSales -= order.total;
            salesData[orderDate].totalOrders -= 1;
            
            order.items.forEach(item => {
                const productKey = `${item.productName}-${item.serviceType}`;
                if (salesData[orderDate].products[productKey]) {
                    salesData[orderDate].products[productKey].quantity -= item.quantity;
                    salesData[orderDate].products[productKey].total -= item.total;
                    
                    if (salesData[orderDate].products[productKey].quantity <= 0) {
                        delete salesData[orderDate].products[productKey];
                    }
                }
            });
            
            localStorage.setItem('salesData', JSON.stringify(salesData));
        }
    }
}