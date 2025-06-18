import KakaoMapApi from "../KakaoMapApi"

export default function StoreMainInfo({
    address,
    addressDetail,
    phone,
    operatingHours,
    storeDescription,
}) {

    return(
        <div className="storeMainInfo">
            <div style={{
                // borderBottom: "1px solid #a7a7a7",
            }}>
                <KakaoMapApi address={address} />
            </div>
            
            <div className="storeInfoTable">
                <div className="storeInfoTable-ui">
                    <div className= "storeInfoTable-right">
                        <p className="storeInfoTable-title">주소</p>
                        <p className="storeInfoTable-title">연락처</p>
                        <p className="storeInfoTable-title">운영 시간</p>
                        <p className="storeInfoTable-title">가게 설명</p>
                    </div>
                    <div className= "storeInfoTable-left">
                        <p className="storeInfoTable-pv">{address} ({addressDetail})</p>
                        <p className="storeInfoTable-pv">{phone}</p>
                        <p className="storeInfoTable-pv">{operatingHours}</p>
                        <p className="storeInfoTable-pv">{storeDescription}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}