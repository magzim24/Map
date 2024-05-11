import * as d3 from 'd3'
import FillCatalogBooks from "./BookCatalog.js"

let scaleCenter;
export default class PointMenu{
    
    addRectToContentRect(rect_g, width, size_rect, y){
        rect_g.append("rect")
        .attr("x", size_rect[0]/2 - (width)/2)
        .attr("y", y)
        .attr("width", width)
        .attr("height", 1.8*scaleCenter.scale/800)
        .attr("rx", 0.9*scaleCenter.scale/800)
        .attr("ry", scaleCenter.scale/800)
    }

    addImageToContentRect(rect_g, size_rect, width, image_link, y){
        rect_g.append("g:image")
        .attr("x", (size_rect[0] - width)/2 + 1.2/800*scaleCenter.scale)
        .attr("y", y + ((1.8 - 1.2)/2/800)*scaleCenter.scale)
        .attr("width", 1.2*scaleCenter.scale/800)
        .attr("height", 1.2*scaleCenter.scale/800)
        .attr("xlink:href", image_link)
    }

    addTextToContentRect(rect_g, width, size_rect, y, font_size_k, Text_){
        const text =  rect_g.append("text")
        .attr("class", "text-rect-button-content-menu")
        .attr("x", (size_rect[0] - width)/2 + 1.4*2/800*scaleCenter.scale + 1.2/800*scaleCenter.scale)
        .style("font-size", String(font_size_k*scaleCenter.scale/800)+"px")
        .text(Text_)
        text.attr("y", y +(1.9/2*scaleCenter.scale/800) + (text.node().getBBox().height/2) - 0.25*scaleCenter.scale/800)//
    }

    addCountFairyTalesToContentRect(rect_g, width, y, font_size_k, countText){
        const count =  rect_g.append("text")
        .attr("class", "countBooks-rect-button-content-menu text-rect-button-content-menu")
        .attr("x", width + scaleCenter.scale/800)
        .style("font-size", String(font_size_k*scaleCenter.scale/800)+"px")
        .text(countText)
        count.attr("y", y +(1.9/2/800*scaleCenter.scale) + (count.node().getBBox().height/2) - 0.25/800*scaleCenter.scale)
    }

    appendContentRect(y, image_link, font_size_k, Text_, countText, event, content_svg, size_rect){
        const width = size_rect[0]*0.72
        const rect_g = content_svg.append("g").attr("class", "cont-books-rects-menu")
        .on("click", FillCatalogBooks.bind(this, event))
        this.addRectToContentRect(rect_g, width, size_rect, y)
        this.addImageToContentRect(rect_g, size_rect, width, image_link, y)
        this.addTextToContentRect(rect_g, width, size_rect, y, font_size_k, Text_)
        this.addCountFairyTalesToContentRect(rect_g, width, y, font_size_k, countText)
    }

    addButtonToPointMenu(parent_target_g, size_rect, event, content_svg){
        const target = d3.select(event.target)
        
        fetch('http://saintmolly.ru:3005/api/story/ethnic-group/'+String(target.attr("ethnicGroup")))
            .then(response => response.json())
            .then(commits=>{
                console.log("scaleCenter.scale "+scaleCenter.scale)
                this.appendContentRect(6*scaleCenter.scale/800, "books.svg", 0.75,
                "Книги", commits.length, event, content_svg, size_rect)
                let countAudio = 0
                commits.map(data => {if(data["audioId"]) countAudio++})
                this.appendContentRect((6+2.2)*scaleCenter.scale/800, "note.svg", 0.75,
                "Аудиокниги", countAudio, event, content_svg, size_rect)
                parent_target_g = parent_target_g.append("g")
                
                this.appendClipPathForCircleRectMenu(parent_target_g, target, size_rect)
                this.appendSemiCircleForRectMenu(parent_target_g, target)
            }
        )
    }
    appendSVGElemContToPointMenu(xText, yText, size_rect){
        return d3.select(".rect-menu-fairyTales-cont")
                .append("svg")
                .attr("class", "content-cont-rect-menu-svg")
                .attr("x", xText )
                .attr("y", yText- 6*scaleCenter.scale/850)
                .attr("width", size_rect[0])
                .attr("height", size_rect[1])
    }
    appendRectForPointClicked(parent_target_g, target, size_rect){
        parent_target_g.attr("class", "rect-menu-fairyTales-cont")
            .append('rect')
            .attr("class", "rect-menu-fairyTales")
            .attr('x', Number(target.attr("cx"))-size_rect[0]/2)
            .attr('y', Number(target.attr("cy"))-size_rect[1])
            .attr('width', size_rect[0])
            .attr('height', size_rect[1])
            .attr("rx", 1.5*scaleCenter.scale/800).attr("ry", 1.5*scaleCenter.scale/800)
    }

    appendClipPathForCircleRectMenu(parent_target_g, target, size_rect){
        parent_target_g
            .append("defs").append("clipPath").attr("id", "cut-off-bottom").append("rect")
            .attr('x', Number(target.attr("cx"))-size_rect[0]/2)
            .attr('y', Number(target.attr("cy"))-1)
            .attr('width', size_rect[0])
            .attr('height', size_rect[1])
    }

    appendSemiCircleForRectMenu(parent_target_g, target){
        parent_target_g.append("circle")
            .attr('cx', Number(target.attr("cx")))
            .attr('cy', Number(target.attr("cy")))
            .attr('r', Number(target.attr("r"))*1.4)
            .attr("id", "semicircle-rect-menu-fT") 
            .attr("clip-path", "url(#cut-off-bottom)")
    }

    appendTextToRectMenuFairyTales(parent_target_g, xText, yText, Text_, font_size_k, elem_type){
        const elem = parent_target_g.append("text").attr("class", "label-nationalityAndRegion-rect-menu")
            .attr('x', xText)
            .attr('y', yText)
            .style("font-size", String(font_size_k*scaleCenter.scale/800)+"px")
        if(!Number.isNaN(Number(Text_))){
            fetch('http://saintmolly.ru:3005/api/ethnic-group/'+String(Text_))
            .then(response => response.json()).then(commits=>{
                if(commits.statusCode === undefined){
                    elem.text(commits["name"])
                }
            })
        }else{
            if(elem_type==="header"){
                if(Text_.length > 25){
                    elem.text(Text_.slice(0, 25)+"...")
                }
                else{
                    elem.text(Text_)
                } 
            }
            else if("region_name"){
                if(Text_.length > 18){
                    elem.text(Text_.slice(0, 18)+"...")
                }
                else{
                    elem.text(Text_)
                }
            }
            
            
        }//23
        /* console.log()
        console.log()
        if(elem.node().getBBox().width > document.querySelector(".rect-menu-fairyTales").width.baseVal.value * 0.8){
            elem.text()
        } */
        return parent_target_g
    }

    constructor(settingsPointMenu, event, scaleCenter_){
        scaleCenter = scaleCenter_;
        const parent_target = d3.select(event.target.parentNode)
        const target = d3.select(event.target)
        let parent_target_g = parent_target.insert("g", ":first-child")
                                            .attr("width", settingsPointMenu["size-rect"][0])
                                            .attr("height", settingsPointMenu["size-rect"][1])
        
        this.appendRectForPointClicked(parent_target_g, target, settingsPointMenu["size-rect"])
        
        const rect = d3.select(".rect-menu-fairyTales")

        const xText = Number(rect.attr("x"))
        const yText = Number(rect.attr("y")) + 5.5*scaleCenter.scale/800
        const content_svg = this.appendSVGElemContToPointMenu(xText, yText, settingsPointMenu["size-rect"])
        this.appendTextToRectMenuFairyTales(content_svg, "50%", settingsPointMenu["ratioYCoordNation"]*scaleCenter.scale, target.attr("ethnicGroup"), settingsPointMenu["font-size-header"]*(3/4), "header")
        this.appendTextToRectMenuFairyTales(content_svg, "50%", settingsPointMenu["ratioYCoordRegion"]*scaleCenter.scale, target.attr("regionName"), settingsPointMenu["font-size-header"]/2, "region_name")
        this.addButtonToPointMenu(parent_target_g, settingsPointMenu["size-rect"], event, content_svg)
        document.querySelector(".points").append(event.target.parentNode)
    }
    static MovePointMenuTo(event, settingsPointMenu){
        const target_ = d3.select(event.target)
        console.log(event.target.parentNode)
        fetch('http://saintmolly.ru:3005/api/story/ethnic-group/'+String(target_.attr("ethnicGroup")))
        .then(response => response.json())
        .then(commits=>{
            
            d3.select(".rect-menu-fairyTales")
            .attr('x', Number(target_.attr("cx"))-settingsPointMenu["size-rect"][0]/2)
            .attr('y', Number(target_.attr("cy"))-settingsPointMenu["size-rect"][1])

            const rect = d3.select(".rect-menu-fairyTales")
            const xText = Number(rect.attr("x"))
            const yText = Number(rect.attr("y")) + 5.5*scaleCenter.scale/800

            d3.select(".content-cont-rect-menu-svg")
            .attr("x", xText )
            .attr("y", yText- 6*scaleCenter.scale/850)

            d3.select("#cut-off-bottom").selectChild("rect")
            .attr('x', Number(target_.attr("cx"))-settingsPointMenu["size-rect"][0]/2)
            .attr('y', Number(target_.attr("cy"))-1)
            
            d3.select("#semicircle-rect-menu-fT")
            .attr('cx', Number(target_.attr("cx")))
            .attr('cy', Number(target_.attr("cy")))
            let labels = d3.selectAll(".label-nationalityAndRegion-rect-menu")
            
            //
            fetch("http://saintmolly.ru:3005/api/ethnic-group/"+String(target_.attr("ethnicGroup")))
            .then(response =>response.json()).then(result=>{
                if(result["name"].length > 18){
                    labels["_groups"][0][0].innerHTML = result["name"].slice(0, 18)+"..."
                }
                else{
                    labels["_groups"][0][0].innerHTML = result["name"]
                }
                
            })
            labels["_groups"][0][1].innerHTML = event.target.getAttribute("regionName")
            let counts = d3.selectAll(".countBooks-rect-button-content-menu")["_groups"][0]
            counts[0].innerHTML = commits.length
            let countAudio = 0
            commits.map(data => {
                if(data["audioId"]){
                    countAudio++
                }
            })
            counts[1].innerHTML = countAudio
            d3.selectAll(".cont-books-rects-menu").on("click", FillCatalogBooks.bind(this, event))
            event.target.before(document.querySelector(".rect-menu-fairyTales-cont"))
            d3.select(".rect-menu-fairyTales-cont").style("display", "block")
            document.querySelector(".points").append(event.target.parentNode)
        })
    }
    

}