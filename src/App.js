import { useState, useEffect } from 'react';
import './App.css';

const images = {
  light: {
    outside: '/outside-light.jpg',
    inside: '/inside-light.jpg'
  },
  dark: {
    outside: '/outside-dark.jpg',
    inside: '/inside-dark.jpg'
  }
};

const menuItems = [
  { id: 'cookie', name: 'Cookie', emoji: '🍪', time: 5 },
  { id: 'tea', name: 'Tea', emoji: '🍵', time: 10 },
  { id: 'croissant', name: 'Croissant', emoji: '🥐', time: 15 },
  { id: 'latte', name: 'Latte', emoji: '☕', time: 20 },
  { id: 'frappuccino', name: 'Frappuccino', emoji: '🥤', time: 25 },
  { id: 'matcha', name: 'Matcha Latte', emoji: '🍵', time: 30 }
];

function App() {
  const [theme, setTheme] = useState('light');
  const [page, setPage] = useState('landing'); // landing, cafe, menu, timer, complete
  const [selectedItem, setSelectedItem] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setPage('complete');
      playNotification();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const playNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('☕ Time\'s up!', {
        body: 'Your focus session is complete. Take a break!',
        icon: '☕'
      });
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const handlePlaceOrder = () => {
    if (selectedItem) {
      setTotalTime(selectedItem.time * 60);
      setTimeLeft(selectedItem.time * 60);
      setPage('timer');
      setIsRunning(false);
      
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  };

  const handleStartTimer = () => {
    setIsRunning(true);
  };

  const handleStopTimer = () => {
    setIsRunning(false);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  const handleOrderAgain = () => {
    setSelectedItem(null);
    setPage('menu');
    setIsRunning(false);
    setTimeLeft(0);
  };

  const handleLeaveCafe = () => {
    setPage('landing');
    setSelectedItem(null);
    setIsRunning(false);
    setTimeLeft(0);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </header>

      {page === 'landing' && (
        <div className="page landing-page">
          <div className="cafe-image-container">
            <img 
              src={images[theme].outside} 
              alt="Cafe exterior" 
              className="cafe-image"
            />
            <button 
              className="enter-btn action-button"
              onClick={() => setPage('cafe')}
            >
              Enter Cafe →
            </button>
          </div>
        </div>
      )}

      {page === 'cafe' && (
        <div className="page cafe-page">
          <div className="cafe-image-container">
            <img 
              src={images[theme].inside} 
              alt="Cafe interior" 
              className="cafe-image"
            />
            <button 
              className="menu-btn action-button"
              onClick={() => setPage('menu')}
            >
              View Menu →
            </button>
          </div>
        </div>
      )}

      {page === 'menu' && (
        <div className="page menu-page">
          <div className="cafe-image-container">
            <img 
              src={images[theme].inside} 
              alt="Cafe interior" 
              className="cafe-image blurred"
            />
          </div>
          
          <div className="menu-popup">
            <button className="leave-cafe-btn" onClick={handleLeaveCafe}>
              ← Leave Cafe
            </button>
            
            <h1 className="menu-title">MENU</h1>
            
            <div className="menu-grid">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  className={`menu-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
                  onClick={() => handleSelectItem(item)}
                >
                  <div className="item-emoji">{item.emoji}</div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-time">{item.time} min</div>
                </button>
              ))}
            </div>
            
            <button 
              className={`order-btn ${selectedItem ? 'active' : ''}`}
              onClick={handlePlaceOrder}
              disabled={!selectedItem}
            >
              {selectedItem ? 'Place Order' : 'At least one order per customer'}
            </button>
          </div>
        </div>
      )}

      {page === 'timer' && selectedItem && (
        <div className="page timer-page">
          <div className="cafe-image-container">
            <img 
              src={images[theme].inside} 
              alt="Cafe interior" 
              className="cafe-image blurred"
            />
          </div>
          
          <div className="timer-popup">
            <button className="leave-cafe-btn" onClick={handleLeaveCafe}>
              ← Leave Cafe
            </button>
            
            <div className="timer-content">
              <div className="selected-item-display">
                <div className="item-emoji-large">{selectedItem.emoji}</div>
                <h2 className="item-name-large">{selectedItem.name}</h2>
              </div>
              
              <div className="timer-display">
                <svg className="progress-ring" width="300" height="300">
                  <circle
                    className="progress-ring-background"
                    cx="150"
                    cy="150"
                    r="130"
                  />
                  <circle
                    className="progress-ring-progress"
                    cx="150"
                    cy="150"
                    r="130"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 130}`,
                      strokeDashoffset: `${2 * Math.PI * 130 * (1 - getProgress() / 100)}`
                    }}
                  />
                </svg>
                <div className="timer-text">{formatTime(timeLeft)}</div>
              </div>
              
              <div className="timer-controls">
                {!isRunning ? (
                  <button className="timer-btn start-btn" onClick={handleStartTimer}>
                    Start
                  </button>
                ) : (
                  <button className="timer-btn stop-btn" onClick={handleStopTimer}>
                    Pause
                  </button>
                )}
                <button className="timer-btn reset-btn" onClick={handleResetTimer}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {page === 'complete' && (
        <div className="page complete-page">
          <div className="cafe-image-container">
            <img 
              src={images[theme].inside} 
              alt="Cafe interior" 
              className="cafe-image blurred"
            />
          </div>
          
          <div className="complete-popup">
            <div className="complete-content">
              <div className="celebration">🎉</div>
              <h2 className="complete-title">Time's Up!</h2>
              <p className="complete-message">Great focus session! Take a well-deserved break.</p>
              
              <div className="complete-buttons">
                <button className="complete-btn" onClick={handleOrderAgain}>
                  Order Again
                </button>
                <button className="complete-btn secondary" onClick={handleLeaveCafe}>
                  Leave Cafe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer>
        <a href="https://yanisa.netlify.app/" target="_blank" rel="noreferrer">yanisa srisa-ard</a>
      </footer>
    </div>
  );
}

export default App;