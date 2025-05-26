import { useState } from 'react';
import './App.css';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupInfo, setSignupInfo] = useState({
    username: '',
    password: '',
    email: '',
    fullName: ''
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [thought, setThought] = useState('');
  const [showThoughtMessage, setShowThoughtMessage] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginUsername, password: loginPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      setIsAuthenticated(true);
    }
    alert(data.message || data.error);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupInfo),
    });

    const data = await res.json();
    if (res.ok) {
      setIsAuthenticated(true);
    }
    alert(data.message || data.error);
  };

  const handleThoughtSubmit = async (e) => {
    e.preventDefault();
    // You can send the thought to your backend here
    setShowThoughtMessage(true);
    setThought('');
  };

  if (isAuthenticated) {
    return (
      <div className="container">
        <h2>Write your thought for today</h2>
        <form onSubmit={handleThoughtSubmit}>
          <textarea
            placeholder="Type your thoughts..."
            value={thought}
            onChange={e => setThought(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
        {showThoughtMessage && <p>Thought submitted! ✅</p>}
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Welcome to My Journal!</h1>
      <div className="toggle-auth">
        <button onClick={() => setShowLogin(true)} disabled={showLogin}>Login</button>
        <button onClick={() => setShowLogin(false)} disabled={!showLogin}>Sign Up</button>
      </div>
      {showLogin ? (
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
      ) : (
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
      )}
    </div>
  );
}

export default App;
