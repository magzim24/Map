//import logo from './logo.svg';
import './App.css';
import Map from './components/Map'
import SearchInput from './components/searchInput/SearchInput'
import MainContCatalogBooks from './components/catalog_books/main_cont/MainContCatalogBooks'
import MainReaderWrapper from './components/book_reader/main/MainReaderWrapper'
import SearchPanel from './components/search_panel/SearchPanel'
import FullScreenTextReader from './components/fullScreenReader/FullScreenTextReader'
import UserProfileMain from './components/user_profile/user_profile_main_btn/UserProfileMain'
import LoginMenu from './components/user_profile/login/LoginMenu';
import UserProfileMenu from './components/user_profile/user_profile_menu/UserProfileMenu';
import AudioOfferMenu from './components/form_of_voiceOver_offer/AudioOfferMenu';

export default function App() {
  
  return (
    <div className="App">
      <header className="App-header">
      </header>
        <div id='map-cont'>
          <Map></Map>
        </div>
        <div className="search-input-cont">
          <SearchInput></SearchInput>
        </div>
        <div id='main-cont-search-panel'>
          <SearchPanel></SearchPanel>
        </div>
        <div id='main-cat-books-wrapper'>
          <MainContCatalogBooks></MainContCatalogBooks>
        </div>
        <div id='main-reader-books-wrapper'>
            <MainReaderWrapper></MainReaderWrapper>
        </div>
        <div id='main-fullscreen-textreader'>
          <FullScreenTextReader></FullScreenTextReader>
        </div>
        <UserProfileMain></UserProfileMain>
        <LoginMenu></LoginMenu>
        <UserProfileMenu></UserProfileMenu>
        <AudioOfferMenu></AudioOfferMenu>
    </div>
  );
}

