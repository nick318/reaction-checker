import { useState, useEffect, useRef } from 'react'
import './App.css'

type GameState = 'idle' | 'waiting' | 'ready' | 'result' | 'tooEarly'

function getInitialScores(): number[] {
  const saved = localStorage.getItem('reactionScores')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        return parsed.filter((n): n is number => typeof n === 'number')
      }
    } catch {
      // Invalid JSON, return empty
    }
  }
  return []
}

function App() {
  const [gameState, setGameState] = useState<GameState>('idle')
  const [reactionTime, setReactionTime] = useState<number>(0)
  const [scores, setScores] = useState<number[]>(getInitialScores)
  const startTimeRef = useRef<number>(0)
  const timeoutRef = useRef<number | null>(null)

  const bestScore = scores.length > 0 ? Math.min(...scores) : null
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const startGame = () => {
    setGameState('waiting')
    const delay = 2000 + Math.random() * 1800 + 200
    timeoutRef.current = window.setTimeout(() => {
      setGameState('ready')
      startTimeRef.current = performance.now()
    }, delay)
  }

  const handleClick = () => {
    if (gameState === 'idle' || gameState === 'result' || gameState === 'tooEarly') {
      startGame()
    } else if (gameState === 'waiting') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setGameState('tooEarly')
    } else if (gameState === 'ready') {
      const endTime = performance.now()
      const time = Math.round(endTime - startTimeRef.current)
      setReactionTime(time)

      const newScores = [...scores, time]
      setScores(newScores)
      localStorage.setItem('reactionScores', JSON.stringify(newScores))

      setGameState('result')
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        handleClick()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'idle':
      case 'result':
      case 'tooEarly':
        return '#5c9ece'
      case 'waiting':
        return '#e57373'
      case 'ready':
        return '#81c784'
    }
  }

  const getMessage = () => {
    switch (gameState) {
      case 'idle':
        return (
          <>
            <span>Start</span>
            <span className="subtitle">(Click or press Space)</span>
          </>
        )
      case 'waiting':
        return 'Wait for Green...'
      case 'ready':
        return 'Smash it!'
      case 'tooEarly':
        return 'Too early! Click to try again'
      case 'result':
        return (
          <>
            <span className="reaction-time">{reactionTime} ms</span>
            <span className="try-again">Click to try again</span>
          </>
        )
    }
  }

  return (
    <div className="game-container">
      <div
        className="game-area"
        style={{ backgroundColor: getBackgroundColor() }}
        onClick={handleClick}
      >
        <div className="message">{getMessage()}</div>
      </div>
      <footer className="footer">
        {bestScore !== null && (
          <>
            <span>Best: {bestScore} ms {avgScore !== null && `(avg ${avgScore} ms)`}</span>
            <button
              className="reset-btn"
              onClick={(e) => {
                e.stopPropagation()
                setScores([])
                localStorage.removeItem('reactionScores')
              }}
            >
              Reset
            </button>
          </>
        )}
      </footer>
    </div>
  )
}

export default App
