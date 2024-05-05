let id = 0
function addPointCircleInPath(g, data, targetElem, projection, pointRadius){
    const coord = projection([Number(data["longitude"]), Number(data["latitude"])])
    
    return g.append("g").append('circle')
        .attr('cx', coord[0])
        .attr('cy', coord[1])
        .attr('r', pointRadius)
        .attr("regionName", targetElem.getAttribute("regionName"))
        .attr("ethnicGroup", data["ethnicGroupId"])
        .attr("class", "points-circle")
        .attr("id", id++)
        .attr("fill", "url(#img1)")
        
}
export default addPointCircleInPath