const AudioPlayerBookReader = ()=>{

    const timeline = document.querySelector(".timeline")
    const playback = document.querySelector(".back-play-btn")
    const playbtn = document.querySelector(".play-btn")
    const playforward = document.querySelector(".forward-play-btn")
    

    const togglePlay = () =>{
        const audio = document.querySelector("#audio-elem")
        if (audio.paused) {
            audio.play();
            console.log(audio.paused)
            //playerButton.innerHTML = pauseIcon;
        }
        else {
            console.log(audio.paused)
            audio.pause();
            //playerButton.innerHTML = playIcon;
        }
    }

    return <div>
                <audio id="audio-elem"></audio>
                <div className="controls">
                    <input type="range" className="timeline" max={"100"} value={"0"}/>
                    <button className="back-play-btn"></button>
                    <button className="play-btn" onClick={togglePlay}><img src="play.svg" alt="" /></button>
                    <button className="forward-play-btn" ></button>
                </div>
                
           </div>
}
export default AudioPlayerBookReader;