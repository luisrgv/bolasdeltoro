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
        // Usar fecha/hora de Bogotá/Lima/Quito (UTC-5)
        const now = new Date();
        const bogotaTime = new Date(now.getTime() - (5 * 60 * 60 * 1000)); // UTC-5
        
        const order = {
            id: 'order-' + Date.now(),
            items: [...orderItems],
            total: orderItems.reduce((sum, item) => sum + item.total, 0),
            timestamp: bogotaTime.toISOString(),
            date: this.getBogotaDateString(),
            time: this.getBogotaTimeString(),
            status: 'completed'
        };

        this.orders.push(order);
        this.saveOrders();
        this.updateSalesData(order);
        
        console.log('Pedido guardado:', order);
    }

    // Obtener fecha en formato Latinoamérica (Bogotá/Lima/Quito)
    getBogotaDateString() {
        const now = new Date();
        const bogotaTime = new Date(now.getTime() - (5 * 60 * 60 * 1000));
        return bogotaTime.toLocaleDateString('es', {
            timeZone: 'America/Bogota',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    // Obtener hora en formato Latinoamérica
    getBogotaTimeString() {
        const now = new Date();
        const bogotaTime = new Date(now.getTime() - (5 * 60 * 60 * 1000));
        return bogotaTime.toLocaleTimeString('es', {
            timeZone: 'America/Bogota',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }

    updateSalesData(order) {
        const today = order.date; // Usar la fecha ya corregida
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

    // Formatear fecha para comparación (DD/MM/YYYY)
    formatDateForComparison(dateString) {
        if (!dateString) return '';
        
        // Si es un objeto Date
        if (dateString instanceof Date) {
            return dateString.toLocaleDateString('es', {
                timeZone: 'America/Bogota',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        }
        
        // Si ya es string en formato latino
        if (dateString.includes('/')) {
            return dateString;
        }
        
        // Si viene en formato YYYY-MM-DD (input date)
        if (dateString.includes('-')) {
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        }
        
        return dateString;
    }

    // Convertir fecha de input a formato latino
    formatInputDateToLatino(dateString) {
        if (!dateString) return this.getBogotaDateString();
        
        const date = new Date(dateString);
        return date.toLocaleDateString('es', {
            timeZone: 'America/Bogota',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    // Obtener fecha y hora completas en formato latino
    getFullLatinoDateTime(timestamp) {
        const date = new Date(timestamp);
        const bogotaTime = new Date(date.getTime() - (5 * 60 * 60 * 1000));
        
        return {
            date: bogotaTime.toLocaleDateString('es', {
                timeZone: 'America/Bogota',
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: bogotaTime.toLocaleTimeString('es', {
                timeZone: 'America/Bogota',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }),
            shortDate: bogotaTime.toLocaleDateString('es', {
                timeZone: 'America/Bogota',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
        };
    }

    generateExcelReport(date) {
        const salesData = this.getSalesDataByDate(date);
        const orders = this.getOrdersByDate(date);
        const latinoDate = this.formatInputDateToLatino(date);
        
        // Crear contenido CSV
        let csvContent = "REPORTE DE VENTAS - LAS BOLAS DEL TORO\n";
        csvContent += `Fecha: ${this.getFullLatinoDateTime(new Date(date)).date}\n\n`;
        
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
                const dateTime = this.getFullLatinoDateTime(order.timestamp);
                const itemsSummary = order.items.map(item => 
                    `${item.quantity}x ${item.productName} (${item.serviceType}) - $${item.total.toFixed(2)}`
                ).join('; ');
                
                csvContent += `"${order.id}","${dateTime.shortDate}","${dateTime.time}",$${order.total.toFixed(2)},"${itemsSummary}"\n`;
            });
        
        // Crear y descargar archivo
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
        
        console.log('Reporte exportado:', fileName);
    }

    // Resto de métodos permanecen igual...
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
            const dateTime = this.getFullLatinoDateTime(order.timestamp);
            const hour = dateTime.time.split(':')[0];
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
        const orderDate = order.date; // Usar la fecha ya corregida
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
