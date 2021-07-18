
//-- Filename:
//--   vaccination_by_dose.js
//--
//-- Author:
//--   Chieh-An Lin

function VBD_InitFig(wrap) {
  if (wrap.tag.includes('mini'))
    GP_InitFig_Mini(wrap);
  else if (wrap.tag.includes('overall'))
    GP_InitFig_Overall(wrap);
  else
    GP_InitFig_Standard(wrap);
}

function VBD_ResetText() {
  if (LS_lang == 'zh-tw') {
    LS_AddStr('vaccination_by_dose_title', '疫苗劑次接種進度');
  }
  
  else if (LS_lang == 'fr') {
    LS_AddStr('vaccination_by_dose_title', 'Avancement de vaccination par nombre de doses');
  }
  
  else { //-- En
    LS_AddStr('vaccination_by_dose_title', 'Vaccination Progress by Dose');
  }
}

function VBD_FormatData(wrap, data) {
  //-- Variables for data
  var col_tag_list = data.columns.slice(2); //-- 0 = index, 1 = date
  var nb_col = col_tag_list.length;
  var i, j, x, y, row;
  
  //-- Variables for plot
  var x_key = 'date';
  var formatted_data = [];
  var y_list_list = [];
  var y_list, block, block2;
  
  //-- Variables for yaxis
  var y_max = 0;
  
  //-- Variables for legend
  var y_last_list = [];
  var y_last;
  
  //-- Loop over row
  for (i=0; i<data.length; i++) {
    row = data[i];
    y_list = [];
    
    //-- Loop over column
    for (j=0; j<nb_col; j++) {
      col = col_tag_list[j];
      
      if ('' == row[col])
        y = NaN;
      else
        y = +row[col];
      
      y_list.push(y);
    }
    y_list.push(0);
    
    y_list_list.push(y_list)
  }
  
  //-- Main loop over column
  for (j=0; j<nb_col; j++) {
    col = col_tag_list[j];
    block2 = [];
    
    //-- Loop over row
    for (i=0; i<data.length; i++) {
      y_list = y_list_list[i];
      y = y_list[j];
      
      //-- Make data block; redundant information is for toolpix text
      block = {
        'x': data[i]['index'],
        'y0': y_list[j+1],
        'y1': y_list[j],
        'y_list': y_list
      };
      
      //-- Update y_last & y_max
      if (!isNaN(y)) {
        y_last = y;
        y_max = Math.max(y_max, y);
      }
      
      //-- Stock
      block2.push(block);
    }
    
    //-- Stock
    formatted_data.push(block2);
    y_last_list.push(y_last);
  }
  
  //-- Calculate y_max
  y_max *= wrap.y_max_factor;
  
  //-- Calculate y_path
  if (wrap.tag.includes('mini'))
    wrap.nb_yticks = 1;
  var y_path = GP_CalculateTickInterval(y_max, wrap.nb_yticks, 'percentage');
  
  //-- Generate yticks
  var ytick = [];
  for (i=0; i<y_max; i+=y_path) 
    ytick.push(i)
  
  //-- Save to wrapper
  wrap.formatted_data = formatted_data;
  wrap.col_tag_list = col_tag_list;
  wrap.nb_col = nb_col;
  wrap.y_max = y_max;
  wrap.ytick = ytick;
  wrap.legend_value = y_last_list;
}

function VBD_FormatData2(wrap, data2) {
  //-- Not optional
  
  var i;
  for (i=0; i<data2.length; i++) {
    if ('timestamp' == data2[i]['key'])
      wrap.timestamp = data2[i]['value'];
  }
  
  //-- Set iso_begin
  if (wrap.tag.includes('latest'))
    wrap.iso_begin = GP_ISODateAddition(wrap.timestamp.slice(0, 10), -90+1);
  else if (wrap.tag.includes('overall'))
    wrap.iso_begin = GP_wrap.iso_ref_vacc;
  
  //-- Calculate xlim
  GP_MakeXLim(wrap, 'area');
  
  //-- Variables for xaxis
  var r = GP_GetRForTickPos(wrap, 90);
  var xticklabel = [];
  var x_list = [];
  var x;
  
  if (wrap.tag.includes('latest')) {
    //-- For xtick
    for (i=0; i<90; i++) {
      //-- Determine where to have xtick
      if (i % wrap.xlabel_path == r) {
        x = GP_ISODateAddition(wrap.iso_begin, i);
        x_list.push(i+wrap.x_min);
        xticklabel.push(x);
      }
    }
  }
  
  //-- Save to wrapper
  wrap.x_list = x_list;
  wrap.xticklabel = xticklabel;
}

function VBD_Plot(wrap) {
  //-- x = bottom, y = left
  GP_PlotBottomLeft(wrap);
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_PlotBottomOverallEmptyAxis(wrap);
  
  //-- Add ylabel
  GP_PlotYLabel(wrap);
  
  //-- Define color
  wrap.color_list = GP_wrap.c_list.slice(2, 2+wrap.nb_col).reverse();
  
  //-- Define xscale
  var xscale = GP_MakeLinearX(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
    
  //-- Define dummy area
  var draw_area = d3.area()
    .x(function (d) {return xscale(d.x);})
    .y0(yscale(0))
    .y1(yscale(0));
    
  //-- Add area
  var area = wrap.svg.selectAll('.content.area')
    .data(wrap.formatted_data)
    .enter();
    
  //-- Update area with dummy details
  area.append('path')
    .attr('class', 'content area')
    .attr('d', function (d) {return draw_area(d);})
    .style('fill', function (d, i) {return wrap.color_list[i];})
      .on('mouseover', function (d) {GP_MouseOver2(wrap, d);})
      .on('mouseleave', function (d) {GP_MouseLeave2(wrap, d);});
    
  //-- Save to wrapper
  wrap.area = area;
}

function VBD_Replot(wrap) {
  //-- Define xscale
  var xscale = GP_MakeLinearX(wrap);
  
  //-- Define yscale
  var yscale = GP_MakeLinearY(wrap);
    
  //-- Define area
  var draw_area = d3.area()
    .x(function (d) {return xscale(d.x);})
    .y0(function (d) {return yscale(d.y0);})
    .y1(function (d) {return yscale(d.y1);});
    
  //-- Update area
  wrap.area.selectAll('.content.area')
    .data(wrap.formatted_data)
    .transition()
    .duration(wrap.trans_delay)
      .attr('d', function (d) {return draw_area(d);});
    
  //-- Frameline for mini
  if (wrap.tag.includes('mini')) {
    GP_PlotTopRight(wrap);
    return;
  }
  
  //-- Replot xaxis
  if (wrap.tag.includes('overall'))
    GP_ReplotOverallXTick(wrap, 'area');
  else {
    //-- Define xaxis
    var xaxis = d3.axisBottom(xscale)
      .tickSize(10)
      .tickSizeOuter(0)
      .tickValues(wrap.x_list)
      .tickFormat(function (d, i) {return LS_ISODateToMDDate(wrap.xticklabel[i]);});
    
    //-- Add xaxis
    wrap.svg.select('.xaxis')
      .transition()
      .duration(wrap.trans_delay)
      .call(xaxis)
      .selectAll('text')
        .attr('transform', 'translate(-20,15) rotate(-90)')
        .style('text-anchor', 'end');
        
    //-- Tick style
    wrap.svg.selectAll('.xaxis line')
      .style('stroke-opacity', '0.4');
  }
  
  //-- Replot yaxis
  GP_ReplotCountAsY(wrap, 'percentage');
  
  //-- Update ylabel
  var ylabel_dict = {en: 'Proportion of the population', fr: 'Part de la population', 'zh-tw': '佔人口比例'};
  GP_ReplotYLabel(wrap, ylabel_dict);
    
  //-- Define legend position
  wrap.legend_pos = {x: wrap.legend_pos_x, y: 45, dx: 12, dy: 30};
  
  //-- Define legend color
  wrap.legend_color = wrap.color_list.slice();
  
  //-- No need to update legend value
  
  //-- Define legend label
  if (LS_lang == 'zh-tw')
    wrap.legend_label = ['已施打一劑', '已施打兩劑'];
  else if (LS_lang == 'fr')
    wrap.legend_label = ['1er dose ', '2nd dose'];
  else
    wrap.legend_label = ['1st dose', '2nd dose'];
  
  //-- Update legend title
  GP_UpdateLegendTitle(wrap);
  
  //-- Replot legend
  GP_ReplotLegend(wrap, 'percentage', 'normal');
}

//-- Load
function VBD_Load(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .defer(d3.csv, wrap.data_path_list[1])
    .await(function (error, data, data2) {
      if (error)
        return console.warn(error);
      
      VBD_FormatData(wrap, data);
      VBD_FormatData2(wrap, data2);
      VBD_Plot(wrap);
      VBD_Replot(wrap);
    });
}

function VBD_Reload(wrap) {
  d3.queue()
    .defer(d3.csv, wrap.data_path_list[0])
    .await(function (error, data) {
      if (error)
        return console.warn(error);
      
      VBD_FormatData(wrap, data);
      VBD_Replot(wrap);
    });
}

function VBD_ButtonListener(wrap) {
  //-- Save
  d3.select(wrap.id + '_save').on('click', function () {
    name = wrap.tag + '_' + LS_lang + '.png'
    saveSvgAsPng(d3.select(wrap.id).select('svg').node(), name);
  });
  
  //-- Language
  $(document).on("change", "input:radio[name='language']", function (event) {
    LS_lang = this.value;
    Cookies.set("lang", LS_lang);
    
    //-- Replot
    VBD_ResetText();
    VBD_Reload(wrap);
  });
}

//-- Main
function VBD_Main(wrap) {
  wrap.id = '#' + wrap.tag
  
  //-- Load
  VBD_InitFig(wrap);
  VBD_ResetText();
  VBD_Load(wrap);
  
  //-- Setup button listeners
  VBD_ButtonListener(wrap);
}
