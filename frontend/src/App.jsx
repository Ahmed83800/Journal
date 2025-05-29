import { useState, useEffect } from 'react';
import './App.css';
import AuthToggle from './components/AuthToggle';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ThoughtForm from './components/ThoughtForm';

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
  const [showall, setShowAll] = useState(false);
  const [thoughts, setThoughts] = useState([]);
  const [mood, setMood] = useState('neutral');  // default mood


  // Store current user id after login/signup
  const [userId, setUserId] = useState(null);

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
      setUserId(data.userId); // assume your server returns userId on login success
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
      setUserId(data.userId); // assume your server returns userId on signup success
    }
    alert(data.message || data.error);
  };

  // Submit new thought to backend
  const handleThoughtSubmit = async (e) => {
  e.preventDefault();
  if (!userId) return alert("User ID not found");

  try {
    const res = await fetch('/api/thoughts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, text: thought, mood }),
    });

    const data = await res.json();
    if (res.ok) {
      setShowThoughtMessage(true);
      setThought('');
      setMood('neutral'); // reset mood after submit
      if (showall) fetchAllThoughts();
    } else {
      alert(data.error || 'Failed to add thought');
    }
  } catch {
    alert('Error submitting thought');
  }
  };


  // Fetch all thoughts from server for current user
  const fetchAllThoughts = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/thoughts/${userId}`);
      const data = await res.json();
      if (res.ok) {
        setThoughts(data);
      } else {
        alert(data.error || 'Failed to load thoughts');
      }
    } catch {
      alert('Error fetching thoughts');
    }
  };

  // When showall changes to true, fetch all thoughts
  useEffect(() => {
    if (showall) {
      fetchAllThoughts();
    }
  }, [showall]);

  if (isAuthenticated) {
    return (
      <div className="container">
        <ThoughtForm
          thought={thought}
          setThought={setThought}
          mood={mood}
          setMood={setMood}
          handleThoughtSubmit={handleThoughtSubmit}
          showThoughtMessage={showThoughtMessage}
       />


        <button onClick={() => setShowAll(prev => !prev)}>
          {showall ? 'Hide All Thoughts' : 'Show All Thoughts'}
        </button>

        {showall && (
          <div style={{ marginTop: '20px' }}>
            <h3>All Your Thoughts</h3>
            {thoughts.length === 0 ? (
              <p>No thoughts yet.</p>
            ) : (
              <ul>
                {thoughts.map(t => (
                  <li key={t._id}>
                    <strong>{t.mood}</strong> — {t.text} <em>({new Date(t.date).toLocaleString()})</em>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Welcome to My Journal!</h1>
      <AuthToggle showLogin={showLogin} setShowLogin={setShowLogin} />
      {showLogin ? (
        <LoginForm
          loginUsername={loginUsername}
          setLoginUsername={setLoginUsername}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          handleLogin={handleLogin}
        />
      ) : (
        <SignupForm
          signupInfo={signupInfo}
          setSignupInfo={setSignupInfo}
          handleSignup={handleSignup}
        />
      )}
    </div>
  );
}

export default App;
