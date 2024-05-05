import './MainReaderWrapper.css'
import BookInfo from '../book-info/BookInfo'
import LanguageComboBoxBookReader from '../lang-combobox/LanguageComboBoxBookReader'
import AudioPlayerBookReader from '../audioplayer/AudioPlayerBookReader'
import TextReader from '../text-reader/TextReader'

const MainReaderWrapper = ()=>{

    const btnCloseClicked = ()=>{
        document.getElementById("main-reader-books-wrapper").style.display = "none";
        document.getElementById("lang-select").style.display = "none"
        document.querySelector("#combobox-btn-arrow").style.transform = "rotate(180deg)"
        document.querySelector("#combobox-btn").setAttribute("isopened", "0")
    }

    const btnFullScreenClicked = ()=>{
        document.querySelector("#cont-content-fullscreen-textreader").innerHTML = document.querySelector(".cont-text-story").firstChild.innerHTML
        document.querySelector("#main-fullscreen-textreader").style.display = "flex"
    }

    function btnOfferOpen(){
        fetch("http://saintmolly.ru:3005/api/ethnic-group/language/all")
        .then(response=>response.json())
        .then(commits=>{
            
            const select = document.querySelector("#combobox-offer")
            select.innerHTML = ''
            let option;
            let id = 1;
            option = document.createElement("option");
            option.innerHTML = "Выберете язык вашей озвучки";
            option.setAttribute("value", 0);
            select.append(option);
            commits.map(data=>{
                option = document.createElement("option");
                option.innerHTML = data["name"];
                option.setAttribute("value", id);
                select.append(option);
                id++;
            })
            document.querySelector(".offer-main-cont").style.display = "flex";
        })
    }

    return <div id="main-cont-reader-horizontal">
                <div id='BookProfile-wrapper'>
                    <div className='cont-BookInfoAndAudio'>
                        <div id='BookProfile-btn-close-cont'>
                            <button id='BookProfile-btn-close' onClick={btnCloseClicked}>
                                <img src="close.svg" alt="" />
                            </button>
                        </div>
                        <div id='BookProfile-content-cont'>
                            <div>
                                <img className='preview-img-book-reader' src="" alt="" />
                            </div>
                            <div id='BookProfile-bookInfoAndAudio-cont'>
                                <BookInfo></BookInfo>
                                <div id='btn-offer-voice-acting' /* style={{display:"none"}} */>
                                    <button id='voice-over-suggestion-button' onClick={btnOfferOpen}><img src="note_white.svg" alt="" />Предложить озвучку</button>
                                </div>
                                <LanguageComboBoxBookReader></LanguageComboBoxBookReader>
                                <AudioPlayerBookReader></AudioPlayerBookReader>
                                
                            </div>
                        </div>
                    </div>
                    <div id='TextBlock-cont'>
                        <button id='btn-bookProfile-textReader-fullscreen' onClick={btnFullScreenClicked}><img src="fullScreenIcon.svg" alt="" /></button>
                        <TextReader></TextReader>
                    </div>
                </div>
           </div>
}
export default MainReaderWrapper;