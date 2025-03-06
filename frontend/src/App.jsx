// import logo from './logo.svg';
import './App.css';
import './css/frame.css';
import FooterUI from './components/FooterUI.jsx'
import AlarmContents from './components/AlarmContents.jsx';
import ProductsAlarm from './components/ProductsAlarm.jsx';
import SideMenuBtn from './components/sideBtn/SideMenuBtn.jsx';
import Header from "./components/Header.jsx";



function App() {
  return (
   <div>
      {/* -------- 헤더 영역 -------- */}
      <div className="header">
         <Header/>
      </div>


      {/* -------- 바디 영역 -------- */}
      <div className= "body sideMargin">
            <SideMenuBtn />
      </div>

      {/* -------- 풋터(하단) 영역 -------- */}
      <div className="footer">
         <FooterUI />
      </div>
   </div>
  );
}

export default App;
