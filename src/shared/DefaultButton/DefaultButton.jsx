import React from 'react'
import "./DefaultButton.scss"

const DefaultButton = ({
  onClickFunction,
  style,
  content

}) => {
  return (
    <div className='default-btn' style={style} onClick={onClickFunction}>{content}</div>
  )
}

export default DefaultButton