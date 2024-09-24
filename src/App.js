import './css/App.css';
import { Route, Routes } from 'react-router-dom';
import ListPage from './page/list';

function App() {
    return (
        <Routes>
            <Route path='/' element = {<ListPage />} />            
            {/* <Route path='/feedback' element= {<Feedback/>} /> */}
        </Routes>
    );
}

export default App;
