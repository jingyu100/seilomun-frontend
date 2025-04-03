import { useState, useEffect } from "react";
import "../css/Main.css";

function MainBanner () {

    return (
        <div>
            <div>
                <div>

                </div>

                <div className="bannerLeftBtn">
                    <svg width="10" height="18" viewBox="0 0 10 18" fill="none" class="pagingButtonPc_icon__1bBio">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M1.5 16.5L9 9 1.5 1.5"></path>
                    </svg>
                </div>
                <div className="bannerRightBtn">
                    <svg width="10" height="18" viewBox="0 0 10 18" fill="none" class="pagingButtonPc_icon__1bBio">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M1.5 16.5L9 9 1.5 1.5"></path>
                    </svg>
                </div>
                <div className="bannerImages">
                    <a href=""
                        target="_blank" rel="noopener noreferrer">
                        <img src="src\image\banner\BannerSP3.jfif" alt="" />
                    </a>
                    <a href=""
                        target="_blank" rel="noopener noreferrer">
                        <img src="src\image\banner\BannerSP2.jfif" alt="" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default MainBanner;