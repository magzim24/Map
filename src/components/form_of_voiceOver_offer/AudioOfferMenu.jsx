import './AudioOfferMenu.css'

const AudioOfferMenu = () =>{

    const file = document.querySelector("#input-file-offer")
    function btnCloseClicked(){
        document.querySelector(".offer-main-cont").style.display = "none";
    }

    function inputFileChanged(){
        const file = document.querySelector("#input-file-offer")
        if (file.files.length > 0) {
            document.querySelector("#offer-file-name").innerHTML = file.files[0].name
        }else{
            document.querySelector("#offer-file-name").innerHTML = ""
        }
        
    }

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

    function btnSendClicked(){
        
        const id = document.querySelector("#combobox-offer").options[ document.querySelector("#combobox-offer").selectedIndex ].getAttribute("value")
        if(Number(id)>0){
            const file = document.querySelector("#input-file-offer")
            if (file.files.length > 0) {
                const currentFile = file.files[0]
                if(currentFile.type === "audio/mpeg" || currentFile === "audio/wav"){
                    let formData = new FormData();
                    formData.append("file", currentFile, currentFile.name);
                    console.log(formData)
                    fetch("http://saintmolly.ru:3005/api/user-audio/upload/" + String(id), {
                        method: "PUT",
                        headers:{
                            
                            "Authorization":"Bearer "+localStorage.getItem("accessToken")
                        },
                        body:formData
                    }).then(response=>response.json()).then(commit=>{
                        if(commit["statusCode"]===401){
                            if(localStorage.getItem("accessToken") !== "undefined"){
                                refreshToken()
                                //btnSendClicked()
                            }
                            else{
                                //document.querySelector(".offer-main-cont").style.display = "none"
                                document.querySelector(".login-cont-main").style.display = "flex";
                            }
                        }
                        else{
                            alert("Заявка успешно отправлена!")
                        }
                    })
                }else{
                    alert("Выберите аудиофайл озвучки!")
                }
            }else{
                alert("Выберите файл озвучки!")
            }
            
        }
        else{
            alert("Выберите язык!")
        }
    }

    return <div className='offer-main-cont'>
            <div className='offer-main-wrapper'>
                <button onClick={btnCloseClicked} className='btn-close-offer'><img src="close.svg" alt="" /></button>
                <h3 className='header-offer'>Предложить озвучку</h3>
                <select  id="combobox-offer">
                    <option value="0">Выберите язык вашей озвучки</option>
                </select>
                <input id='input-file-offer' type="file" onChange={inputFileChanged} accept='audio/wav, audio/AAIF, audio/mp3, audio/*;capture=microphone'/>
                <label htmlFor="input-file-offer" className='upload-cont'>
                    <span >Загрузить файл</span>
                    <span id='offer-btn-upload' ><img src="logout.svg" alt="" /></span>
                </label>
                
                <div id='offer-cont-sendBtn-cont'>
                    <span id='offer-file-name'></span>
                    <button onClick={btnSendClicked} id='send-offer-btn'>Отправить</button>
                </div>
            </div>
           </div>
}
export default AudioOfferMenu;