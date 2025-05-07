import "../../css/customer/Store.css";

export default function Inquiry() {
    
    return (
        <div className="inquiry storeRight-ui"
            style={{

            }}
            onClick={() => {
                console.log("클릭됨");
            }}
        >
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px"
            }}>
                <p style={{ paddingTop: "3px", }}>1:1문의</p>
                <img src="/image/icon/icon-chat2.png" alt="" style={{
                    width: "20%",
                    height: "auto",
                }} />
            </div>
        </div>
    )
}