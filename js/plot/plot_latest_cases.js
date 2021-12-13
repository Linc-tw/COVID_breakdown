
    //--------------------------------//
    //--  plot_latest_cases.js      --//
    //--  Chieh-An Lin              --//
    //--  2021.12.13                --//
    //--------------------------------//

var PLC_plot_list = [
  [CC_Main, CC_latest_wrap, 1000],
  [LCPC_Main, LCPC_latest_wrap, 1000],
  [CBA_Main, CBA_latest_wrap, 1000],
];

GP_Cascade(PLC_plot_list);
