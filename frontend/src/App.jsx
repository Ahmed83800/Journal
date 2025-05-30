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
  const [thoughts, setThoughts] = useState([]);
  const [mood, setMood] = useState('neutral');
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState('new');
  const [editingThoughtId, setEditingThoughtId] = useState(null);

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
      setUserId(data.userId);
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
      setUserId(data.userId);
    }
    alert(data.message || data.error);
  };

  const handleThoughtSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("User ID not found");

    const url = editingThoughtId ? `/api/thoughts/${editingThoughtId}` : '/api/thoughts';
    const method = editingThoughtId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, text: thought, mood }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowThoughtMessage(true);
        setThought('');
        setMood('neutral');
        setEditingThoughtId(null);
        if (currentPage === 'all') fetchAllThoughts();
      } else {
        alert(data.error || 'Failed to submit thought');
      }
    } catch {
      alert('Error submitting thought');
    }
  };

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

  const deleteThought = async (id) => {
    const res = await fetch(`/api/thoughts/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) {
      fetchAllThoughts();
    } else {
      alert(data.error || 'Failed to delete');
    }
  };

  const editThought = (t) => {
    setThought(t.text);
    setMood(t.mood);
    setEditingThoughtId(t._id);
    setCurrentPage('new');
  };

  useEffect(() => {
    if (currentPage === 'all') fetchAllThoughts();
  }, [currentPage]);

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setThought('');
    setThoughts([]);
    setCurrentPage('new');
    setLoginUsername('');
    setLoginPassword('');
  };

  if (!isAuthenticated) {
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

  return (
    <div className="app-layout">
      <div className="sidebar">
        <button onClick={() => setCurrentPage('new')}>New Thought</button>
        <button onClick={() => setCurrentPage('all')}>Show All Thoughts</button>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="content">
        {currentPage === 'new' && (
          <ThoughtForm
            thought={thought}
            setThought={setThought}
            mood={mood}
            setMood={setMood}
            handleThoughtSubmit={handleThoughtSubmit}
            showThoughtMessage={showThoughtMessage}
          />
        )}

        {currentPage === 'all' && (
          <div>
            <h3>All Your Thoughts</h3>
            {thoughts.length === 0 ? (
              <p>No thoughts yet.</p>
            ) : (
              <div className="thought-cards">
                {thoughts.map(t => (
                  <div className="thought-card" key={t._id}>
                    <p><strong>Mood:</strong> {t.mood}</p>
                    <p>{t.text}</p>
                    <p><em>{new Date(t.date).toLocaleString()}</em></p>
                    <button onClick={() => editThought(t)}>Update</button>
                    <button onClick={() => deleteThought(t._id)}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
