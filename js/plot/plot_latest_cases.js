
//-- Filename:
//--   plot_latest_cases.js
//--
//-- Author:
//--   Chieh-An Lin

var PLC_plot_list = [
  [CBT_Main, CBT_latest_wrap, 1000],
  [LCPC_Main, LCPC_latest_wrap, 1000],
  [CBA_Main, CBA_latest_wrap, 1000],
];

GP_Cascade(PLC_plot_list);
