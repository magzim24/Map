import { useEffect } from "react"
import './AudioPlayerBookReader.css'

const AudioPlayerBookReader = ()=>{

    let timeline = null
    const playback = document.querySelector(".back-play-btn")
    const playforward = document.querySelector(".forward-play-btn")
    let audio = null

    const togglePlay = () =>{
        if(audio.getAttribute("src")){
            if (audio.paused) {
                audio.play();
                document.querySelector(".play-btn").children[0].setAttribute("src", "pause.svg")
            }
            else {
                audio.pause();
                document.querySelector(".play-btn").children[0].setAttribute("src", "play.svg")
            }
        }
        
    }

    function changeTimelinePosition () {
        if(audio.getAttribute("src")) {
            const percentagePosition = (100*audio.currentTime) / audio.duration;
            timeline.value = percentagePosition;
        }
        
    }

    function changeSeek (e) {
        console.log(e.target.value)
        if(audio.getAttribute("src")) {
            const time = (timeline.value * audio.duration) / 100;
            audio.currentTime = time;
        }
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
                <div className="controls">
                    <input type="range" className="timeline" max={"100"} defaultValue={"0"}/>
                    <div id="cont-btns-controls">
                        <button className="back-play-btn" onClick={rewind.bind(this, 0)}><img src="skipVideo.svg"></img></button>
                        <button className="play-btn" onClick={togglePlay}><img src="play.svg" alt="" /></button>
                        <button className="forward-play-btn" onClick={rewind.bind(this, 1)}><img src="skipVideo.svg"></img></button>
                    </div>
                </div>
                
           </div>
}
export default AudioPlayerBookReader;