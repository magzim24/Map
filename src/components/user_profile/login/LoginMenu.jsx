import './LoginMenu.css'
const LoginMenu = ()=>{
    if(!localStorage.getItem("accessToken")){
        localStorage.setItem("accessToken", "undefined");
        localStorage.setItem("refreshToken", "undefined");
    }
    

    const btnAuthClicked = ()=>{
        document.querySelector(".authorization-tab").classList.add("active-log-mode")
        document.querySelector(".inputs-auth-cont-log").classList.add("active-log-mode-inputs")
        if(document.querySelector(".register-tab").classList.contains("active-log-mode")
        && document.querySelector(".inputs-auth-cont-reg").classList.contains("active-log-mode-inputs")){
            document.querySelector(".register-tab").classList.remove("active-log-mode")
            document.querySelector(".inputs-auth-cont-reg").classList.remove("active-log-mode-inputs")
        }
    }

    const btnRegClicked = ()=>{
        document.querySelector(".register-tab").classList.add("active-log-mode")
        document.querySelector(".inputs-auth-cont-reg").classList.add("active-log-mode-inputs")
        if(document.querySelector(".authorization-tab").classList.contains("active-log-mode")
        && document.querySelector(".inputs-auth-cont-log").classList.contains("active-log-mode-inputs")){
            document.querySelector(".authorization-tab").classList.remove("active-log-mode")
            document.querySelector(".inputs-auth-cont-log").classList.remove("active-log-mode-inputs")
        }
    }
    const btnMenuCloseClicked = ()=>{
        document.querySelector("#message-span").innerHTML=""
        document.querySelector(".login-cont-main").style.display = "none"
    }

    const btnToggleShowPasswordClicked = (IdPassword, event)=>{
        console.log(event.target)
        event.target.classList.toggle("shown") 
        if(event.target.classList.contains("shown")){
            document.querySelector(IdPassword).setAttribute("type", "text")
            if(event.target.classList.contains("show-password-btn")){
                event.target.children[0].setAttribute("src", "unshownPass.svg")
            }
            else{
                event.target.setAttribute("src", "unshownPass.svg")
            }
            /* if(event.target.type) console.log(event.target) */
        }
        else{
            document.querySelector(IdPassword).setAttribute("type", "password")
            if(event.target.classList.contains("show-password-btn")){
                event.target.children[0].setAttribute("src", "shownPass.svg")
            }
            else{
                event.target.setAttribute("src", "shownPass.svg")
            }
        }
    }

    const btnLogInClicked = ()=>{
        const email = document.querySelector("#logInEmail").value
        const password = document.querySelector("#password-auth").value
        const messageSpan = document.querySelector("#message-span")
        if(Boolean(email) && Boolean(password)){
            fetch("http://saintmolly.ru:3005/api/auth/signin", {
                method: "POST",
                headers:{
                    "Content-Type":"application/json;charset=utf-8"
                },
                body:JSON.stringify({
                    "email":email,
                    "password":password
                })
            }).then(response=>response.json()).then(commit=>{
                
                if(commit["statusCode"] === 404){
                    messageSpan.innerHTML = "Неверные данные пользователя!"
                    messageSpan.style.color = "red"
                }else if(commit["statusCode"]===403){
                    messageSpan.innerHTML = "Неверный логин или пароль!"
                    messageSpan.style.color = "red"
                }else{
                    localStorage.setItem("accessToken", commit["accessToken"])
                    localStorage.setItem("refreshToken", commit["refreshToken"])
                    
                    messageSpan.innerHTML = "Вы успешно вошли в аккаунт!"
                    messageSpan.style.color = "green"
                }
            })
        }
        else{
            DontFillFieldMessagePrint()
        }

    }
    function DontFillFieldMessagePrint(){
        const messageSpan = document.querySelector("#message-span")
            messageSpan.innerHTML = "Заполните все поля!"
            messageSpan.style.color = "red"
    }
    const btnRegisterClicked = ()=>{
        const email = document.querySelector("#regEmail").value
        const password = document.querySelector("#password-reg").value
        const surname = document.querySelector("#regSurname").value
        const name = document.querySelector("#regName").value
        const messageSpan = document.querySelector("#message-span")
        if(Boolean(email) && Boolean(password) && Boolean(surname) && Boolean(name)){
            fetch("http://saintmolly.ru:3005/api/auth/signup", {
            method: "POST",
            headers:{
                "Content-Type":"application/json;charset=utf-8"
            },
            body:JSON.stringify({
                "email":email,
                "password":password,
                "firstName":surname,
                "lastName":name
            })
            }).then(response=>response.json()).then(commit=>{
                if(commit["statusCode"] === 403){
                    
                    messageSpan.innerHTML = "Пользователь с такой почтой уже существует!"
                    messageSpan.style.color = "red"
                }
                else{
                    localStorage.setItem("accessToken", commit["accessToken"])
                    localStorage.setItem("refreshToken", commit["refreshToken"])
                    messageSpan.innerHTML = "Вы успешно зарегистрировались и вошли!"
                    messageSpan.style.color = "green"
                }
            })
        }
        else{
            DontFillFieldMessagePrint()
        }
    }

    function inputLogInEnteredByEnter(e){
        e.preventDefault();
        if (e.key === 'Enter') {
            btnLogInClicked()
        }
    }        
    
    function inputRegEnteredByEnter(e){
        e.preventDefault();
        if (e.key === 'Enter') {
            btnRegisterClicked()
        }
    }  

    
    return <div className='login-cont-main'>
                <div className='login-wrapper'>
                    <button className='btn-close' onClick={btnMenuCloseClicked}><img src="close.svg" alt="" /></button>
                    <div className='main-cont-content'>
                    <h2>Вход</h2>
                    <div id='content-auth-cont'>
                        
                        <span id='message-span'></span>
                        <div className='authorization-tab login-tabs active-log-mode'>
                            <button className='btn-auth' >Авторизация</button>
                            <button className="btn-auth" onClick={btnAuthClicked} style={{position:"absolute", opacity:"0", zIndex:"4"}}></button>
                            <div className='inputs-auth-cont inputs-auth-cont-log active-log-mode-inputs'>
                                <input onKeyUp={inputLogInEnteredByEnter} id='logInEmail' type="email" placeholder='Email'/>
                                <div  className='password-cont'>
                                    <input onKeyUp={inputLogInEnteredByEnter} className='password' id='password-auth' type="password" placeholder='Пароль'/>
                                    <button className='show-password-btn' onClick={btnToggleShowPasswordClicked.bind(this, "#password-auth")}><img src="shownPass.svg" alt="" /></button>
                                </div>
                                <button className='submit-btn' onClick={btnLogInClicked}>Войти</button>
                            </div>
                            
                        </div>
                        <div className='register-tab login-tabs'>
                            <button className='btn-reg' >Регистрация</button>
                            <button className="btn-reg" onClick={btnRegClicked} style={{position:"absolute", opacity:"0", zIndex:"3"}}></button>
                            <div className='inputs-auth-cont inputs-auth-cont-reg'>
                                <input onKeyUp={inputRegEnteredByEnter} id='regEmail' type="email" placeholder='Email'/>
                                <div className='password-cont'>
                                    <input onKeyUp={inputRegEnteredByEnter} className='password' id='password-reg' type="password" placeholder='Пароль'/>
                                    <button className='show-password-btn' onClick={btnToggleShowPasswordClicked.bind(this, "#password-reg")}><img src="shownPass.svg" alt="" /></button>
                                </div>
                                
                                <input onKeyUp={inputRegEnteredByEnter} id='regSurname' type="text" placeholder='Фамилия'/>
                                <input onKeyUp={inputRegEnteredByEnter} id='regName' type="text" placeholder='Имя'/>
                                <button className='submit-btn' onClick={btnRegisterClicked}>Зарегистрироваться</button>
                            </div>
                            
                        </div>
                    </div>
                    </div>
                </div>
           </div>
}
export default LoginMenu