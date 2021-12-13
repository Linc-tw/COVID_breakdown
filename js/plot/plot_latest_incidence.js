
    //--------------------------------//
    //--  plot_latest_incidence.js  --//
    //--  Chieh-An Lin              --//
    //--  2021.12.13                --//
    //--------------------------------//

var PLI_plot_list = [
  [IR_Main, IR_latest_wrap, 1000],
  [IM_Main, IM_latest_wrap, 1700],
  [IEBC_Main, IEBC_latest_wrap, 1200],
  [IEBA_Main, IEBA_latest_wrap, 1200],
];

GP_Cascade(PLI_plot_list);
