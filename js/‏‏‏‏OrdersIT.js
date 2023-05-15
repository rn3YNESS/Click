var PMOClick = window.PMOClick || {};

PMOClickOrdersIT = {

    GlobalVariables: {
        InvitationsIT: [],
        Locations: [],
        locIds: [],
        Visitors: []
    },

    Lists: {
        VisitorsOrder: {
            HE: "הזמנת מבקרים",
            EN: "visitorsOrder"
        },
        Visitors: {
            HE: "מבקרים",
            EN: "visitors"
        },
        Locations:{
            HE: "מתחמים",
            EN: "localizations"
        },
        Settings: {
            EN: "settings"
        }
    },
    
    CONSTANTS: {
        SITECONTEXT: '',
        SITEABSOLUTEURL: '',
        SITESERVERRELATIVEURL: '',
        WEBABSOLUTEURL: '',
        WEBSERVERRELATIVEURL: '',
        FORMMODE: null,
        TIMER: '',
        CURRENTDATE: null
    },
 
    Init: function () {
        var status = "'נשלחה'";
        PMOClickOrdersIT.GlobalVariables.InvitationsIT = PMOClick.Methods.GetListItemsREST(null, PMOClickOrdersIT.Lists.VisitorsOrder.HE, '$select=Host/Id,*', '&$filter=OrderStatus eq '+ status, "&$expand=Host", "&$orderby=ID desc",null);
        PMOClickOrdersIT.GlobalVariables.Locations = PMOClick.Methods.GetListItemsREST(null, PMOClickOrdersIT.Lists.Locations.HE, null, null, null, "&$orderby=ID desc",null);
        //debugger;
        PMOClickOrdersIT.GlobalVariables.Locations.value.forEach(function(item){PMOClickOrdersIT.GlobalVariables.locIds.push(item.Id)});
        PMOClickOrdersIT.Load();
    },

    Load: function () {
        var isFirst = false;
        var bodyOrder = document.getElementById("bodyOrders");
        bodyOrder.innerHTML = '';
        PMOClickOrdersIT.GlobalVariables.InvitationsIT.value.forEach(function(order){
            //debugger;
            if( PMOClickOrdersIT.GlobalVariables.locIds.includes(order.locationId)){
            PMOClickOrdersIT.Methods.DrawOrder(order, isFirst);
            isFirst = true;}
        });
    },

    Methods: {
        DrawOrder: function(order, isFirst){
            var meetingStartTime = PMOClick.Methods.ConvertDateToCustomDateAndTime(order.meetingStartTime);
            var OData__x05d7__x05e1__x05d9__x05e4__x05 = order.OData__x05d7__x05e1__x05d9__x05e4__x05 == null? '': order.OData__x05d7__x05e1__x05d9__x05e4__x05;
            var src = !isFirst ? '/_layouts/15/images/rbsel.gif' : '/_layouts/15/images/rbunsel.gif';
            var isChoose = !isFirst ? 'chooseRecord' : '';
            var titleOpenDlg = "";
            if(order.Title != undefined && order.Title != null)
            {
                titleOpenDlg = order.Title.replace('"/gi', '')
                titleOpenDlg = titleOpenDlg.replace("'/gi", "");
            }
            var tdOrder = '<tr class="ms-alternating ms-itmHoverEnabled">'+
                            '<td onclick="PMOClickOrdersIT.Methods.OrderVisitors(' + order.ID + '); PMOClickOrdersIT.Methods.ChangeImage(this);" role="gridcell" class="ms-cellstyle ms-vb2">'+
                            '<img class="imgChooseRecord" id="' + isChoose + '" border="0" align="absmiddle" style="cursor: hand" src="' + src + '" alt="רגיל"></img>'+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            order.ID+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb-title ms-positionRelative" height="100%">'+
                            '<div class="ms-vb ms-tableCell ms-list-TitleLink ms-vb-menuPadding itx">'+
                            '<a class="ms-listlink ms-draggable" onclick="PMOClick.Methods.OpenInDialog(\'הזמנת מבקרים - ' + titleOpenDlg + '...\', 736,818, false, true, false, \'' + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/visitorsIT/Lists/visitorsOrder/הזמנת מבקרים/displayifs.aspx?ID=' + order.ID + '\', null, null)">'+
                            order.Title+
                            '</a>'+
                            '</div>'+
                            '<div class="ms-list-itemLink ms-tableCell ms-alignRight">'+
                            '<div class="dropdown">'+
                            '<a title="הפעלת זרימת עבודה" class="dropbtn ms-lstItmLinkAnchor ms-ellipsis-a"><img class="ms-ellipsis-icon" src="/_catalogs/theme/Themed/62149AFB/spcommon-B35BB0A9.themedpng?ctag=14" alt="פתח תפריט"></a>'+
                            '<div id="DropdownActions" class="dropdown-content">'+
                            '<a onclick="PMOClickOrdersIT.Methods.OpenTabAction(this.text, ' + order.ID + ')">שליחת תגובה</a>'+
                            '</div>'+
                            '</div>'+
                            '</div>'+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb-user">'+
                            '<div class="ms-tableRow">'+
                            '<div class="ms-tableCell">'+
                            '<div class="ms-peopleux-userImgDiv">'+
                            '<span class="ms-imnSpan">'+
                            '<a href="' + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/visitors/_layouts/15/userdisp.aspx?ID=' + order.HostId + '">'+
                            '<img style="min-width:36px; min-height:36px; clip:rect(0px, 36px, 36px, 0px); max-width:36px; pointer:cursor;" src="' + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/_layouts/15/userphoto.aspx?size=xs&username=' + order.FullName + '"></img>'+
                            '</a>'+
                            '</span>'+
                            '</div>'+
                            '</div>'+
                            "<div class='ms-tableCell ms-peopleux-userdetails ms-noList'>"+
                            '<ul style="max-width:150px">'+
                            '<li>'+
                            "<span><a href='" + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + "/visitors/_layouts/15/userdisp.aspx?ID=" + order.HostId + "'>" + order.FullName + "</a></span>"+
                            '</li>'+
                            '<li>'+
                            "<div class='ms-metadata ms-textSmall ms-peopleux-detailuserline'>" + order.JobTitle + ', ' + order.ol_Department + "</div>"+
                            '</li>'+
                            '</ul>'+
                            '</div>'+
                            '</div>'+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            '<span class="ms-noWrap" title="' + meetingStartTime + '">'+
                            meetingStartTime+
                            '</span>'+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            order.meetingCharacter+
                            '</td>'+
                            '<td role="gridcell" class="ms-vb-lastCell ms-cellstyle ms-vb2 ms-vb-lastCell">'+
                            OData__x05d7__x05e1__x05d9__x05e4__x05+
                            '</td>'+
                          '</tr>';
            document.getElementById("bodyOrders").innerHTML += tdOrder;
            if(!isFirst){
                PMOClickOrdersIT.Methods.OrderVisitors(order.ID);
            }
        },

        ChangeImage: function(img){
            var a = document.getElementById("chooseRecord");
            a.src = '/_layouts/15/images/rbunsel.gif';
            a.id = "";
            img = img.children[0];
            if(img != undefined && img != null){
                img.id = "chooseRecord";
                img.src = '/_layouts/15/images/rbsel.gif';
            }
        },

        OnChildColumn: function(thDiv){
            thDiv.classList.toggle("ms-headerCellStyleMenuOpen");
            thDiv.children[3].children[0].children[0].style.display = "block";
        },

        OnChildColumnOut: function(thDiv){
            thDiv.classList.remove("ms-headerCellStyleMenuOpen");
            thDiv.children[3].children[0].children[0].style.display = "none";
        },
            
        SoryByColumn: function(thDiv){
            var id = thDiv.id;
            var sortDownElements = document.getElementsByClassName("ms-sortarrowdown-iconouter");
            Array.prototype.forEach.call(sortDownElements, function(sortDown) {
                if(sortDown.parentElement != thDiv){
                    sortDown.children[0].classList.remove("ms-sortarrowup-icon");
                    sortDown.children[0].classList.toggle("ms-sortarrowdown-icon");
                    sortDown.style.display = "none";
                }
            });
            if(thDiv.children[1].children[0].classList.contains("ms-sortarrowup-icon")){
                thDiv.children[1].children[0].classList.toggle("ms-sortarrowdown-icon");
                thDiv.children[1].children[0].classList.remove("ms-sortarrowup-icon");
            }
            else{
                thDiv.children[1].children[0].classList.toggle("ms-sortarrowup-icon");
                thDiv.children[1].children[0].classList.remove("ms-sortarrowdown-icon");
            }
            thDiv.children[1].style.display = "inline-block";
            PMOClickOrdersIT.GlobalVariables.InvitationsIT.value.sort(PMOClickOrdersIT.Methods.DynamicSort(id));
            if(thDiv.children[1].children[0].classList.contains("ms-sortarrowdown-icon")){
                PMOClickOrdersIT.GlobalVariables.InvitationsIT.value.reverse();
            }
            var isFirst = false;
            // PMOClickOrdersIT.Methods.ChangeImage();
            document.getElementById("bodyOrders").innerHTML = '';
            PMOClickOrdersIT.GlobalVariables.InvitationsIT.value.forEach(function(v){
                PMOClickOrdersIT.Methods.DrawOrder(v, isFirst);
                isFirst = true;
            });
        },

        OrderVisitors: function(idOrder){
            PMOClickOrdersIT.GlobalVariables.Visitors = PMOClick.Methods.GetListItemsREST(null, PMOClickOrdersIT.Lists.Visitors.HE, null, '$filter=byOrder eq ' + idOrder, null, null, null);
            document.getElementsByClassName("stopEditData")[0].style.display = "none";
            document.getElementsByClassName("editData")[0].style.display = "block";
            PMOClickOrdersIT.Methods.DrawOrderVisitors("read");
        },

        DrawOrderVisitors: function(type){
            document.getElementById("bodyOrderVisitors").innerHTML = '';
            if(PMOClickOrdersIT.GlobalVariables.Visitors.value.length == 0){
                var noResult = '<div style="width: 300px; font-size=18px;">'+
                                'אין פריטים להצגה בתצוגה זו של הרשימה "מבקרים".'+
                               '</div>';
                document.getElementById("bodyOrderVisitors").innerHTML = noResult;
            }
            else{
                if(type == "read"){
                    PMOClickOrdersIT.GlobalVariables.Visitors.value.forEach(function(v){
                        PMOClickOrdersIT.Methods.DrawVisitorRead(v);
                    });
                }
                else{
                    PMOClickOrdersIT.GlobalVariables.Visitors.value.forEach(function(v, i){
                        PMOClickOrdersIT.Methods.DrawVisitorWrite(v, i);
                    });
                }
            }
        },

        DrawVisitorRead : function(visitorOrder){
            var OData__x0049_D1 = visitorOrder.OData__x0049_D1 == null? '': visitorOrder.OData__x0049_D1;
            var Title = visitorOrder.Title == null? '': visitorOrder.Title;
            var FirstName = visitorOrder.FirstName == null? '': visitorOrder.FirstName;
            var Company = visitorOrder.Company == null? '': visitorOrder.Company;
            var JobTitle = visitorOrder.JobTitle == null? '': visitorOrder.JobTitle;
            var secLevel = visitorOrder.secLevel == null? '': visitorOrder.secLevel;
            var visitorStatus = visitorOrder.visitorStatus == null? '': visitorOrder.visitorStatus;
            var secCheckNeed = visitorOrder.secCheckNeed == null? '': visitorOrder.secCheckNeed == false? "לא": "כן";
            var titleOpenDlg = "";
            if(Title != undefined && Title != null)
            {
                titleOpenDlg = Title.replace('"/gi', '')
                titleOpenDlg = titleOpenDlg.replace("'/gi", "");
            }
            var visitor = '<tr class="ms-alternating ms-itmHoverEnabled">'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            OData__x0049_D1+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            FirstName+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb-title ms-positionRelative" height="100%">'+
                            '<div style="width: 38.7695px;" class="ms-vb ms-tableCell ms-list-TitleLink ms-vb-menuPadding itx">'+
                            '<a class="ms-listlink ms-draggable" onclick="PMOClick.Methods.OpenInDialog(\'מבקרים - ' + titleOpenDlg + '\', 736,818, false, true, false, \'' + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/visitorsIT/Lists/visitors/מוזמן/displayifs.aspx?List=מבקרים&ID=' + visitorOrder.ID + '\', null, null)">'+
                            Title+
                            '</a>'+
                            '</div>'+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            Company+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            JobTitle+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            secLevel+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            secCheckNeed+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            visitorStatus+
                            '</td>'+
                        '</tr>';
            document.getElementById("bodyOrderVisitors").innerHTML += visitor;
        },

        DrawVisitorWrite: function(visitorOrder, i){
            var OData__x0049_D1 = visitorOrder.OData__x0049_D1 == null? '': visitorOrder.OData__x0049_D1;
            var Title = visitorOrder.Title == null? '': visitorOrder.Title;
            var FirstName = visitorOrder.FirstName == null? '': visitorOrder.FirstName;
            var Company = visitorOrder.Company == null? '': visitorOrder.Company;
            var JobTitle = visitorOrder.JobTitle == null? '': visitorOrder.JobTitle;
            var secLevel = visitorOrder.secLevel == null? '': visitorOrder.secLevel;
            var visitorStatus = visitorOrder.visitorStatus == null? '': visitorOrder.visitorStatus;
            var secCheckNeed = visitorOrder.secCheckNeed == null? '': visitorOrder.secCheckNeed == false? "לא": "כן";
            var titleOpenDlg = "";
            if(Title != undefined && Title != null)
            {
                titleOpenDlg = Title.replace('"/gi', '')
                titleOpenDlg = titleOpenDlg.replace("'/gi", "");
            }
            var visitor = '<tr class="ms-alternating ms-itmHoverEnabled">'+
            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
            OData__x0049_D1+
            '</td>'+
            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
            FirstName+
            '</td>'+
            '<td role="gridcell" class="ms-cellstyle ms-vb-title ms-positionRelative" height="100%">'+
            '<div style="width: 38.7695px;" class="ms-vb ms-tableCell ms-list-TitleLink ms-vb-menuPadding itx">'+
            '<a class="ms-listlink ms-draggable" onclick="PMOClick.Methods.OpenInDialog(\'מבקרים - ' + titleOpenDlg + '\', 736,818, false, true, false, \'' + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/visitorsIT/Lists/visitors/מוזמן/displayifs.aspx?List=מבקרים&ID=' + visitorOrder.ID + '\', null, null)">'+
            Title+
            '</a>'+
            '</div>'+
            '</td>'+
            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
            Company+
            '</td>'+
            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
            JobTitle+
            '</td>'+
            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
            '<select id="secLevel' + i + '">'+
            '<option>לא ידוע</option>'+
            '<option>ללא</option>'+
            '<option>רמה 6</option>'+
            '<option>רמה 5</option>'+
            '<option>רמה 4</option>'+
            '<option>רמה 3</option>'+
            '<option>רמה 2</option>'+
            '<option>רמה 1</option>'+
            '</select>'+
            '</td>'+
            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
            '<select id="secCheckNeed' + i + '">'+
            '<option>לא</option>'+
            '<option>כן</option>'+
            '</select>'+
            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
            '<select id="visitorStatus' + i + '">'+
            '<option>טרם נבדק</option>'+
            '<option>אושר</option>'+
            '<option>אושר, נדרש למלא טפסי סיווג</option>'+
            '<option>נדחה, ממתין לסיווג</option>'+
            '<option>נדחה</option>'+
            '</select>'+
            '</td>'+
            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
            '<button class="saveButton" onclick="return PMOClickOrdersIT.Methods.UpdateVisitor(' + visitorOrder.ID + ', this)">אישור'+
            '</button>'+
            '</td>'+
            '</tr>';
            document.getElementById("bodyOrderVisitors").innerHTML += visitor;
            document.getElementById("secCheckNeed" + i).selectedIndex = secCheckNeed == "לא" ? 0 : 1;
            var visitorStatusOptions = document.getElementById("visitorStatus" + i).options;
            for (var index = 0; index < visitorStatusOptions.length; index++) {
                if(visitorStatusOptions[index].text == visitorStatus){
                    document.getElementById("visitorStatus" + i).selectedIndex = index;
                    break;
                }
            }
            var options = document.getElementById("secLevel" + i).options;
            for (var index = 0; index < options.length; index++) {
                if(options[index].text == secLevel){
                    document.getElementById("secLevel" + i).selectedIndex = index;
                    break;
                }
            }
        },

        DynamicSort: function(property) {
            var sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        },

        SoryByColumnVisitors: function(thDiv){
            var id = thDiv.id;
            var sortDownElements = document.getElementsByClassName("ms-sortarrowdown-iconouter");
            Array.prototype.forEach.call(sortDownElements, function(sortDown) {
                if(sortDown.parentElement != thDiv){
                    sortDown.children[0].classList.remove("ms-sortarrowup-icon");
                    sortDown.children[0].classList.toggle("ms-sortarrowdown-icon");
                    sortDown.style.display = "none";
                }
            });
            if(thDiv.children[1].children[0].classList.contains("ms-sortarrowup-icon")){
                thDiv.children[1].children[0].classList.toggle("ms-sortarrowdown-icon");
                thDiv.children[1].children[0].classList.remove("ms-sortarrowup-icon");
            }
            else{
                thDiv.children[1].children[0].classList.toggle("ms-sortarrowup-icon");
                thDiv.children[1].children[0].classList.remove("ms-sortarrowdown-icon");
            }
            thDiv.children[1].style.display = "inline-block";
            PMOClickOrdersIT.GlobalVariables.Visitors.value.sort(PMOClickOrdersIT.Methods.DynamicSort(id));
            if(thDiv.children[1].children[0].classList.contains("ms-sortarrowdown-icon"))
            PMOClickOrdersIT.GlobalVariables.Visitors.value.reverse();
            PMOClickOrdersIT.Methods.DrawOrderVisitors("read");
        },

        EditData: function(){
            PMOClickOrdersIT.Methods.DrawOrderVisitors("edit");
            document.getElementsByClassName("stopEditData")[0].style.display = "block";
            document.getElementsByClassName("editData")[0].style.display = "none";
        },

        UpdateVisitor: function(visitorId, thisButton){
            var thisTr = thisButton.parentElement.parentElement;
            var itemProperties = {secLevel: thisTr.children[5].children[0].value, secCheckNeed: thisTr.children[6].children[0].value == 'לא' ? false : true, visitorStatus: thisTr.children[7].children[0].value};
            PMOClick.Methods.UpdateListItemREST(PMOClickOrdersIT.Lists.Visitors.HE, PMOClickOrdersIT.Lists.Visitors.EN, visitorId, itemProperties);
            PMOClickOrdersIT.GlobalVariables.Visitors = PMOClick.Methods.GetListItemsREST(null, PMOClickOrdersIT.Lists.Visitors.HE, null, '$filter=byOrder eq ' + parseInt(document.getElementById("chooseRecord").parentElement.parentElement.children[1].innerText), null, null, null);
            PMOClickOrdersIT.Methods.DrawOrderVisitors("edit");
            return false;
        },

        OpenTabAction: function(action, idOrder){
            var templateId = PMOClick.Methods.GetListItemsREST(null, PMOClickOrdersIT.Lists.Settings.EN, "$select=data", "&$filter=description eq 'שליחת תגובה'", null, null, null).value[0].data;
            var url = PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/visitorsIT/_layouts/15/NintexWorkflow/StartWorkflow.aspx?List={EB6784EC-E548-4E89-B77B-87CD6D40257C}&ID=' + idOrder + '&TemplateID=' + templateId;
            window.open(url, "_blank");
        },

        StopEditData: function(){
            PMOClickOrdersIT.Methods.DrawOrderVisitors("read");
            document.getElementsByClassName("stopEditData")[0].style.display = "none";
            document.getElementsByClassName("editData")[0].style.display = "block";
        }
    }
};