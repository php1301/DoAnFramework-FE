import React from 'react'

function SetApi() {
    const handleClick = () => {
        const api = document.getElementById("apiInput").value
        const hub = document.getElementById("hubInput").value
        localStorage.setItem("baseApi", api);
        localStorage.setItem("hubApi", hub);
    }
    return (
        <div>
            <p>Api</p>
            <input id="apiInput" type="text" />
            <p>Hub</p>
            <input id="hubInput" type="text" />
            <button onClick={handleClick}>Set base URL Ngrok</button>
        </div>
    )
}

export default SetApi;
