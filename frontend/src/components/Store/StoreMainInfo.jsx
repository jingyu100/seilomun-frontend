import KakaoMapApi from "../KakaoMapApi"

export default function StoreMainInfo({
    address,
    phone,
    operatingHours,

    storeDescription,
}) {

    return(
        <div className="storeMainInfo">
            <KakaoMapApi address={address} />
            
            <div className="storeInfoTable">
                <div className="storeInfoTable-ui">
                    <div className="storeInfoTable-inner">
                        <p className="storeInfoTable-title">주소</p>
                        <p>{address}</p>
                    </div>
                    <div className="storeInfoTable-inner">
                        <p className="storeInfoTable-title">연락처</p>
                        <p>{phone}</p>
                    </div>
                    <div className="storeInfoTable-inner">
                        <p className="storeInfoTable-title">운영 시간</p>
                        <p>{operatingHours}</p>
                    </div>
                    <div className="storeInfoTable-inner">
                        <p className="storeInfoTable-title">가게 설명</p>
                        <p>{storeDescription}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}