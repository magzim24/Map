import "./ButtonZoom.css"

const ButtonZoom = (props)=>{
    return <button id={props.idName + "-zoom-button"} className="zoom-button">
        {props.idName === "plus" ? <img src="plus.svg"></img> : <img src="minus.svg"></img>}
        
        </button>
}
export default ButtonZoom;