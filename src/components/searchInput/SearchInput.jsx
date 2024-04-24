import "./SearchInput.css"
import * as d3 from 'd3'
import imageClicked from "../BookProfile.js"
//import addPointCircleInPath from "../PointGenerator.js"
import foundedPointsBySearchInput from "../Map.jsx"
const SearchInput=()=>{

    function buttonPanelOpenerClicked(event){
        if(d3.select("#main-cont-search-panel").style("left")==="-260px"){
            d3.select("#btn-panel-opener-icon").transition().duration(750).style("transform", "rotate(180deg)")
            d3.select("#main-cont-search-panel").transition()
            .duration(750).style("left", "0px")
        }
        else{
            d3.select("#btn-panel-opener-icon").transition().duration(750).style("transform", "rotate(0deg)")
            d3.select("#main-cont-search-panel").transition()
            .duration(750).style("left", "-260px")
        }
        
    }

    function regionResultClicked(regionElem){
        regionElem.dispatchEvent(new Event("click"))
    }
    function ButtonExtendingListClicked(block){

        block.classList.toggle("active")
        let content = block.nextSibling
        console.log(content.style.height)
        if(content.style.height!=="0px"){
            d3.select(block).selectChild("img").transition().duration(750).style("transform", "rotate(-90deg)")
            content.style.height = 0;
        }
        else{
            d3.select(block).selectChild("img").transition().duration(750).style("transform", "rotate(90deg)")
            
            content.style.height = content.scrollHeight+"px";
        }

        
    }
    function appendHeaderCategory(panel, nameOfCategory, elemClassName){
        const div = panel.append("div").attr("class", elemClassName+ " header-cont")
        .on("click", ButtonExtendingListClicked.bind(this, document.querySelector("."+elemClassName)))
        div.append("h3").text(nameOfCategory).attr("class", "result-searching-header")
        div.append("img").attr("src", "arrow-panel.svg").attr("class", "btn-expanding-list")
    }
    function FairyTalesResultClicked(storyId){
        imageClicked(storyId)
    }
    function fillSearchingPanelByFairyTales(panel, nameFairyTales){
        appendHeaderCategory(panel, "Сказки", "header-fairyTales-cont")
        const cont = panel.append("div").attr("class", "content-cont")
        fetch("http://saintmolly.ru:3005/api/story/by-name/"+String(nameFairyTales))
        .then(response => response.json())
        .then(commit => {
            commit.forEach(data=>{
                //fetch()
                cont.append("span").text(data["name"])
                .style("display", "block")
                .attr("class", "span-result-searching").on("click", FairyTalesResultClicked.bind(this, data["id"]))
            })
        })
        
    }
    function fillSearchingPanelByNations(panel, nameEthnicGroup){
        appendHeaderCategory(panel, "Народности", "header-nations-cont")
        const cont = panel.append("div").attr("class", "content-cont")
        document.querySelector("#search-input").dispatchEvent(new CustomEvent("foundedSearchedData", {
            detail:{ container: cont, nameEthnicGroup:nameEthnicGroup}
        }))
        
    }
    function fillSearchingPanelByRegions(panel, searchInDocument){
        appendHeaderCategory(panel, "Регионы", "header-regions-cont")
        const cont = panel.append("div").attr("class", "content-cont")

        searchInDocument.forEach(data=>{
            cont.append("span").text(data.getAttribute("regionName"))
            .style("display", "block")
            .attr("class", "span-result-searching").on("click", regionResultClicked.bind(this, data))
        })
    }

    function buttonSearchSubmitClicked(event){
        if(event.key === "Enter" || event.keyCode === 13 || event.target.getAttribute("id") === "btn-submit-search" 
        || event.target.getAttribute("id") === "search-icon" || event.target.getAttribute("id")==="search-input"){
            const valueInput = document.getElementById("search-input").value
            if(valueInput !== ''){
                const searchInDocument = document.querySelectorAll('path[regionName*=' + "'" +valueInput + "'"+']')
                const panel = d3.select("#search-panel-cont-wrapper")
                panel.selectChildren().remove()
                if(searchInDocument.length !== 0){
                    fillSearchingPanelByRegions(panel, searchInDocument)
                }
                fillSearchingPanelByNations(panel, valueInput)
                fillSearchingPanelByFairyTales(panel, valueInput)
            }
        }
        
        
    }

    return <span id="search-span-cont">
                <div id="search-input-cont">
                    <input id="search-input" onKeyUp={buttonSearchSubmitClicked} onInput={buttonSearchSubmitClicked} placeholder="Найти регион, народность или сказку"/>
                    <button id="btn-submit-search" onClick={buttonSearchSubmitClicked}>
                        <img id="search-icon" src="search.svg" alt="" />
                    </button>
                </div>
                <button id="search-btn-panel-opener" onClick={buttonPanelOpenerClicked}><img id="btn-panel-opener-icon" src="arrow-panel.svg" alt="" /></button>
           </span>
}
export default SearchInput;