
//-- Filename:
//--   analytics.js
//--
//-- Author:
//--   Chieh-An Lin

//------------------------------------------------------------------------------
//-- Script

var host = window.location.hostname;
if (!host in ["localhost", "127.0.0.1"]) {    
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-58898441-4');
}

//-- End of file
//------------------------------------------------------------------------------
