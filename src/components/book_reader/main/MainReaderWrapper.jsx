import './MainReaderWrapper.css'
import BookInfo from '../book-info/BookInfo'
import LanguageComboBoxBookReader from '../lang-combobox/LanguageComboBoxBookReader'
import AudioPlayerBookReader from '../audioplayer/AudioPlayerBookReader'
import TextReader from '../text-reader/TextReader'

const MainReaderWrapper = ()=>{

    const btnCloseClicked = ()=>{
        document.getElementById("main-reader-books-wrapper").style.display = "none";
        document.getElementById("lang-select").style.display = "none"
    }

    return <div id="main-cont-reader-horizontal">
                <div>
                    <button onClick={btnCloseClicked} id="closeBtn">
                        <img src="close.svg" alt="" id="closeImg"/>
                    </button>
                    <div id="imgDiv">
                        <img className='preview-img-book-reader' src="" alt=""/>
                    </div>
                    <div id="allDiv">
                        <BookInfo></BookInfo>
                        <LanguageComboBoxBookReader></LanguageComboBoxBookReader>
                        <AudioPlayerBookReader></AudioPlayerBookReader>
                        <div id='btn-offer-voice-acting' style={{display:"none"}}>
                            <button>Предложить озвучку</button>
                        <div>
                            <button style={{background: 'transparent', border: 'none'}}>
                            Предложить озвучку
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                <TextReader></TextReader>
                </div>
           </div>
    </div>
}
export default MainReaderWrapper;