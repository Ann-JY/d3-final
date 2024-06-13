import * as d3 from "d3"; //d3 가져오기
import "./viz.css"; //스타일링 첨부

////////////////////////////////////////////////////////////////////
////////////////////////////  Init  ///////////////////////////////
// svg
const svg = d3.select("#svg-container").append("svg").attr("id", "svg");
let width = parseInt(d3.select("#svg-container").style("width"));
let height = parseInt(d3.select("#svg-container").style("height"));
const margin = { top: 70, right: 30, bottom: 60, left: 100 };

// parsing & formatting
const parseTime = d3.timeParse("%Y");
const parseDate = d3.timeParse("%m/%d");
const formatDate = d3.timeFormat("%m/%d");
const formatYAxis = d3.timeFormat("%Y");

// scale
const xScale = d3.scaleTime().range([margin.left, width - margin.right]);
const yScale = d3.scaleTime().range([height - margin.bottom, margin.top]);

// axis
const xAxis = d3
  .axisBottom(yScale)
  .ticks(10)
  .tickFormat((d) => formatYAxis(d)) // x축 설정
  .tickSizeOuter(0);

const yAxis = d3.axisLeft(xScale).ticks(5).tickSize(10).tickPadding(7);

/////////////////////////////////////////////////////////////////// line
const line = d3
  .line()
  .defined((d) => d.gwangju !== null)
  .x((d) => yScale(d.gwangju))
  .y((d) => xScale(d.year));

const line2 = d3
  .line()
  .defined((d) => d.daegu !== null)
  .x((d) => yScale(d.daegu))
  .y((d) => xScale(d.year));

const line3 = d3
  .line()
  .defined((d) => d.daejeon !== null)
  .x((d) => yScale(d.daejeon))
  .y((d) => xScale(d.year));

const line4 = d3
  .line()
  .defined((d) => d.busan !== null)
  .x((d) => yScale(d.busan))
  .y((d) => xScale(d.year));

const line5 = d3
  .line()
  .defined((d) => d.seoul !== null)
  .x((d) => yScale(d.seoul))
  .y((d) => xScale(d.year));

const line6 = d3
  .line()
  .defined((d) => d.ulsan !== null)
  .x((d) => yScale(d.ulsan))
  .y((d) => xScale(d.year));

const line7 = d3
  .line()
  .defined((d) => d.incheon !== null)
  .x((d) => yScale(d.incheon))
  .y((d) => xScale(d.year));

const line8 = d3
  .line()
  .defined((d) => d.jeju !== null)
  .x((d) => yScale(d.jeju))
  .y((d) => xScale(d.year));

const line9 = d3
  .line()
  .defined((d) => d.avg !== null)
  .x((d) => yScale(d.avg))
  .y((d) => xScale(d.year));

////////////////////////////////////////////////////////////////////
////////////////////////////  Load CSV  ////////////////////////////
let data = [];

d3.json("data/cherryblossom2.json").then((raw_data) => {
  const data = raw_data.map((d) => {
    return {
      year: parseTime(d.year.toString()),
      gwangju: d.gwangju !== "x" ? parseDate(d.gwangju) : null, //gwangju
      daegu: d.daegu !== "x" ? parseDate(d.daegu) : null, //daegu
      daejeon: d.daejeon !== "x" ? parseDate(d.daejeon) : null, //daejeon
      seoul: d.seoul !== "x" ? parseDate(d.seoul) : null, //seoul
      busan: d.busan !== "x" ? parseDate(d.busan) : null, // busan
      ulsan: d.ulsan !== "x" ? parseDate(d.ulsan) : null, // ulsan
      incheon: d.incheon !== "x" ? parseDate(d.incheon) : null, // incheon
      jeju: d.jeju !== "x" ? parseDate(d.jeju) : null, // jeju
      avg: d.avg !== "x" ? parseDate(d.avg) : null, //jeju
    };
  });

  const mar1 = parseDate("03/01");
  const apr25 = parseDate("04/25");

  xScale.domain(d3.extent(data, (d) => d.year));
  yScale.domain([mar1, apr25]);

  //axis
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .call((g) =>
      g
        .append("text")
        .attr("x", -margin.left + 35)
        .attr("y", 50)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("(개화시기)")
    );

  svg
    .append("path")
    .datum(data)
    .attr("class", "gwangju")
    .attr("fill", "none")
    .attr("stroke", "#e05780")
    .attr("stroke-width", 1.5)
    .attr("d", line)
    .style("opacity", 0.3);

  svg
    .append("path")
    .datum(data)
    .attr("class", "daegu")
    .attr("fill", "none")
    .attr("stroke", "#e05780")
    .attr("stroke-width", 1.5)
    .attr("d", line2)
    .style("opacity", 0.3);

  svg
    .append("path")
    .datum(data)
    .attr("class", "daejeon")
    .attr("fill", "none")
    .attr("stroke", "#e05780")
    .attr("stroke-width", 1.5)
    .attr("d", line3)
    .style("opacity", 0.3);

  svg
    .append("path")
    .datum(data)
    .attr("class", "busan")
    .attr("fill", "none")
    .attr("stroke", "#e05780")
    .attr("stroke-width", 1.5)
    .attr("d", line4)
    .style("opacity", 0.3);

  svg
    .append("path")
    .datum(data)
    .attr("class", "seoul")
    .attr("fill", "none")
    .attr("stroke", "#e05780")
    .attr("stroke-width", 1.5)
    .attr("d", line5)
    .style("opacity", 0.3);
  svg
    .append("path")
    .datum(data)
    .attr("class", "ulsan")
    .attr("fill", "none")
    .attr("stroke", "#e05780")
    .attr("stroke-width", 1.5)
    .attr("d", line6)
    .style("opacity", 0.3);

  svg
    .append("path")
    .datum(data)
    .attr("class", "incheon")
    .attr("fill", "none")
    .attr("stroke", "#e05780")
    .attr("stroke-width", 1.5)
    .attr("d", line7)
    .style("opacity", 0.3);

  svg
    .append("path")
    .datum(data)
    .attr("class", "jeju")
    .attr("fill", "none")
    .attr("stroke", "#e05780")
    .attr("stroke-width", 1.5)
    .attr("d", line8)
    .style("opacity", 0.3);

  svg
    .append("path")
    .datum(data)
    .attr("class", "average")
    .attr("fill", "none")
    .attr("stroke", "#e05780")
    .attr("stroke-width", 5)
    .attr("d", line9)
    .style("opacity", 0.7);

  //마우스오버 이벤트

  svg
    .selectAll(
      ".gwangju, .daegu, .daejeon, .busan, .seoul, .ulsan, .incheon, .jeju, .average"
    )
    .on("mouseover", function (event, d) {
      const [mouseX, mouseY] = d3.pointer(event, this);

      const className = d3.select(this).attr("class");

      svg
        .append("rect")
        .attr("class", "tooltip-box")
        .attr("x", mouseX + 5)
        .attr("y", mouseY - 25)
        .attr("width", 70)
        .attr("height", 25)
        .style("fill", "white")
        .style("stroke", "#e05780")
        .style("opacity", 1)
        .attr("rx", 5)
        .attr("ry", 5);

      svg
        .append("text")
        .attr("class", "hover-text")
        .attr("x", mouseX + 40)
        .attr("y", mouseY - 10)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("fill", "#e05780")
        .text(className);

      d3.select(this).attr("stroke-width", 5);
    })
    .on("mouseout", function () {
      svg.select(".hover-text").remove();
      svg.select(".tooltip-box").remove();

      d3.select(this).attr("stroke-width", 1.5);
    });
});
