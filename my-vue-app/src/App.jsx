import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(10);
  const [name, setName] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let intervalId;
    
    if (isRunning && count > 0) {
      intervalId = setInterval(() => {
        setCount(prevCount => prevCount - 1);
      }, 1000);
    } else if (count === 0 && isRunning) {
      setIsRunning(false);
      setIsFinished(true);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, count]);

  function startTimer() {
    if (!isRunning) {
      setIsRunning(true);
      setIsFinished(false);
    }
  }

  function resetTimer() {
    setCount(10);
    setIsRunning(false);
    setIsFinished(false);
    setName('');
  }

  return (
    <div>
      <input 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <br />
      <br />
      <h3>{count}</h3>
      <br />
      {isFinished && (
        <div>
          <h3>You got it {name} 💪</h3>
          <br />
        </div>
      )}
      <button onClick={startTimer}>Start Timer</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  )
}

export default App
