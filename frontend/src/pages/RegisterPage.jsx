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
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    ngoName: '',
    ngoRegistrationNumber: '',
    ngoDocument: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
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

    const payload = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: accountType,
      location: {
        address: formData.address,
      },
    };

    if (accountType === 'ngo') {
      payload.ngoName = formData.ngoName;
      payload.ngoRegistrationNumber = formData.ngoRegistrationNumber;
      payload.ngoDocument = formData.ngoDocument;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
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
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        ngoName: '',
        ngoRegistrationNumber: '',
        ngoDocument: '',
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

          <form className="register-form" onSubmit={handleSubmit}>
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

            <div className="form-grid">
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
              <label className="field">
                <span>@</span>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={updateField}
                  required
                />
              </label>
            </div>

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

            <label className="field">
              <span>☏</span>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={updateField}
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

            <label className="field select-field">
              <span>▤</span>
              <select value={accountType} onChange={(event) => handleAccountTypeChange(event.target.value)}>
                <option value="donor">Donor</option>
                <option value="ngo">NGO</option>
              </select>
            </label>

            {accountType === 'ngo' && (
              <>
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
                      type="text"
                      name="ngoDocument"
                      placeholder="NGO Document Link"
                      value={formData.ngoDocument}
                      onChange={updateField}
                      required
                    />
                  </label>
                </div>
              </>
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

            <div className="divider">
              <span></span>
              OR
              <span></span>
            </div>

            <button className="google-btn" type="button">
              <span>G</span>
              Continue with Google
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
