import { useState } from 'react';
import { useDonorProfile } from '../hooks/useDonorProfile';
import { useMyDonations } from '../hooks/useMyDonations';
import DonorLayout from '../layouts/DonorLayout/DonorLayout';
import PostDonationIntro from '../sections/PostDonationIntro';
import {
  DonationDetailsModal,
  EditDonationModal,
  MyDonationsList,
} from '../sections/MyDonations';
import '../styles/DonorDashboard.css';
import '../styles/PostDonationPage.css';
import '../styles/MyDonationsPage.css';

const MyDonationsPage = () => {
  const { profile, profileError, handleLogout } = useDonorProfile();
  const {
    donations,
    totals,
    isLoading,
    statusMessage,
    selectedDonation,
    editForm,
    isSaving,
    setSelectedDonation,
    startEdit,
    closeEdit,
    updateEditField,
    updateEditImage,
    submitEdit,
    removeDonation,
  } = useMyDonations();
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredDonations = selectedStatus === 'all'
    ? donations
    : donations.filter((donation) => donation.status === selectedStatus);

  return (
    <DonorLayout
      activeKey="myDonations"
      profile={profile}
      onLogout={handleLogout}
      pageClassName="my-donations-page"
    >
      <section className="my-donations-shell">
        <PostDonationIntro
          eyebrow="My Donations"
          title="Manage your posted donations."
          description="View each donation, update available posts, and remove food listings that are no longer active."
          imageAlt="Food donation volunteers"
        />

        {(profileError || statusMessage.message) && (
          <p className={`dashboard-alert ${statusMessage.type || 'error'}`}>
            {profileError || statusMessage.message}
          </p>
        )}

        <MyDonationsList
          donations={filteredDonations}
          totals={totals}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          isLoading={isLoading}
          onView={setSelectedDonation}
          onEdit={startEdit}
          onDelete={removeDonation}
        />
      </section>

      <DonationDetailsModal donation={selectedDonation} onClose={() => setSelectedDonation(null)} />
      <EditDonationModal
        editForm={editForm}
        isSaving={isSaving}
        onClose={closeEdit}
        onChange={updateEditField}
        onImageChange={updateEditImage}
        onSubmit={submitEdit}
      />
    </DonorLayout>
  );
};

export default MyDonationsPage;
