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
      <div>
         <Header/>
      </div>
df

      {/* -------- 바디 영역 -------- */}
      <div style={{
            width: '100%', height: '100%', position: 'relative', zIndex: '20대'
         }}>
         <div style={{
            height: '1200px'
         }} >
            <SideMenuBtn />
         </div>
      </div>

      {/* -------- 풋터(하단) 영역 -------- */}
      <footer>
         <FooterUI />
      </footer>
   </div>
  );
}

export default App;
