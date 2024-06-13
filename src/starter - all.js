import * as d3 from "d3";
import "./viz.css";

// svg 설정
const svg = d3.select("#svg-container").append("svg").attr("id", "svg");
let width = parseInt(d3.select("#svg-container").style("width"));
let height = parseInt(d3.select("#svg-container").style("height"));
const margin = { top: 30, right: 55, bottom: 75, left: 65 };

const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("display", "none")
  .style("background-color", "white")
  // .style("border", "1px solid #000000")
  // .style("padding", "5px")
  // .style("border-radius", "5px")
  .style("color", "#000000");

const parseTime = d3.timeParse("%Y");
const parseDate = d3.timeParse("%m/%d");
const formatDate = d3.timeFormat("%m/%d");
const formatXAxis = d3.timeFormat("%Y");

const xScale = d3.scaleTime().range([margin.left, width - margin.right]);
const yScale = d3.scaleTime().range([height - margin.bottom, margin.top]);

const xAxis = d3
  .axisBottom(xScale)
  .ticks(10)
  .tickFormat((d) => formatXAxis(d))
  .tickSizeOuter(0);

const yAxis = d3
  .axisLeft(yScale)
  .ticks(5)
  .tickFormat(formatDate)
  .tickSize(8)
  .tickPadding(2);

const line = d3
  .line()
  .defined((d) => d.avg !== null)
  .x((d) => xScale(d.year))
  .y((d) => yScale(d.avg))
  .curve(d3.curveCatmullRom.alpha(0.5));

const colorMap = {
  cherryblossom: "#e05780",
  forsythia: "#F9A602",
  azalea: "#b80f0a",
};

let rawData;

const drawGraph = (type) => {
  const data = rawData.filter((d) => d.type === type);

  const xDomain = d3.extent(rawData, (d) => d.year);

  const mar1 = parseDate("03/01");
  const apr23 = parseDate("04/23");

  xScale.domain(xDomain);
  yScale.domain([mar1, apr23]);

  svg.selectAll("*").remove();

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left - 10},0)`)
    .call(yAxis)
    .call((g) =>
      g
        .append("text")
        .attr("x", -margin.left + 10)
        .attr("y", 18)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("(개화시기)")
    );

  const color = colorMap[type];

  svg
    .append("path")
    .datum(data)
    .attr("class", "average")
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", 2.5)
    .attr("d", line)
    .style("opacity", 0.7);

  const addDots = (city) => {
    svg
      .selectAll(`.dot-${city}`)
      .data(data)
      .enter()
      .append("circle")
      .attr("class", `dot-${city}`)
      .attr("cx", (d) => xScale(d.year))
      .attr("cy", (d) => yScale(d[city]))
      .attr("r", 3)
      .style("fill", color)
      .style("opacity", 0.2)
      .on("mousemove", function (event, d) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 25 + "px")
          .style("display", "block")
          .html(`${city}, ${formatDate(d[city])}`);

        d3.select(this)
          .style("stroke-width", 3)
          .attr("stroke", color)
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

  addDots("gwangju");
  addDots("daegu");
  addDots("daejeon");
  addDots("seoul");
  addDots("busan");
  addDots("ulsan");
  addDots("incheon");
  addDots("jeju");

  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr(
      "transform",
      `translate(${width - margin.right - 30}, ${margin.top})`
    );

  const legendItem = legend.append("g");

  legendItem
    .append("line")
    .attr("x1", -50)
    .attr("y1", -4)
    .attr("x2", -20)
    .attr("y2", -4)
    .attr("stroke", color)
    .attr("stroke-width", 2.5);

  legendItem
    .append("text")
    .attr("x", -15)
    .attr("y", 0)
    .attr("text-anchor", "start")
    .style("fill", "#000000")
    .text("전국평균")
    .style("font-size", "12px");

  legendItem
    .append("line")
    .attr("x1", -50)
    .attr("y1", 15)
    .attr("x2", -20)
    .attr("y2", 15)
    .attr("stroke", "#888")
    .attr("stroke-width", 1)
    .style("stroke-dasharray", "5, 5");

  legendItem
    .append("text")
    .attr("x", -15)
    .attr("y", 18)
    .attr("text-anchor", "start")
    .style("fill", "#000000")
    .text("추세선")
    .style("font-size", "12px");

  const points = data.map((d) => ({
    x: xScale(d.year),
    y: yScale(d.avg),
  }));

  const addLinearRegression = (pointsData, svg, color) => {
    const xMean = d3.mean(pointsData, (d) => d.x);
    const yMean = d3.mean(pointsData, (d) => d.y);

    const numerator = d3.sum(pointsData, (d) => (d.x - xMean) * (d.y - yMean));
    const denominator = d3.sum(
      pointsData,
      (d) => (d.x - xMean) * (d.x - xMean)
    );

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
      .attr("stroke", color)
      .style("stroke-dasharray", "5, 5")
      .attr("stroke-width", 1)
      .attr("d", line);
  };

  addLinearRegression(points, svg, color);
};

d3.json("data/all.json").then((data) => {
  rawData = data
    .map((d) => ({
      year: parseTime(d.year.toString()),
      gwangju: d.gwangju !== "x" ? parseDate(d.gwangju) : null,
      daegu: d.daegu !== "x" ? parseDate(d.daegu) : null,
      daejeon: d.daejeon !== "x" ? parseDate(d.daejeon) : null,
      seoul: d.seoul !== "x" ? parseDate(d.seoul) : null,
      busan: d.busan !== "x" ? parseDate(d.busan) : null,
      ulsan: d.ulsan !== "x" ? parseDate(d.ulsan) : null,
      incheon: d.incheon !== "x" ? parseDate(d.incheon) : null,
      jeju: d.jeju !== "x" ? parseDate(d.jeju) : null,
      avg: d.avg !== "x" ? parseDate(d.avg) : null,
      type: d.type,
    }))
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
  drawGraph("cherryblossom");
});

d3.select("#options").on("change", function () {
  const selectedType = d3.select(this).property("value");
  drawGraph(selectedType);
});

////////////////////////////////////////////////////////////////////
////////////////////////////  Resize  //////////////////////////////수정필요
window.addEventListener("resize", () => {
  // width, height 업데이트
  width = parseInt(d3.select("#svg-container").style("width"));
  height = parseInt(d3.select("#svg-container").style("height"));

  // SVG 크기 업데이트
  svg.attr("width", width).attr("height", height);

  // 스케일 업데이트
  xScale.range([margin.left, width - margin.right]);
  yScale.range([height - margin.bottom, margin.top]);

  // 그래프 다시 그리기
  const selectedType = d3.select("#options").property("value");
  drawGraph(selectedType);
});
