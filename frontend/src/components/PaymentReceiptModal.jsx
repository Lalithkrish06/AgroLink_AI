import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, Download, Printer, ShieldCheck, Sprout, Phone } from 'lucide-react';

const PaymentReceiptModal = ({ transaction, onClose }) => {
  const { t, getCropName } = useLanguage();
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Generate printable print window or PDF file trigger
    const printContent = document.getElementById('printable-receipt');
    const win = window.open('', '', 'height=800,width=700');
    win.document.write('<html><head><title>AgroLink_Payment_Receipt_' + (transaction.transactionId || 'AGRO-2026-001') + '</title>');
    win.document.write('<style>');
    win.document.write(`
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #0F172A; }
      .card { border: 2px solid #166534; padding: 30px; border-radius: 12px; max-width: 650px; margin: 0 auto; background: #fff; }
      .header { text-align: center; border-bottom: 2px solid #166534; padding-bottom: 15px; margin-bottom: 20px; }
      .header h1 { color: #064E3B; margin: 0; font-size: 26px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
      .box { background: #F8FAFC; padding: 12px; border-radius: 8px; border: 1px solid #E2E8F0; }
      .box-title { font-size: 11px; font-weight: bold; color: #64748B; text-transform: uppercase; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      th, td { padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: left; font-size: 14px; }
      th { background: #F1F5F9; font-weight: bold; }
      .total-row { background: #DCFCE7; font-weight: bold; color: #166534; font-size: 16px; }
      .stamp { background: #F0FDF4; border: 1px solid #86EFAC; padding: 12px; text-align: center; font-weight: bold; color: #166534; border-radius: 8px; margin-top: 15px; }
      .no-print { display: none !important; }
    `);
    win.document.write('</style></head><body>');
    win.document.write(printContent.outerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
    }, 500);
  };

  const currentDate = transaction.completedAt || transaction.createdAt || new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const grossAmount = Number(transaction.grossAmount || (transaction.agreedPrice * transaction.quantity)) || 35000;
  const transportCost = Number(transaction.transportCost) || 1800;
  const platformFee = Number(transaction.platformFee) || Math.round(grossAmount * 0.02);
  const otherCharges = Number(transaction.otherCharges) || 100;
  const finalNetPayment = Number(transaction.finalNetPayment) || (grossAmount - transportCost - platformFee - otherCharges);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1rem'
      }}
    >
      <div
        className="card"
        id="printable-receipt"
        style={{
          maxWidth: '680px',
          width: '100%',
          padding: '2.25rem',
          marginBottom: 0,
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <button
          onClick={onClose}
          className="no-print"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', borderBottom: '2.5px solid var(--primary-green)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--primary-dark)', fontSize: '1.6rem', fontWeight: 800 }}>
            <Sprout size={28} style={{ color: 'var(--primary-green)' }} /> Agro Link Market
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-green)', textTransform: 'uppercase', marginTop: '0.2rem', letterSpacing: '0.05em' }}>
            OFFICIAL FARMER PAYMENT & TRANSACTION RECEIPT
          </div>
        </div>

        {/* Txn ID & Date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem', background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <div>Transaction ID: <strong style={{ color: 'var(--text-dark)' }}>{transaction.transactionId || 'AGRO-2026-001'}</strong></div>
          <div>Date: <strong style={{ color: 'var(--text-dark)' }}>{String(currentDate)}</strong></div>
        </div>

        {/* Parties Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          {/* Farmer */}
          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>FARMER DETAILS (farmerUserId)</div>
            <div style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '0.98rem', marginTop: '0.2rem' }}>
              {transaction.farmerName || 'Farmer'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem' }}>
              <Phone size={14} /> {transaction.farmerPhone || transaction.farmerMobile || '+91 9876543210'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              User ID: <code>{transaction.farmerUserId || transaction.farmerId || 'farmer_01'}</code>
            </div>
          </div>

          {/* Buyer */}
          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>BUYER DETAILS (buyerUserId)</div>
            <div style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '0.98rem', marginTop: '0.2rem' }}>
              {transaction.buyerName || 'Buyer Market'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem' }}>
              <Phone size={14} /> {transaction.buyerPhone || transaction.buyerMobile || '+91 9876543211'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              Market: {transaction.buyerMarketName || transaction.marketName || 'APMC Wholesale Yard'}
            </div>
          </div>
        </div>

        {/* Crop Details Table */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            CROP HARVEST SPECIFICATIONS
          </div>
          <table className="custom-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Crop Name</th>
                <th>Quantity</th>
                <th>Quality Grade</th>
                <th>Agreed Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{getCropName(transaction.cropName || 'Tomato')}</strong></td>
                <td>{transaction.quantity || 1000} {transaction.unit || 'kg'}</td>
                <td>{transaction.qualityGrade || 'Grade A'}</td>
                <td>₹{transaction.agreedPrice || 35} / {transaction.unit || 'kg'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Summary Breakdown Table */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            PAYMENT BREAKDOWN & NET CALCULATION
          </div>
          <table className="custom-table" style={{ margin: 0 }}>
            <tbody>
              <tr>
                <td style={{ color: 'var(--text-muted)' }}>Gross Product Amount (Agreed Price × Quantity)</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{grossAmount.toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)' }}>Transport Cost ({transaction.transportDistance || transaction.distance || 45} km)</td>
                <td style={{ textAlign: 'right', color: '#DC2626' }}>- ₹{transportCost.toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)' }}>Platform Fee (2%)</td>
                <td style={{ textAlign: 'right', color: '#DC2626' }}>- ₹{platformFee.toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)' }}>Other Charges (APMC Cess / Handling)</td>
                <td style={{ textAlign: 'right', color: '#DC2626' }}>- ₹{otherCharges.toLocaleString()}</td>
              </tr>
              <tr style={{ background: '#DCFCE7' }}>
                <td style={{ fontWeight: 900, color: '#166534', fontSize: '1.05rem' }}>FINAL NET PAYMENT TO FARMER</td>
                <td style={{ textAlign: 'right', fontWeight: 900, color: '#166534', fontSize: '1.35rem' }}>
                  ₹{finalNetPayment.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Status Stamp & Verification */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F0FDF4', border: '1.5px solid #86EFAC', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>PAYMENT STATUS</div>
            <div style={{ fontWeight: 800, color: '#15803D', fontSize: '1rem' }}>
              {transaction.paymentStatus === 'Completed' || transaction.paymentStatus === 'PAYMENT_COMPLETED' ? 'PAYMENT_COMPLETED' : 'PAYMENT_PROCESSING'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#166534', fontSize: '0.85rem', fontWeight: 800 }}>
            <ShieldCheck size={20} /> Verified by Agro Link Market Platform
          </div>
        </div>

        {/* Actions */}
        <div className="no-print" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} /> Print Receipt
          </button>
          <button className="btn btn-primary" onClick={handleDownloadPDF}>
            <Download size={16} /> Download Receipt (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptModal;
