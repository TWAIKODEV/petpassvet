
import { jsPDF } from 'jspdf';

export const generatePayrollPDF = (employee: any, payroll: any): void => {
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
  addText(`Nombre: ${employee.firstName} ${employee.lastName}`, 25, 80);
  addText(`Puesto: ${employee.position}`, 25, 85);
  addText(`Departamento: ${employee.department}`, 25, 90);
  addText(`Fecha de Alta: ${new Date(employee.startDate).toLocaleDateString('es-ES')}`, 25, 95);

  // Schedule Info (if available)
  doc.setFontSize(12);
  addText('Información Laboral', 25, 115);
  
  doc.setFontSize(10);
  addText(`Salario Base: ${employee.baseSalary.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`, 25, 125);
  addText(`Tipo de Contrato: ${employee.contractType || 'No especificado'}`, 25, 130);
  addText(`Modalidad: ${employee.workMode === 'onsite' ? 'Presencial' : 
                        employee.workMode === 'remote' ? 'Remoto' : 'Híbrido'}`, 25, 135);

  // Helper function to get period name
  const getPeriodName = (period: number): string => {
    if (period >= 1 && period <= 12) {
      const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      return months[period - 1];
    } else if (period === 13) {
      return 'Paga Extra Verano';
    } else if (period === 14) {
      return 'Paga Extra Navidad';
    }
    return 'Periodo desconocido';
  };

  // Payroll Details
  let yPos = 155;
  doc.setFontSize(12);
  addText('Desglose de Nómina', 25, yPos);
  yPos += 10;

  doc.setFontSize(10);
  addText(`Período: ${getPeriodName(payroll.period)}`, 25, yPos);
  yPos += 8;
  addText(`Fecha de Emisión: ${new Date(payroll.issueDate).toLocaleDateString('es-ES')}`, 25, yPos);
  yPos += 15;

  // Calculate salary breakdown based on base salary
  const grossSalary = employee.baseSalary;
  const irpf = grossSalary * 0.19; // 19% IRPF
  const socialSecurityEmployee = grossSalary * 0.0635; // 6.35% Seguridad Social empleado
  const totalDeductions = irpf + socialSecurityEmployee;
  const netSalary = payroll.netAmount; // Use actual net amount from payroll
  const socialSecurityCompany = grossSalary * 0.30; // 30% Seguridad Social empresa
  const totalCost = grossSalary + socialSecurityCompany;

  // Gross Salary
  addText('Salario Bruto:', 25, yPos);
  addText(grossSalary.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }), 120, yPos);
  
  yPos += 8;
  addText('Salario Base:', 35, yPos);
  addText((grossSalary * 0.8).toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }), 120, yPos);
  
  yPos += 8;
  addText('Complementos:', 35, yPos);
  addText((grossSalary * 0.2).toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }), 120, yPos);

  // Deductions
  yPos += 15;
  addText('Deducciones:', 25, yPos);
  addText(`-${totalDeductions.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  })}`, 120, yPos);
  
  yPos += 8;
  addText('IRPF (19%):', 35, yPos);
  addText(`-${irpf.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  })}`, 120, yPos);
  
  yPos += 8;
  addText('Seguridad Social (6.35%):', 35, yPos);
  addText(`-${socialSecurityEmployee.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  })}`, 120, yPos);

  // Net Salary
  yPos += 15;
  doc.setFontSize(12);
  addText('Salario Neto:', 25, yPos);
  addText(netSalary.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }), 120, yPos);

  // Company Cost
  yPos += 20;
  doc.setFontSize(10);
  addText('Coste Empresa:', 25, yPos);
  addText(totalCost.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }), 120, yPos);
  
  yPos += 8;
  addText('Seguridad Social Empresa (30%):', 35, yPos);
  addText(socialSecurityCompany.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }), 120, yPos);

  // Footer
  doc.setFontSize(8);
  addText('Este documento es meramente informativo y no constituye una nómina oficial.', 20, 270);
  addText('Para cualquier aclaración, contacte con el departamento de Recursos Humanos.', 20, 275);

  // Download/Print the PDF
  doc.save(`nomina_${employee.firstName}_${employee.lastName}_${getPeriodName(payroll.period)}.pdf`);
};
