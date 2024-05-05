import * as d3 from 'd3'


const getAudio = (userAudioId)=>{
    fetch("http://saintmolly.ru:3005/api/user-audio/"+String(userAudioId))
    .then(response => response.blob())
    .then(blob=>{
        let mpeg = URL.createObjectURL(blob);
        document.getElementById("audio-elem").setAttribute("src", mpeg)
    })
}

const OnChangedSelect = (elem) =>{
    let parent = null
    if(elem.target.getAttribute("class") === "combobox-option"){
        parent = elem.target
    }
    else{
        parent = elem.target.parentNode
    }
    d3.select("#lang-select").style("display", "none")
    d3.select("#book-audio-author-in-book-profile").text(parent.getAttribute("author"))
    d3.select("#cont-author-audio").style("display", "block")
    const userAudioId = parent.getAttribute("useraudioid")
    d3.select("#combobox-btn").attr("userAudioId", userAudioId)
    d3.select("#book-audio-rating-profile").text(parent.children[2].innerHTML)
    d3.select("#cont-profile-audio-rating").style("display", "flex");
    getAudio(userAudioId)
    document.getElementById("combobox-btn-arrow").style.transform = "rotate(180deg)"
}

const FillBookInfoInBookProfile = (json)=>{
    d3.select("#bookname-in-book-profile").text(json["name"])
    
    if(json["audioId"] !== null){
        d3.select(".opened-book-img-profile").attr("src", "AudioAndBook.svg").attr("class", "opened-book-img-profile AudioAndBook-img")
        /* d3.select("#btn-offer-voice-acting").style("display", "none") */
        d3.select("#main-cont-audioplayer").style("display", "flex")
        d3.select("#combobox-language-selection").style("display", "block")
    }
    else {
        d3.select(".opened-book-img-profile").attr("src", "opened_book.svg").attr("class", "opened-book-img-profile opened-book-img")
        d3.select("#main-cont-audioplayer").style("display", "none")
        /* d3.select("#btn-offer-voice-acting").style("display", "block") */
        d3.select("#combobox-language-selection").style("display", "none")
    }
    const elemSelect = d3.select("#lang-select")
    elemSelect.selectChildren().remove()
    fetch("http://saintmolly.ru:3005/api/story/languages/"+String(json["id"]))
    .then(response => response.json())
    .then(commits=>{
        
        commits.map(item => {
            const author = item["authors"]
            const a = elemSelect.append("a")
            .attr("class", "combobox-option")
            .attr("audioId", item["id"])
            .attr("userAudioId", item["userAudioId"])
            .attr("author", author["firstName"]+" "+author["lastName"])
            .on("click", OnChangedSelect)
            a.append("span").text(item["language"]["name"])
            a.append("img").attr("src", "star.svg")
            fetch("http://saintmolly.ru:3005/api/story/rating/"+String(item["id"]))
            .then(response=>response.json()).then(commit=>{
                a.append("span").text(commit["ratingAudio"])
            })
            //
        })
    })
    
    //d3.select("#book-audio-author-in-book-profile").text(json[])
}

const imageClicked = (storyId)=>{
    const preview = d3.select(".preview-img-book-reader")
    fetch('http://saintmolly.ru:3005/api/story/image/' + String(storyId))
    .then(response => response.blob())
    .then(blob=>{
        let img = URL.createObjectURL(blob);
        preview.attr("src", blob.type==="application/octet-stream" ? img : "Preview.jpg")
        .attr("storyId", storyId)
        fetch("http://saintmolly.ru:3005/api/story/text/" + String(storyId))
        .then(response => {
            if(response.headers.get("content-type") !== null) return response.json();

        }).then(commits=>{
            if(commits !== undefined && commits !== null){
                d3.select(".cont-text-story").selectChild("section").text(commits["text"])
            }
            fetch("http://saintmolly.ru:3005/api/story/" + String(storyId))
            .then(response => response.json())
            .then(commits => {
                FillBookInfoInBookProfile(commits)
                d3.select("#main-reader-books-wrapper").style("display", "flex");
            })
        })
    })
    
    
    
    
}
export default imageClicked