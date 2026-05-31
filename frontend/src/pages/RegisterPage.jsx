import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get('role');
  const [accountType, setAccountType] = useState(
    requestedRole === 'ngo' || requestedRole === 'donor' ? requestedRole : 'donor'
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    ngoName: '',
    ngoRegistrationNumber: '',
    ngoDocument: null,
  });
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));
  };

  const updateDocumentFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFormData((current) => ({
        ...current,
        ngoDocument: '',
      }));
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setFormStatus({ type: 'error', message: 'Please upload a PDF, JPG, or PNG document.' });
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormStatus({ type: 'error', message: 'Document must be 5MB or smaller.' });
      event.target.value = '';
      return;
    }

    setFormData((current) => ({
      ...current,
      ngoDocument: file,
    }));
    setFormStatus({ type: '', message: '' });
  };

  const handleAccountTypeChange = (role) => {
    setAccountType(role);
    setFormStatus({ type: '', message: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus({ type: '', message: '' });

    if (formData.password !== formData.confirmPassword) {
      setFormStatus({ type: 'error', message: 'Password and confirm password must match.' });
      return;
    }

    if (!acceptedTerms) {
      setFormStatus({ type: 'error', message: 'Please agree to the terms and privacy policy.' });
      return;
    }

    if (accountType === 'ngo' && !formData.ngoDocument) {
      setFormStatus({ type: 'error', message: 'Please upload your NGO verification document.' });
      return;
    }

    const payload = new FormData();
    payload.append('email', formData.email);
    payload.append('password', formData.password);
    payload.append('phone', formData.phone);
    payload.append('role', accountType);
    payload.append('address', formData.address);

    if (accountType === 'donor') {
      payload.append('name', formData.name);
    }

    if (accountType === 'ngo') {
      payload.append('ngoName', formData.ngoName);
      payload.append('ngoRegistrationNumber', formData.ngoRegistrationNumber);
      payload.append('ngoDocument', formData.ngoDocument);
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        body: payload,
      });

      const result = await response.json();

      if (!response.ok) {
        const validationMessage = result.error?.details?.errors?.[0]?.message;
        throw new Error(validationMessage || result.error?.message || 'Registration failed.');
      }

      setFormStatus({
        type: 'success',
        message: 'Account created successfully. Your registration is now saved.',
      });
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        ngoName: '',
        ngoRegistrationNumber: '',
        ngoDocument: null,
      });
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <div className="register-page">
      <Navbar variant="light" />

      <main className="register-main">
        <section className="register-intro">
          <div className="register-intro-copy">
            <h1>
              Be a Part of
              <br />
              Something <span>Bigger.</span>
            </h1>
            <p>
              Create your account to join donors and NGOs in reducing food
              waste and helping those in need.
            </p>
          </div>

          <div className="register-art">
            <img src="/home-page-ani.png" alt="Food donation handover" />
          </div>
        </section>

        <section className="register-panel" aria-labelledby="register-title">
          <div className="register-heading">
            <h2 id="register-title">Create Your Account</h2>
            <p>Sign up to get started</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="role-toggle" aria-label="Select account type">
              <button
                type="button"
                className={accountType === 'donor' ? 'selected' : ''}
                onClick={() => handleAccountTypeChange('donor')}
              >
                <span className="role-dot"></span>
                <span className="role-icon">🥗</span>
                Donor
              </button>
              <button
                type="button"
                className={accountType === 'ngo' ? 'selected' : ''}
                onClick={() => handleAccountTypeChange('ngo')}
              >
                <span className="role-dot"></span>
                <span className="role-icon">🤝</span>
                NGO
              </button>
            </div>

            {accountType === 'donor' && (
              <label className="field">
                <span>♙</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={updateField}
                  required
                />
              </label>
            )}

            {accountType === 'ngo' && (
              <label className="field">
                <span>▥</span>
                <input
                  type="text"
                  name="ngoName"
                  placeholder="NGO Name"
                  value={formData.ngoName}
                  onChange={updateField}
                  required
                />
              </label>
            )}

            <label className="field">
              <span>✉</span>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={updateField}
                required
              />
            </label>

            <div className="form-grid">
              <label className="field">
                <span>▣</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={updateField}
                  required
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </label>
              <label className="field">
                <span>▣</span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={updateField}
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword((value) => !value)}>
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </label>
            </div>

            <label className="field phone-field">
              <span>☏</span>
              <strong>+92</strong>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={updateField}
                inputMode="numeric"
                maxLength="10"
                pattern="[0-9]{10}"
                required
              />
            </label>

            <label className="field select-field">
              <span>⌖</span>
              <select value="Islamabad" disabled>
                <option value="Islamabad">Islamabad</option>
              </select>
            </label>

            <label className="field">
              <span>⌂</span>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={updateField}
                required
              />
            </label>

            {accountType === 'ngo' && (
              <div className="form-grid">
                <label className="field">
                  <span>#</span>
                  <input
                    type="text"
                    name="ngoRegistrationNumber"
                    placeholder="NGO Registration Number"
                    value={formData.ngoRegistrationNumber}
                    onChange={updateField}
                    required
                  />
                </label>
                <label className="field">
                  <span>▧</span>
                  <input
                    type="file"
                    name="ngoDocument"
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    onChange={updateDocumentFile}
                    required
                  />
                </label>
              </div>
            )}

            <label className="terms-row">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
              />
              <span>
                I agree to the <a href="#terms">Terms & Conditions</a> and{' '}
                <a href="#privacy">Privacy Policy</a>
              </span>
            </label>

            {formStatus.message && (
              <p className={`form-status ${formStatus.type}`}>
                {formStatus.message}
              </p>
            )}

            <button className="register-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>

            <p className="login-note">
              Already have an account? <Link to="/#login">Login</Link>
            </p>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;
