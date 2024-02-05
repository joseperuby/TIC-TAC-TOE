import { useState } from 'react';
import './Restart.css';


export default function Restart(props){
    return (
        <div className="restart-content">
            <button className="restart" onClick={props.handleRestart}>Restart</button>
        </div>
    )
}
