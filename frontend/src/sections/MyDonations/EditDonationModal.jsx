import { foodTypeOptions, quantityUnitOptions } from '../../constants/donationConstants';

const EditDonationModal = ({
  editForm,
  isSaving,
  onClose,
  onChange,
  onImageChange,
  onSubmit,
}) => {
  if (!editForm) {
    return null;
  }

  return (
    <div className="donation-modal-backdrop" role="presentation">
      <section className="donation-modal edit-donation-modal" role="dialog" aria-modal="true" aria-labelledby="edit-donation-title">
        <div className="modal-heading">
          <div>
            <p className="post-eyebrow">Edit Donation</p>
            <h2 id="edit-donation-title">Update Available Donation</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close edit form">×</button>
        </div>

        <form className="post-donation-form" onSubmit={onSubmit} encType="multipart/form-data">
          <label className="post-field">
            <span>▣</span>
            <input
              type="text"
              name="foodTitle"
              placeholder="Food Title"
              value={editForm.foodTitle}
              onChange={onChange}
              required
            />
          </label>

          <div className="post-form-grid">
            <label className="post-field post-select-field">
              <span>▤</span>
              <select name="foodType" value={editForm.foodType} onChange={onChange} required>
                {foodTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="post-field">
              <span>◴</span>
              <input
                type="datetime-local"
                name="expiryDate"
                value={editForm.expiryDate}
                onChange={onChange}
                required
              />
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
                value={editForm.quantityValue}
                onChange={onChange}
                required
              />
            </label>

            <label className="post-field post-select-field">
              <span>▧</span>
              <select name="quantityUnit" value={editForm.quantityUnit} onChange={onChange} required>
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
              placeholder="Pickup Address"
              value={editForm.address}
              onChange={onChange}
              required
            />
          </label>

          <label className="post-field post-textarea-field">
            <span>☰</span>
            <textarea
              name="description"
              placeholder="Description"
              value={editForm.description}
              onChange={onChange}
              rows="4"
            />
          </label>

          <label className="post-field image-field">
            <span>▧</span>
            <input type="file" name="images" accept="image/*" onChange={onImageChange} />
          </label>

          <div className="post-form-actions">
            <button type="button" className="secondary-action" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditDonationModal;
