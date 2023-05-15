var siteUrl = '/sites/Npdu';
var listTitle = 'אבני דרך';
var rowlimit = '5';

var colorlist = 'זירות';

function retrieveListItems() {

    var clientContext = new SP.ClientContext(siteUrl);
    var oList = clientContext.get_web().get_lists().getByTitle(listTitle);


    var camlQuery = new SP.CamlQuery();

    var today = new Date()
    camlQuery.set_viewXml('<View><Query><Where>' +
        //'<And>'+
        //'<Geq><FieldRef Name=\'ID\'/><Value Type=\'Number\'>0</Value></Geq>'+
        '<And>' +
        '<Geq><FieldRef Name=\'Expires\'/><Value IncludeTimeValue="FALSE" Type=\'DateTime\'><Today /></Value></Geq>' +
        '<Leq><FieldRef Name=\'StartDate\'/><Value IncludeTimeValue="FALSE" Type=\'DateTime\'><Today /></Value></Leq>' +
        '</And>' +
        //'</And>'+
        '</Where>' +
        '<OrderBy><FieldRef Name=\'Expires\'/></OrderBy>' +
        '</Query>' +
        '<RowLimit>' + rowlimit + '</RowLimit></View>');
    //camlQuery.set_viewXml('<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' +
    //    '<Value Type=\'Number\'>1</Value></Geq></Where></Query><RowLimit>' + rowlimit + '</RowLimit></View>');
    this.collListItem = oList.getItems(camlQuery);

    clientContext.load(collListItem);

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));

}

function onQuerySucceeded(sender, args) {
    var divMilestones = document.getElementById("divMilestones");
    var nodeMilestones = document.createElement("div");
    divMilestones.innerHTML = "";
    var listItemEnumerator = collListItem.getEnumerator();
    //var listItemCount = collListItem.get_count();

    if (collListItem.get_count() > 0) {

        var nodeText = '';
        //nodeText += '<div style="padding:5px;font-family:assistant;font-weight:bold;text-align:right;color:black;font-size:1em;">​​​​​​​​​​​​​​​​​​​​​אבני דרך</div><div>';
        //if(listItemEnumerator.moveNext()){nodeText += '<div style="padding:5px;font-family:assistant;font-weight:bold;text-align:right;font-size:1.5em;"><a style="color:#0072c6;" href="/sites/npdu/lists/milestones">​​​​​​​​​​​​​​​​​​​​​אבני דרך</a></div>';}
        nodeText += '<div style="padding:5px;font-family:assistant;font-weight:bold;text-align:right;font-size:1.5em;"><a style="color:#0072c6;" href="/sites/npdu/lists/milestones">​​​​​​​​​​​​​​​​​​​​​אבני דרך</a></div>';
        nodeText += '<div>';
        while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();

            nodeText += '<table dir=rtl style="border: solid 5px rgb(53,94,126);margin-bottom: 5px;color:white;background-color:rgb(53,94,126)">';


            var expiryDate = new Date(oListItem.get_item('Expires'));
            //const options = { year: 'numeric', month: 'numeric', day: 'numeric' };

            var startDate = new Date(oListItem.get_item('StartDate'));
            const options = { year: 'numeric', month: 'numeric', day: 'numeric' };

            nodeText += '<tr>';

            var itemcolor = "FFFFFF";
            var usr = "";
            var itembody = oListItem.get_item('Body') + "";
//var testvar = oListItem.get_item('AssignedTo').$5c_1;
            if (oListItem.get_item('AssignedTo') != null){usr = "(הוקצה ל: " + oListItem.get_item('AssignedTo').$5c_1 + ")"}

            if (oListItem.get_item('_x05d6__x05d9__x05e8__x05d4__x00') != null) { itemcolor = oListItem.get_item('_x05d6__x05d9__x05e8__x05d4__x00').get_lookupValue() };

            if (itemcolor == null) { itemcolor = "FFFFFF" }
            nodeText += '<td style="padding:0px 10px 0px 10px;white-space:nowrap;vertical-align:top;width:75px;text-align:center;">' + expiryDate.toLocaleDateString('iw-IL', options) + '</td>' +
                '<td style="padding:0px 10px 0px 10px;white-space:nowrap;vertical-align:top;width:150px;text-align:center;border-left: solid 5px #' + itemcolor + ';border-right: solid 5px #' + itemcolor + ';"><a style="color:#FFFFFF" href="/SitePages/itemPopUp.aspx?form=/sites/Npdu/Lists/Milestones/DispForm.aspx&itemid=' + oListItem.get_item('ID') + '&callback=' + window.location + '">' + oListItem.get_item('Title') + '</a></td>' +
                '<td style="padding:0px 10px 0px 10px;vertical-align:top;">';

            if ('null' != itembody) { nodeText += itembody.replace(/(<([^>]+)>)/gi, "") }
            if ((usr != "") && ('null' != itembody)){nodeText += '<br/>'}
            nodeText += usr;
            //nodeText += itembody.replace(/(<([^>]+)>)/gi, "");

            nodeText += '</td>';
            nodeText += '</tr>';

            nodeText += '</table>';


        }

        nodeText += '</div>';
        nodeMilestones.innerHTML = nodeText;
        divMilestones.appendChild(nodeMilestones);
    }

    //alert(listItemInfo.toString());
}

function onQueryFailed(sender, args) {

    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}


window.addEventListener("load", function () {

    retrieveListItems();


})