import ProductsAlarm from "./ProductsAlarm.jsx";

const AlarmContents = ({product}) => {
    const {name, thumbnail, url, state} = product;

    return (
        <li>
            <a href={url}>
                <li>{state}</li>
                <div>
                    <img src={thumbnail} alt="" style={{
                        width: '70px', height: '70px'
                    }} />
                    <p>
                        <span>
                            <span>{name}</span>
                        </span>
                    </p>
                </div>
            </a>
        </li>
    );
};

export default AlarmContents;