// import React, { useState, useEffect } from 'react';
// import './App.css';

// function App() {

//   return (
//     <form action="{{ url_for('summarize') }}" method="post">
//             <label for="article">Enter your article:</label><br></br>
//             <textarea id="article" name="article" rows="10" cols="50"></textarea><br></br>
//             <button type="submit">Summarize</button>
//         </form>
//   );
// }

// export default App;

import React, { useState } from 'react';

function App() {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // clear previous error
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:6006/summarize', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error); 
            } else {
                setSummary(data.summary); 
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to connect to the backend. Please try again.');
        }
    };

    return (
        <div className="App">
            <h1>Legal-ease: Simplify your legal documents</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload and Summarize</button>
            </form>

            {error && (
                <div style={{ color: 'red' }}>
                    <h2>Error</h2>
                    <p>{error}</p>
                </div>
            )}

            {summary && (
                <div>
                    <h2>Summary</h2>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
}

export default App;
