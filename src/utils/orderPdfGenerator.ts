import { jsPDF } from 'jspdf';

interface OrderData {
  id: string;
  date: string;
  status: string;
  items: Array<{
    reference: string;
    name: string;
    quantity: number;
    price: number;
    discount: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  deliveryDate: string;
  notes?: string;
}

export const generateOrderPDF = (data: OrderData): jsPDF => {
  const doc = new jsPDF();
  
  // Helper function to add text with proper encoding
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    doc.text(text, x, y, options);
  };

  // Company Header
  doc.setFontSize(22);
  addText('ClinicPro', 20, 20);
  
  doc.setFontSize(10);
  addText('Calle de Beatriz de Bobadilla, 9', 20, 30);
  addText('28040 Madrid', 20, 35);
  addText('CIF: B12345678', 20, 40);
  addText('Tel: +34 912 345 678', 20, 45);

  // Order Details
  doc.setFontSize(16);
  addText('PEDIDO', 150, 20);
  
  doc.setFontSize(10);
  addText(`Nº: ${data.id}`, 150, 30);
  addText(`Fecha: ${new Date(data.date).toLocaleDateString('es-ES')}`, 150, 35);
  addText(`Estado: ${data.status === 'delivered' ? 'Entregado' : 'En Proceso'}`, 150, 40);

  // Table Header
  const tableTop = 60;
  doc.setFillColor(240, 240, 240);
  doc.rect(20, tableTop, 170, 8, 'F');
  
  doc.setFontSize(8);
  addText('Referencia', 25, tableTop + 6);
  addText('Producto', 60, tableTop + 6);
  addText('Cantidad', 100, tableTop + 6);
  addText('Precio', 120, tableTop + 6);
  addText('Dto.', 140, tableTop + 6);
  addText('Total', 160, tableTop + 6);

  // Table Content
  let yPos = tableTop + 15;
  data.items.forEach(item => {
    doc.setFontSize(8);
    addText(item.reference, 25, yPos);
    addText(item.name, 60, yPos);
    addText(item.quantity.toString(), 100, yPos);
    
    const price = item.price.toLocaleString('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    });
    addText(price, 120, yPos);
    
    addText(`${item.discount}%`, 140, yPos);
    
    const total = item.total.toLocaleString('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    });
    addText(total, 160, yPos);
    
    yPos += 10;
  });

  // Summary
  yPos += 10;
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  doc.setFontSize(10);
  const summaryX = 120;
  addText('Subtotal:', summaryX, yPos);
  addText(data.subtotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), 160, yPos);
  
  yPos += 8;
  addText('IVA (21%):', summaryX, yPos);
  addText(data.tax.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), 160, yPos);
  
  yPos += 8;
  addText('Gastos de envío:', summaryX, yPos);
  addText(data.shipping.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), 160, yPos);
  
  yPos += 10;
  doc.line(summaryX, yPos, 190, yPos);
  yPos += 8;
  
  doc.setFontSize(12);
  addText('Total:', summaryX, yPos);
  addText(data.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), 160, yPos);

  // Delivery Info
  yPos += 20;
  doc.setFontSize(10);
  addText('Información de Entrega', 20, yPos);
  yPos += 8;
  addText(`Fecha de entrega: ${new Date(data.deliveryDate).toLocaleDateString('es-ES')}`, 20, yPos);
  yPos += 6;
  addText(`Método de pago: ${data.paymentMethod}`, 20, yPos);

  if (data.notes) {
    yPos += 15;
    addText('Notas:', 20, yPos);
    yPos += 6;
    addText(data.notes, 20, yPos);
  }

  return doc;
};