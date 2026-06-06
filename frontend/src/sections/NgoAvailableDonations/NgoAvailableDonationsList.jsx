import { foodTypeOptions } from '../../constants/donationConstants';
import {
  formatDate,
  formatQuantity,
  getDonationImage,
  getPickupArea,
} from '../../utils/donationUtils';

const NgoAvailableDonationsList = ({
  donations,
  searchTerm,
  foodType,
  quantityFilter,
  expiryFilter,
  pickupAreaFilter,
  isLoading,
  onSearchChange,
  onFoodTypeChange,
  onQuantityChange,
  onExpiryChange,
  onPickupAreaChange,
  onViewDetails,
  onRequestDonation,
  requestingDonationId,
}) => (
  <section className="my-donations-panel ngo-available-panel">
    <div className="my-donations-heading ngo-available-heading">
      <div>
        <h2>Available Donations</h2>
        <p>Browse food donations currently open for NGO requests.</p>
      </div>
    </div>

    <div className="ngo-donation-toolbar" aria-label="Available donation filters">
      <label>
        <span>Search by food name</span>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search food name"
        />
      </label>

      <label>
        <span>Filter by food type</span>
        <select
          value={foodType}
          onChange={(event) => onFoodTypeChange(event.target.value)}
        >
          <option value="">All food types</option>
          {foodTypeOptions.map((option) => (
            <option value={option.value} key={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label>
        <span>Filter by quantity</span>
        <input
          type="number"
          min="0"
          value={quantityFilter}
          onChange={(event) => onQuantityChange(event.target.value)}
          placeholder="Minimum quantity"
        />
      </label>

      <label>
        <span>Filter by expiry</span>
        <input
          type="date"
          value={expiryFilter}
          onChange={(event) => onExpiryChange(event.target.value)}
        />
      </label>

      <label>
        <span>Filter by pickup area</span>
        <input
          type="search"
          value={pickupAreaFilter}
          onChange={(event) => onPickupAreaChange(event.target.value)}
          placeholder="Pickup area"
        />
      </label>
    </div>

    <div className="ngo-available-list">
      {isLoading && <p className="empty-state">Loading available donations...</p>}

      {!isLoading && donations.length === 0 && (
        <div className="my-donations-empty">
          <h3>No available donations found</h3>
          <p>Try adjusting the search or food type filter.</p>
        </div>
      )}

      {!isLoading && donations.map((donation) => (
        <article
          className="ngo-available-card"
          key={donation._id}
          role="button"
          tabIndex={0}
          onClick={() => onViewDetails(donation)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onViewDetails(donation);
            }
          }}
        >
          <div className="ngo-card-body">
            <img src={getDonationImage(donation)} alt={donation.foodTitle} />

            <div className="ngo-available-copy">
              <div>
                <strong>{donation.foodTitle}</strong>
                <span>
                  <i aria-hidden="true"></i>
                  {donation.foodType || 'Food'}
                </span>
              </div>

              <dl className="ngo-donation-meta">
                <div>
                  <span className="meta-icon quantity" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M6 3v18" />
                      <path d="M10 3v18" />
                      <path d="M15 4v8" />
                      <path d="M18 4v8" />
                      <path d="M15 12c0 3 3 3 3 6v3" />
                    </svg>
                  </span>
                  <dt>Quantity</dt>
                  <dd>{formatQuantity(donation.quantity)}</dd>
                </div>
                <div>
                  <span className="meta-icon expiry" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M8 2v4" />
                      <path d="M16 2v4" />
                      <path d="M4 9h16" />
                      <path d="M5 5h14v17H5z" />
                    </svg>
                  </span>
                  <dt>Expiry</dt>
                  <dd>{formatDate(donation.expiryDate)}</dd>
                </div>
                <div>
                  <span className="meta-icon area" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11Z" />
                      <path d="M12 10.5h.01" />
                    </svg>
                  </span>
                  <dt>Pickup Area</dt>
                  <dd>{getPickupArea(donation)}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="ngo-card-action">
            <button
              className="ngo-request-button"
              type="button"
              disabled={requestingDonationId === donation._id}
              onClick={(event) => {
                event.stopPropagation();
                onRequestDonation(donation._id);
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 3 10 14" />
                <path d="m21 3-7 20-4-9-9-4 20-7Z" />
              </svg>
              {requestingDonationId === donation._id ? 'Requesting...' : 'Request'}
            </button>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default NgoAvailableDonationsList;
