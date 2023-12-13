// URL
const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let wholedata;
// Use D3 to select the dropdown menu
let dropdownMenu = d3.select("#selDataset");

function init() {
  // fetch the json data and console log it
  d3.json(url).then(function (data) {
    // getting all names from json

    let names = data.names;
    wholedata = data;

    // Add  samples to dropdown menu
    names.forEach((name) => {
      dropdownMenu.append("option").text(name).property("value", name);
    });

    let first_name = names[0];
    //console.log(first_name);

    demographic_Info(first_name);
    demo_bar(first_name);
    demo_bubblechart(first_name);
    demo_gaugechart(first_name);
  });
}

// **************************** demographic_Info      ****************************************************
let demographic_Info = (sample_Name) => {
  let metadata = wholedata.metadata;

  // Filter data where id = selected value after converting their types
  // (bc meta.id is in integer format and selectValue from is in string format)

  let filter_Data = metadata.filter((meta) => meta.id == sample_Name);

  // Clear the child elements in div with id sample-metadata
  d3.select("#sample-metadata").html("");

  // Assign the first object to obj variable
  let sample_data = filter_Data[0];

  // Object.entries() is a built-in method in JavaScript
  // This returns an array of a given object's own enumerable property [key, value]
  let entries = Object.entries(sample_data);
  console.log(entries);

  // Iterate through the entries array
  // Add a h5 child element for each key-value pair to the div with id sample-metadata
  entries.forEach(([key, value]) => {
    d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
  });
};

// **************************** Bar graph ****************************************************
let demo_bar = (sample_Name) => {
  let samples_data = wholedata.samples;

  // Filter data where id = selected value after converting their types
  // (bc meta.id is in integer format and selectValue from is in string format)

  let filter_Data = samples_data.filter((meta) => meta.id == sample_Name);
  // console.log(filter_Data);

  // Assign the first object to obj variable
  let obj = filter_Data[0];

  // Trace for the data for the horizontal bar chart
  let trace = [
    {
      // Slice the top 10 otus
      x: obj.sample_values.slice(0, 10).reverse(),
      y: obj.otu_ids
        .slice(0, 10)
        .map((otu_id) => `OTU ${otu_id}`)
        .reverse(),
      text: obj.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      // marker: {
      //   color: "rgb(166,172,237)",
      // },
      orientation: "h",
    },
  ];

  // Use Plotly to plot the data in a bar chart
  Plotly.newPlot("bar", trace);
};

// **************************** Bubble chart ****************************************************
let demo_bubblechart = (sample_Name) => {
  let samples_data = wholedata.samples;
  // console.log(wholedata);

  // Filter data where id = selected value after converting their types
  // (bc meta.id is in integer format and selectValue from is in string format)

  let filter_Data = samples_data.filter((meta) => meta.id == sample_Name);
  //console.log(filter_Data);

  // Assign the first object to obj variable
  let obj = filter_Data[0];

  // Trace for the data for the bubble chart
  let trace = [
    {
      x: obj.otu_ids,
      y: obj.sample_values,
      text: obj.otu_labels,
      mode: "markers",
      marker: {
        size: obj.sample_values,
        color: obj.otu_ids,
        colorscale: "Portland",
      },
    },
  ];

  // Apply the x-axis lengend to the layout
  let layout = {
    xaxis: { title: "OTU ID" },
  };

  // Use Plotly to plot the data in a bubble chart
  Plotly.newPlot("bubble", trace, layout);
};

// **************************** Gauge Chart ****************************************************
let demo_gaugechart = (sample_Name) => {
  let metadatagauge = wholedata.metadata;
  //console.log(metadata);

  // Filter data where id = selected value after converting their types
  // (bc meta.id is in integer format and selectValue from is in string format)

  let filter_Datagauge = metadatagauge.filter((meta) => meta.id == sample_Name);

  // Assign the first object to obj variable
  let sample_datagauge = filter_Datagauge[0];

  // Trace for the data for the bubble chart
  let trace = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: sample_datagauge.wfreq,
      title: {
        text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
        font: { size: 24 },
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [0, 10], tickmode: "linear", tick0: 1, dtick: 1 },
        // bar: { color: "black" },

        steps: [
          {
            range: [0, 1],
            color: "rgba(255, 255, 255, 0)",
            text: "0",
          },
          {
            range: [1, 2],
            color: "rgba(232, 226, 202, .5)",
          },
          {
            range: [2, 3],
            color: "rgba(210, 206, 145, .5)",
          },
          {
            range: [3, 4],
            color: "rgba(202, 209, 95, .5)",
          },
          {
            range: [4, 5],
            color: "rgba(184, 205, 68, .5)",
          },
          {
            range: [5, 6],
            color: "rgba(170, 202, 42, .5)",
          },
          {
            range: [6, 7],
            color: "rgba(142, 178, 35 , .5)",
          },
          {
            range: [7, 8],
            color: "rgba(110, 154, 22, .5)",
          },
          {
            range: [8, 9],
            color: "rgba(50, 143, 10, 0.5)",
          },
          {
            range: [9, 10],
            color: "rgba(14, 127, 0, .5)",
          },
        ],
      },
    },
  ];

  // Use Plotly to plot the data in a gauge chart
  Plotly.newPlot("gauge", trace);
};

// Toggle to new plots when option changed
function optionChanged(selectedValue) {
  demographic_Info(selectedValue);
  demo_bar(selectedValue);
  demo_bubblechart(selectedValue);
  demo_gaugechart(selectedValue);
}

//When valve in drop down changes
dropdownMenu.on("change", (event) => {
  optionChanged(event.target.value);
});

init();
