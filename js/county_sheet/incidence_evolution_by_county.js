
//-- Filename:
//--   incidence_evolution_by_county.js
//--
//-- Author:
//--   Chieh-An Lin

function IEBC_InitFig(wrap) {
  wrap.tot_width = 1200;
  wrap.tot_height_ = {};
  wrap.tot_height_['zh-tw'] = 540;
  wrap.tot_height_['fr'] = 540;
  wrap.tot_height_['en'] = 540;
  wrap.margin_ = {};
  wrap.margin_['zh-tw'] = {left: 110, right: 2, bottom: 105, top: 2};
  wrap.margin_['fr'] = {left: 110, right: 2, bottom: 90, top: 2};
  wrap.margin_['en'] = {left: 110, right: 2, bottom: 90, top: 2};
  
  GS_InitFig(wrap);
}

function IEBC_ResetText() {
  if (GS_lang == 'zh-tw') {
//     TT_AddStr("incidence_evolution_by_county_title", "各縣市之每日確診人數"); //WARNING
//     TT_AddStr("incidence_evolution_by_county_button_total", "本土合計");
  }
  
  else if (GS_lang == 'fr') {
//     TT_AddStr("incidence_evolution_by_county_title", "Cas confirmés locaux par ville et comté");
//     TT_AddStr("incidence_evolution_by_county_button_total", "Locaux totaux");
  }
  
  else { //-- En
    TT_AddStr("incidence_evolution_by_county_title", "Evolution of Incidence Rate by City & County");
//     TT_AddStr("incidence_evolution_by_county_button_total", "Total local");
  }
}

function IEBC_FormatData(wrap, data) {
  //-- Variables for xtick
  var q = data.length % wrap.xlabel_path;
  var r = wrap.r_list[q];
  var xtick = [];
  var xticklabel = [];
  
  //-- Variables for data
  var col_tag_list = data.columns.slice(1);
  var nb_col = col_tag_list.length;
  var x_list = []; //-- For date
  var row, col_tag;
  
  //-- Other variables
  var formatted_data = [];
  var i, j, x, y, value, block;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    x = row['date'];
    x_list.push(x);
    
    //-- Determine whether to have xtick
    if (i % wrap.xlabel_path == r) {
      xtick.push(i+0.5)
      xticklabel.push(x);
    }
    
    //-- Loop over column
    for (j=0; j<nb_col; j++) {
      col_tag = col_tag_list[j]
      
      //-- Make data block
      block = {
        'x': x,
        'y': col_tag,
        'value': +row[col_tag]
      };
      
      //-- Stock
      formatted_data.push(block);
    }
  }
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<nb_col; i++)
    ytick.push(i+0.5);
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.x_list = x_list;
  wrap.xtick = xtick;
  wrap.xticklabel = xticklabel;
  wrap.ytick = ytick;
}

function IEBC_Plot(wrap) {
  //-- Define xscale
  var xscale = d3.scaleBand()
    .domain(wrap.x_list)
    .range([0, wrap.width])
    .padding(0.04);
    
  //-- Define xscale_2 for xtick & xticklabel
  var eps = 0.1
  var xscale_2 = d3.scaleLinear()
    .domain([-eps, wrap.x_list.length+eps])
    .range([0, wrap.width]);
  
  //-- Define xaxis & update xtick or xticklabel later
  var xaxis = d3.axisBottom(xscale_2)
    .tickSize(0)
    .tickFormat('');
  
  //-- Add xaxis & adjust position
  wrap.svg.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + wrap.height + ')')
    .call(xaxis);
    
  //-- Define yscale
  var yscale = d3.scaleBand()
    .domain(wrap.col_tag_list)
    .range([0, wrap.height])
    .padding(0.04);
  
  //-- Define yaxis for only yticklabel, no ytick
  var yaxis = d3.axisLeft(yscale)
    .tickSize(0)
    .tickFormat(function (d, i) {return wrap.col_tag_list[i]});
  
  //-- Add yaxis
  wrap.svg.append('g')
    .attr('class', 'yaxis')
    .call(yaxis)
    .selectAll('text')
      .attr('transform', 'translate(-3,0)')
      .style('font-size', '12px');

  //-- Define yaxis_2 for the frameline at right
  var yaxis_2 = d3.axisRight(yscale)
    .ticks(0)
    .tickSize(0);
  
  //-- Add yaxis_2 & adjust position
  wrap.svg.append('g')
    .attr('class', 'yaxis')
    .attr('transform', 'translate(' + wrap.width + ',0)')
    .call(yaxis_2);
    
  //-- Define square color
  var color = d3.scaleSequential()
    .domain([0, 60]) //WARNING use y_max
    .interpolator(t => d3.interpolateMagma(1-0.75*t));
  
  //-- Add square
  wrap.svg.selectAll()
    .data(wrap.formatted_data)
    .enter()
    .append('rect')
      .attr('class', 'content square')
      .attr('x', function (d) {return xscale(d.x);})
      .attr('y', function (d) {return yscale(d.y);})
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('width', xscale.bandwidth())
      .attr('height', yscale.bandwidth())
      .style('fill', function (d) {return color(d.value);})
      .on('mouseover', function (d) {GS_MouseOver2(wrap, d);})
      .on('mouseleave', function (d) {GS_MouseLeave2(wrap, d);});
    
  //-- Add text
  wrap.svg.selectAll()
    .data(wrap.formatted_data)
    .enter()
    .append('text')
      .attr('class', 'content text')
      .attr('x', function (d) {return xscale(d.x) + 0.5*+xscale.bandwidth();})
      .attr('y', function (d) {return yscale(d.y) + 0.5*+yscale.bandwidth();})
      .style('fill', function (d) {if (d.value<25) return '#000000'; return '#FFFFFF';})
      .text(function (d) {return d.value.toFixed(0);})
      .style('font-size', '10px')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central');
  
  //-- Save to wrapper
  wrap.xscale_2 = xscale_2;
  wrap.yscale = yscale;
}

function IEBC_Replot(wrap) {
  //-- Define new xaxis for xticklabel
  var x_axis = d3.axisBottom(wrap.xscale_2)
    .tickSize(0)
    .tickValues(wrap.xtick)
    .tickFormat(function (d, i) {return GS_ISODateToMDDate(wrap.xticklabel[i]);});
  
  //-- Update xaxis
  wrap.svg.select('.xaxis')
    .transition()
    .duration(GS_wrap.trans_delay)
    .call(x_axis)
    .selectAll('text')
      .attr('transform', 'translate(-20,15) rotate(-90)')
      .style('font-size', '14px')
      .style('text-anchor', 'end');
  
//   //-- Define y-axis
//   var yscale = d3.scaleLinear()
//     .domain([0, wrap.y_max])
//     .range([wrap.height, 0]);
//   
//   //-- Define ytick
//   var yaxis = d3.axisLeft(yscale)
//     .tickSize(-wrap.width)
//     .tickValues(wrap.ytick)
//     .tickFormat(d3.format('d'));
//   
//   //-- Update y-axis
//   wrap.svg.select('.yaxis')
//     .transition()
//     .duration(GS_wrap.trans_delay)
//     .call(yaxis);
}

//-- Load
function IEBC_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      IEBC_FormatData(wrap, data);
      IEBC_Plot(wrap);
      IEBC_Replot(wrap);
    });
}

function IEBC_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      IEBC_FormatData(wrap, data);
      IEBC_Replot(wrap);
    });
}

function IEBC_ButtonListener(wrap) {
  //-- Period
//   d3.select(wrap.id +'_county').on('change', function() {
//     wrap.county = this.value;
//     IEBC_Reload(wrap);
//   });
  
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
//     col_label = [
//       'Total', 'Keelung', 'Taipei', 'New Taipei', 'Taoyuan', 'Hsinchu County', 'Hsinchu City', 'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
//       'Chiayi County', 'Chiayi City', 'Tainan', 'Kaohsiung', 'Pingtung', 'Yilan', 'Hualien', 'Taitung', 'Penghu', 'Kinmen', 'Matsu'
//     ];
//     var tag1 = col_label[wrap.county];
    
    name = wrap.tag + '_' + GS_lang + '.png';
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });

  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    GS_lang = this.value;
    Cookies.set("lang", GS_lang);
    
    //-- Replot
    IEBC_ResetText();
    IEBC_Replot(wrap);
  });
}

//-- Main
function IEBC_Main(wrap) {
  wrap.id = '#' + wrap.tag;

  //-- Swap active to current value
//   wrap.county = document.getElementById(wrap.tag + "_county").value;
  
  //-- Load
  IEBC_InitFig(wrap);
  IEBC_ResetText();
  IEBC_Load(wrap);
  
  //-- Setup button listeners
  IEBC_ButtonListener(wrap);
}
