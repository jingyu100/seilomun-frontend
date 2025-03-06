function FooterUI () {
    return (
        <div className="footerContainer">
            <div className="footerUI footerCommon sideMargin">
                <div className="footerHead footerCommon">
                    <ul className="footerHead_left">
                        <li>
                            <a href="">회사 소개</a>
                        </li>
                        <li>
                            <a href="">이용 약관</a>
                        </li>
                        <li>
                            <a href="" style={{
                                fontSize: '13px',
                                fontWeight: 'bold'
                            }}>개인정보처리방침</a>
                        </li>
                        <li>
                            <a href="">광고 문의</a>
                        </li>
                    </ul>
                    <ul className="footerHead_right">
                        <li>
                            <a href="https://www.instagram.com/">
                                <img src="https://kr.object.ncloudstorage.com/dev-open/design/sns/d83cb015-2c22-42f0-a932-2ceff9f2cdc7.png" alt="인스타그램" />
                            </a>
                        </li>
                        <li>
                            <a href="https://www.youtube.com/">
                                <img src="https://kr.object.ncloudstorage.com/prod-open/design/sns/5cc55db0-c642-4321-8436-d44afe904eb9.png" alt="유튜브" />
                            </a>
                        </li>
                        <li>
                            <a href="https://www.facebook.com/">
                                <img src="https://kr.object.ncloudstorage.com/dev-open/design/sns/1cf1b3ed-296f-47d4-a142-807a347f09b2.png" alt="페이스북" />
                            </a>
                        </li>
                        <li>
                            <a href="">
                                <img src="" alt="" />
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footerMid footerCommon">
                    <div>
                        <ul>
                            <li className="footerBold">COMPANY</li>
                            <p>
                                <span>(주) 세일로문</span>
                                <br />
                                <span>대표이사 : 백진규</span>
                                <br />
                                대구광역시 북구 복현로 35
                                <br />
                                대표 전화 : 053-940-5290 | 사업자 등록번호 : 000-00-00000
                                <br />

                            </p>
                        </ul>
                    </div>
                    <div>
                        <ul>
                            <li className="footerBold">CUSTOMER CENTER</li>
                            <p>
                                Tel : 1566-0000
                            </p>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default FooterUI;