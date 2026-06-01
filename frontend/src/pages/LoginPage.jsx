import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus({ type: '', message: '' });
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Sign in failed.');
      }

      setFormStatus({
        type: 'success',
        message: 'Logged in successfully.',
      });

      if (result.data?.user?.role === 'donor') {
        navigate('/donor/dashboard');
      }
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'Sign in failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar variant="light" />

      <main className="login-main">
        <section className="login-intro">
          <div className="login-intro-copy">
            <h1>
              Welcome Back!
              <br />
              Your Sign In
              <br />
              Helps Create
              <br />
              a <span>Better Tomorrow.</span>
            </h1>
            <p>
              Sign in to your account and continue making a positive impact by
              connecting food with those who need it most.
            </p>
          </div>

          <div className="login-art">
            <img src="/home-page-ani.png" alt="Food donation volunteers" />
          </div>

          <div className="login-benefits">
            <div className="login-benefit">
              <span>🛡</span>
              <div>
                <h3>Secure & Trusted</h3>
                <p>We ensure a safe and secure experience for all users.</p>
              </div>
            </div>
            <div className="login-benefit">
              <span>👥</span>
              <div>
                <h3>Verified NGOs</h3>
                <p>All NGOs are verified to ensure transparency and trust.</p>
              </div>
            </div>
            <div className="login-benefit">
              <span>🌿</span>
              <div>
                <h3>Reduce Food Waste</h3>
                <p>Your small action can lead to a big change in someone's life.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="login-panel" aria-labelledby="login-title">
          <div className="login-heading">
            <h2 id="login-title">Welcome Back!</h2>
            <p>Sign in to your account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field-group">
              <label htmlFor="login-email">Email Address</label>
              <div className="login-field">
                <span>✉</span>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={updateField}
                  required
                />
              </div>
            </div>

            <div className="login-field-group">
              <label htmlFor="login-password">Password</label>
              <div className="login-field">
                <span>▣</span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={updateField}
                  required
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                Remember me
              </label>
              <a href="#forgot-password">Forgot Password?</a>
            </div>

            {formStatus.message && (
              <p className={`login-status ${formStatus.type}`}>
                {formStatus.message}
              </p>
            )}

            <button className="login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="login-divider">
              <span></span>
              OR
              <span></span>
            </div>

            <p className="register-note">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
