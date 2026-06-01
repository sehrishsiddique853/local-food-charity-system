const DonorWelcome = ({ profile }) => (
  <section className="welcome-band">
    <div>
      <p>Welcome back,</p>
      <h1>{profile?.name || 'Donor'} <span>👋</span></h1>
      <p>Thank you for supporting the community!</p>
    </div>
    <img src="/home-page-ani.png" alt="Fresh food donation box" />
  </section>
);

export default DonorWelcome;
