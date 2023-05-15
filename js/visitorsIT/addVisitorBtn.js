function checkDOMChange() {
    var guid;
    var btnguid;
    var statusGuid;
    var url = window.location.href;
    if (window.location.href.indexOf("newifs.aspx") > 0) {
        /*change ct137 to ct 140 for seattle master page*/
        guid = 'ctl00_ctl37_g_f55f201a_7245_4186_8e42_546c41549549_FormControl0_V1_I1_E1';//form id section
        btnguid = 'ctl00_ctl37_g_f55f201a_7245_4186_8e42_546c41549549_FormControl0_V1_I1_B4';//update table of visitors btn
        statusGuid = 'ctl00_ctl37_g_f55f201a_7245_4186_8e42_546c41549549_FormControl0_V1_I1_E7';//form status section
    }
    else {
        /*change ct137 to ct 140 for seattle master page*/
        guid = 'ctl00_ctl37_g_2ac6a08e_f9c3_4e42_bd50_b9d926571319_FormControl0_V1_I1_E1';
        btnguid = 'ctl00_ctl37_g_2ac6a08e_f9c3_4e42_bd50_b9d926571319_FormControl0_V1_I1_B4';
        statusGuid = 'ctl00_ctl37_g_2ac6a08e_f9c3_4e42_bd50_b9d926571319_FormControl0_V1_I1_E7';
    }
    if (document.getElementById(guid) != null) {
        if (timer != null) { clearTimeout(timer); }
        var tt = document.getElementById(guid).innerHTML;
        //console.log(tt);
        if (document.getElementById(statusGuid).innerHTML != "נשלחה" && document.getElementById(statusGuid).innerHTML != "הסתיים טיפול") {
            document.getElementById('addVisitorBtn').style.display = "block";
            document.getElementById('deleteGuest').style.display = "block";
        }
        document.getElementById('addVisitorBtn').onclick = function () {
            OpenPopUpPage('/visitorsIT/Lists/visitors/מוזמן/newifs.aspx?orderId=' + tt + '&IsDlg=1', function () { RefreshPage; document.getElementById(btnguid).click(); }
            )
        };
        document.getElementById('deleteGuest').onclick = function () {
            OpenPopUpPage('/visitorsIT/Pages/editGuests.aspx?DELID=' + tt + '&IsDlg=1', function () { RefreshPage; document.getElementById(btnguid).click(); })
        };
    }
    return;
}
// call the function again after 500 milliseconds
const timer = setTimeout(checkDOMChange, 500);

/*-------------------delete function----not working----------------------------*/
/*var siteUrl = '/visitorsIT';
function deleteMyListItem() {
    var itemId = document.getElementById('guestNum').value;
    var clientContext = new SP.ClientContext(siteUrl);
    var oList = clientContext.get_web().get_lists().getByTitle('מבקרים');
    this.oListItem = oList.getItemById(itemId);
    oListItem.deleteObject();
    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}
function onQuerySucceeded() {
    location.reload(true);
}
function onQueryFailed(sender, args) {
    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}*/

