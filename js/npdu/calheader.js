var siteUrl = '/sites/Npdu';
var branches = 'זירות';

function retrieveListItemsB() {

    var clientContextBranches = new SP.ClientContext(siteUrl);
    var oListBranches = clientContextBranches.get_web().get_lists().getByTitle(branches);
    var camlQueryBranches = new SP.CamlQuery();

    camlQueryBranches.set_viewXml('<View><Query><Where>' +
        '<Geq><FieldRef Name=\'ID\'/><Value Type=\'Number\'>0</Value></Geq>' +
        '</Where></Query></View>');

    this.collBranchesItem = oListBranches.getItems(camlQueryBranches);

    clientContextBranches.load(collBranchesItem);

    clientContextBranches.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceededB), Function.createDelegate(this, this.onQueryFailedB));

}
function onQuerySucceededB(sender, args) {

    var headerB = document.getElementById("calheader");
    var nodeheaderB = document.createElement("div");
    var nodeText = '';

    nodeText += '<div style="text-align:center;font-family:assistant;font-weight:bold;color:#0072c6;font-size:2em;">לוח אירועים ומשימות​<br><a href="/sites/Npdu/SitePages/gant.aspx" style="color:#0072c6;font-size:14pt;">מעבר לתצוגת גאנטים​​</a></div>';

    nodeText += '<div style="margin: 0px;">';

    var listItemEnumeratorB = collBranchesItem.getEnumerator();

    while (listItemEnumeratorB.moveNext()) {
        var oListItemB = listItemEnumeratorB.get_current();

        //if (loc.includes("div" + oListItem.get_item('divNo'))) {
        //    divNo = oListItem.get_item('divNo');
        //    divName = '<strong>' + oListItem.get_item('Title') + '</strong>';
        //    eventbg = oListItem.get_item('EventColor');
        //    taskbg = oListItem.get_item('TaskColor');
        //};

        nodeText += '<table style="display:inline-block;width:100%">';

        nodeText += '<tr><td colspan=2 style="font-weight:bold;text-align:center;background-color:#e2f4fd;border-left:1.5px solid black;border-right:1.5px solid black">' + oListItemB.get_item('Title') + '</td></tr>';

        nodeText += '<tr>';

        nodeText += '<td style="border-right:1.5px solid white;background-color:#' + oListItemB.get_item('EventColor') + '">' +
            '<input onclick ="visitems(' + oListItemB.get_item('Title') + ',1)" checked="checked" type="checkbox" id="div' + oListItemB.get_item('divNo') + 'events" ' +
            'name="div' + oListItemB.get_item('divNo') + 'events" value="div' + oListItemB.get_item('divNo') + 'events"> ' +
            '<a style="color:white" href="/sites/Npdu/Docs_Div' + oListItemB.get_item('divNo') + '/Forms/eventview.aspx">📅 ​אירועים</a>' +
            '</td>';

        nodeText += '<td style="border-left:1.5px solid white;background-color:#' + oListItemB.get_item('TaskColor') + '">' +
            '<input onclick ="visitems(' + oListItemB.get_item('Title') + ',2)" checked="checked" type="checkbox" id="div' + oListItemB.get_item('divNo') + 'tasks" ' +
            'name="div' + oListItemB.get_item('divNo') + 'tasks" value="div' + oListItemB.get_item('divNo') + 'tasks"> ' +
            '<a style="color:white" href="/sites/Npdu/Docs_Div' + oListItemB.get_item('divNo') + '/Forms/taskview.aspx">⏳ ​משימות</a>' +
            '</td>';

        nodeText += '</tr>';

        //<input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
        //<label for="vehicle1"> I have a bike</label>

        nodeText += '</table>';
        

    };

    nodeText += '</div>';

    nodeheaderB.innerHTML = nodeText;
//TORESTOIRE
    //headerB.appendChild(nodeheaderB);

}


//function visitems(argtype, argfield, eventcolor, taskcolor) {
function visitems(argfield, argtype) {

    var calitems = document.getElementsByClassName("ms-acal-item");

    var listItemEnumeratorC = calitems.getEnumerator();

    while (listItemEnumeratorC.moveNext()) {
        var oListItemB = listItemEnumeratorB.get_current();

        
        var itemtitle = oListItemB.attr('title');
        var splittitle = itemtitle.split(' ');
        var itemtype = splittitle[0];
        var itemfield = splittitle[1] + ' ' + splittitle[2];

        if ((itemfield == argfield) && (itemtype == argtype)) {
            oListItemB.style['display'] = "none";

        }

    //    var itemtitle = oListItemB.attr('title');
    //    var splittitle = itemtitle.split(' ');
    //    var itemtype = splittitle[0];
    //    var itemfield = splittitle[1] + ' ' + splittitle[2];
//
//
//
    //    if (itemfield == argfield) {
    //        if (itemtype == 'אירועים') {
    //            oListItemB.style['background-color'] = "#" + eventcolor;
    //        }
    //        if (itemtype == 'משימות') {
    //            oListItemB.style['background-color'] = "#" + taskcolor;
    //        }
    //    }
//
    }
}


function onQueryFailedB(sender, args) {

    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}



window.addEventListener("load", function () {

    retrieveListItemsB();




})