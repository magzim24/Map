import "./BookInfo.css"

const BookInfo =()=>{
    return  <div className="book-profile-info-cont">
                <div>
                    <span id="bookname-in-book-profile"></span>
                </div>
                <div id="cont-author-audio">
                    <span>Озвучил: </span>
                    <span id="book-audio-author-in-book-profile"></span>
                </div>
                <div className="book-specification-img">
                    <img className="opened-book-img-profile" src="" alt="" />
                    {/* <span id="cont-profile-audio-rating">
                        <img className="img-star" src="star.svg" alt="" />
                        <span id="book-audio-rating-profile"></span>
                    </span> */}
                    
                </div>
            </div>
}
export default BookInfo;