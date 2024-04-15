import "./LanguageComboBoxBookReader.css"

const LanguageComboBoxBookReader = () =>{

    const comboboxBtnClicked =()=>{
        const select = document.getElementById("lang-select")
        if(document.getElementById("combobox-btn").getAttribute("isopened") === "0"){
            select.style.display = "block"
            document.getElementById("combobox-btn").setAttribute("isopened", "1")
            document.getElementById("combobox-btn-arrow").style.transform = "rotate(0deg)"
        }
        else{
            select.style.display = "none"
            document.getElementById("combobox-btn").setAttribute("isopened", "0")
            document.getElementById("combobox-btn-arrow").style.transform = "rotate(180deg)"
        }

    }

    return <div id="combobox-language-selection">
                <button id="combobox-btn" isopened="0" onClick={comboboxBtnClicked}>
                    <img id="transIcon" src="translationIcon.svg"></img>
                    Выбрать звукозапись
                    <img id="combobox-btn-arrow" src="arrow.svg"></img>
                </button>
                <div id="lang-select">

                </div>
           </div>
}
export default LanguageComboBoxBookReader;