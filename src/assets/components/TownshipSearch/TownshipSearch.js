import React from 'react'
import './TownshipSearch.css'

function TownshipSearch({ onSearch }) {
    const [input, setInput] = React.useState('');

    return (
        <div className='searchCont'>
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Enter PIN or Address"
            />
            <button onClick={() => onSearch(input)}>Search</button>
        </div>
    );
}

export default TownshipSearch