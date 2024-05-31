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
const parseDate = d3.timeParse("%m-%d");
const formatDate = d3.timeFormat("%m-%d");
const formatXAxis = d3.timeFormat("%Y");

// const parseTime = d3.timeParse("%Y-%m-%d");
// const formatXAxis = d3.timeFormat("%Y");

// scale
const xScale = d3.scaleTime().range([margin.left, width - margin.right]);
const yScale = d3.scaleTime().range([height - margin.bottom, margin.top]);

// axis
const xAxis = d3
  .axisBottom(xScale)
  .ticks(10)
  .tickFormat((d) => formatXAxis(d)) //x축설정, 항목을 5개로, 그걸 포맷 적용
  .tickSizeOuter(0); //축에서 밖으로 나오는 거 삭제, 안해도 딱히 지장은 없음

const yAxis = d3
  .axisLeft(yScale)
  .ticks(5)
  .tickSize(10)
  //.tickSize(-width + margin.right + margin.left) //가로선
  .tickPadding(7);

// svg elements

////////////////////////////////////////////////////////////////////
////////////////////////////  Load CSV  ////////////////////////////
//  data (d3.csv)
let data = [];

d3.json("data/cherryblossom.json").then((raw_data) => {
  const data = raw_data
    .map((d) => {
      return {
        year: parseTime(d.year.toString()),
        seoul: d.seoul !== "x" ? parseDate(d.seoul) : null, //seoul
        busan: d.busan !== "x" ? parseDate(d.busan) : null, // busan
        jeju: d.jeju !== "x" ? parseDate(d.jeju) : null, // jeju
      };
    })
    .filter((d) => d.seoul !== null && d.busan !== null && d.jeju !== null);

  // d3.json("data/cherryblossom.json").then((raw_data) => {
  //   data = raw_data.map((d) => {
  //     d.date_parsed = parseTime(d.year);
  //     return d;
  //   });
  const mar1 = parseDate("03-01");
  const apr30 = parseDate("04-30");

  xScale.domain(d3.extent(data, (d) => d.year));
  yScale.domain([mar1, apr30]);

  //axis
  svg
    .append("g")
    // .attr("transform", "translate(0, " + (height - margin.bottom) + ")") //위치 정하기, 안하면 0,0에다 만들어짐
    .attr("class", "x-axis") //css에서 수정
    .attr("transform", `translate(0, ${height - margin.bottom})`) //`를 넣으면 ()안에 변수 넣을 수 있음, 안하면 숫자만
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

  // 서울
  svg
    .selectAll(".dot-seoul")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot-seoul")
    .attr("cx", (d) => xScale(d.year))
    .attr("cy", (d) => yScale(d.seoul))
    .attr("r", 3)
    .style("fill", "#e05780");

  // 부산
  svg
    .selectAll(".dot-busan")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot-busan")
    .attr("cx", (d) => xScale(d.year))
    .attr("cy", (d) => yScale(d.busan))
    .attr("r", 3)
    .style("fill", "#ff9ebb");

  // 제주
  svg
    .selectAll(".dot-jeju")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot-jeju")
    .attr("cx", (d) => xScale(d.year))
    .attr("cy", (d) => yScale(d.jeju))
    .attr("r", 3)
    .style("fill", "#ffe0e9");
});
