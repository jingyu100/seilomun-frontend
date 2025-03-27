import React from "react";

const AlarmContents = ({ products }) => {
    return (
        <ul>
            {products.map((product) => (
                <li key={product.id}>
                    <a href={product.url || "#"}> {/* URL이 없을 경우 기본값 설정 */}
                        <li>{product.state}</li>
                        <div>
                            <img src={product.image} alt={product.name} style={{
                                width: '70px', height: '70px'
                            }} />
                            <p>
                                <span>
                                    <span>{product.name}</span>
                                </span>
                            </p>
                        </div>
                    </a>
                </li>
            ))}
        </ul>
    );
};

export default AlarmContents;
