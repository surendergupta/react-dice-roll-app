import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './Die.css'

const Die = ({face, rolling}) => {
  return (
    <div>
      <FontAwesomeIcon icon={['fas', `fa-dice-${face}`]} className={`Die ${rolling && 'Die-shaking'}`} />
    </div>
  )
}

export default Die
