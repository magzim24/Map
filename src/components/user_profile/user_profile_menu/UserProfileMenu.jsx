import './UserProfileMenu.css'
import UserProfileMenuInfo from './user_profile_menu_info/UserProfileMenuInfo';
import UserProfileMenuBooks from './user_profile_menu_books/UserProfileMenuBooks';
import UserProfileMenuRequests from './user_profile_menu_requests/UserProfileMenuRequests';

const UserProfileMenu = ()=>{

    function btnCloseClicked(){
        document.querySelector("#user-profile-menu-main-cont").style.display = "none";
    }

    return <div id='user-profile-menu-main-cont'>
             <div id='user-profile-menu-main-wrapper'>
                <div className='user-profile-menu-close-btn-cont'><img onClick={btnCloseClicked} src="close.svg" alt="" /></div>
                <UserProfileMenuInfo></UserProfileMenuInfo>
                <UserProfileMenuBooks></UserProfileMenuBooks>
                <UserProfileMenuRequests></UserProfileMenuRequests>
             </div>
           </div>
}
export default UserProfileMenu;