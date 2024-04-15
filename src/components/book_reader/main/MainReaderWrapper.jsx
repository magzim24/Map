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
                    <button onClick={btnCloseClicked}>
                        <img src="" alt="" />
                    </button>
                    <div>
                        <img className='preview-img-book-reader' src="" alt="" />
                    </div>
                    <div>
                        <BookInfo></BookInfo>
                        <LanguageComboBoxBookReader></LanguageComboBoxBookReader>
                        <AudioPlayerBookReader></AudioPlayerBookReader>
                        <div style={{display:"none"}}>
                            <button>Предложить озвучку</button>
                        </div>
                    </div>
                </div>
                <div>
                    <TextReader></TextReader>
                </div>
           </div>
}
export default MainReaderWrapper;