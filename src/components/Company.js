import React from 'react'
import { Link } from 'react-router-dom'
import logo from './static/InfoceptsLogo.png'

export default function Company(props) {

  return (
    <div >
      <div style={{display:'flex',justifyContent:'center',position:'relative'}}>
        <Link to={'/home'}><img src={logo} alt="Company" width={200}/></Link>
      </div>
      {props.children}
    </div>
  )
}
