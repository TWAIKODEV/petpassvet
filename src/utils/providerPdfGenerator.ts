import { jsPDF } from 'jspdf';

interface ProviderData {
  name: string;
  type: string;
  contact: {
    name: string;
    position: string;
    email: string;
    phone: string;
    mobile: string;
  };
  company: {
    cif: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    website: string;
  };
  billing: {
    paymentMethod: string;
    bankAccount: string;
    vatNumber: string;
    currency: string;
    paymentTerms: string;
    minimumOrder: number;
  };
  deliveryTerms: {
    shippingMethod: string;
    deliveryTime: string;
    shippingCost: number;
    freeShippingThreshold: number;
    returnPolicy: string;
  };
  notes?: string;
}

export const generateProviderPDF = (data: ProviderData): jsPDF => {
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

  // Provider Title
  doc.setFontSize(16);
  addText('FICHA DE PROVEEDOR', 20, 60);

  // Provider Info
  let yPos = 80;
  doc.setFontSize(12);
  addText('Información General', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  addText(`Nombre: ${data.name}`, 20, yPos);
  yPos += 6;
  addText(`Tipo: ${data.type}`, 20, yPos);
  yPos += 6;
  addText(`CIF: ${data.company.cif}`, 20, yPos);

  // Contact Info
  yPos += 15;
  doc.setFontSize(12);
  addText('Información de Contacto', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  addText(`Contacto: ${data.contact.name}`, 20, yPos);
  yPos += 6;
  addText(`Cargo: ${data.contact.position}`, 20, yPos);
  yPos += 6;
  addText(`Email: ${data.contact.email}`, 20, yPos);
  yPos += 6;
  addText(`Teléfono: ${data.contact.phone}`, 20, yPos);
  yPos += 6;
  addText(`Móvil: ${data.contact.mobile}`, 20, yPos);

  // Company Info
  yPos += 15;
  doc.setFontSize(12);
  addText('Dirección', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  addText(`${data.company.address}`, 20, yPos);
  yPos += 6;
  addText(`${data.company.postalCode} ${data.company.city}`, 20, yPos);
  yPos += 6;
  addText(`${data.company.country}`, 20, yPos);
  yPos += 6;
  addText(`Web: ${data.company.website}`, 20, yPos);

  // Billing Info
  yPos += 15;
  doc.setFontSize(12);
  addText('Información de Facturación', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  addText(`Método de pago: ${data.billing.paymentMethod}`, 20, yPos);
  yPos += 6;
  addText(`Cuenta bancaria: ${data.billing.bankAccount}`, 20, yPos);
  yPos += 6;
  addText(`NIF/CIF IVA: ${data.billing.vatNumber}`, 20, yPos);
  yPos += 6;
  addText(`Moneda: ${data.billing.currency}`, 20, yPos);
  yPos += 6;
  addText(`Condiciones de pago: ${data.billing.paymentTerms}`, 20, yPos);
  yPos += 6;
  addText(`Pedido mínimo: ${data.billing.minimumOrder.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  })}`, 20, yPos);

  // Delivery Terms
  yPos += 15;
  doc.setFontSize(12);
  addText('Condiciones de Envío', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  addText(`Método de envío: ${data.deliveryTerms.shippingMethod}`, 20, yPos);
  yPos += 6;
  addText(`Tiempo de entrega: ${data.deliveryTerms.deliveryTime}`, 20, yPos);
  yPos += 6;
  addText(`Gastos de envío: ${data.deliveryTerms.shippingCost.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  })}`, 20, yPos);
  yPos += 6;
  addText(`Envío gratuito a partir de: ${data.deliveryTerms.freeShippingThreshold.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  })}`, 20, yPos);
  yPos += 6;
  addText(`Política de devoluciones: ${data.deliveryTerms.returnPolicy}`, 20, yPos);

  // Notes
  if (data.notes) {
    yPos += 15;
    doc.setFontSize(12);
    addText('Notas', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    addText(data.notes, 20, yPos);
  }

  return doc;
};

export const generateProviderExcel = (data: ProviderData): Blob => {
  // Create workbook
  const workbook = {
    SheetNames: ['Información General'],
    Sheets: {
      'Información General': {
        '!ref': 'A1:B20',
        'A1': { v: 'Nombre', t: 's' },
        'B1': { v: data.name, t: 's' },
        'A2': { v: 'Tipo', t: 's' },
        'B2': { v: data.type, t: 's' },
        'A3': { v: 'CIF', t: 's' },
        'B3': { v: data.company.cif, t: 's' },
        'A4': { v: 'Contacto', t: 's' },
        'B4': { v: data.contact.name, t: 's' },
        'A5': { v: 'Cargo', t: 's' },
        'B5': { v: data.contact.position, t: 's' },
        'A6': { v: 'Email', t: 's' },
        'B6': { v: data.contact.email, t: 's' },
        'A7': { v: 'Teléfono', t: 's' },
        'B7': { v: data.contact.phone, t: 's' },
        'A8': { v: 'Móvil', t: 's' },
        'B8': { v: data.contact.mobile, t: 's' },
        'A9': { v: 'Dirección', t: 's' },
        'B9': { v: data.company.address, t: 's' },
        'A10': { v: 'Ciudad', t: 's' },
        'B10': { v: `${data.company.postalCode} ${data.company.city}`, t: 's' },
        'A11': { v: 'País', t: 's' },
        'B11': { v: data.company.country, t: 's' },
        'A12': { v: 'Web', t: 's' },
        'B12': { v: data.company.website, t: 's' },
        'A13': { v: 'Método de pago', t: 's' },
        'B13': { v: data.billing.paymentMethod, t: 's' },
        'A14': { v: 'Cuenta bancaria', t: 's' },
        'B14': { v: data.billing.bankAccount, t: 's' },
        'A15': { v: 'NIF/CIF IVA', t: 's' },
        'B15': { v: data.billing.vatNumber, t: 's' },
        'A16': { v: 'Condiciones de pago', t: 's' },
        'B16': { v: data.billing.paymentTerms, t: 's' },
        'A17': { v: 'Pedido mínimo', t: 'n' },
        'B17': { v: data.billing.minimumOrder, t: 'n' },
        'A18': { v: 'Método de envío', t: 's' },
        'B18': { v: data.deliveryTerms.shippingMethod, t: 's' },
        'A19': { v: 'Tiempo de entrega', t: 's' },
        'B19': { v: data.deliveryTerms.deliveryTime, t: 's' },
        'A20': { v: 'Notas', t: 's' },
        'B20': { v: data.notes || '', t: 's' }
      }
    }
  };

  // Convert to blob
  const s2ab = (s: string) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  };

  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
  return new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
};