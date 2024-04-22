import * as d3 from 'd3'
import imageClicked from "./BookProfile.js"


const FillBookInCatalogBooks = (commits)=>{
    commits.map(data=>{
        const list = d3.select(".cont-list-catalog-books").append("div").attr("class", "cont-bookInCatalog")
        const preview = list.append("img").on('click', imageClicked.bind(this, data["id"]));
            fetch('http://saintmolly.ru:3005/api/story/image/'+String(data["id"]))
            .then(response => response.blob())
            .then(blob=>{
                let img = URL.createObjectURL(blob);
                preview.attr("src", blob.type==="application/octet-stream" ? img : "Preview.jpg")
                .attr("class","preview-img-book")
                .attr("storyId", data["id"])
            })
            
            list.append("span").text(data["name"])
        if(data["audioId"] !== null){
            const div = list.append("div").attr("class", "book-specification-img")
            div.append("img").attr("src", "AudioAndBook.svg").attr("class", "AudioAndBook-img")
        }
        if(data["audioId"] === null){
            const div = list.append("div").attr("class", "book-specification-img")
            div.append("img").attr("src", "opened_book.svg").attr("class", " opened-book-img")
        }
    })
}

const FillCatalogBooks = (event) =>{
    event.stopPropagation()
    
    const target = d3.select(event.target)
    if(window.innerWidth < 801){
        d3.select("#main-cat-books-wrapper").style("display", "block");
    }
    else{
        d3.select("#main-cat-books-wrapper").style("display", "flex")
    }
    d3.select("#ethnicGroup-span-list-fairyTales").attr("ethnicGroupId", target.attr("ethnicGroup"))
    fetch('http://saintmolly.ru:3005/api/ethnic-group/'+String(target.attr("ethnicGroup")))
    .then(response => response.json())
    .then(commits=>{
        d3.select("#ethnicGroup-span-list-fairyTales").text(commits["name"]);
        fetch('http://saintmolly.ru:3005/api/story/ethnic-group/'+String(target.attr("ethnicGroup")))
        .then(response => response.json()).then(commits=>{
            d3.select(".cont-list-catalog-books").selectChildren().remove()
            FillBookInCatalogBooks(commits)
        })
    })
}
export default FillCatalogBooks;