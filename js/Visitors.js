var PMOClick = window.PMOClick || {};

PMOClick.Visitors = {

    GlobalVariables: {
        InvitationsMisradRashi: [],
        InvitationsKirya: [],
        InvitationsMaon: [],
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
        var misradRashi = "'משרד ראשי'";
        var kirya = "'קריה'";
        var maon = "'" + 'מעון רה"מ' + "'";
        var status = "'נשלחה'";
        PMOClick.Visitors.GlobalVariables.InvitationsMisradRashi = PMOClick.Methods.GetListItemsREST(null, PMOClick.Visitors.Lists.VisitorsOrder.HE, '$select=Host/Id,floor/Id,floor/Title,*', '&$filter=OrderStatus eq '+ status + 'and OData__x05de__x05ea__x05d7__x05dd_ eq ' + misradRashi,"&$expand=Host,floor", "&$orderby=ID desc",null);
        PMOClick.Visitors.GlobalVariables.InvitationsKirya = PMOClick.Methods.GetListItemsREST(null, PMOClick.Visitors.Lists.VisitorsOrder.HE, '$select=Host/Id,floor/Id,floor/Title,*', '&$filter=OrderStatus eq '+ status + 'and OData__x05de__x05ea__x05d7__x05dd_ eq ' + kirya,"&$expand=Host,floor", "&$orderby=ID desc",null);
        PMOClick.Visitors.GlobalVariables.InvitationsMaon = PMOClick.Methods.GetListItemsREST(null, PMOClick.Visitors.Lists.VisitorsOrder.HE, '$select=Host/Id,floor/Id,floor/Title,*', '&$filter=OrderStatus eq '+ status + 'and OData__x05de__x05ea__x05d7__x05dd_ eq ' + maon,"&$expand=Host,floor", "&$orderby=ID desc",null);
        PMOClick.Visitors.Load();
    },

    Load: function () {
        var isFirst = false;
        var bodyOrder = document.getElementsByClassName("bodyOrder");
        Array.prototype.forEach.call(bodyOrder, function(order) {
            order.innerHTML = '';
        });
        if(document.getElementById("bodyOrderMisradRashi") != null){
            PMOClick.Visitors.GlobalVariables.InvitationsMisradRashi.value.forEach(function(order){
                PMOClick.Visitors.Methods.DrawOrder(order, 'bodyOrderMisradRashi', isFirst);
                isFirst = true;
            });
        }
        if(document.getElementById("bodyOrderKirya") != null){
            PMOClick.Visitors.GlobalVariables.InvitationsKirya.value.forEach(function(order){
                PMOClick.Visitors.Methods.DrawOrder(order, 'bodyOrderKirya', isFirst);
                isFirst = true;
            });
        }
        if(document.getElementById("bodyOrderMaon") != null){
            PMOClick.Visitors.GlobalVariables.InvitationsMaon.value.forEach(function(order){
                PMOClick.Visitors.Methods.DrawOrder(order, 'bodyOrderMaon', isFirst);
                isFirst = true;
            });
        }
    },

    Methods: {
        DrawOrder: function(v, orderPlace, isFirst){
            var meetingStartTime = PMOClick.Methods.ConvertDateToCustomDateAndTime(v.meetingStartTime);
            var src = !isFirst ? '/_layouts/15/images/rbsel.gif' : '/_layouts/15/images/rbunsel.gif';
            var isChoose = !isFirst ? 'chooseRecord' : '';
            var floors = "";
            v.floor.forEach(function(floor){
                var dlgtitle = "";
                if(floor.Title != undefined && floor.Title != null)
                {
                    dlgtitle = floor.Title.replace('"/g', '')
                    dlgtitle = dlgtitle.replace("'/g", "");
                }
                floors += '<a class="ms-listlink ms-draggable" onclick="PMOClick.Methods.OpenInDialog(\'מיקומי פגישות - ' + dlgtitle + '\', 596,310, false, true, false, \'' + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/visitors/Lists/meetingPlaces/DispForm.aspx?ID=' + floor.Id + '\', null, null)">'+
                        floor.Title+
                        '</a>' + ', ';
            });
            floors = floors.substr(0, floors.length-2);
            var titleOpenDlg = "";
            if(v.Title != undefined && v.Title != null)
            {
                titleOpenDlg = v.Title.replace('"/g', '')
                titleOpenDlg = titleOpenDlg.replace("'/g", "");
            }
            var tdOrder = '<tr class="ms-alternating ms-itmHoverEnabled">'+
                            '<td onclick="PMOClick.Visitors.Methods.OrderVisitors(' + v.ID + '); PMOClick.Visitors.Methods.ChangeImage(this);" role="gridcell" class="ms-cellstyle ms-vb2">'+
                            '<img class="imgChooseRecord" id="' + isChoose + '" border="0" align="absmiddle" style="cursor: hand" src="' + src + '" alt="רגיל"></img>'+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            v.ID+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb-title ms-positionRelative" height="100%">'+
                            '<div class="ms-vb ms-tableCell ms-list-TitleLink ms-vb-menuPadding itx">'+
                            '<a class="ms-listlink ms-draggable" onclick="PMOClick.Methods.OpenInDialog(\'הזמנת מבקרים - ' + titleOpenDlg + '...\', 736,818, false, true, false, \'' + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/visitors/Lists/visitorsOrder/הזמנת מבקרים/displayifs.aspx?ID=' + v.ID + '\', null, null)">'+
                            v.Title+
                            '</a>'+
                            '</div>'+
                            '<div class="ms-list-itemLink ms-tableCell ms-alignRight">'+
                            '<div class="dropdown">'+
                            '<a title="הפעלת זרימת עבודה" class="dropbtn ms-lstItmLinkAnchor ms-ellipsis-a"><img class="ms-ellipsis-icon" src="/_catalogs/theme/Themed/62149AFB/spcommon-B35BB0A9.themedpng?ctag=14" alt="פתח תפריט"></a>'+
                            '<div id="DropdownActions" class="dropdown-content">'+
                            '<a onclick="PMOClick.Visitors.Methods.OpenTabAction(this.text, ' + v.ID + ')">ניסוח ושליחת תגובה</a>'+
                            '<a onclick="PMOClick.Visitors.Methods.OpenTabAction(this.text, ' + v.ID + ')">הזמנה תקינה</a>'+
                            '<a onclick="PMOClick.Visitors.Methods.OpenTabAction(this.text, ' + v.ID + ')">הזמנה לא תקינה</a>'+
                            '<a onclick="PMOClick.Visitors.Methods.OpenTabAction(this.text, ' + v.ID + ')">הוזמן לאותה השעה</a>'+
                            '<a onclick="PMOClick.Visitors.Methods.OpenTabAction(this.text, ' + v.ID + ')">הזמנה כפולה</a>'+
                            '<a onclick="PMOClick.Visitors.Methods.OpenTabAction(this.text, ' + v.ID + ')">פחות מ-24 שעות</a>'+
                            '</div>'+
                            '</div>'+
                            '</div>'+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb-user">'+
                            '<div class="ms-tableRow">'+
                            '<div class="ms-tableCell">'+
                            '<div class="ms-peopleux-userImgDiv">'+
                            '<span class="ms-imnSpan">'+
                            '<a href="' + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/visitors/_layouts/15/userdisp.aspx?ID=' + v.HostId + '">'+
                            '<img style="min-width:36px; min-height:36px; clip:rect(0px, 36px, 36px, 0px); max-width:36px; pointer:cursor;" src="' + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/_layouts/15/userphoto.aspx?size=xs&username=' + v.FullName + '"></img>'+
                            '</a>'+
                            '</span>'+
                            '</div>'+
                            '</div>'+
                            "<div class='ms-tableCell ms-peopleux-userdetails ms-noList'>"+
                            '<ul style="max-width:150px">'+
                            '<li>'+
                            "<span><a href='" + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + "/visitors/_layouts/15/userdisp.aspx?ID=" + v.HostId + "'>" + v.FullName + "</a></span>"+
                            '</li>'+
                            '<li>'+
                            "<div class='ms-metadata ms-textSmall ms-peopleux-detailuserline'>" + v.JobTitle + ', ' + v.ol_Department + "</div>"+
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
                            v.meetingCharacter+
                            '</td>'+
                            '<td role="gridcell" class="ms-vb-lastCell ms-cellstyle ms-vb2 ms-vb-lastCell">'+
                            v.OData__x05d7__x05e1__x05d9__x05e4__x05+
                            '</td>'+
                            '<td role="gridcell" class="ms-vb-lastCell ms-cellstyle ms-vb2 ms-vb-lastCell">'+
                            floors
                            '</td>'+
                        '</tr>';
            document.getElementById(orderPlace).innerHTML += tdOrder;
            if(!isFirst){
                PMOClick.Visitors.Methods.OrderVisitors(v.ID);
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
            
        SoryByColumn: function(thDiv, nameTable){
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
             if(nameTable == 'MisradRashi')
                PMOClick.Visitors.GlobalVariables.InvitationsMisradRashi.value.sort(PMOClick.Visitors.Methods.DynamicSort(id));
            if(nameTable == 'Kirya')
                PMOClick.Visitors.GlobalVariables.InvitationsKirya.value.sort(PMOClick.Visitors.Methods.DynamicSort(id));
            if(nameTable == 'Maon')
                PMOClick.Visitors.GlobalVariables.InvitationsMaon.value.sort(PMOClick.Visitors.Methods.DynamicSort(id));
            if(thDiv.children[1].children[0].classList.contains("ms-sortarrowdown-icon")){
                if(nameTable == 'MisradRashi')
                    PMOClick.Visitors.GlobalVariables.InvitationsMisradRashi.value.reverse();
                if(nameTable == 'Kirya')
                    PMOClick.Visitors.GlobalVariables.InvitationsKirya.value.reverse();
                if(nameTable == 'Maon')
                    PMOClick.Visitors.GlobalVariables.InvitationsMaon.value.reverse();
            }
            var isFirst = false;
            // PMOClick.Visitors.Methods.ChangeImage();
            if(nameTable == 'MisradRashi'){
                document.getElementById("bodyOrderMisradRashi").innerHTML = '';
                PMOClick.Visitors.GlobalVariables.InvitationsMisradRashi.value.forEach(function(v){
                    PMOClick.Visitors.Methods.DrawOrder(v, 'bodyOrderMisradRashi', isFirst);
                    isFirst = true;
                });
            }
            if(nameTable == 'Kirya'){
                document.getElementById("bodyOrderKirya").innerHTML = '';
                PMOClick.Visitors.GlobalVariables.InvitationsKirya.value.forEach(function(v){
                    PMOClick.Visitors.Methods.DrawOrder(v, 'bodyOrderKirya', isFirst);
                    isFirst = true;
                });
            }
            if(nameTable == 'Maon'){
               document.getElementById("bodyOrderMaon").innerHTML = '';
                PMOClick.Visitors.GlobalVariables.InvitationsMaon.value.forEach(function(v){
                    PMOClick.Visitors.Methods.DrawOrder(v, 'bodyOrderMaon', isFirst);
                    isFirst = true;
                });
            }
        },

        OrderVisitors: function(idOrder){
            PMOClick.Visitors.GlobalVariables.Visitors = PMOClick.Methods.GetListItemsREST(null, PMOClick.Visitors.Lists.Visitors.HE, null, '$filter=byOrder eq ' + idOrder, null, null, null);
            document.getElementsByClassName("stopEditData")[0].style.display = "none";
            document.getElementsByClassName("editData")[0].style.display = "block";
            PMOClick.Visitors.Methods.DrawOrderVisitors("read");
        },

        DrawOrderVisitors: function(type){
            document.getElementById("bodyOrderVisitors").innerHTML = '';
            if(PMOClick.Visitors.GlobalVariables.Visitors.value.length == 0){
                var noResult = '<div style="width: 300px; font-size=18px;">'+
                                'אין פריטים להצגה בתצוגה זו של הרשימה "מבקרים".'+
                               '</div>';
                document.getElementById("bodyOrderVisitors").innerHTML = noResult;
            }
            else{
                if(type == "read"){
                    PMOClick.Visitors.GlobalVariables.Visitors.value.forEach(function(v){
                        PMOClick.Visitors.Methods.DrawVisitorRead(v);
                    });
                }
                else{
                    PMOClick.Visitors.GlobalVariables.Visitors.value.forEach(function(v, i){
                        PMOClick.Visitors.Methods.DrawVisitorWrite(v, i);
                    });
                }
            }
        },

        DrawVisitorRead : function(visitorOrder){
            var IDType = visitorOrder.IDType == null? '': visitorOrder.IDType;
            var OData__x0049_D1 = visitorOrder.OData__x0049_D1 == null? '': visitorOrder.OData__x0049_D1;
            var OData__x05de__x05d3__x05d9__x05e0__x05 = visitorOrder.OData__x05de__x05d3__x05d9__x05e0__x05 == null? '': visitorOrder.OData__x05de__x05d3__x05d9__x05e0__x05;
            var Title = visitorOrder.Title == null? '': visitorOrder.Title;
            var FirstName = visitorOrder.FirstName == null? '': visitorOrder.FirstName;
            var Company = visitorOrder.Company == null? '': visitorOrder.Company;
            var JobTitle = visitorOrder.JobTitle == null? '': visitorOrder.JobTitle;
            var PrevWork = visitorOrder.PrevWork == null? '': visitorOrder.PrevWork;
            var CellPhone = visitorOrder.CellPhone == null? '': visitorOrder.CellPhone;
            var CarNum = visitorOrder.CarNum == null? '': visitorOrder.CarNum;
            var meetingInit = visitorOrder.meetingInit == null? '': visitorOrder.meetingInit;
            var knownGuest = visitorOrder.knownGuest == null? '': visitorOrder.knownGuest == false? "לא": "כן";
            var meetingCharacter = visitorOrder.meetingCharacter == null? '': visitorOrder.meetingCharacter;
            var SpetialNeeds = visitorOrder.SpetialNeeds == null? '': visitorOrder.SpetialNeeds == false? "לא": "כן";
            var secLevel = visitorOrder.secLevel == null? '': visitorOrder.secLevel;
            var Comments = visitorOrder.Comments == null? '': visitorOrder.Comments;
            var visitorStatus = visitorOrder.visitorStatus == null? '': visitorOrder.visitorStatus;
            var qiriaNum = visitorOrder.qiriaNum == null? '': visitorOrder.qiriaNum;
            var titleOpenDlg = "";
            if(Title != undefined && Title != null)
            {
                titleOpenDlg = Title.replace('"/g', '')
                titleOpenDlg = titleOpenDlg.replace("'/g", "");
            }
            var visitor = '<tr class="ms-alternating ms-itmHoverEnabled">'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            IDType+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            OData__x0049_D1+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            OData__x05de__x05d3__x05d9__x05e0__x05+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb-title ms-positionRelative" height="100%">'+
                            '<div style="width: 38.7695px;" class="ms-vb ms-tableCell ms-list-TitleLink ms-vb-menuPadding itx">'+
                            '<a class="ms-listlink ms-draggable" onclick="PMOClick.Methods.OpenInDialog(\'מבקרים - ' + titleOpenDlg + '\', 736,818, false, true, false, \'' + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/visitors/Lists/visitors/מוזמן/displayifs.aspx?List=מבקרים&ID=' + visitorOrder.ID + '\', null, null)">'+
                            Title+
                            '</a>'+
                            '</div>'+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            FirstName+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            Company+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            JobTitle+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            PrevWork+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            CellPhone+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            CarNum+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            meetingInit+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            knownGuest+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            meetingCharacter+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            SpetialNeeds+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            secLevel+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            Comments+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            visitorStatus+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            qiriaNum+
                            '</td>'+
                        '</tr>';
            document.getElementById("bodyOrderVisitors").innerHTML += visitor;
        },

        DrawVisitorWrite: function(visitorOrder, i){
            var IDType = visitorOrder.IDType == null? '': visitorOrder.IDType;
            var OData__x0049_D1 = visitorOrder.OData__x0049_D1 == null? '': visitorOrder.OData__x0049_D1;
            var OData__x05de__x05d3__x05d9__x05e0__x05 = visitorOrder.OData__x05de__x05d3__x05d9__x05e0__x05 == null? '': visitorOrder.OData__x05de__x05d3__x05d9__x05e0__x05;
            var Title = visitorOrder.Title == null? '': visitorOrder.Title;
            var FirstName = visitorOrder.FirstName == null? '': visitorOrder.FirstName;
            var Company = visitorOrder.Company == null? '': visitorOrder.Company;
            var JobTitle = visitorOrder.JobTitle == null? '': visitorOrder.JobTitle;
            var PrevWork = visitorOrder.PrevWork == null? '': visitorOrder.PrevWork;
            var CellPhone = visitorOrder.CellPhone == null? '': visitorOrder.CellPhone;
            var CarNum = visitorOrder.CarNum == null? '': visitorOrder.CarNum;
            var meetingInit = visitorOrder.meetingInit == null? '': visitorOrder.meetingInit;
            var knownGuest = visitorOrder.knownGuest == null? '': visitorOrder.knownGuest == false? "לא": "כן";
            var meetingCharacter = visitorOrder.meetingCharacter == null? '': visitorOrder.meetingCharacter;
            var SpetialNeeds = visitorOrder.SpetialNeeds == null? '': visitorOrder.SpetialNeeds == false? "לא": "כן";
            var secLevel = visitorOrder.secLevel == null? '': visitorOrder.secLevel;
            var Comments = visitorOrder.Comments == null? '': visitorOrder.Comments;
            var visitorStatus = visitorOrder.visitorStatus == null? '': visitorOrder.visitorStatus;
            var qiriaNum = visitorOrder.qiriaNum == null? '': visitorOrder.qiriaNum;
            var titleOpenDlg = "";
            if(Title != undefined && Title != null)
            {
                titleOpenDlg = Title.replace('"/g', '')
                titleOpenDlg = titleOpenDlg.replace("'/g", "");
            }
            var visitor = '<tr class="ms-alternating ms-itmHoverEnabled">'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            IDType+
                            '"</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            OData__x0049_D1+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            OData__x05de__x05d3__x05d9__x05e0__x05+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb-title ms-positionRelative" height="100%">'+
                            '<div style="width: 38.7695px;" class="ms-vb ms-tableCell ms-list-TitleLink ms-vb-menuPadding itx">'+
                            '<a class="ms-listlink ms-draggable" onclick="PMOClick.Methods.OpenInDialog(\'מבקרים - ' + titleOpenDlg + '\', 736,818, false, true, false, \'' + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/visitors/Lists/visitors/מוזמן/displayifs.aspx?List=מבקרים&ID=' + visitorOrder.ID + '\', null, null)">'+
                            Title+
                            '</a>'+
                            '</div>'+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            FirstName+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            Company+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            JobTitle+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            PrevWork+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            CellPhone+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            CarNum+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            meetingInit+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            knownGuest+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            meetingCharacter+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            SpetialNeeds+
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
                            '<input value="'+
                            Comments+
                            '"></td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            '<select id="visitorStatus' + i + '">'+
                            '<option>טרם נבדק</option>'+
                            '<option>אושר</option>'+
                            '<option>נדחה</option>'+
                            '</select>'+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            '<input value="'+
                            qiriaNum+
                            '"></td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            '<button class="saveButton" onclick="return PMOClick.Visitors.Methods.UpdateVisitor(' + visitorOrder.ID + ', this)">אישור'+
                            '</button>'+
                            '</td>'+
                            '</tr>';
            document.getElementById("bodyOrderVisitors").innerHTML += visitor;
            document.getElementById("visitorStatus" + i).selectedIndex = visitorStatus == 'טרם נבדק' ? '0': visitorStatus == 'אושר' ? '1' : '2';
            var options = document.getElementById("secLevel" + i).options;
            for (var index = 0; index < options.length; index++) {
                if(options[index].text == secLevel){
                    document.getElementById("secLevel" + i).selectedIndex = index;
                    return false;
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
            PMOClick.Visitors.GlobalVariables.Visitors.value.sort(PMOClick.Visitors.Methods.DynamicSort(id));
            if(thDiv.children[1].children[0].classList.contains("ms-sortarrowdown-icon"))
                PMOClick.Visitors.GlobalVariables.Visitors.value.reverse();
            PMOClick.Visitors.Methods.DrawOrderVisitors("read");
        },

        EditData: function(){
            PMOClick.Visitors.Methods.DrawOrderVisitors("edit");
            document.getElementsByClassName("stopEditData")[0].style.display = "block";
            document.getElementsByClassName("editData")[0].style.display = "none";
        },

        UpdateVisitor: function(visitorId, thisButton){
            var thisTr = thisButton.parentElement.parentElement;
            var itemProperties = {secLevel: thisTr.children[14].children[0].value, Comments: thisTr.children[15].children[0].value, visitorStatus: thisTr.children[16].children[0].value, qiriaNum: thisTr.children[17].children[0].value};
            PMOClick.Methods.UpdateListItemREST(PMOClick.Visitors.Lists.Visitors.HE, PMOClick.Visitors.Lists.Visitors.EN, visitorId, itemProperties);
            PMOClick.Visitors.GlobalVariables.Visitors = PMOClick.Methods.GetListItemsREST(null, PMOClick.Visitors.Lists.Visitors.HE, null, '$filter=byOrder eq ' + parseInt(document.getElementById("chooseRecord").parentElement.parentElement.children[1].innerText), null, null, null);
            PMOClick.Visitors.Methods.DrawOrderVisitors("edit");
            return false;
        },

        OpenTabAction: function(action, idOrder){
            var url = PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/visitors/_layouts/15/NintexWorkflow/StartWorkflow.aspx?List=';
            url += PMOClick.Methods.GetListItemsREST(null, PMOClick.Visitors.Lists.Settings.EN, "$select=data", "&$filter=description eq 'הזמנת מבקרים'", null, null, null).value[0].data;
            url += '&ID=';
            url += idOrder;
            url +='&TemplateID=';
            url += PMOClick.Methods.GetListItemsREST(null, PMOClick.Visitors.Lists.Settings.EN, "$select=data", "&$filter=description eq '" + action + "'", null, null, null).value[0].data;
            window.open(url, "_blank");
        },

        StopEditData: function(){
            PMOClick.Visitors.Methods.DrawOrderVisitors("read");
            document.getElementsByClassName("stopEditData")[0].style.display = "none";
            document.getElementsByClassName("editData")[0].style.display = "block";
        }
    }
};