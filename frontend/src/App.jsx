// import logo from './logo.svg';
import './App.css';
import './css/frame.css';
import Footer from './components/Footer.jsx'
import AlarmContents from './components/AlarmContents.jsx';
import ProductsAlarm from './components/ProductsAlarm.jsx';
import SideMenuBtn from './components/sideBtn/SideMenuBtn.jsx';
import Header from "./components/Header.jsx";
import Filter from "./components/Filter.jsx";



function App() {
    return (
        <div>
            <div className="header">
                <Header />
            </div>

            <div className="body sideMargin">
                <Filter />
                <SideMenuBtn />
            </div>

            <div className="footer">
                <Footer />
            </div>
        </div>
    );
}

export default App;
