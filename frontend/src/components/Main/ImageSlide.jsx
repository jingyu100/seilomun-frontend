import React, { useEffect, useRef, useState } from "react";
import "../../css/Main.css";

function ImageSlide () {

    const images = [
        { src: "/image/banner/BannerSP1.jpg", link: "https://example.com/1" },
        { src: "/image/banner/BannerSP2.jfif", link: "https://example.com/2" },
        { src: "/image/banner/BannerSP3.jfif", link: "https://example.com/3" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // 3초마다 슉 이동
  
      return () => clearInterval(interval);
    }, [images.length]);
  
    return (
      <div className="wrapper">
        <div className="slide_container">
          <ul
            className="slide_wrapper"
            onMouseEnter={onStop}
            onMouseLeave={onRun}
          >
            <div className={"slide original" + (animate ? "" : " stop")}>
              {images.map((image, index) => (
                <li key={index}>
                  <p className="item">
                    <a href={image.link} target="_blank" rel="noopener noreferrer">
                      <img src={image.src} alt={`BannerImages ${index + 1}`} />
                    </a>
                  </p>
                </li>
              ))}
            </div>
  
            <div className={"slide clone" + (animate ? "" : " stop")}>
              {images.map((image, index) => (
                <li key={`clone-${index}`}>
                  <p className="item">
                    <a href={image.link} target="_blank" rel="noopener noreferrer">
                      <img src={image.src} alt={`BannerImages ${index + 1}`} />
                    </a>
                  </p>
                </li>
              ))}
            </div>
          </ul>
        </div>
      </div>


    
    );

}

export default ImageSlide;