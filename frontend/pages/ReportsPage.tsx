import React, { useState } from 'react';
import { User } from '../types';
import { useManagerMetrics } from '../hooks/useManagerMetrics';
import { ICONS } from '../constants';

// Define props to accept the user
interface ReportsPageProps {
  user: User;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const metrics = useManagerMetrics();

  const handleGenerateReport = () => {
    setIsLoading(true);
    
    try {
      // Access jspdf from the window object
      const { jsPDF } = (window as any).jspdf;
      if (!jsPDF) {
        throw new Error("jsPDF not loaded");
      }
      const doc = new jsPDF();

      // 1. Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('SmartShelf Manager Report', 105, 20, { align: 'center' });

      // 2. Report Info
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`Generated for: ${user.name}`, 20, 40);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 47);

      // 3. KPI Summary
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('KPI Summary', 20, 65);
      
      const kpiData = [
        ['Pending Tasks', metrics.pendingTasks],
        ['Total Inventory Items', metrics.totalItems],
        ['Active Workers', metrics.workersOnline],
        ['Order Completion Rate', metrics.orderCompletionRate],
        ['Low Stock Alerts', metrics.lowStockAlertCount],
        ['Expiring Soon Alerts', metrics.expiringSoonAlertCount],
      ];
      
      (doc as any).autoTable({
        startY: 70,
        head: [['Metric', 'Value']],
        body: kpiData,
        theme: 'striped',
        headStyles: { fillColor: '#4f46e5' },
      });
      
      let finalY = (doc as any).lastAutoTable.finalY || 120;

      // 4. Low Stock Table
      if (metrics.lowStockItems.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Low Stock Items', 20, finalY + 15);
        
        const lowStockBody = metrics.lowStockItems.map(item => [
          item.productName,
          item.sku,
          item.quantity,
          item.supplier
        ]);
        
        (doc as any).autoTable({
          startY: finalY + 20,
          head: [['Product', 'SKU', 'Quantity', 'Supplier']],
          body: lowStockBody,
          theme: 'striped',
          headStyles: { fillColor: '#ef4444' },
        });
        finalY = (doc as any).lastAutoTable.finalY;
      }

      // 5. Expiring Soon Table
      if (metrics.expiringSoonItems.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Items Nearing Expiry (FEFO)', 20, finalY + 15);
        
        const expiringBody = metrics.expiringSoonItems.map(item => [
          item.productName,
          item.sku,
          `${item.daysLeft} ${item.daysLeft === 1 ? 'day' : 'days'}`,
          item.quantity
        ]);
        
        (doc as any).autoTable({
          startY: finalY + 20,
          head: [['Product', 'SKU', 'Expires In', 'Quantity']],
          body: expiringBody,
          theme: 'striped',
          headStyles: { fillColor: '#f59e0b' },
        });
      }

      // 6. Save PDF
      doc.save(`SmartShelf_Report_${user.name.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Make sure PDF libraries are loaded.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-heading">Reports</h1>
      <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-sm border border-border-light dark:border-border-dark text-center">
        
        <h2 className="text-2xl font-bold mb-4 font-heading">Generate Compliance Reports</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
          Select a report type and date range to generate and view compliance and historical data reports.
        </p>
        <button 
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-hover transition-colors duration-300 flex items-center justify-center gap-2 w-64 mx-auto disabled:opacity-50"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <ICONS.Reports className="w-5 h-5" />
          )}
          <span>{isLoading ? 'Generating...' : 'Generate New Report'}</span>
        </button>
      </div>
    </div>
  );
};

export default ReportsPage;