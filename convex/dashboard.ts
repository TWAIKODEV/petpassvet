
import { query } from "./_generated/server";

// Get dashboard summary statistics
export const getDashboardSummary = query({
  handler: async (ctx) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's appointments
    const todaysAppointments = await ctx.db
      .query("appointments")
      .withIndex("by_date", (q) => q.eq("date", today))
      .collect();

    // Get this week's appointments
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const allAppointments = await ctx.db.query("appointments").collect();
    const weekAppointments = allAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= weekStart && appointmentDate <= weekEnd;
    });

    // Get total patients
    const patients = await ctx.db.query("patients").collect();

    // Get payments for revenue calculation
    const payments = await ctx.db.query("payments").collect();
    
    const todaysRevenue = payments
      .filter(payment => payment.date === today && payment.status === 'completed')
      .reduce((total, payment) => total + payment.amount, 0);

    const weekRevenue = payments
      .filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= weekStart && paymentDate <= weekEnd && payment.status === 'completed';
      })
      .reduce((total, payment) => total + payment.amount, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthRevenue = payments
      .filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear && 
               payment.status === 'completed';
      })
      .reduce((total, payment) => total + payment.amount, 0);

    return {
      appointmentsToday: todaysAppointments.length,
      appointmentsWeek: weekAppointments.length,
      patientsTotal: patients.length,
      revenueToday: todaysRevenue,
      revenueWeek: weekRevenue,
      revenueMonth: monthRevenue,
    };
  },
});
