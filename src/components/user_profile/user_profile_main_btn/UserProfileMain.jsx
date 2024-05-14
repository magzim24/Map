import './UserProfileMain.css'
import '../../BookProfile.js'
import imageClicked from '../../BookProfile.js';

const UserProfileMain = ()=>{

    function refreshToken(){
        fetch("http://saintmolly.ru:3005/api/auth/refresh", {
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem("refreshToken")
            }
        }).then(response=>response.json()).then(commits=>{
            localStorage.setItem("accessToken", commits["accessToken"]);
            localStorage.setItem("refreshToken", commits["refreshToken"])
        })
    }
    function FillUserProfileMenuBookPack(){
        fetch("http://saintmolly.ru:3005/api/user-audio/my-audios/approved",{
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem("accessToken")
            }
        }).then(response=>response.json()).then(commits=>{
            //console.log(commits)
            if(commits["statusCode"] === 401){
                refreshToken();
            }
            else{
                if(commits.length === 0){
                    document.querySelector("#user-profile-menu-books-pack").innerHTML = "У вас нет действующих одобренных озвучек"
                }
                else{
                    
                    commits.map((data)=>{
                        document.querySelector("#user-profile-menu-books-pack").innerHTML = ''
                        CreateBlockApprovedBookByData(data);
                    })
                }
            }
        })
        //user-profile-menu-books-pack
    }
    function CreateBlockApprovedBookByData(data){
        
        const div = document.createElement("div");
        div.setAttribute("class", "cont-bookInCatalog")
        const img = document.createElement("img");
        img.setAttribute("class", "preview-img-book");
        img.onclick = imageClicked.bind(this, data["story"]["id"]);
        const storyName = document.createElement("span");
        const divSpecification = document.createElement("div")
        divSpecification.setAttribute("class", "book-specification-img")
        const imgSpecification = document.createElement("img")
        imgSpecification.setAttribute("class", "AudioAndBook-img")
        imgSpecification.setAttribute("src", "AudioAndBook.svg")
        const imgStar = document.createElement("img")
        imgStar.setAttribute("class", "star-img-book-menu-profile")
        imgStar.setAttribute("src", "star.svg")
        const rating = document.createElement("span")
        rating.setAttribute("class", "Book-audio-rating-user-profile-menu")
        divSpecification.append(imgSpecification, imgStar, rating)
        fetch("http://saintmolly.ru:3005/api/story/image/"+String(data["story"]["id"]), {
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem("accessToken")
            }
        }).then(response=>response.json()).then(commit=>{
            
            
            if(!commit["status"]){
                let image = URL.createObjectURL(commit["buffer"]);
                img.setAttribute("src", image)
            }
            else{
                img.setAttribute("src", "Preview.jpg")
            }
            fetch("http://saintmolly.ru:3005/api/story/rating/" + String(data["story"]["audioId"]))
            .then(response=>response.json()).then(com=>{
                rating.innerHTML = com["ratingAudio"]
            })
            storyName.innerHTML = data["story"]["name"]
            div.append(img, storyName, divSpecification);
            document.querySelector("#user-profile-menu-books-pack").append(div)
            
        })

    }

    function CreateBlockRequestByData(data){
        
        const div = document.querySelector(".user-profile-menu-requests-pack");
        
        const div1 = document.createElement("div");
        div1.setAttribute("class", "request-cont");
        const imgDiv = document.createElement("div");
        const img = document.createElement("img");
        img.setAttribute("src", "file.svg");
        img.setAttribute("class", "icon-file-requests");
        imgDiv.append(img)
        const contentDiv = document.createElement("div");
        contentDiv.setAttribute("class", "content-cont-request")
        const name = document.createElement("span");
        name.innerHTML = data["userAudio"]["name"];
        const progressBar = document.createElement("progress");
        progressBar.setAttribute("max", 100);
        let value;
        let stringStatus;
        switch(data["status"]){
            case "SEND":
                value = 40;
                stringStatus = "На проверке"
                break;
            case "SUCCESSED":
                value=100;
                stringStatus = "Заявка одобрена"
                break;
            case "CANCELLED":
                value = 100;
                stringStatus = "Заявка отклонена"
                break;
        }
        progressBar.setAttribute("value", value);
        progressBar.setAttribute("class", data["status"] + "-request");
        const statusReq = document.createElement("span");
        statusReq.setAttribute("class", "status-request");
        statusReq.innerHTML = stringStatus
        contentDiv.append(name, progressBar, statusReq);
        div1.append(imgDiv,contentDiv);
        
        div.append(div1);
    }

    function FillUserProfileMenuRequestsPack(){
        fetch("http://saintmolly.ru:3005/api/user/me", {
            headers:{
                Authorization:"Bearer " + localStorage.accessToken
            }
        }
        ).then(response=>response.json()).then(commit_=>{localStorage.setItem("userId", commit_["id"])})
        fetch("http://saintmolly.ru:3005/api/audio-story-request/my-requests",{
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem("accessToken")
            }
        }).then(response=>response.json()).then(commits=>{
            //console.log(commits)
            if(commits["statusCode"] === 401){
                refreshToken();
            }
            else{
                
                if(commits.length === 0){
                    document.querySelector(".user-profile-menu-requests-pack").innerHTML = "Вы не создавали заявок"
                }
                else{
                    document.querySelector(".user-profile-menu-requests-pack").innerHTML = ''
                    commits.map((data)=>{
                        
                        CreateBlockRequestByData(data);
                    })
                }
            }
        })
        //user-profile-menu-books-pack
    }

    function FillUserProfileMenuInfo(){
        fetch("http://saintmolly.ru:3005/api/user/me",{
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem("accessToken")
            }
        }).then(response=>response.json()).then(commits=>{
            if(commits["statusCode"] === 401){
                refreshToken();
            }
            else{
                document.querySelector("#user-profile-menu-names").innerHTML = commits["lastName"] + " " + commits["firstName"];
                document.querySelector("#user-profile-menu-email").innerHTML = commits["email"];
                
            }
        })
    }

    function btnClicked(){
        const accessToken = localStorage.getItem("accessToken")
        
        if(accessToken !== "undefined" && accessToken!==null){
            console.log("Отработал")
            FillUserProfileMenuInfo();
            FillUserProfileMenuRequestsPack()
            FillUserProfileMenuBookPack()
            document.querySelector("#user-profile-menu-main-cont").style.display = "flex";
        }
        else{
            document.querySelector(".login-cont-main").style.display = "flex";
        }
        
    }

    return <div className="user-profile-btn-main" onClick={btnClicked}>
                <img src="profileIcon.svg" alt="" />
           </div>
}
export default UserProfileMain