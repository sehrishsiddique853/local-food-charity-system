const RegisterIntro = () => {
  return (
    <section className="register-intro">
      <div className="register-intro-copy">
        <h1>
          Join Us Today!
          <br />
          Your Registration
          <br />
          Helps Create
          <br />
          a <span>Better Tomorrow.</span>
        </h1>
        <p>
          Create your account and start making a positive impact by
          connecting food with those who need it most.
        </p>
      </div>

      <div className="register-art">
        <img src="/home-page-ani.png" alt="Food donation handover" />
      </div>

      <div className="register-benefits">
        <div className="register-benefit">
          <span>🛡</span>
          <div>
            <h3>Secure & Trusted</h3>
            <p>We ensure a safe and secure experience for all users.</p>
          </div>
        </div>
        <div className="register-benefit">
          <span>👥</span>
          <div>
            <h3>Verified NGOs</h3>
            <p>All NGOs are verified to ensure transparency and trust.</p>
          </div>
        </div>
        <div className="register-benefit">
          <span>🌿</span>
          <div>
            <h3>Reduce Food Waste</h3>
            <p>Your small action can lead to a big change in someone&apos;s life.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterIntro;
