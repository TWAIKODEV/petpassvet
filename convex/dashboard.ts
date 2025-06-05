
import { query } from "./_generated/server";

// Get dashboard summary statistics
export const getDashboardSummary = query({
  handler: async (ctx) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get appointments for today
    const appointmentsToday = await ctx.db
      .query("appointments")
      .withIndex("by_date", (q) => q.eq("date", today))
      .collect();

    // Get all appointments for week calculation
    const allAppointments = await ctx.db.query("appointments").collect();
    const appointmentsThisWeek = allAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= weekStart;
    });

    // Get total patients
    const allPatients = await ctx.db.query("patients").collect();

    // Get payments for revenue calculation
    const allPayments = await ctx.db.query("payments").collect();
    
    const revenueToday = allPayments
      .filter(payment => payment.date === today && payment.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0);

    const revenueThisWeek = allPayments
      .filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= weekStart && payment.status === 'completed';
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    const revenueThisMonth = allPayments
      .filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= monthStart && payment.status === 'completed';
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      appointmentsToday: appointmentsToday.length,
      appointmentsWeek: appointmentsThisWeek.length,
      patientsTotal: allPatients.length,
      revenueToday,
      revenueWeek: revenueThisWeek,
      revenueMonth: revenueThisMonth,
    };
  },
});
