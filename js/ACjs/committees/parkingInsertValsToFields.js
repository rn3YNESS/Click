
var stickerColor;
var parkingLocation_0;
var parkingLocation_1;
var parkingLocation_2;
var parkingLocation_3;
var parkingLocation_4;
var parkingLocation_5;

$('document').ready(function(){

    window.setTimeout(readyCall, 1000);

});



function readyCall(){

stickerColor = document.getElementById("ctl00_ctl36_g_5b064810_6df8_497d_9ffb_5c1ebcfbfda0_ff121_ctl00_DropDownChoice");
   stickerColor.onchange = function(){onStickerChanged()};
parkingLocation_0 = document.getElementById("ctl00_ctl36_g_5b064810_6df8_497d_9ffb_5c1ebcfbfda0_ff131_ctl00_ctl00");
parkingLocation_1 = document.getElementById("ctl00_ctl36_g_5b064810_6df8_497d_9ffb_5c1ebcfbfda0_ff131_ctl00_ctl01");
parkingLocation_2 = document.getElementById("ctl00_ctl36_g_5b064810_6df8_497d_9ffb_5c1ebcfbfda0_ff131_ctl00_ctl02");
parkingLocation_3 = document.getElementById("ctl00_ctl36_g_5b064810_6df8_497d_9ffb_5c1ebcfbfda0_ff131_ctl00_ctl03");
parkingLocation_4 = document.getElementById("ctl00_ctl36_g_5b064810_6df8_497d_9ffb_5c1ebcfbfda0_ff131_ctl00_ctl04");
parkingLocation_5 = document.getElementById("ctl00_ctl36_g_5b064810_6df8_497d_9ffb_5c1ebcfbfda0_ff131_ctl00_ctl05");

								



}

function onStickerChanged(){

	parkingLocation_0.checked = false;
    parkingLocation_1.checked = false;
    parkingLocation_2.checked = false;
    parkingLocation_3.checked = false;
    parkingLocation_4.checked = false;
    parkingLocation_5.checked = false;





switch(stickerColor.value) {
	case "לבן":
            
        parkingLocation_0.checked = true;
        parkingLocation_1.checked = true;
        parkingLocation_2.checked = true;
        parkingLocation_3.checked = true;
		parkingLocation_4.checked = true;
        parkingLocation_5.checked = true;

    	break;
	case "חום":
         
    	parkingLocation_1.checked = true;
    	parkingLocation_2.checked = true;
        parkingLocation_3.checked = true;
        parkingLocation_4.checked = true;
        parkingLocation_5.checked = true;


        break;
        
	case "ירוק":
            
		parkingLocation_2.checked = true;
	    parkingLocation_3.checked = true;
        parkingLocation_4.checked = true;
        parkingLocation_5.checked = true;

    	break;
    case "צהוב":
         
         parkingLocation_3.checked = true;
         parkingLocation_4.checked = true;
         parkingLocation_5.checked = true;


        break;


case "כתום":
         
  parkingLocation_3.checked = true;
         parkingLocation_4.checked = true;
          parkingLocation_5.checked = true;


        break;
        
         case "אדום":
            
          parkingLocation_4.checked = true;
          parkingLocation_5.checked = true;
    	break;
    case "כחול":
         
         parkingLocation_5.checked = true;

        break;


        
        
        
    default:
        
}





}
