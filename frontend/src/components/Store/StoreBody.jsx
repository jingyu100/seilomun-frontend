import React, { useState, useRef, useEffect } from "react";
import "../../css/customer/Store.css";
import StoreMenu from "./StoreMenu";

export default function StoreBody() {

    return (
        <div className="storeBody">
            <div style={{
                position: "relative",
                justifyItems: "center",
            }}>
                <div style={{
                    position: "relative",
                    display: "flex",
                    width: "60%",
                    alignItems: "center",
                    textAlign: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid gray",
                    gap: "33%",   
                }}>
                    <div><p>메뉴</p></div>
                    <div><p>정보</p></div>
                    <div><p>리뷰</p></div>
                </div>
            </div>
            
            <div className=" ">
                <StoreMenu />
            </div>
        </div>
    );
}