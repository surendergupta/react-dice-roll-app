import React, { useState } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

import RollDice from './Components/RollDice/RollDice'

import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => setDarkMode(prev => !prev);
  return (
    <>
      <div className={`App ${darkMode ? 'dark' : 'light'}`}>
        <h1>React Dice Roll</h1>
        <button className="theme-toggle" onClick={toggleTheme}>  {darkMode ? 'Light' : 'Dark'} Mode</button>
        <RollDice darkMode={darkMode} />
      </div> 
    </>
  )
}

export default App
