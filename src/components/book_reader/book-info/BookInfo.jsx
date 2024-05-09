import { useEffect } from "react";
import "./BookInfo.css"

const BookInfo =()=>{
    let starsCont;
    let rating

    function refreshToken(){
        fetch("http://saintmolly.ru:3005/api/auth/refresh", {
            method:"POST",
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem("refreshToken")
            }
        }).then(response=>response.json()).then(commits=>{
            localStorage.setItem("accessToken", commits["accessToken"]);
            localStorage.setItem("refreshToken", commits["refreshToken"])
        })
    }

    function GenerateStarMenu(){
        if(!document.querySelector(".stars-rate-cont")){
            const div = document.createElement("div")
            div.setAttribute("class", "stars-rate-cont")
            let star;let i = 0
            for (;i<5; i++){
                star = document.createElement("img")
                star.setAttribute("class", "star-rate")
                star.setAttribute("src", i+1 <= rating ? "star.svg" : "StarStroke.svg" )
                star.setAttribute("value", i+1)
                star.addEventListener("click", OnStarClicked)
                star.addEventListener("mouseover", OnMouseOverOnStar)
                star.addEventListener("mouseout", OnMouseOutOnStar)
                
                
                div.append(star)
            }
            document.querySelector("#cont-profile-audio-rating").append(div)
            starsCont = div
        }
        else{
            document.querySelector(".stars-rate-cont").style.display = "flex"
        }
    }
    function btnStarClicked(){
        fetch("http://saintmolly.ru:3005/api/story/rating/my/"+document.querySelector("#combobox-btn").getAttribute("useraudioid"),{
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem("accessToken")
            }
        }).then(response=>response.json())
        .then(commit=>{
            console.log(commit)
            if(commit["statusCode"]){
                if(commit["statusCode"]===401) {
                    if(localStorage.accessToken !== 'undefined'){refreshToken()}
                    else document.querySelector(".login-cont-main").style.display = "flex"
                }
                if(commit["statusCode"]===400){
                    rating = Number(commit["rating"])
                    GenerateStarMenu()
                }
            }
            else {
                
                rating = Number(commit["rating"])
                GenerateStarMenu()
            }
        })
        
        
    }
    function OnStarClicked(event){
        rating = Number(event.target.getAttribute("value"))
        const info = JSON.stringify({
            "rating": rating,
            "audioId": Number(localStorage.getItem("currentStoryAudioId"))
        })
        console.log(info)
        fetch("http://saintmolly.ru:3005/api/story/rating/add",{
            method:"PUT",
            headers:{
                'Content-Type': 'application/json',
                "Authorization":"Bearer "+ localStorage.getItem("accessToken")
            },
            body: info
        }).then(response=>response.json())
        .then(commit=>{
            console.log(commit)
            if(commit["statusCode"]){
                if(commit["statusCode"]===401) {
                    if(localStorage.accessToken !== 'undefined'){refreshToken()}
                    else document.querySelector(".login-cont-main").style.display = "flex"
                }
            }
            else {
                alert("Оценка успешно отправлена!")
                document.querySelector("#book-audio-rating-profile").innerHTML = commit["ratingAudioStory"]
            }
        })
    }
    function OnMouseOutOnStar(){
        
        let tempCont = [...starsCont.children].slice(0, rating ? rating : 0);
        [...starsCont.children].map(data=>{
            data.setAttribute("src", "StarStroke.svg")
        })
        
        tempCont.map(data=>{
            data.setAttribute("src", "star.svg")
        })
    }
    function OnMouseOverOnStar(event){
        [...starsCont.children].map(data=>{
            data.setAttribute("src", "StarStroke.svg")
        })
        let i = Number(event.target.getAttribute("value"))
        let tempCont = [...starsCont.children].slice(0, i)
        tempCont.map(data=>{
            data.setAttribute("src", "star.svg")
        })
    }
    useEffect(()=>{
        const mainReaderCont= document.querySelector("#main-cont-reader-horizontal")
        mainReaderCont.addEventListener('mouseup', function(e) {
            var container = document.getElementsByClassName("stars-rate-cont")[0];
            if(container)
                if (!container.contains(e.target)) {
                    container.style.display = 'none';
                }
        });
    })
    

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
                    <div id="cont-profile-audio-rating" style={{display:"none"}}>
                        <img onClick={btnStarClicked} className="img-star" src="star.svg" alt="" />
                        <span id="book-audio-rating-profile"></span>
                    </div>
                    
                </div>
            </div>
}
export default BookInfo;