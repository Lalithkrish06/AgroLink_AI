import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CROP_CATEGORIES, CROPS_DATA } from '../utils/crops';
import API from '../services/api';
import { ArrowRight, CheckCircle2, Phone, MapPin, Sparkles } from 'lucide-react';

const CreateCropLot = () => {
  const { user } = useContext(AuthContext);
  const { t, getCropName, getCategoryName } = useLanguage();
  const navigate = useNavigate();

  const farmerPhone = user?.phone || user?.mobileNumber || 'No Mobile';

  const [stateName, setStateName] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('Erode');
  const [villageCity, setVillageCity] = useState('Perundurai');
  const [lat, setLat] = useState(11.341);
  const [lng, setLng] = useState(77.7172);

  const [sellerType, setSellerType] = useState('individual');
  const [fpoName, setFpoName] = useState('Perundurai Farmers Producer Organization');
  const [aggregatedFarmerCount, setAggregatedFarmerCount] = useState(5);
  const [availableDate, setAvailableDate] = useState(new Date().toISOString().split('T')[0]);

  const [formData, setFormData] = useState({
    cropName: 'Tomato',
    cropCategory: 'Vegetables',
    variety: 'Hybrid Red',
    quantity: '1000',
    unit: 'kg',
    qualityGrade: 'Grade A',
    freshness: 'Fresh Harvest (1 Day)',
    description: 'Fresh organic farm produce, harvested for buyer procurement.',
    expectedPrice: '35',
    minPrice: '30'
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cropCategory') {
      // When category changes, set default cropName for that category if available
      const matchingCrops = CROPS_DATA.filter(c => c.category === value);
      const defaultCrop = matchingCrops.length > 0 ? matchingCrops[0].id : formData.cropName;
      setFormData(prev => ({ ...prev, cropCategory: value, cropName: defaultCrop }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrorMsg('');
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setGeoLoading(false);
          setSuccessMsg(`📍 GPS Location acquired: Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)}`);
          setTimeout(() => setSuccessMsg(''), 3000);
        },
        (err) => {
          setGeoLoading(false);
          setErrorMsg('Could not fetch GPS location. Please ensure location access is enabled.');
        }
      );
    } else {
      setErrorMsg('Geolocation is not supported by your browser.');
    }
  };

  const qty = Number(formData.quantity) || 0;
  const price = Number(formData.expectedPrice) || 0;
  const totalProductAmount = qty * price;

  // Filter crops based on selected category
  const filteredCrops = CROPS_DATA.filter(c => !formData.cropCategory || c.category === formData.cropCategory);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.cropName?.trim()) {
      setLoading(false);
      setErrorMsg('Crop Name is required. Please select a valid crop name.');
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setLoading(false);
      setErrorMsg('Valid Quantity is required. Quantity must be greater than 0.');
      return;
    }

    if (!formData.expectedPrice || Number(formData.expectedPrice) <= 0) {
      setLoading(false);
      setErrorMsg('Expected Price is required. Price must be greater than 0 ₹.');
      return;
    }

    if (!villageCity?.trim() || !district?.trim()) {
      setLoading(false);
      setErrorMsg('Location details (District and Village/City) are required to publish crop lot.');
      return;
    }

    const payload = {
      ...formData,
      farmerId: user?.id || user?._id || 'usr_farmer',
      farmerName: user?.name || 'Farmer',
      farmerMobile: user?.phone || user?.mobileNumber || user?.mobile || '',
      state: stateName,
      district,
      village: villageCity,
      location: `${villageCity}, ${district}, ${stateName}`,
      latitude: lat,
      longitude: lng,
      estimatedValue: totalProductAmount,
      status: 'PUBLISHED'
    };

    try {
      const res = await API.post('/crop-lots', payload);

      if (res.data && res.data.cropLot) {
        const savedLot = res.data.cropLot;
        localStorage.setItem('agrolink_selected_crop', JSON.stringify({
          id: savedLot._id || savedLot.id,
          cropName: savedLot.cropName,
          quantity: savedLot.quantity,
          unit: savedLot.unit,
          expectedPrice: savedLot.expectedPrice,
          qualityGrade: savedLot.qualityGrade,
          location: savedLot.location
        }));

        setSuccessMsg(t('lot_created_success'));
        
        setTimeout(() => {
          setLoading(false);
          navigate('/market-analysis');
        }, 1200);
      } else {
        setLoading(false);
        setErrorMsg(res.data?.message || 'Server responded without crop lot save confirmation.');
      }
    } catch (err) {
      setLoading(false);
      if (err.response) {
        setErrorMsg(`Database / Server Error (${err.response.status}): ${err.response.data?.message || 'Failed to save crop lot to database.'}`);
      } else if (err.request) {
        setErrorMsg('Network Connection Error: Failed to reach backend server. Please verify backend service is active.');
      } else {
        setErrorMsg(`Publication Error: ${err.message || 'An unexpected error occurred.'}`);
      }
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--text-dark)' }}>🌾 {t('create_lot_title')}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Fill crop specifications, quality details, expected price and location to match with active buyer demands.
              </p>
            </div>

            {/* Logged in Farmer Profile Badge */}
            <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
              <div>
                Logged in Farmer: <strong>{user?.name || 'Authenticated Farmer'}</strong>
              </div>
              <div style={{ color: '#166534', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={16} /> Registered Mobile: {farmerPhone || 'Not Provided'}
              </div>
            </div>

            {errorMsg && (
              <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid #FCA5A5', fontWeight: 600, fontSize: '0.9rem' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{ background: '#DCFCE7', color: '#15803D', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid #86EFAC', fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={20} /> <strong>{successMsg}</strong>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/market-analysis')}
                  style={{ gap: '0.3rem' }}
                >
                  Go to Market Analysis <ArrowRight size={16} />
                </button>
              </div>
            )}

            <div className="card" style={{ padding: '2rem' }}>
              <form onSubmit={handleSubmit}>
                
                {/* SECTION: FPO / Seller Type Selection */}
                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>🌾 Seller / Publisher Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.4rem' }}>
                    <button
                      type="button"
                      className={`btn btn-sm ${sellerType === 'individual' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setSellerType('individual')}
                      style={{ fontWeight: 700 }}
                    >
                      🧑‍🌾 Individual Farmer
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${sellerType === 'fpo' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setSellerType('fpo')}
                      style={{ fontWeight: 700 }}
                    >
                      🏢 FPO / Producer Group Aggregation
                    </button>
                  </div>

                  {sellerType === 'fpo' && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontWeight: 800, color: '#166534', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        🌾 FPO Aggregated Lot Configuration
                      </div>
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">FPO / Producer Group Name</label>
                          <input type="text" className="form-control" value={fpoName} onChange={(e) => setFpoName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Number of Farmers Aggregated</label>
                          <input type="number" className="form-control" value={aggregatedFarmerCount} onChange={(e) => setAggregatedFarmerCount(e.target.value)} required min="2" />
                        </div>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#15803D', fontWeight: 600 }}>
                        🏷️ <strong>Example Aggregated Lot Preview:</strong> {fpoName} Aggregated Lot ({getCropName(formData.cropName)}, {aggregatedFarmerCount} Farmers, {formData.quantity} {formData.unit}, {formData.qualityGrade})
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION: Crop Information */}
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                  1. Crop Information
                </h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('crop_category')}</label>
                    <select name="cropCategory" className="form-control" value={formData.cropCategory} onChange={handleChange} required>
                      {CROP_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {getCategoryName(cat.id)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('crop_name')}</label>
                    <select name="cropName" className="form-control" value={formData.cropName} onChange={handleChange} required>
                      {filteredCrops.map(c => (
                        <option key={c.id} value={c.id}>
                          {getCropName(c.id)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('variety')}</label>
                    <input type="text" name="variety" className="form-control" value={formData.variety} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('quantity')}</label>
                    <input type="number" name="quantity" className="form-control" value={formData.quantity} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('unit')}</label>
                    <select name="unit" className="form-control" value={formData.unit} onChange={handleChange}>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="Quintals">Quintals</option>
                      <option value="Tons">Tons</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Available Date</label>
                    <input type="date" className="form-control" value={availableDate} onChange={(e) => setAvailableDate(e.target.value)} required />
                  </div>
                </div>

                {/* SECTION: Quality Information */}
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', margin: '1.5rem 0 1rem 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                  2. Quality Information
                </h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('quality_grade')}</label>
                    <select name="qualityGrade" className="form-control" value={formData.qualityGrade} onChange={handleChange}>
                      <option value="Grade A">Grade A (Premium)</option>
                      <option value="Grade B">Grade B (Standard)</option>
                      <option value="Grade C">Grade C (Fair)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('freshness')}</label>
                    <input type="text" name="freshness" className="form-control" value={formData.freshness} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('description')}</label>
                  <textarea name="description" rows="2" className="form-control" value={formData.description} onChange={handleChange}></textarea>
                </div>

                {/* SECTION: Price Information */}
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', margin: '1.5rem 0 1rem 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                  3. Price Information
                </h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('expected_price')}</label>
                    <input type="number" name="expectedPrice" className="form-control" value={formData.expectedPrice} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('min_acceptable_price')}</label>
                    <input type="number" name="minPrice" className="form-control" value={formData.minPrice} onChange={handleChange} required />
                  </div>
                </div>

                {/* Total Product Amount Display */}
                <div style={{ background: '#ECFDF5', border: '1.5px solid #6EE7B7', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>
                    Total Estimated Crop Value (Quantity × Price)
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#065F46', margin: '0.2rem 0' }}>
                    ₹{totalProductAmount.toLocaleString()}
                  </div>
                </div>

                {/* SECTION: Location & Geolocation */}
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', margin: '1.5rem 0 1rem 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                  4. Location & GPS Coordinates
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="btn btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#EFF6FF', border: '1px solid #93C5FD', color: '#1E40AF', fontWeight: 700 }}
                    disabled={geoLoading}
                  >
                    <MapPin size={18} /> {geoLoading ? 'Detecting Location...' : '📍 Use My Current Location'}
                  </button>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    GPS Coordinates: Lat <strong>{lat.toFixed(4)}</strong>, Lng <strong>{lng.toFixed(4)}</strong>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input type="text" className="form-control" value={stateName} onChange={(e) => setStateName(e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">District</label>
                    <input type="text" className="form-control" value={district} onChange={(e) => setDistrict(e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Village / City</label>
                    <input type="text" className="form-control" value={villageCity} onChange={(e) => setVillageCity(e.target.value)} required />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
                  {loading ? t('loading') : t('publish_lot_btn')} <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CreateCropLot;
