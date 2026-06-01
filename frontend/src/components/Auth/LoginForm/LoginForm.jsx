import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const LoginForm = ({
  formData,
  updateField,
  rememberMe,
  setRememberMe,
  showPassword,
  togglePassword,
  handleSubmit,
  formStatus,
  isSubmitting,
}) => {
  return (
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
            <button type="button" onClick={togglePassword}>
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
          Don't have an account? <Link to={ROUTES.register}>Register</Link>
        </p>
      </form>
    </section>
  );
};

export default LoginForm;
