function AuthToggle({ showLogin, setShowLogin }) {
  return (
    <div className="toggle-auth">
      <button onClick={() => setShowLogin(true)} disabled={showLogin}>Login</button>
      <button onClick={() => setShowLogin(false)} disabled={!showLogin}>Sign Up</button>
    </div>
  );
}

export default AuthToggle;
