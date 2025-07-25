import React, { useState, useEffect,useCallback, useMemo  } from 'react'
import confetti from 'canvas-confetti';

import Die from '../Die/Die';
const diceFaces = ['one', 'two', 'three', 'four', 'five', 'six'];

import './RollDice.css'
const RollDice = ({ darkMode  }) => {
    
    const [rolling, setRolling] = useState(false);
    const [history, setHistory] = useState([]);
    const [die1, setDie1] = useState('one');
    const [die2, setDie2] = useState('one');
    // const rollSound = new Audio('/dice-rolling.mp3');
    const rollSound = useMemo(() => new Audio('/dice-rolling.mp3'), []);
    
    const [playerTurn, setPlayerTurn] = useState(1);
    const [playerScores, setPlayerScores] = useState({ 1: 0, 2: 0 });
    const [winner, setWinner] = useState(null);
    
    const [autoRoll, setAutoRoll] = useState(false);
    
    const handleBtn = rolling ?'RollDice-rolling' : '';
    // const getDieValue = (face) => diceFaces.indexOf(face) + 1;

    const getDieValue = useCallback((face) => diceFaces.indexOf(face) + 1,[]);
    const roll = useCallback(() => {
        const value1 = diceFaces[Math.floor(Math.random() * diceFaces.length)];
        const value2 = diceFaces[Math.floor(Math.random() * diceFaces.length)];
        setDie1(value1);
        setDie2(value2);
        const newRoll = [value1, value2];
        setHistory((prev) => {
            const updated = [...prev, newRoll];
            return updated.slice(-5); // keep last 5 rolls
        });
        const total = getDieValue(value1) + getDieValue(value2);

        setRolling(true);

        // Play sound if added
        if (rollSound) {
            rollSound.pause();
            rollSound.currentTime = 0;
            rollSound.play().catch(() => {});
        }

        setTimeout(() => {
            setRolling(false);

            // Update scores
            setPlayerScores((prevScores) => {
            const newScore = prevScores[playerTurn] + total;
            const updatedScores = {
                ...prevScores,
                [playerTurn]: newScore,
            };

            // Check for winner
            if (newScore >= 100) {                
                setWinner(playerTurn);
                confetti({
                    particleCount: 300,
                    startVelocity: 30,
                    spread: 180,
                    ticks: 60,
                    origin: { y: 0.6 },
                });
            }

            return updatedScores;
            });

            // Switch turn if no winner
            if (!winner) {
                setPlayerTurn((prevTurn) => (prevTurn === 1 ? 2 : 1));
            }
        }, 1000);
    }, [playerTurn, winner, rollSound, setPlayerScores, setPlayerTurn, setWinner, getDieValue]);

    useEffect(() => {
        let interval;
        if (autoRoll && !winner) {
            interval = setInterval(() => {
            roll();
            }, 2000); // change delay if needed
        }
        return () => clearInterval(interval);
    }, [autoRoll, winner, roll]);

  return (
    <div className={`roll-dice ${darkMode ? 'dark' : 'light'}`}>        
        <div >        
            <div className='roll-dice__container'>           
                <Die face={die1} rolling={rolling} />
                <Die face={die2} rolling={rolling} />
            </div>
            <p className="roll-total">
                You rolled: {getDieValue(die1)} + {getDieValue(die2)} = <strong>{getDieValue(die1) + getDieValue(die2)}</strong>
            </p>
            <button 
                aria-label="Roll Dice"
                className={handleBtn}
                disabled={rolling || winner || autoRoll}
                onClick={roll}
                
            >
                {rolling ? 'Rolling' : winner ? 'Game Over' : `Roll Dice! (Player ${playerTurn})`}
            </button>
            <br />
            {winner && (
                <button className="reset-btn" onClick={() => {
                    setPlayerScores({ 1: 0, 2: 0 });
                    setWinner(null);
                    setPlayerTurn(1);
                    setHistory([]);
                    setDie1('one');
                    setDie2('one');
                    setRolling(false);
                }}>
                    🔄 Reset Game
                </button>
                )}
            <br />
            <button aria-label="Start or Stop Auto Roll" className="auto-roll-toggle" onClick={() => setAutoRoll((prev) => !prev)} >
                {autoRoll ? '🛑 Stop Auto Roll' : '🔁 Start Auto Roll'}
            </button>
        </div>
        <div >
            <div className="player-scores">
                {!winner ? (
                    <h3>🎯 Player {playerTurn}'s Turn {playerTurn === 1 ? '👤' : '🧑‍💻'}</h3>
                    ) : (
                    <h2>🏆 Player {winner} Wins!</h2>
                    )}

                    <div className="scoreboard">
                    <p>👤 Player 1: {playerScores[1]}</p>
                    <p>🧑‍💻 Player 2: {playerScores[2]}</p>
                    </div>
            </div>
            <div className="roll-history">
                <h4>Last 5 Rolls:</h4>
                <table>
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Dice 1</th>
                            <th>Dice 2</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                    {history.slice().reverse().map((roll, index) => (
                    <tr key={index}>
                        <td>{history.length - index}</td>
                        <td>🎲 { getDieValue(roll[0])}</td>
                        <td>🎲 { getDieValue(roll[1])}</td>
                        <td>🎲 { getDieValue(roll[0]) + getDieValue(roll[1]) }</td>
                    </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default RollDice;
