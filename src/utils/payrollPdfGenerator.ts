import { jsPDF } from 'jspdf';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  startDate: string;
  salary: {
    gross: number;
    socialSecurity: number;
    net: number;
    totalCost: number;
  };
  schedule: {
    hours: number;
    shifts: string[];
  };
  status: 'active' | 'inactive';
}

export const generatePayrollPDF = (data: StaffMember): jsPDF => {
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

  // Document Title
  doc.setFontSize(16);
  addText('NÓMINA', 150, 20);
  
  doc.setFontSize(10);
  addText(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 150, 30);

  // Employee Info
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 60, 170, 40, 'F');
  
  doc.setFontSize(12);
  addText('Datos del Empleado', 25, 70);
  
  doc.setFontSize(10);
  addText(`Nombre: ${data.name}`, 25, 80);
  addText(`Puesto: ${data.role}`, 25, 85);
  addText(`Departamento: ${data.department}`, 25, 90);
  addText(`Fecha de Alta: ${new Date(data.startDate).toLocaleDateString('es-ES')}`, 25, 95);

  // Schedule Info
  doc.setFontSize(12);
  addText('Horario Laboral', 25, 115);
  
  doc.setFontSize(10);
  addText(`Horas Semanales: ${data.schedule.hours}`, 25, 125);
  addText(`Días: ${data.schedule.shifts[0]}`, 25, 130);
  addText(`Horario: ${data.schedule.shifts[1]}`, 25, 135);

  // Salary Details
  let yPos = 155;
  doc.setFontSize(12);
  addText('Desglose de Nómina', 25, yPos);
  yPos += 10;

  // Gross Salary
  doc.setFontSize(10);
  addText('Salario Bruto:', 25, yPos);
  addText(data.salary.gross.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }), 120, yPos);
  
  yPos += 8;
  addText('Salario Base:', 35, yPos);
  addText((data.salary.gross * 0.8).toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }), 120, yPos);
  
  yPos += 8;
  addText('Complementos:', 35, yPos);
  addText((data.salary.gross * 0.2).toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }), 120, yPos);

  // Deductions
  yPos += 15;
  addText('Deducciones:', 25, yPos);
  addText(`-${(data.salary.gross - data.salary.net).toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  })}`, 120, yPos);
  
  yPos += 8;
  addText('IRPF (19%):', 35, yPos);
  addText(`-${(data.salary.gross * 0.19).toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  })}`, 120, yPos);
  
  yPos += 8;
  addText('Seguridad Social (6.35%):', 35, yPos);
  addText(`-${(data.salary.gross * 0.0635).toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  })}`, 120, yPos);

  // Net Salary
  yPos += 15;
  doc.setFontSize(12);
  addText('Salario Neto:', 25, yPos);
  addText(data.salary.net.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }), 120, yPos);

  // Company Cost
  yPos += 20;
  doc.setFontSize(10);
  addText('Coste Empresa:', 25, yPos);
  addText(data.salary.totalCost.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }), 120, yPos);
  
  yPos += 8;
  addText('Seguridad Social Empresa (30%):', 35, yPos);
  addText(data.salary.socialSecurity.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }), 120, yPos);

  // Footer
  doc.setFontSize(8);
  addText('Este documento es meramente informativo y no constituye una nómina oficial.', 20, 270);
  addText('Para cualquier aclaración, contacte con el departamento de Recursos Humanos.', 20, 275);

  return doc;
};