import { Link } from 'react-router-dom';
import { foodTypeOptions, quantityUnitOptions } from '../../constants/donationConstants';
import { ROUTES } from '../../constants/routes';

const PostDonationForm = ({
  formData,
  formStatus,
  isSubmitting,
  updateField,
  updateImages,
  handleSubmit,
}) => {
  return (
    <section className="post-donation-card" aria-labelledby="post-donation-title">
      <div className="post-form-heading">
        <h2 id="post-donation-title">Donation Details</h2>
        <p>Fields marked with clear food and pickup information help NGOs respond faster.</p>
      </div>

      <form className="post-donation-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="post-field">
          <span>Food Title</span>
          <input
            type="text"
            name="foodTitle"
            placeholder="Chicken Biryani"
            value={formData.foodTitle}
            onChange={updateField}
            required
          />
        </label>

        <div className="post-form-grid">
          <label className="post-field">
            <span>Food Type</span>
            <select name="foodType" value={formData.foodType} onChange={updateField} required>
              {foodTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="post-field">
            <span>Expiry Date & Time</span>
            <input
              type="datetime-local"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={updateField}
              required
            />
          </label>
        </div>

        <div className="post-form-grid">
          <label className="post-field">
            <span>Quantity</span>
            <input
              type="number"
              name="quantityValue"
              placeholder="20"
              min="1"
              step="0.5"
              value={formData.quantityValue}
              onChange={updateField}
              required
            />
          </label>

          <label className="post-field">
            <span>Unit</span>
            <select name="quantityUnit" value={formData.quantityUnit} onChange={updateField} required>
              {quantityUnitOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="post-field">
          <span>Pickup Address</span>
          <input
            type="text"
            name="address"
            placeholder="House 12, Street 5, G-10"
            value={formData.address}
            onChange={updateField}
            required
          />
        </label>

        <label className="post-field">
          <span>Description</span>
          <textarea
            name="description"
            placeholder="Freshly cooked and packed. Please collect before the expiry time."
            value={formData.description}
            onChange={updateField}
            rows="4"
          ></textarea>
        </label>

        <label className="post-field image-field">
          <span>Food Images</span>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={updateImages}
          />
          <small>You can upload up to 5 images.</small>
        </label>

        {formStatus.message && (
          <p className={`post-form-status ${formStatus.type}`}>
            {formStatus.message}
          </p>
        )}

        <div className="post-form-actions">
          <Link to={ROUTES.donorDashboard}>Cancel</Link>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Posting Donation...' : 'Post Donation'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default PostDonationForm;
