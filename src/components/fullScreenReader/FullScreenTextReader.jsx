import './FullScreenTextReader.css'
const FullScreenTextReader = ()=>{
    const btnCloseClicked = ()=>{
        document.getElementById("main-fullscreen-textreader").style.display = "none";
    }
    return <div id="fullscreen-textreader-wrapper">
            <button id="close-btn-fullscreen-reader" onClick={btnCloseClicked}>
                <img src="fullScreenIcon.svg" alt="" />
            </button>
            <section id="cont-content-fullscreen-textreader">

            </section>
           </div>
}
export default FullScreenTextReader