import './UserProfileMenuInfo.css'

const UserProfileMenuInfo=()=>{
    
    const btnLogOutClicked = ()=>{
        fetch("http://saintmolly.ru:3005/api/auth/logout", {
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem("refreshToken")
            }
        }).then(response=>response.json()).then(commits=>{
            if(commits["statusCode"] === 401){
                if(localStorage.getItem("accessToken") !== null){
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                }
                
            }
            else{
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
            document.querySelector("#user-profile-menu-main-cont").style.display = "none";
        })
    } 

    return <div className='user-profile-menu-user-info-cont'>
                <div className='user-profile-menu-info-content'>
                    <img id='user-profile-menu-icon-user' src="profileIcon.svg" alt="" />
                    <div id='user-profile-menu-personal-data-cont'>
                        <h2 id='user-profile-menu-names'></h2>
                        <span id='user-profile-menu-email'></span>
                    </div>
                </div>
                <div id='logout-icon-cont'>
                    <img onClick={btnLogOutClicked} src="logout.svg" alt="" />
                </div>
           </div>
}
export default UserProfileMenuInfo;