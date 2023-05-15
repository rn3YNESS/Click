function checkDOMChange() {
    var guid;
    var btnguid;
    var statusGuid;
    var url = window.location.href;
    if (window.location.href.indexOf("newifs.aspx") > 0) {
        /*chance ctl37 to ctl140 for seattle masterpage*/
        guid = 'ctl00_ctl37_g_abfada0e_640d_4a8f_a8ff_81694aa7f3a6_FormControl0_V1_I1_E1';//ID section
        btnguid = 'ctl00_ctl37_g_abfada0e_640d_4a8f_a8ff_81694aa7f3a6_FormControl0_V1_I1_B4';//refresh visitors button
        statusGuid = 'ctl00_ctl37_g_abfada0e_640d_4a8f_a8ff_81694aa7f3a6_FormControl0_V1_I1_E7';//status section
    }
    else {
        guid = 'ctl00_ctl37_g_cffbf678_0af4_42f8_826b_5c7d346bf477_FormControl0_V1_I1_E1';
        btnguid = 'ctl00_ctl37_g_cffbf678_0af4_42f8_826b_5c7d346bf477_FormControl0_V1_I1_B4';
        statusGuid = 'ctl00_ctl37_g_cffbf678_0af4_42f8_826b_5c7d346bf477_FormControl0_V1_I1_E7';
    }
    if (document.getElementById(guid) != null) {
        var tt = document.getElementById(guid).innerHTML;
        clearTimeout(timer);
        if (document.getElementById(statusGuid).innerHTML != "נשלחה" && document.getElementById(statusGuid).innerHTML != "הסתיים טיפול") {
            document.getElementById('addVisitorBtn').style.display = "block";
            document.getElementById('deleteGuest').style.display = "block";
        }
        document.getElementById('addVisitorBtn').onclick = function () {
            OpenPopUpPage('/visitors/Lists/visitors/מוזמן/newifs.aspx?orderId=' + tt + '&IsDlg=1', function () { RefreshPage; document.getElementById(btnguid).click(); })
        };
        document.getElementById('deleteGuest').onclick = function () {
            //alert('hello'); 
            OpenPopUpPage('/visitors/Pages/editGuests.aspx?DELID=' + tt + '&IsDlg=1', function () { RefreshPage; document.getElementById(btnguid).click(); })
        };
    }
    return;
}

 // call the function again after 100 milliseconds
 const timer = setTimeout(checkDOMChange, 500);
