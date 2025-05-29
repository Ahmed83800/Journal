function ThoughtForm({ thought, setThought, mood, setMood, handleThoughtSubmit, showThoughtMessage }) {
  return (
    <form onSubmit={handleThoughtSubmit}>
      <div>
        <label>Thought:</label>
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          required
          rows={3}
          cols={40}
        />
      </div>

      <div>
        <label>Mood:</label>
        <label>
          <input
            type="radio"
            name="mood"
            value="neutral"
            checked={mood === 'neutral'}
            onChange={(e) => setMood(e.target.value)}
          />
          Neutral
        </label>

        <label>
          <input
            type="radio"
            name="mood"
            value="happy"
            checked={mood === 'happy'}
            onChange={(e) => setMood(e.target.value)}
          />
          Happy
        </label>

        <label>
          <input
            type="radio"
            name="mood"
            value="sad"
            checked={mood === 'sad'}
            onChange={(e) => setMood(e.target.value)}
          />
          Sad
        </label>
      </div>

      <button type="submit">Add Thought</button>
      {showThoughtMessage && <p>Thought submitted!</p>}
    </form>
  );
}

export default ThoughtForm;
