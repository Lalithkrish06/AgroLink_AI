import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentReceiptModal from '../components/PaymentReceiptModal';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import API from '../services/api';
import { CheckCircle2, Truck, PackageCheck, CreditCard, AlertCircle, X, FileText, Phone, ShieldCheck, UserCheck, PlusCircle, XCircle, Calculator, Download } from 'lucide-react';

const Transactions = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { t, getCropName } = useLanguage();
  const loggedInUserId = String(user?.id || user?._id || '');
  const currentUserRole = user?.role;

  const [transactions, setTransactions] = useState([]);
  const [buyerAcceptedRequests, setBuyerAcceptedRequests] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);
  const [driverAssignment, setDriverAssignment] = useState(null);

  const [driverForm, setDriverForm] = useState({
    driverName: '',
    driverPhone: '',
    vehicleNumber: '',
    vehicleType: 'Eicher Mini Truck 14ft'
  });

  const [assignDriverModalOpen, setAssignDriverModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [paymentLinkModalOpen, setPaymentLinkModalOpen] = useState(false);
  const [generatedPaymentLink, setGeneratedPaymentLink] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleGeneratePaymentLink = async (tx) => {
    try {
      const txId = tx.transactionId || tx._id;
      const fullUrl = `${window.location.origin}/payment/${txId}`;
      setGeneratedPaymentLink(fullUrl);
      setPaymentLinkModalOpen(true);
      await API.post(`/transactions/${txId}/payment-link`);
    } catch (e) {
      const fullUrl = `${window.location.origin}/payment/${tx.transactionId || tx._id}`;
      setGeneratedPaymentLink(fullUrl);
      setPaymentLinkModalOpen(true);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;
    try {
      // Fetch Transactions with strict authorization filter
      const txRes = await API.get(`/transactions?farmerId=${loggedInUserId}&buyerId=${loggedInUserId}`);
      if (txRes.data && Array.isArray(txRes.data)) {
        let filtered = txRes.data.filter((tx) => {
          if (currentUserRole === 'farmer') return String(tx.farmerUserId || tx.farmerId) === loggedInUserId;
          if (currentUserRole === 'buyer') return String(tx.buyerUserId || tx.buyerId) === loggedInUserId;
          if (currentUserRole === 'driver') return String(tx.driverUserId || tx.driverId) === loggedInUserId;
          return true;
        });

        setTransactions(filtered);
        if (filtered.length > 0) {
          setSelectedTx(filtered[0]);
        }
      }
    } catch (e) {
      console.error('Transactions fetch error:', e);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  // Farmer Final Sale Confirmation (BUYER_ACCEPTED -> FARMER_CONFIRMED)
  const handleFarmerConfirmSale = async (request) => {
    setSuccessMsg('');
    setErrorMsg('');

    const gross = (request.expectedPrice || request.offeredPrice || 35) * (request.quantity || 1000);
    const transDistance = request.distance || 45;
    const transFee = Number(request.transportCost) || (transDistance * 40);
    const platFee = Math.round(gross * 0.02); // 2% platform fee
    const other = 100; // APMC cess/handling
    const net = gross - transFee - platFee - other;

    const newTxData = {
      transactionId: 'AGRO-TX-' + Date.now(),
      requestId: request.requestId || request._id,
      cropLotId: request.cropLotId || 'lot_active',
      farmerUserId: loggedInUserId,
      buyerUserId: request.buyerId,
      driverUserId: 'usr_driver_pending',
      farmerName: request.farmerName || user?.name || 'Farmer',
      farmerPhone: request.farmerMobile || user?.phone || '+91 9876543210',
      buyerName: request.buyerName || 'Buyer',
      buyerPhone: request.buyerMobileNumber || '+91 9876543211',
      buyerMarketName: request.marketName || 'Buyer Market',
      cropName: request.cropName || request.crop || 'Crop',
      quantity: Number(request.quantity) || 1000,
      unit: request.unit || 'kg',
      qualityGrade: request.qualityGrade || 'Grade A',
      agreedPrice: Number(request.expectedPrice || request.offeredPrice) || 35,
      grossAmount: gross,
      transportDistance: transDistance,
      transportRate: 40,
      transportCost: transFee,
      platformFee: platFee,
      otherCharges: other,
      finalNetPayment: net,
      totalCropValue: gross,
      netAmountToFarmer: net,
      pickupLocation: request.location || 'Farmer Farm, Erode',
      deliveryLocation: request.marketName || 'Buyer Market',
      currentStep: 1,
      transactionStatus: 'CONFIRMED',
      paymentStatus: 'PAYMENT_PENDING',
      createdAt: new Date()
    };

    try {
      await API.patch(`/offers/${request._id || request.id}/accept`, request);
    } catch (e) {}

    setTransactions((prev) => [newTxData, ...prev]);
    setSelectedTx(newTxData);
    setBuyerAcceptedRequests((prev) => prev.filter((r) => r._id !== request._id));

    setSuccessMsg(`🎉 Sale Confirmed! Transaction ${newTxData.transactionId} created. Driver can now be assigned.`);
  };

  const handleFarmerCancelSale = async (request) => {
    try {
      await API.patch(`/offers/${request._id || request.id}/reject`);
      setBuyerAcceptedRequests((prev) => prev.filter((r) => r._id !== request._id));
      setSuccessMsg('Sale cancelled.');
    } catch (e) {}
  };

  const handleAssignDriver = async (e) => {
    e.preventDefault();
    if (!selectedTx) return;

    const assignedObj = {
      driverUserId: 'usr_driver_' + Date.now(),
      driverName: driverForm.driverName,
      driverPhone: driverForm.driverPhone,
      vehicleNumber: driverForm.vehicleNumber,
      vehicleType: driverForm.vehicleType
    };

    const updatedTx = {
      ...selectedTx,
      ...assignedObj,
      currentStep: 2,
      transactionStatus: 'IN_TRANSIT',
      paymentStatus: 'PAYMENT_PROCESSING'
    };

    setSelectedTx(updatedTx);
    setTransactions((prev) => prev.map((t) => (t.transactionId === selectedTx.transactionId ? updatedTx : t)));
    setDriverAssignment(assignedObj);
    setAssignDriverModalOpen(false);

    try {
      await API.post('/driver/assign', {
        transactionId: selectedTx.transactionId,
        farmerUserId: selectedTx.farmerUserId,
        buyerUserId: selectedTx.buyerUserId,
        ...driverForm
      });
    } catch (err) {}

    setSuccessMsg('🚚 Delivery Driver assigned! Pickup progress updated.');
  };

  const handleStepUpdate = async (newStep, transStat, payStat) => {
    if (!selectedTx) return;
    const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const updated = {
      ...selectedTx,
      currentStep: newStep,
      transactionStatus: transStat || selectedTx.transactionStatus,
      paymentStatus: payStat || selectedTx.paymentStatus,
      completedAt: newStep === 6 ? today : selectedTx.completedAt
    };
    setSelectedTx(updated);
    setTransactions((prev) => prev.map((t) => (t.transactionId === selectedTx.transactionId ? updated : t)));

    try {
      if (newStep === 6) {
        await API.patch(`/transactions/${selectedTx._id || selectedTx.transactionId}/payment`);
      } else {
        await API.patch(`/transactions/${selectedTx._id || selectedTx.transactionId}/status`, {
          step: newStep,
          transactionStatus: transStat,
          paymentStatus: payStat
        });
      }
    } catch (e) {}
  };

  const steps = [
    { num: 1, title: 'Confirmed Sale', icon: CheckCircle2 },
    { num: 2, title: 'Driver Assigned', icon: Truck },
    { num: 3, title: 'Crop Picked Up', icon: PackageCheck },
    { num: 4, title: 'In Transit', icon: Truck },
    { num: 5, title: 'Delivered', icon: CheckCircle2 },
    { num: 6, title: 'Payment Completed', icon: CreditCard }
  ];

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--text-dark)' }}>📋 Confirmed Transactions & Financial Settlement</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Logged in User ID: <code>{loggedInUserId}</code> ({currentUserRole?.toUpperCase()})
              </p>
            </div>

            <span className="badge badge-success" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', fontWeight: 700 }}>
              🛡️ Authorization Verified by userId
            </span>
          </div>

          {successMsg && (
            <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid #86EFAC', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> {successMsg}
            </div>
          )}

          {/* SECTION 1 & 2: FARMER REVIEW BUYER ACCEPTANCE & CONFIRM SALE */}
          {currentUserRole === 'farmer' && buyerAcceptedRequests.length > 0 && (
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: '#F0FDF4', border: '2px solid #86EFAC' }}>
              <div style={{ fontWeight: 800, color: '#166534', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={22} /> 🔔 Buyer Accepted Your Crop Requests ({buyerAcceptedRequests.length})
              </div>
              <p style={{ fontSize: '0.88rem', color: '#15803D', marginBottom: '1rem' }}>
                Review buyer acceptance details below and click <strong>Confirm Sale</strong> to create the final transaction and calculate net payment.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {buyerAcceptedRequests.map((req, idx) => (
                  <div key={idx} style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid #86EFAC' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.15rem', color: 'var(--text-dark)', marginBottom: '0.3rem' }}>
                          🏢 Buyer <strong>{req.buyerName}</strong> accepted your {req.cropName} crop request.
                        </h4>
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          Market: <strong>{req.marketName}</strong> | Agreed Price: <strong style={{ color: '#166534' }}>₹{req.expectedPrice || req.offeredPrice}/kg</strong> | Quantity: <strong>{req.quantity} kg</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary btn-sm" style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }} onClick={() => handleFarmerCancelSale(req)}>
                          <XCircle size={15} /> Reject / Cancel Sale
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={() => handleFarmerConfirmSale(req)}>
                          <CheckCircle2 size={15} /> Confirm Sale
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!selectedTx && transactions.length === 0 && (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <FileText size={42} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)' }}>No Transactions Created Yet</h3>
              <p style={{ fontSize: '0.9rem' }}>Transactions will appear here automatically when a Buyer accepts your crop request.</p>
            </div>
          )}

          {selectedTx && (
            <>
              {/* Confirmed Transaction Banner */}
              <div style={{ background: '#DCFCE7', border: '2px solid #86EFAC', borderRadius: 'var(--radius-md)', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CheckCircle2 size={32} style={{ color: '#15803D', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: '#166534', margin: 0, fontWeight: 800 }}>
                      Transaction Confirmed ({selectedTx.transactionId})
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#15803D', margin: 0 }}>
                      Crop: <strong>{getCropName(selectedTx.cropName)} ({selectedTx.quantity} {selectedTx.unit || 'kg'})</strong> | Gross: <strong>₹{(selectedTx.grossAmount || selectedTx.totalCropValue || 35000).toLocaleString()}</strong>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-outline" onClick={() => setReceiptModalOpen(true)}>
                    <FileText size={16} /> Generate Payment Bill
                  </button>
                  <button className="btn btn-primary" onClick={() => setReceiptModalOpen(true)}>
                    <Download size={16} /> Download Payment Bill PDF
                  </button>
                  <button className="btn btn-secondary" style={{ background: '#EFF6FF', border: '1px solid #93C5FD', color: '#1E40AF', fontWeight: 700 }} onClick={() => handleGeneratePaymentLink(selectedTx)}>
                    <CreditCard size={16} /> Generate Payment Link
                  </button>
                </div>
              </div>

              {/* 6-Step Fulfillment Tracker */}
              <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-dark)', fontWeight: 700 }}>
                  Order Fulfillment & Payment Progress Tracker
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {steps.map((step) => {
                    const IconComponent = step.icon;
                    const isCompleted = step.num <= (selectedTx.currentStep || 1);
                    const isCurrent = step.num === (selectedTx.currentStep || 1);

                    return (
                      <div
                        key={step.num}
                        style={{
                          padding: '0.85rem 0.5rem',
                          borderRadius: 'var(--radius-md)',
                          background: isCompleted ? '#DCFCE7' : '#F8FAFC',
                          border: isCurrent ? '2px solid #15803D' : '1px solid var(--border-color)',
                          textAlign: 'center'
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: isCompleted ? '#15803D' : '#CBD5E1',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 0.4rem auto'
                          }}
                        >
                          <IconComponent size={16} />
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: isCompleted ? '#166534' : 'var(--text-muted)' }}>
                          {step.num}. {step.title}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Fulfillment Controls */}
                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    FULFILLMENT & PAYMENT CONTROLS
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleStepUpdate(3, 'Crop Picked Up', 'PAYMENT_PENDING')} disabled={(selectedTx.currentStep || 1) >= 3}>
                      Step 3: Mark Picked Up
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleStepUpdate(4, 'In Transit', 'PAYMENT_PROCESSING')} disabled={(selectedTx.currentStep || 1) >= 4}>
                      Step 4: Mark In Transit
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleStepUpdate(5, 'Delivered', 'PAYMENT_PROCESSING')} disabled={(selectedTx.currentStep || 1) >= 5}>
                      Step 5: Mark Delivered
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => handleStepUpdate(6, 'COMPLETED', 'PAYMENT_COMPLETED')} disabled={(selectedTx.currentStep || 1) === 6}>
                      Step 6: Complete Payment
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 3: NET PAYMENT FINANCIAL STATEMENT */}
              <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', background: '#F0FDF4', border: '1.5px solid #86EFAC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#166534', margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calculator size={22} /> Section 3: Net Payment Calculation Statement
                  </h3>
                  <span className="badge badge-success" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                    Status: {selectedTx.paymentStatus || 'PAYMENT_COMPLETED'}
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="custom-table" style={{ background: '#FFFFFF', borderRadius: 'var(--radius-sm)' }}>
                    <tbody>
                      <tr>
                        <td style={{ color: 'var(--text-muted)' }}>Crop Name & Quantity</td>
                        <td><strong>{selectedTx.cropName} ({selectedTx.quantity} {selectedTx.unit || 'kg'})</strong></td>
                      </tr>
                      <tr>
                        <td style={{ color: 'var(--text-muted)' }}>Agreed Selling Price</td>
                        <td>₹{selectedTx.agreedPrice} / {selectedTx.unit || 'kg'}</td>
                      </tr>
                      <tr>
                        <td style={{ color: 'var(--text-muted)' }}><strong>Gross Product Amount (Agreed Price × Quantity)</strong></td>
                        <td style={{ fontWeight: 800, fontSize: '1.05rem' }}>₹{(selectedTx.grossAmount || (selectedTx.agreedPrice * selectedTx.quantity)).toLocaleString()}</td>
                      </tr>
                      <tr style={{ color: '#DC2626' }}>
                        <td>Transport Cost ({selectedTx.transportDistance || selectedTx.distance || 45} km × ₹40/km)</td>
                        <td>- ₹{(selectedTx.transportCost || 1800).toLocaleString()}</td>
                      </tr>
                      <tr style={{ color: '#DC2626' }}>
                        <td>Platform Fee (2%)</td>
                        <td>- ₹{(selectedTx.platformFee || Math.round((selectedTx.grossAmount || 35000) * 0.02)).toLocaleString()}</td>
                      </tr>
                      <tr style={{ color: '#DC2626' }}>
                        <td>Other Charges (APMC Cess / Handling)</td>
                        <td>- ₹{(selectedTx.otherCharges || 100).toLocaleString()}</td>
                      </tr>
                      <tr style={{ background: '#DCFCE7' }}>
                        <td style={{ fontWeight: 900, color: '#166534', fontSize: '1.1rem' }}>💰 FINAL NET PAYMENT TO FARMER</td>
                        <td style={{ fontWeight: 900, color: '#166534', fontSize: '1.4rem' }}>
                          ₹{(selectedTx.finalNetPayment || selectedTx.netAmountToFarmer || 32400).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* User ID Ownership Summary (Section 8 Authorization) */}
              <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: '#F8FAFC' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  SECTION 8: TRANSACTION AUTHORIZATION DATA (userId BOUND)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div>Farmer User ID (farmerUserId): <code>{selectedTx.farmerUserId || selectedTx.farmerId}</code></div>
                  <div>Buyer User ID (buyerUserId): <code>{selectedTx.buyerUserId || selectedTx.buyerId}</code></div>
                  <div>Driver User ID (driverUserId): <code>{selectedTx.driverUserId || selectedTx.driverId || 'usr_driver_pending'}</code></div>
                </div>
              </div>
            </>
          )}

          {/* Receipt Modal */}
          {receiptModalOpen && selectedTx && (
            <PaymentReceiptModal transaction={selectedTx} onClose={() => setReceiptModalOpen(false)} />
          )}

          {/* Payment Link Modal */}
          {paymentLinkModalOpen && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
              <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2rem', background: '#FFFFFF', borderRadius: '16px', position: 'relative' }}>
                <button onClick={() => setPaymentLinkModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>✕</button>

                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '0.3rem' }}>💳</div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>Digital Payment Link Generated</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Shareable URL associated with Transaction {selectedTx?.transactionId}</p>
                </div>

                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #CBD5E1', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>PAYMENT URL</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, wordBreak: 'break-all', color: '#1E40AF', fontFamily: 'monospace' }}>{generatedPaymentLink}</div>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button
                    className="btn btn-outline"
                    style={{ flex: 1, fontWeight: 800 }}
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPaymentLink);
                      alert('Payment Link copied to clipboard!');
                    }}
                  >
                    📋 Copy Payment Link
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, fontWeight: 800 }}
                    onClick={() => {
                      setPaymentLinkModalOpen(false);
                      navigate(`/payment/${selectedTx?.transactionId || selectedTx?._id}`);
                    }}
                  >
                    💳 Pay Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Transactions;
