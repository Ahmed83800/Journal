function LoginForm({ loginUsername, setLoginUsername, loginPassword, setLoginPassword, handleLogin }) {
  return (
    <form onSubmit={handleLogin} className="auth-form">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={loginUsername}
        onChange={e => setLoginUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={loginPassword}
        onChange={e => setLoginPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
