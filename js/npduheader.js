var siteUrl = '/sites/Npdu';
var listname = 'זירות';

function retrieveListItems() {

    var clientContext = new SP.ClientContext(siteUrl);
    var oList = clientContext.get_web().get_lists().getByTitle(listname);
    var camlQuery = new SP.CamlQuery();

    camlQuery.set_viewXml('<View><Query><Where>' +
        '<Geq><FieldRef Name=\'ID\'/><Value Type=\'Number\'>0</Value></Geq>' +
        '</Where></Query></View>');

    this.collListItem = oList.getItems(camlQuery);

    clientContext.load(collListItem);

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));

}
function onQuerySucceeded(sender, args) {

    var header = document.getElementById("divheader");
    var nodeheader = document.createElement("div");
    var nodeText = '';

    var loc = window.location.pathname.toLowerCase();
    var divNo = 0;
    var divName = '';
    var eventbg = '';
    var taskbg = '';


    var listItemEnumerator = collListItem.getEnumerator();
    while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();

        if (loc.includes("div" + oListItem.get_item('divNo'))) {
            divNo = oListItem.get_item('divNo');
            divName = oListItem.get_item('Title');
            eventbg = oListItem.get_item('EventColor');
            taskbg = oListItem.get_item('TaskColor');
        };

    };



    var icon1 = '';
    var icon2 = '';
    var icon3 = '';

    var text1 = '';
    var text2 = '';
    var text3 = '';

    var link2 = '';
    var link3 = '';

    var title1bg = 'FFFFFF';
    var title2bg = 'FFFFFF';
    var title3bg = 'FFFFFF';
    var title1color = 'black';
    var title2color = 'black';
    var title3color = 'black';

    if (loc.includes("/calendar")) {


        icon1 = '📅⏳';
        icon2 = '📅';
        icon3 = '⏳';
        text1 = 'לוח ​משימות ואירועים';
        text2 = 'לוח ​אירועים';
        text3 = 'לוח ​משימות';
        link2 = '/Docs_Div' + divNo.toString() + '/Forms/eventview.aspx';
        link3 = '/Docs_Div' + divNo.toString() + '/Forms/taskview.aspx';
        title1bg = 'FFFFFF';
        title2bg = eventbg;
        title3bg = taskbg;
        title1color = 'black';
        title2color = 'white';
        title3color = 'white';

    } else if (loc.includes("/eventview")) {


        icon1 = '📅';
        icon2 = '⏳';
        icon3 = '📅⏳';
        text1 = 'לוח ​אירועים';
        text2 = 'לוח ​משימות';
        text3 = 'לוח ​משימות ואירועים';
        link2 = '/Docs_Div' + divNo.toString() + '/Forms/taskview.aspx';
        link3 = '/Lists/Calendar/div' + divNo.toString() + '_view.aspx';
        title1bg = eventbg;
        title2bg = taskbg;
        title3bg = 'FFFFFF';
        title1color = 'white';
        title2color = 'white';
        title3color = 'black';

        var calitems = document.getElementsByClassName("ms-acal-item");
        for (var i = 0, len = calitems.length; i < len; i++) {
            calitems[i].style["background-color"] = "#" + title1bg;
        }

    } else if (loc.includes("/taskview")) {


        icon1 = '⏳';
        icon2 = '📅';
        icon3 = '📅⏳';
        text1 = 'לוח ​משימות';
        text2 = 'לוח ​אירועים';
        text3 = 'לוח ​משימות ואירועים';
        link2 = '/Docs_Div' + divNo.toString() + '/Forms/eventview.aspx';
        link3 = '/Lists/Calendar/div' + divNo.toString() + '_view.aspx';
        title1bg = taskbg;
        title2bg = eventbg;
        title3bg = 'FFFFFF';
        title1color = 'white';
        title2color = 'white';
        title3color = 'black';

        var calitems = document.getElementsByClassName("ms-acal-item");
        for (var i = 0, len = calitems.length; i < len; i++) {
            calitems[i].style["background-color"] = "#" + title1bg;
        }

    } else if (loc.includes("/opentaskview")) {


        icon1 = '⏳';
        icon2 = '📅';
        icon3 = '📅⏳';
        text1 = 'לוח ​משימות פתוחות';
        text2 = 'לוח ​אירועים';
        text3 = 'לוח ​משימות ואירועים';
        link2 = '/Docs_Div' + divNo.toString() + '/Forms/eventview.aspx';
        link3 = '/Lists/Calendar/div' + divNo.toString() + '_view.aspx';
        title1bg = taskbg;
        title2bg = eventbg;
        title3bg = 'FFFFFF';
        title1color = 'white';
        title2color = 'white';
        title3color = 'black';

        var calitems = document.getElementsByClassName("ms-acal-item");
        for (var i = 0, len = calitems.length; i < len; i++) {
            calitems[i].style["background-color"] = "#" + title1bg;
        }

    }

    var title1 = '<div class="titlecommon title1" style="color: ' + title1color + ';background-color:#' + title1bg + '"><span id="iconspan">' + icon1 + '</span>' +
        divName + ' - ' + text1 + '</div>';
    var title2 = '<div class="titlecommon title2" style="color: ' + title2color + ';background-color:#' + title2bg + '"><span id="iconspan">' + icon2 + '</span>' +
        'מעבר ל<a href="/sites/Npdu/' + link2 + '" style="color: ' + title2color + ';">' + text2 + '</a></div>';
    var title3 = '<div class="titlecommon title3" style="color: ' + title3color + ';background-color:#' + title3bg + '"><span id="iconspan">' + icon3 + '</span>' +
        'מעבר ל<a href="/sites/Npdu/' + link3 + '" style="color: ' + title3color + ';">' + text3 + '</a></div>';

    nodeText += title1 + title2 + title3;

    nodeheader.innerHTML = nodeText;

    header.appendChild(nodeheader);


}

function onQueryFailed(sender, args) {

    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}

window.addEventListener("load", function () {

    retrieveListItems();




})