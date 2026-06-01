const LoginIntro = () => {
  return (
    <section className="login-intro">
      <div className="login-intro-copy">
        <h1>
          Welcome Back!
          <br />
          Your Sign In
          <br />
          Helps Create
          <br />
          a <span>Better Tomorrow.</span>
        </h1>
        <p>
          Sign in to your account and continue making a positive impact by
          connecting food with those who need it most.
        </p>
      </div>

      <div className="login-art">
        <img src="/home-page-ani.png" alt="Food donation volunteers" />
      </div>

      <div className="login-benefits">
        <div className="login-benefit">
          <span>🛡</span>
          <div>
            <h3>Secure & Trusted</h3>
            <p>We ensure a safe and secure experience for all users.</p>
          </div>
        </div>
        <div className="login-benefit">
          <span>👥</span>
          <div>
            <h3>Verified NGOs</h3>
            <p>All NGOs are verified to ensure transparency and trust.</p>
          </div>
        </div>
        <div className="login-benefit">
          <span>🌿</span>
          <div>
            <h3>Reduce Food Waste</h3>
            <p>Your small action can lead to a big change in someone's life.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginIntro;
