import * as d3 from "d3"; //d3 가져오기
import "./viz.css"; //스타일링 첨부

////////////////////////////////////////////////////////////////////
////////////////////////////  Init  ///////////////////////////////
// svg
const svg = d3.select("#svg-container").append("svg").attr("id", "svg");
let width = parseInt(d3.select("#svg-container").style("width"));
let height = parseInt(d3.select("#svg-container").style("height"));
const margin = { top: 70, right: 30, bottom: 60, left: 100 };

////////////////////////////////////////////////////////////////////
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("display", "none")
  .style("background-color", "white")
  .style("border", "1px solid #e05780")
  .style("padding", "5px")
  .style("border-radius", "5px")
  .style("color", "#e05780");

d3.select(this).attr("stroke-width", 5);
///////////////////////////////////////////////////////////////////

// parsing & formatting
const parseTime = d3.timeParse("%Y");
const parseDate = d3.timeParse("%m/%d");
const formatDate = d3.timeFormat("%m/%d");
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

const line = d3
  .line()
  .defined((d) => d.avg !== null) // avg 값이 null이 아닌 경우만 정의
  .x((d) => xScale(d.year))
  .y((d) => yScale(d.avg))
  .curve(d3.curveCatmullRom.alpha(0.5));

// svg elements

////////////////////////////////////////////////////////////////////
////////////////////////////  Load CSV  ////////////////////////////
//  data (d3.csv)
let data = [];
let points = [];

// d3.json("data/cherryblossom2.json").then((raw_data) => {
// d3.json("data/forsythia.json").then((raw_data) => {
// d3.json("data/azalea.json").then((raw_data) => {
d3.json("data/all.json").then((raw_data) => {
  const data = raw_data
    .map((d) => {
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
        avg: d.avg !== "x" ? parseDate(d.avg) : null, //avg
      };
    })
    .filter(
      (d) =>
        d.gwangju !== null &&
        d.daegu !== null &&
        d.daejeon !== null &&
        d.seoul !== null &&
        d.busan !== null &&
        d.ulsan !== null &&
        d.incheon !== null &&
        d.jeju !== null &&
        d.avg !== null
    );

  const mar5 = parseDate("03/05");
  const apr25 = parseDate("04/25");

  xScale.domain(d3.extent(data, (d) => d.year));
  yScale.domain([mar5, apr25]);

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

  const addDots = (className, color, city) => {
    svg
      .selectAll(`.dot-${className}`)
      .data(data)
      .enter()
      .append("circle")
      .attr("class", `dot-${className}`)
      .attr("cx", (d) => xScale(d.year))
      .attr("cy", (d) => yScale(d[city]))
      .attr("r", 3)
      .style("fill", color)
      .style("opacity", 0.3)
      .on("mousemove", function (event, d) {
        tooltip
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 25 + "px")
          .style("display", "block")
          .html(`${className}, ${formatDate(d[city])}`);

        d3.select(this)
          .style("stroke-width", 3)
          .attr("stroke", "#e05780")
          .style("opacity", 1);
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
        d3.select(this)
          .style("stroke-width", 1)
          .attr("stroke", "#fff")
          .style("opacity", 0.3);
      });
  };

  addDots("daegu", "#ff9ebb", "daegu");
  addDots("gwangju", "#ff9ebb", "gwangju");
  addDots("daejeon", "#ff9ebb", "daejeon");
  addDots("seoul", "#ff9ebb", "seoul");
  addDots("busan", "#ff9ebb", "busan");
  addDots("ulsan", "#ff9ebb", "ulsan");
  addDots("incheon", "#ff9ebb", "incheon");
  addDots("jeju", "#ff9ebb", "jeju");

  addLinearRegression(points, svg);

  //평균
  svg
    .append("path")
    .datum(data)
    .attr("class", "average")
    .attr("fill", "none")
    .attr("stroke", "#e05780")
    .attr("stroke-width", 2.5)
    .attr("d", line)
    .style("opacity", 0.7);
  // .on("mousemove", function (event, d) {
  //   tooltip
  //     .style("left", event.pageX + 5 + "px")
  //     .style("top", event.pageY - 25 + "px")
  //     .style("display", "block")
  //     .html(`average`);

  //   d3.select(this).attr("stroke-width", 5);
  // })
  // .on("mouseout", function () {
  //   svg.select(".hover-text").remove();
  //   svg.select(".tooltip-box").remove();

  //   d3.select(this).attr("stroke-width", 3);
  // });

  points = data.map((d) => ({
    x: xScale(d.year),
    y: yScale(d.avg),
  }));

  addLinearRegression(points, svg);
});

const addLinearRegression = (pointsData, svg) => {
  const xMean = d3.mean(pointsData, (d) => d.x);
  const yMean = d3.mean(pointsData, (d) => d.y);

  const numerator = d3.sum(pointsData, (d) => (d.x - xMean) * (d.y - yMean));
  const denominator = d3.sum(pointsData, (d) => (d.x - xMean) * (d.x - xMean));

  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;

  const trendline = [
    {
      x: d3.min(pointsData, (d) => d.x),
      y: slope * d3.min(pointsData, (d) => d.x) + intercept,
    },
    {
      x: d3.max(pointsData, (d) => d.x),
      y: slope * d3.max(pointsData, (d) => d.x) + intercept,
    },
  ];

  const line = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y);

  svg
    .append("path")
    .datum(trendline)
    .attr("fill", "none")
    .attr("stroke", "#888")
    .style("stroke-dasharray", "5, 5")
    .attr("stroke-width", 1)
    .attr("d", line);
};

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// 평균 범례
const legendAvg = svg
  .append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${width - margin.right - 30}, ${margin.top})`);

legendAvg
  .append("line")
  .attr("x1", -40)
  .attr("y1", -4)
  .attr("x2", -10)
  .attr("y2", -4)
  .attr("stroke", "#e05780")
  .attr("stroke-width", 2.5);

legendAvg
  .append("text")
  .attr("x", -5)
  .attr("y", 0)
  .attr("text-anchor", "start")
  .style("fill", "#000000")
  .text("평균값")
  .style("font-size", "12px");

// 추세선 범례
const legendTrendline = svg
  .append("g")
  .attr("class", "legend")
  .attr(
    "transform",
    `translate(${width - margin.right - 30}, ${margin.top + 20})`
  );

legendTrendline
  .append("line")
  .attr("x1", -40)
  .attr("y1", -4)
  .attr("x2", -10)
  .attr("y2", -4)
  .attr("stroke", "#888")
  .attr("stroke-width", 1)
  .style("stroke-dasharray", "5, 5");

legendTrendline
  .append("text")
  .attr("x", -5)
  .attr("y", 0)
  .attr("text-anchor", "start")
  .style("fill", "#000000")
  .text("추세선")
  .style("font-size", "12px");

// ////////////////////////////////////////////////////////////////////
// ////////////////////////////  Resize  //////////////////////////////수정필요
// window.addEventListener("resize", () => {
//   //  width, height updated
//   width = parseInt(d3.select("#svg-container").style("width"));
//   height = parseInt(d3.select("#svg-container").style("height"));

//   //  scale updated
//   xScale.range([margin.left, width - margin.right]);
//   yScale.range([height - margin.bottom, margin.top]);

//   //  line updated
//   line.x((d) => xScale(d.date_parsed)).y((d) => yScale(d.price));

//   //  path updated
//   path.attr("d", line);

//   // circle
//   const lastValue = data[data.length - 1];

//   circle
//     .attr("cx", xScale(lastValue.date_parsed))
//     .attr("cy", yScale(lastValue.price));

//   //  axis updated
//   d3.select(".x-axis")
//     .attr("transform", `translate(0,${height - margin.bottom})`)
//     .call(xAxis);

//   d3.select(".y-axis")
//     .attr("transform", `translate(${margin.left}, 0)`)
//     .call(yAxis);
// });
