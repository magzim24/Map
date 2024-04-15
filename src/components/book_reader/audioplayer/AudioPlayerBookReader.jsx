import { useEffect } from "react"

const AudioPlayerBookReader = ()=>{

    let timeline = null
    const playback = document.querySelector(".back-play-btn")
    const playbtn = document.querySelector(".play-btn")
    const playforward = document.querySelector(".forward-play-btn")
    let audio = null

    const togglePlay = () =>{
        
        if (audio.paused) {
            audio.play();
        }
        else {
            console.log(audio.paused)
            audio.pause();
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

    

    useEffect(()=>{
        audio = document.querySelector("#audio-elem")
        timeline = document.querySelector(".timeline")
        audio.ontimeupdate = changeTimelinePosition
        timeline.addEventListener("input", changeSeek)
        
    })
    return <div>
                <audio id="audio-elem"></audio>
                <div className="controls">
                    <input type="range" className="timeline" max={"100"} defaultValue={"0"}/>
                    <button className="back-play-btn"></button>
                    <button className="play-btn" onClick={togglePlay}><img src="play.svg" alt="" /></button>
                    <button className="forward-play-btn" ></button>
                </div>
                
           </div>
}
export default AudioPlayerBookReader;