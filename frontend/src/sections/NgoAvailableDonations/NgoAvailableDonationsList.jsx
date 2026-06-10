import { useEffect, useRef, useState } from 'react';
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
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [isFoodTypeOpen, setIsFoodTypeOpen] = useState(false);
  const foodTypeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (foodTypeRef.current && !foodTypeRef.current.contains(event.target)) {
        setIsFoodTypeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedFoodType = foodTypeOptions.find((option) => option.value === foodType) || { value: '', label: 'All food types' };

  return (
    <section className="my-donations-panel ngo-available-panel">
      <div className="my-donations-heading ngo-available-heading">
        <div>
          <h2>Available Donations</h2>
          <p>Browse food donations currently open for NGO requests.</p>
        </div>
      </div>

      <div className="ngo-donation-toolbar" aria-label="Available donation filters">
        <label className="ngo-search-filter">
          <span>Search by food name</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search food name"
          />
        </label>

        <button
          className="ngo-filter-toggle"
          type="button"
          aria-expanded={showFilters}
          onClick={() => setShowFilters((current) => !current)}
        >
          More filters
          <span aria-hidden="true">{showFilters ? '-' : '+'}</span>
        </button>

        <div className={`ngo-filter-fields ${showFilters ? 'open' : ''}`}>
          <label className="ngo-foodtype-filter">
            <span>Filter by food type</span>
            <div className="ngo-foodtype-select" ref={foodTypeRef}>
              <button
                type="button"
                className="ngo-foodtype-select__button"
                aria-haspopup="listbox"
                aria-expanded={isFoodTypeOpen}
                onClick={() => setIsFoodTypeOpen((current) => !current)}
              >
                {selectedFoodType.label}
              </button>

              {isFoodTypeOpen && (
                <ul className="ngo-foodtype-select__menu" role="listbox">
                  <li>
                    <button
                      type="button"
                      className={`ngo-foodtype-select__item ${foodType === '' ? 'selected' : ''}`}
                      onClick={() => {
                        onFoodTypeChange('');
                        setIsFoodTypeOpen(false);
                      }}
                    >
                      All food types
                    </button>
                  </li>
                  {foodTypeOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        className={`ngo-foodtype-select__item ${foodType === option.value ? 'selected' : ''}`}
                        onClick={() => {
                          onFoodTypeChange(option.value);
                          setIsFoodTypeOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
            className="ngo-list-card"
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
            <div className="ngo-list-main">
              <img src={getDonationImage(donation)} alt={donation.foodTitle} />

              <div className="ngo-list-copy">
                <strong>{donation.foodTitle}</strong>
                <span className="status-pill available ngo-mobile-status">Available</span>
                <p>
                  {formatQuantity(donation.quantity)}
                  <span>•</span>
                  {getPickupArea(donation)}
                </p>
                <small>Posted {formatDate(donation.createdAt)}</small>
              </div>
            </div>

            <span className="status-pill available ngo-desktop-status">Available</span>

            <div className="ngo-list-actions">
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
};

export default NgoAvailableDonationsList;
