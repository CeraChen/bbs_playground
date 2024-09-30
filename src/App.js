import './css/App.css';
import { useState, useEffect } from "react";
import { Route, Routes } from 'react-router-dom';
import ListPage from './page/list';



function App() {
    console.log("to fetch");
    const [mNotes, loadNotes] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                fetch("http://localhost:5001/api/load", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log("get data");
                    console.log(data);
                    loadNotes(data);
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Routes>
            <Route path='/' element = {<ListPage noteJson={mNotes} />} />
        </Routes>
    );
}

export default App;
