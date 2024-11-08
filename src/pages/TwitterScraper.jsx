/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import API_URL from './config'
const TwitterScraper = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [hashtag, setHashtag] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [numposts,setnumposts] = useState('')
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    const handleScrape = async () => {
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        const trimmedMobileNumber = mobileNumber.trim();
        const trimmedHashtag = hashtag.trim();
        const trimmednumposts = parseInt(numposts.trim(), 10);  // Convert to number
    
        if (!trimmedUsername || !trimmedPassword || !trimmedMobileNumber || !trimmedHashtag || isNaN(trimmednumposts)) {
            alert("Please fill in all fields (username, password, hashtag, mobile number, number of posts)");
            return;
        }
    
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/scrape_twitter`, { 
                username: trimmedUsername,
                password: trimmedPassword,
                mobile_number: trimmedMobileNumber,
                hashtag: trimmedHashtag,
                desired_posts: trimmednumposts  // Send as number
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
            });
            setPosts(response.data);
        } catch (error) {
            if (error.response) {
                console.error("Error scraping data", error.response.data);
                alert(`Error: ${error.response.data.error || 'Scraping failed!'}`);
            } else {
                console.error("Error scraping data", error.message);
                alert("Network Error: Could not connect to the server. Please check if your backend is running.");
            }
        } finally {
            setLoading(false);
        }
    };
    

    const convertToCSV = (objArray) => {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let str = `${Object.keys(array[0]).join(',')}\r\n`;

        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (let key in array[i]) {
                if (line !== '') line += ',';
                line += array[i][key];
            }
            str += `${line}\r\n`;
        }

        return str;
    };

    const downloadCSV = () => {
        const csv = convertToCSV(posts);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'scraped_posts.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-light flex flex-col items-center justify-center">
            <h2 className="text-4xl text-center text-blue-950 font-bold mb-8">Twitter Scraper</h2>

            <div className="w-full max-w-lg space-y-4">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your Twitter username"
                    className="w-full p-4 text-lg border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your Twitter password"
                    className="w-full p-4 text-lg border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter your Twitter mobile number"
                    className="w-full p-4 text-lg border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                    type="text"
                    value={hashtag}
                    onChange={(e) => setHashtag(e.target.value)}
                    placeholder="Enter the hashtag (without #)"
                    className="w-full p-4 text-lg border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                    type="text"
                    value={numposts}
                    onChange={(e) => setnumposts(e.target.value)}
                    placeholder="Enter the no. of posts"
                    className="w-full p-4 text-lg border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
            </div>

            <button 
                className={`mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ${!hashtag.trim() || !username.trim() || !password.trim() || !mobileNumber.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleScrape} 
                disabled={loading || !hashtag.trim() || !username.trim() || !password.trim() || !mobileNumber.trim() || !numposts.trim()}
            >
                {loading ? "Scraping..." : "Start Scraping"}
            </button>

            {loading && (
                <div className="flex justify-center items-center mt-10">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                </div>
            )}

            <div className="w-full max-w-screen-lg mt-10 p-4 bg-white border-2 border-gray-200 rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold mb-2">Output:</h3>
                <div className="text-gray-700">
                    {posts.length > 0 ? (
                        <>
                            <button 
                                className="mb-3 p-2 rounded-md bg-green-600 text-white"
                                onClick={downloadCSV}
                            >
                                Download CSV
                            </button>
                            <pre className="bg-gray-100 p-3 border border-gray-300 rounded-md overflow-auto whitespace-pre-wrap">
                                {JSON.stringify(posts, null, 1)}
                            </pre>
                        </>
                    ) : (
                        'No data available. Please enter a query and scrape.'
                    )}
                </div>
            </div>
        </div>
    );
};

export default TwitterScraper;