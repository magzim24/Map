//import logo from './logo.svg';
import './App.css';
import Map from './components/Map'
import SearchInput from './components/searchInput/SearchInput'
import MainContCatalogBooks from './components/catalog_books/main_cont/MainContCatalogBooks'
import MainReaderWrapper from './components/book_reader/main/MainReaderWrapper'


export default function App() {
  
  return (
    <div className="App">
      <header className="App-header">
      </header>
      {/*console.log(width)*/}
        <div id='map-cont'>
          <Map></Map>
        </div>
        <div className="search-input-cont">{/* <SearchInput></SearchInput> */}</div> 
        <div id='main-cat-books-wrapper'>
          <MainContCatalogBooks></MainContCatalogBooks>
        </div>
        <div id='main-reader-books-wrapper'>
            <MainReaderWrapper></MainReaderWrapper>
        </div>

    </div>
  );
}

