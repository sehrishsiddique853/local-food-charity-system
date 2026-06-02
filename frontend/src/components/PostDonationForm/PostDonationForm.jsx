import { Link } from 'react-router-dom';
import { foodTypeOptions, quantityUnitOptions } from '../../constants/donationConstants';
import { ROUTES } from '../../constants/routes';
import PostDonationCard from '../PostDonationCard';

const PostDonationForm = ({
  formData,
  formStatus,
  isSubmitting,
  minExpiryDate,
  updateField,
  updateImages,
  handleSubmit,
}) => {
  return (
    <PostDonationCard
      title="Upload Donation"
      description="Enter details of the donation"
      titleId="post-donation-title"
    >
      <form className="post-donation-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="post-field">
          <span>▣</span>
          <input
            type="text"
            name="foodTitle"
            placeholder="Food Title"
            value={formData.foodTitle}
            onChange={updateField}
            required
          />
        </label>

        <div className="post-form-grid">
          <label className="post-field post-select-field">
            <span>▤</span>
            <select name="foodType" value={formData.foodType} onChange={updateField} required>
              {foodTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="post-field">
            <span>◴</span>
            <span className="post-date-control">
              {!formData.expiryDate && <strong>Expiry Date</strong>}
              <input
                type="datetime-local"
                name="expiryDate"
                aria-label="Expiry Date"
                title="Expiry Date"
                value={formData.expiryDate}
                min={minExpiryDate}
                onChange={updateField}
                required
              />
            </span>
          </label>
        </div>

        <div className="post-form-grid">
          <label className="post-field">
            <span>#</span>
            <input
              type="number"
              name="quantityValue"
              placeholder="Quantity"
              min="1"
              step="0.5"
              value={formData.quantityValue}
              onChange={updateField}
              required
            />
          </label>

          <label className="post-field post-select-field">
            <span>▧</span>
            <select name="quantityUnit" value={formData.quantityUnit} onChange={updateField} required>
              {quantityUnitOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="post-field">
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

        <label className="post-field post-textarea-field">
          <span>☰</span>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={updateField}
            rows="4"
          ></textarea>
        </label>

        <label className="post-field image-field">
          <span>▧</span>
          <input
            type="file"
            name="images"
            accept="image/*"
            onChange={updateImages}
          />
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
    </PostDonationCard>
  );
};

export default PostDonationForm;
