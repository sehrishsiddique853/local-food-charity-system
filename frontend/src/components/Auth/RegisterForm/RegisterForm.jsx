import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const roleIcons = {
  donor: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9.5 12 5l8 4.5-8 4.5-8-4.5z" />
      <path d="M4 9.5v7L12 21l8-4.5v-7" />
      <path d="M12 14v7" />
      <path d="M9.5 9.8h5" />
    </svg>
  ),
  ngo: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 21h16" />
      <path d="M6 21V9l6-4 6 4v12" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 11h.01" />
      <path d="M12 11h.01" />
      <path d="M15 11h.01" />
    </svg>
  ),
};

const RegisterForm = ({
  accountType,
  formData,
  acceptedTerms,
  formStatus,
  isSubmitting,
  showPassword,
  showConfirmPassword,
  updateField,
  updateDocumentFile,
  setAcceptedTerms,
  handleAccountTypeChange,
  toggleShowPassword,
  toggleShowConfirmPassword,
  handleSubmit,
}) => {
  return (
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
            <span className="role-icon">{roleIcons.donor}</span>
            Donor
          </button>
          <button
            type="button"
            className={accountType === 'ngo' ? 'selected' : ''}
            onClick={() => handleAccountTypeChange('ngo')}
          >
            <span className="role-dot"></span>
            <span className="role-icon">{roleIcons.ngo}</span>
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
            <button type="button" onClick={toggleShowPassword}>
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
            <button type="button" onClick={toggleShowConfirmPassword}>
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
          Already have an account? <Link to={ROUTES.login}>Sign In</Link>
        </p>
      </form>
    </section>
  );
};

export default RegisterForm;
