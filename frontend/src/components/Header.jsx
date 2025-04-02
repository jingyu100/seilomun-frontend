import AlarmContents from "./AlarmContents.jsx";
import ProductsAlarm from "./ProductsAlarm.jsx";

const Header = () => {
    return(<div className="head-area">
        <header>
            <div className="head-menu sideMargin" >

                <div className="head-top-menu">
                    <div className="head-top-half">
                        <div className="head-top-left"></div>
                    </div>
                    <div className="head-top-half">
                        <div className="head-top-right">
                            <ul className="head-top-right">
                                {/* <li className="myInfo">
                              <a href="">내 정보</a>
                           </li> */}
                                <li className="login">
                                    <a href="Login">로그인</a>
                                </li>
                                <li className="join" >
                                    <a href="">회원가입</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="head-mid">
                    <div className="head-mid-menu">
                        <div className="title-logo">
                            <h2>
                                <a href="">
                                    <div>
                                        <img src="../image/logo/mainLogo.png" alt="sampleLogo" style={{
                                            width: '200px', height: '90px'
                                        }} />
                                        {/* <!-- 프로젝트 로고 --> */}
                                    </div>
                                </a>
                            </h2>
                        </div>
                        <div className="search-ui product-search">
                            <div>
                                <form className="search" method="get" action="">
                                    <div className="search-inner">
                                        <div>
                                            <input type="text" placeholder="" className="search-input" />
                                            <button type="button" className="search-inputBtn">
                                                <svg width="30" height="30"
                                                     fill="none" viewBox="0 0 24 24"
                                                     className="search-icon">
                                                    <circle
                                                        cx="10.412" cy="10.412" r="7.482"
                                                        stroke="currentColor" stroke-linecap="round" stroke-width="1.5"
                                                    ></circle>
                                                    <path
                                                        stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M16.706 16.706L21 21"
                                                    ></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="icon-menu">
                            <ul className="icon-menuInner">
                                <li className="icon-Btn alarm-icon">
                                    <a href="" className="myAlarm myIcon">
                                        <div>
                                            <img src="../image/icon/icon-bell.png" alt="alarm" style={{
                                                width: '35px',
                                                height: '35px'
                                            }} />
                                        </div>
                                        <em className="headIconCount" id="alarm-cnt">0</em>
                                    </a>
                                    <div className='alarm-frame'>
                                 <span className='alarm-contents'>
                                    <ul className='alarm-inner'>
                                       {/* <!-- 여긴 알림에 아무것도 없거나 로그인을 안 했을 시 뜨는 문구 --> */}
                                        <li>알림 온 게 없습니다.</li>

                                        {/* <!-- 알림 온 게 있을 시 --> */}
                                        <AlarmContents products={ProductsAlarm} /> 
                                       <li>
                                          <a href="">
                                             <div>
                                                <span>해당 상품이 배송을 시작하였습니다.</span>
                                             </div>
                                             <div>
                                                <img src='/image/product1.jpg' alt="product1" style={{width: '70px', height: '70px'}} />
                                                <p>
                                                   <span>
                                                      <span>상품 이름</span>
                                                   </span>
                                                </p>
                                             </div>
                                          </a>
                                       </li>
                                       <li>
                                          <a href="">
                                             <div>
                                                <AlarmContents products={ProductsAlarm} /> 
                                             </div>
                                          </a>
                                       </li>
                                    </ul>
                                 </span>
                                    </div>
                                </li>
                                <li className="icon-Btn shopping-bag-icon">
                                    <a href="" className="myBag myIcon">
                                        <div>
                                            <img src="/image/icon/icon-shopping-bag.png" alt="shoppingBag" style={{
                                                width: '35px',
                                                height: '35px'
                                            }} />
                                        </div>
                                        <em className="headIconCount" id='shopping-bag-cnt'>0</em>
                                    </a>
                                    <div className='alarm-frame'>
                                 <span className='cart-contents'>
                                    <ul className='cart-inner'>
                                       {/* <!-- 여긴 장바구니에 아무것도 없거나 로그인을 안 했을 시 뜨는 문구 --> */}
                                        <li>장바구니에 담긴 상품이 없습니다.</li>
                                        {/* <!-- 장바구니에 담은 물건이 있을 시 --> */}
                                        <li>
                                          <a href="">
                                             <img src="" alt="" />
                                             <p>
                                                <span>
                                                   <span>상품 이름</span>
                                                </span>
                                             </p>
                                          </a>
                                       </li>
                                    </ul>
                                 </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="head-bottom">
                    <div className='kategorie'>
                        <div className='kategorie-frame' style={{
                            width: '45%', maxWidth: 'auto', minWidth: 'auto', padding: '0 0px 3px 3px'
                        }}>
                            <button className='menu-font-st' style={{
                                color: '#000',
                                fontSize: '16px',
                                fontWeight: '600',
                                padding: '4px',
                                paddingBottom: '8px',
                                height: '24px'
                            }}>
                           <span>
                              <img src='./image/icon/icon_nav.svg' alt="kategorie" style={{
                                  marginRight: '8px'
                              }}/>
                           </span>
                                카테고리
                                <span>
                           </span>
                            </button>
                        </div>
                    </div>
                    <nav className='menu-ui' style={{
                        whiteSpace: 'nowrap', justifyItems: 'center', paddingLeft: '20px'
                    }}>
                        <ul className='menu-inner'>
                            <li className='' >
                                <a href="/" className='menu-font-st menu-under' style={{
                                    borderBottom: '2px solid rgb(0, 0, 0)'
                                }}>홈</a>
                            </li>
                            <li className='' >
                                <a href="/" className='menu-font-st menu-under'>베스트</a>
                            </li>
                            <li className='' >
                                <a href="/" className='menu-font-st menu-under'>임박특가</a>
                            </li>
                            <li className='' >
                                <a href="/" className='menu-font-st menu-under'>주문 목록</a>
                            </li>
                            <li className='' >
                                <a href="/" className='menu-font-st menu-under'>위시리스트</a>
                            </li>
                        </ul>
                    </nav>
                </div>

            </div>
        </header>
    </div>)

}

export default  Header;
