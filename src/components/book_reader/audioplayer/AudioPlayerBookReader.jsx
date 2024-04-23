import { useEffect } from "react"
import "./AudioPlayerBookReader.css"

const AudioPlayerBookReader = ()=>{

    let timeline = null
    const playback = document.querySelector(".back-play-btn")
    const playforward = document.querySelector(".forward-play-btn")
    let audio = null

    const togglePlay = () =>{
        if(audio.getAttribute("src")){
            if (audio.paused) {
                audio.play();
            }
            else {
                audio.pause();
            }
        }
        
    }

    function changeTimelinePosition () {
        const percentagePosition = (100*audio.currentTime) / audio.duration;
        timeline.value = percentagePosition;
    }

    function changeSeek (e) {
        console.log(e.target.value)
        const time = (timeline.value * audio.duration) / 100;
        audio.currentTime = time;
    }

    function rewind(sign){
        let ratio = 0
        sign === 0 ? ratio = -5 : ratio = 5
        audio.currentTime = audio.currentTime + ratio;
    }

    useEffect(()=>{
        audio = document.querySelector("#audio-elem")
        timeline = document.querySelector(".timeline")
        audio.ontimeupdate = changeTimelinePosition
        timeline.addEventListener("input", changeSeek)
        
    })
    return <div id="main-cont-audioplayer">
                <audio id="audio-elem"></audio>
                <div className="controls" style={{width: 150}}>
                    <input type="range" className="timeline" max={"100"} defaultValue={"0"}/>
                    <button className="back-play-btn" onClick={rewind.bind(this, 0)}><img src="minus.svg" style={{width: 15, height: 15}}/></button>
                    <button className="play-btn" onClick={togglePlay}><img src="play.svg" alt="" style={{width: 15, height: 15}}/></button>
                    <button className="forward-play-btn" onClick={rewind.bind(this, 1)}> <img src="plus.svg" style={{width: 15, height: 15}}/></button>
           </div>
    </div>
}

export default AudioPlayerBookReader;