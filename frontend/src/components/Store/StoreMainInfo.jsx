import KakaoMapApi from "../KakaoMapApi"

export default function StoreMainInfo(
    address,
    
) {

    return(
        <div className="storeMainInfo">
            <KakaoMapApi address={address || "대구광역시 북구 복현로 35"} />
            
            <div>

            </div>
        </div>
    )
}