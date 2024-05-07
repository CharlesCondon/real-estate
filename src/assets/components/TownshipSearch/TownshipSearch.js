import React from 'react'

function TownshipSearch({ onSearch }) {
    const [input, setInput] = React.useState('');

    return (
        <div>
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Enter PIN"
            />
            <button onClick={() => onSearch(input)}>Search</button>
        </div>
    );
}

export default TownshipSearch