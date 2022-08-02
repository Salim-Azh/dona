import * as React from 'react'
import { Link } from 'react-router-dom'

export function App() {
    return(
        <div>
            <h1>Welcome to DonaTrack!</h1>
            <Link to='/associations'>Get started and discover the associations</Link>
        </div>
    )
};

export default App;