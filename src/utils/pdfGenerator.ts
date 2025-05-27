import { jsPDF } from 'jspdf';

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientAddress: string;
  clientNif: string;
  clientEmail: string;
  clientPhone: string;
  items: Array<{
    description: string;
    area: string;
    amount: number;
  }>;
  paymentMethod: string;
  notes?: string;
}

interface BudgetData {
  budgetNumber: string;
  date: string;
  validUntil: string;
  clientName: string;
  clientAddress: string;
  clientNif: string;
  clientEmail: string;
  clientPhone: string;
  items: Array<{
    description: string;
    area: string;
    amount: number;
    discount?: number;
  }>;
  notes?: string;
}

interface PrescriptionData {
  prescriptionNumber: string;
  date: string;
  patientName: string;
  petName: string;
  petDetails: string;
  diagnosis: string;
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
  }>;
  notes?: string;
  doctor: string;
  clinic: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  qrData?: string;
}

interface TicketData {
  date: string;
  clientName: string;
  items: Array<{
    description: string;
    amount: number;
  }>;
  paymentMethod: string;
  professional: string;
}

export const generateInvoicePDF = (data: InvoiceData): jsPDF => {
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
  addText('Email: facturacion@clinicpro.com', 20, 50);

  // Invoice Details
  doc.setFontSize(16);
  addText('FACTURA', 150, 20);

  doc.setFontSize(10);
  addText(`Nº: ${data.invoiceNumber}`, 150, 30);
  addText(`Fecha: ${data.date}`, 150, 35);

  // Client Details
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 60, 170, 35, 'F');

  doc.setFontSize(12);
  addText('Datos del Cliente', 25, 70);

  doc.setFontSize(10);
  addText(data.clientName, 25, 80);
  addText(data.clientAddress, 25, 85);
  addText(`NIF/CIF: ${data.clientNif}`, 25, 90);

  addText(data.clientEmail, 120, 80);
  addText(data.clientPhone, 120, 85);

  // Table Header
  const tableTop = 105;
  doc.setFillColor(240, 240, 240);
  doc.rect(20, tableTop, 170, 8, 'F');

  doc.setFontSize(10);
  addText('Descripción', 25, tableTop + 6);
  addText('Base Imponible', 100, tableTop + 6);
  addText('IVA (21%)', 130, tableTop + 6);
  addText('Total', 160, tableTop + 6);

  // Table Content
  let yPos = tableTop + 15;
  data.items.forEach(item => {
    addText(item.description, 25, yPos);
    addText(`Área: ${item.area}`, 25, yPos + 5, { fontSize: 8 });

    const baseAmount = item.amount.toLocaleString('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    });
    addText(baseAmount, 100, yPos, { align: 'right' });

    const tax = (item.amount * 0.21).toLocaleString('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    });
    addText(tax, 130, yPos, { align: 'right' });

    const total = (item.amount * 1.21).toLocaleString('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    });
    addText(total, 160, yPos, { align: 'right' });

    yPos += 15;
  });

  // Total
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);

  yPos += 10;
  doc.setFontSize(12);
  addText('Total:', 130, yPos);
  const grandTotal = (data.items.reduce((sum, item) => sum + item.amount, 0) * 1.21)
    .toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  addText(grandTotal, 160, yPos, { align: 'right' });

  // Payment Info
  yPos += 20;
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPos, 170, 15, 'F');

  doc.setFontSize(10);
  addText('Información de Pago', 25, yPos + 5);
  addText(`Método de pago: ${data.paymentMethod}`, 25, yPos + 10);

  // Notes
  if (data.notes) {
    yPos += 25;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, 170, 20, 'F');

    addText('Notas:', 25, yPos + 5);
    addText(data.notes, 25, yPos + 10);
  }

  // Footer
  doc.setFontSize(8);
  addText('Esta factura sirve como justificante de pago.', 20, 270);
  addText('IVA incluido según la legislación vigente.', 20, 275);

  return doc;
};

export const generateBudgetPDF = (data: BudgetData): jsPDF => {
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
  addText('Email: info@clinicpro.com', 20, 50);

  // Budget Details
  doc.setFontSize(16);
  addText('PRESUPUESTO', 150, 20);

  doc.setFontSize(10);
  addText(`Nº: ${data.budgetNumber}`, 150, 30);
  addText(`Fecha: ${data.date}`, 150, 35);
  addText(`Válido hasta: ${data.validUntil}`, 150, 40);

  // Client Details
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 60, 170, 35, 'F');

  doc.setFontSize(12);
  addText('Datos del Cliente', 25, 70);

  doc.setFontSize(10);
  addText(data.clientName, 25, 80);
  addText(data.clientAddress, 25, 85);
  addText(`NIF/CIF: ${data.clientNif}`, 25, 90);

  addText(data.clientEmail, 120, 80);
  addText(data.clientPhone, 120, 85);

  // Table Header
  const tableTop = 105;
  doc.setFillColor(240, 240, 240);
  doc.rect(20, tableTop, 170, 8, 'F');

  doc.setFontSize(10);
  addText('Descripción', 25, tableTop + 6);
  addText('Precio', 100, tableTop + 6);
  addText('Descuento', 125, tableTop + 6);
  addText('Base Imponible', 150, tableTop + 6);
  addText('IVA (21%)', 175, tableTop + 6);

  // Table Content
  let yPos = tableTop + 15;
  let totalBase = 0;
  let totalTax = 0;

  data.items.forEach(item => {
    addText(item.description, 25, yPos);
    addText(`Área: ${item.area}`, 25, yPos + 5, { fontSize: 8 });

    const price = item.amount.toLocaleString('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    });
    addText(price, 100, yPos, { align: 'right' });

    // Calculate discount if applicable
    let discountText = '0%';
    let baseAmount = item.amount;

    if (item.discount && item.discount > 0) {
      discountText = `${item.discount}%`;
      const discountAmount = item.amount * (item.discount / 100);
      baseAmount = item.amount - discountAmount;
    }

    addText(discountText, 125, yPos, { align: 'right' });

    const baseAmountText = baseAmount.toLocaleString('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    });
    addText(baseAmountText, 150, yPos, { align: 'right' });

    const tax = (baseAmount * 0.21).toLocaleString('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    });
    addText(tax, 175, yPos, { align: 'right' });

    totalBase += baseAmount;
    totalTax += baseAmount * 0.21;

    yPos += 15;
  });

  // Total
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);

  yPos += 10;
  doc.setFontSize(10);
  addText('Base Imponible:', 130, yPos);
  addText(totalBase.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), 175, yPos, { align: 'right' });

  yPos += 8;
  addText('IVA (21%):', 130, yPos);
  addText(totalTax.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), 175, yPos, { align: 'right' });

  yPos += 10;
  doc.setLineWidth(0.5);
  doc.line(130, yPos, 190, yPos);

  yPos += 8;
  doc.setFontSize(12);
  addText('Total:', 130, yPos);
  const grandTotal = (totalBase + totalTax).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  addText(grandTotal, 175, yPos, { align: 'right' });

  // Notes
  if (data.notes) {
    yPos += 25;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, 170, 20, 'F');

    doc.setFontSize(10);
    addText('Notas:', 25, yPos + 5);
    addText(data.notes, 25, yPos + 10);
  }

  // Footer
  doc.setFontSize(8);
  addText('Este presupuesto tiene validez hasta la fecha indicada.', 20, 270);
  addText('Los precios incluyen IVA según la legislación vigente.', 20, 275);
  addText('El presupuesto no supone compromiso de reserva.', 20, 280);

  return doc;
};

export const generateTicketPDF = (data: TicketData): jsPDF => {
  // Create PDF in a smaller format suitable for tickets
  const doc = new jsPDF({
    format: [80, 200], // 80mm width
    unit: 'mm'
  });

  // Helper function to add centered text
  const addCenteredText = (text: string, y: number, size: number = 10) => {
    doc.setFontSize(size);
    const textWidth = doc.getStringUnitWidth(text) * size / doc.internal.scaleFactor;
    const x = (80 - textWidth) / 2;
    doc.text(text, x, y);
  };

  // Helper function to add left-aligned text
  const addText = (text: string, x: number, y: number, size: number = 10) => {
    doc.setFontSize(size);
    doc.text(text, x, y);
  };

  // Header
  addCenteredText('ClinicPro', 10, 14);
  addCenteredText('Calle de Beatriz de Bobadilla, 9', 15, 8);
  addCenteredText('28040 Madrid', 19, 8);
  addCenteredText('CIF: B12345678', 23, 8);
  addCenteredText('Tel: +34 912 345 678', 27, 8);

  // Divider
  doc.line(5, 30, 75, 30);

  // Ticket Details
  let yPos = 35;
  addText(`Fecha: ${data.date}`, 5, yPos, 8);
  yPos += 4;
  addText(`Cliente: ${data.clientName}`, 5, yPos, 8);
  yPos += 4;
  addText(`Atendido por: ${data.professional}`, 5, yPos, 8);

  // Divider
  yPos += 4;
  doc.line(5, yPos, 75, yPos);
  yPos += 6;

  // Items
  addText('CONCEPTO', 5, yPos, 8);
  addText('IMPORTE', 60, yPos, 8);
  yPos += 4;
  doc.line(5, yPos, 75, yPos);
  yPos += 6;

  let total = 0;
  data.items.forEach(item => {
    // Handle long descriptions
    const description = item.description;
    if (doc.getStringUnitWidth(description) * 8 / doc.internal.scaleFactor > 40) {
      const words = description.split(' ');
      let line = '';
      words.forEach(word => {
        if (doc.getStringUnitWidth((line + ' ' + word).trim()) * 8 / doc.internal.scaleFactor <= 40) {
          line = (line + ' ' + word).trim();
        } else {
          addText(line, 5, yPos, 8);
          yPos += 4;
          line = word;
        }
      });
      if (line) {
        addText(line, 5, yPos, 8);
      }
    } else {
      addText(description, 5, yPos, 8);
    }

    const amount = item.amount.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR'
    });
    addText(amount, 60, yPos, 8);
    yPos += 6;

    total += item.amount;
  });

  // Divider
  doc.line(5, yPos, 75, yPos);
  yPos += 6;

  // Total
  const totalText = total.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  });
  addText('TOTAL:', 5, yPos, 10);
  addText(totalText, 60, yPos, 10);

  // Payment Method
  yPos += 8;
  addText(`Forma de pago: ${data.paymentMethod}`, 5, yPos, 8);

  // Footer
  yPos += 8;
  doc.line(5, yPos, 75, yPos);
  yPos += 4;
  addCenteredText('¡Gracias por su visita!', yPos, 8);
  yPos += 4;
  addCenteredText('www.clinicpro.com', yPos, 8);

  return doc;
};

export const generatePrescriptionPDF = (data: PrescriptionData) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('RECETA VETERINARIA', 105, 30, { align: 'center' });

  // Clinic info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Clínica Veterinaria • Tel: 91 123 45 67 • Email: info@clinica.com', 105, 40, { align: 'center' });

  // Prescription details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Datos de la Receta', 20, 60);

  doc.setFont('helvetica', 'normal');
  doc.text(`Número: ${data.prescriptionNumber}`, 20, 70);
  doc.text(`Fecha: ${data.date}`, 20, 80);
  doc.text(`Veterinario: ${data.doctor}`, 20, 90);

  // Patient details
  doc.setFont('helvetica', 'bold');
  doc.text('Datos del Paciente', 110, 60);

  doc.setFont('helvetica', 'normal');
  doc.text(`Paciente: ${data.petName}`, 110, 70);
  doc.text(`Especie: ${data.petDetails}`, 110, 80);
  doc.text(`Raza: ${data.petDetails}`, 110, 90);
  doc.text(`Propietario: ${data.patientName}`, 110, 100);

  // Medications
  let yPos = 120;
  doc.setFont('helvetica', 'bold');
  doc.text('Medicamentos Prescritos', 20, yPos);
  yPos += 10;

  data.medications.forEach((med, index) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${med.name}`, 20, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'normal');
    doc.text(`Dosis: ${med.dosage}`, 25, yPos);
    doc.text(`Frecuencia: ${med.frequency}`, 25, yPos + 6);
    doc.text(`Duración: ${med.duration}`, 25, yPos + 12);

    if (med.notes) {
      doc.text(`Instrucciones: ${med.notes}`, 25, yPos + 18);
      yPos += 24;
    } else {
      yPos += 18;
    }
    yPos += 5;
  });

  // Notes
  if (data.notes) {
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Notas Adicionales', 20, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(data.notes, 20, yPos);
  }

  // Footer
  const footerY = 250;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Esta receta es válida únicamente para el paciente especificado.', 105, footerY, { align: 'center' });

  return doc;
}