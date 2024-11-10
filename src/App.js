import React, { useState } from 'react';

function App() {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSummary('');
        setLoading(true); // Start loading indicator

        if (!file) {
            setError('Please select a file.');
            setLoading(false);
            return;
        }

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
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    const handleClear = () => {
        setFile(null);
        setSummary('');
        setError('');
    };

    const handleDownload = () => {
        const blob = new Blob([summary], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'summary.txt';
        link.click();
    };

    return (
        <div className="App">
          <script src="https://kit.fontawesome.com/663b498e89.js" crossorigin="anonymous"></script>
            <h1>Legal-ease</h1>  <i class="fa-solid fa-feather"></i>
            <h2>Simplify your legal documents:</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                /><br></br>
                <button type="submit" disabled={loading}>Summarize</button>
                <button type="button" onClick={handleClear}>Clear</button>
            </form>

            {loading && <p>Loading... Please wait.</p>}

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
                    <p><strong>Word Count:</strong> {summary.split(/\s+/).length}</p>
                    <button onClick={handleDownload}>Download Summary</button>
                </div>
            )}
        </div>
    );
}

export default App;
