function SignupForm({ signupInfo, setSignupInfo, handleSignup }) {
  return (
    <form onSubmit={handleSignup} className="auth-form">
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        value={signupInfo.username}
        onChange={e => setSignupInfo({ ...signupInfo, username: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={signupInfo.password}
        onChange={e => setSignupInfo({ ...signupInfo, password: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={signupInfo.email}
        onChange={e => setSignupInfo({ ...signupInfo, email: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Full Name"
        value={signupInfo.fullName}
        onChange={e => setSignupInfo({ ...signupInfo, fullName: e.target.value })}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignupForm;
