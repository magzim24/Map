import './MainContCatalogBooks.css'



const MainContCatalogBooks = ()=>{
    
    const closeCatalogHandler = ()=>{
        document.getElementById("main-cat-books-wrapper").style.setProperty("display", "none");
    }
    
    return  <div className='main-content-catalog-wrapper'>
                <div id="span-div-button-close-catalog">
                    <button id="close-catalog-btn" onClick={closeCatalogHandler}><img src="close.svg"></img></button>
                </div>
                <div id="books-catalog-wrapper">
                    <h2 style={{margin:0, padding:0}}>Сказки народности: <span id="ethnicGroup-span-list-fairyTales"></span></h2>
                    <div className="list-catalog-books">
                        <div className='cont-list-catalog-books'>

                        </div>
                    </div>
                </div>
            </div>
                    
                       
               
                
            
}
export default MainContCatalogBooks