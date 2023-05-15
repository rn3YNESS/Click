var PMOClick = window.PMOClick || {};

PMOClickVisitors = {

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
        PMOClickVisitors.GlobalVariables.InvitationsMisradRashi = PMOClick.Methods.GetListItemsREST(PMOClickVisitors.Lists.VisitorsOrder.HE, '$select=Host/Id,*', '&$filter=OrderStatus eq '+ status + 'and OData__x05de__x05ea__x05d7__x05dd_ eq ' + misradRashi,"&$expand=Host", "&$orderby=ID desc",null);
        PMOClickVisitors.GlobalVariables.InvitationsKirya = PMOClick.Methods.GetListItemsREST(PMOClickVisitors.Lists.VisitorsOrder.HE, '$select=Host/Id,*', '&$filter=OrderStatus eq '+ status + 'and OData__x05de__x05ea__x05d7__x05dd_ eq ' + kirya,"&$expand=Host", "&$orderby=ID desc",null);
        PMOClickVisitors.GlobalVariables.InvitationsMaon = PMOClick.Methods.GetListItemsREST(PMOClickVisitors.Lists.VisitorsOrder.HE, '$select=Host/Id,*', '&$filter=OrderStatus eq '+ status + 'and OData__x05de__x05ea__x05d7__x05dd_ eq ' + maon,"&$expand=Host", "&$orderby=ID desc",null);
        PMOClickVisitors.Load();
    },

    Load: function () {
        $.each($('.bodyOrder'), function(i, v){
            $('.bodyOrder')[i].innerHTML = '';
        })
        $.each(PMOClickVisitors.GlobalVariables.InvitationsMisradRashi.value,function(i,v){
            PMOClickVisitors.Methods.DrawOrder(v, 'bodyOrderMisradRashi');
        });
        $.each(PMOClickVisitors.GlobalVariables.InvitationsKirya.value,function(i,v){
            PMOClickVisitors.Methods.DrawOrder(v, 'bodyOrderKirya');
        });
        $.each(PMOClickVisitors.GlobalVariables.InvitationsMaon.value,function(i,v){
            PMOClickVisitors.Methods.DrawOrder(v, 'bodyOrderMaon');
        });
        if($('.bodyOrderMisradRashi')[0].children.length > 0 && $('.bodyOrderMisradRashi')[0].children[0].children.length > 0){
            PMOClickVisitors.Methods.OrderVisitors($('.bodyOrderMisradRashi')[0].children[0].children[0]);
            PMOClickVisitors.Methods.changeImage($('.bodyOrderMisradRashi')[0].children[0].children[0].children[0]);
        }
        if($('.bodyOrderKirya')[0].children.length > 0 && $('.bodyOrderKirya')[0].children[0].children.length > 0){
            PMOClickVisitors.Methods.OrderVisitors($('.bodyOrderKirya')[0].children[0].children[0]);
            PMOClickVisitors.Methods.changeImage($('.bodyOrderKirya')[0].children[0].children[0].children[0]);
        }
        if($('.bodyOrderMaon')[0].children.length > 0 && $('.bodyOrderMaon')[0].children[0].children.length > 0){
            PMOClickVisitors.Methods.OrderVisitors($('.bodyOrderMaon')[0].children[0].children[0]);
            PMOClickVisitors.Methods.changeImage($('.bodyOrderMaon')[0].children[0].children[0].children[0]);
        }
    },

    Methods: {
        DrawOrder: function(v, orderPlace){
            var meetingStartTime = PMOClick.Methods.ConvertDateToCustomDateAndTime(v.meetingStartTime);
            var tdOrder = '<tr class="ms-alternating ms-itmHoverEnabled">'+
                            '<td onclick="PMOClickVisitors.Methods.OrderVisitors(this)" role="gridcell" class="ms-cellstyle ms-vb2">'+
                            '<img class="imgChooseRecord" border="0" align="absmiddle" style="cursor: hand" src="/_layouts/15/images/rbunsel.gif" alt="רגיל" onclick="PMOClickVisitors.Methods.changeImage(this)"></img>'+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb2">'+
                            v.ID+
                            '</td>'+
                            '<td role="gridcell" class="ms-cellstyle ms-vb-title ms-positionRelative" height="100%">'+
                            '<div class="ms-vb ms-tableCell ms-list-TitleLink ms-vb-menuPadding itx">'+
                            '<a class="ms-listlink ms-draggable" onclick="PMOClick.Methods.OpenInDialog(\'הזמנת מבקרים - ' + v.Title.replace('רה"מ', 'ראש הממשלה') + '...\', 736,818, false, true, false, \'' + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/visitors/Lists/visitorsOrder/הזמנת מבקרים/displayifs.aspx?ID=' + v.ID + '\', null, null)">'+
                            v.Title+
                            '</a>'+
                            '</div>'+
                            '<div class="ms-list-itemLink ms-tableCell ms-alignRight">'+
                            '<div class="dropdown">'+
                            '<a title="הפעלת זרימת עבודה" class="dropbtn ms-lstItmLinkAnchor ms-ellipsis-a"><img class="ms-ellipsis-icon" src="/_catalogs/theme/Themed/62149AFB/spcommon-B35BB0A9.themedpng?ctag=14" alt="פתח תפריט"></a>'+
                            '<div id="DropdownActions" class="dropdown-content">'+
                            '<a onclick="PMOClickVisitors.Methods.OpenTabAction(this.text, ' + v.ID + ')">ניסוח ושליחת תגובה</a>'+
                            '<a onclick="PMOClickVisitors.Methods.OpenTabAction(this.text, ' + v.ID + ')">הזמנה תקינה</a>'+
                            '<a onclick="PMOClickVisitors.Methods.OpenTabAction(this.text, ' + v.ID + ')">הזמנה לא תקינה</a>'+
                            '<a onclick="PMOClickVisitors.Methods.OpenTabAction(this.text, ' + v.ID + ')">הוזמן לאותה השעה</a>'+
                            '<a onclick="PMOClickVisitors.Methods.OpenTabAction(this.text, ' + v.ID + ')">הזמנה כפולה</a>'+
                            '<a onclick="PMOClickVisitors.Methods.OpenTabAction(this.text, ' + v.ID + ')">פחות מ-24 שעות</a>'+
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
                            "<span class='ms-noWrap ms-imnSpan'><a href='" + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + "/visitors/_layouts/15/userdisp.aspx?ID=" + v.HostId + "'>" + v.FullName + "</a></span>"+
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
                          '</tr>';
            $('.' + orderPlace).append(tdOrder);
        },

        changeImage: function(img){
            $.each($('.chooseRecord'), function(i, v){
                v.src = '/_layouts/15/images/rbunsel.gif';
            });
            $('.chooseRecord').removeClass("chooseRecord");
            $(img).addClass("chooseRecord");
            img.src = '/_layouts/15/images/rbsel.gif';
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
            $.each($(".ms-sortarrowdown-iconouter"),function(i,v){
                if(v.parentElement != thDiv){
                v.children[0].classList.remove("ms-sortarrowup-icon");
                v.children[0].classList.toggle("ms-sortarrowdown-icon");
                v.style.display = "none";
            }});
            if(thDiv.children[1].children[0].classList.contains("ms-sortarrowup-icon")){
                thDiv.children[1].children[0].classList.toggle("ms-sortarrowdown-icon");
                thDiv.children[1].children[0].classList.remove("ms-sortarrowup-icon");
            }
            else{
                thDiv.children[1].children[0].classList.toggle("ms-sortarrowup-icon");
                thDiv.children[1].children[0].classList.remove("ms-sortarrowdown-icon");
            }
            thDiv.children[1].style.display = "inline-block";
            switch(thDiv.children[0].innerText){
                case 'מזהה':
                    if(nameTable == 'MisradRashi')
                        PMOClickVisitors.GlobalVariables.InvitationsMisradRashi.value.sort(PMOClickVisitors.Methods.DynamicSort('ID'));
                    if(nameTable == 'Kirya')
                        PMOClickVisitors.GlobalVariables.InvitationsKirya.value.sort(PMOClickVisitors.Methods.DynamicSort('ID'));
                    if(nameTable == 'Maon')
                        PMOClickVisitors.GlobalVariables.InvitationsMaon.value.sort(PMOClickVisitors.Methods.DynamicSort('ID'));
                    break;
                case 'כותרת':
                    if(nameTable == 'MisradRashi')
                        PMOClickVisitors.GlobalVariables.InvitationsMisradRashi.value.sort(PMOClickVisitors.Methods.DynamicSort('Title'));
                    if(nameTable == 'Kirya')
                        PMOClickVisitors.GlobalVariables.InvitationsKirya.value.sort(PMOClickVisitors.Methods.DynamicSort('Title'));
                    if(nameTable == 'Maon')
                        PMOClickVisitors.GlobalVariables.InvitationsMaon.value.sort(PMOClickVisitors.Methods.DynamicSort('Title'));
                    break;
                case 'המזמין':
                    if(nameTable == 'MisradRashi')
                        PMOClickVisitors.GlobalVariables.InvitationsMisradRashi.value.sort(PMOClickVisitors.Methods.DynamicSort('FullName'));
                    if(nameTable == 'Kirya')
                        PMOClickVisitors.GlobalVariables.InvitationsKirya.value.sort(PMOClickVisitors.Methods.DynamicSort('FullName'));
                    if(nameTable == 'Maon')
                        PMOClickVisitors.GlobalVariables.InvitationsMaon.value.sort(PMOClickVisitors.Methods.DynamicSort('FullName'));
                    break;
                case 'תאריך ושעת הגעה':
                    if(nameTable == 'MisradRashi')
                        PMOClickVisitors.GlobalVariables.InvitationsMisradRashi.value.sort(PMOClickVisitors.Methods.DynamicSort('meetingStartTime'));
                    if(nameTable == 'Kirya')
                        PMOClickVisitors.GlobalVariables.InvitationsKirya.value.sort(PMOClickVisitors.Methods.DynamicSort('meetingStartTime'));
                    if(nameTable == 'Maon')
                        PMOClickVisitors.GlobalVariables.InvitationsMaon.value.sort(PMOClickVisitors.Methods.DynamicSort('meetingStartTime'));
                    break;
                case 'אופי פגישה':
                    if(nameTable == 'MisradRashi')
                        PMOClickVisitors.GlobalVariables.InvitationsMisradRashi.value.sort(PMOClickVisitors.Methods.DynamicSort('meetingCharacter'));
                    if(nameTable == 'Kirya')
                        PMOClickVisitors.GlobalVariables.InvitationsKirya.value.sort(PMOClickVisitors.Methods.DynamicSort('meetingCharacter'));
                    if(nameTable == 'Maon')
                        PMOClickVisitors.GlobalVariables.InvitationsMaon.value.sort(PMOClickVisitors.Methods.DynamicSort('meetingCharacter'));
                    break;
                case 'סיווג הפגישה':
                    if(nameTable == 'MisradRashi')
                        PMOClickVisitors.GlobalVariables.InvitationsMisradRashi.value.sort(PMOClickVisitors.Methods.DynamicSort('OData__x05d7__x05e1__x05d9__x05e4__x05'));
                    if(nameTable == 'Kirya')
                        PMOClickVisitors.GlobalVariables.InvitationsKirya.value.sort(PMOClickVisitors.Methods.DynamicSort('OData__x05d7__x05e1__x05d9__x05e4__x05'));
                    if(nameTable == 'Maon')
                        PMOClickVisitors.GlobalVariables.InvitationsMaon.value.sort(PMOClickVisitors.Methods.DynamicSort('OData__x05d7__x05e1__x05d9__x05e4__x05'));
                    break;
            }
            if(thDiv.children[1].children[0].classList.contains("ms-sortarrowdown-icon")){
                if(nameTable == 'MisradRashi')
                    PMOClickVisitors.GlobalVariables.InvitationsMisradRashi.value.reverse();
                if(nameTable == 'Kirya')
                    PMOClickVisitors.GlobalVariables.InvitationsKirya.value.reverse();
                if(nameTable == 'Maon')
                    PMOClickVisitors.GlobalVariables.InvitationsMaon.value.reverse();
            }
            if(nameTable == 'MisradRashi'){
                $('.bodyOrderMisradRashi')[0].innerHTML = '';
                $.each(PMOClickVisitors.GlobalVariables.InvitationsMisradRashi.value,function(i,v){
                    PMOClickVisitors.Methods.DrawOrder(v, 'bodyOrderMisradRashi');
                });
            }
            if(nameTable == 'Kirya'){
                $('.bodyOrderKirya')[0].innerHTML = '';
                $.each(PMOClickVisitors.GlobalVariables.InvitationsKirya.value,function(i,v){
                    PMOClickVisitors.Methods.DrawOrder(v, 'bodyOrderKirya');
                });
            }
            if(nameTable == 'Maon'){
                $('.bodyOrderMaon')[0].innerHTML = '';
                $.each(PMOClickVisitors.GlobalVariables.InvitationsMaon.value,function(i,v){
                    PMOClickVisitors.Methods.DrawOrder(v, 'bodyOrderMaon');
                });
            }
        },

        OrderVisitors: function(thDiv){
            PMOClickVisitors.GlobalVariables.Visitors = PMOClick.Methods.GetListItemsREST(PMOClickVisitors.Lists.Visitors.HE, null, '$filter=byOrder eq ' + parseInt(thDiv.parentElement.children[1].innerText), null, null, null);
            PMOClickVisitors.Methods.DrawOrderVisitors("read");
        },

        DrawOrderVisitors: function(type){
            $('.bodyOrderVisitors')[0].innerHTML = '';
            if(PMOClickVisitors.GlobalVariables.Visitors.value.length == 0){
                var noResult = '<div style="width: 300px; font-size=18px;">'+
                                'אין פריטים להצגה בתצוגה זו של הרשימה "מבקרים".'+
                               '</div>';
                $('.bodyOrderVisitors').append(noResult);
            }
            else{
                if(type == "read"){
                    $.each(PMOClickVisitors.GlobalVariables.Visitors.value,function(i,v){
                        PMOClickVisitors.Methods.DrawVisitorRead(v);
                    });
                }
                else{
                    $.each(PMOClickVisitors.GlobalVariables.Visitors.value,function(i,v){
                        PMOClickVisitors.Methods.DrawVisitorWrite(v, i);
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
                            '<a class="ms-listlink ms-draggable" onclick="PMOClick.Methods.OpenInDialog(\'מבקרים - ' + Title + '\', 736,818, false, true, false, \'' + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/visitors/Lists/visitors/מוזמן/displayifs.aspx?List=מבקרים&ID=' + visitorOrder.ID + '\', null, null)">'+
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
            $('.bodyOrderVisitors').append(visitor);
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
                            '<a class="ms-listlink ms-draggable" onclick="PMOClick.Methods.OpenInDialog(\'מבקרים - ' + Title + '\', 736,818, false, true, false, \'' + PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/visitors/Lists/visitors/מוזמן/displayifs.aspx?List=מבקרים&ID=' + visitorOrder.ID + '\', null, null)">'+
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
                            '<select class="secLevel' + i + '">'+
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
                            '<select class="visitorStatus' + i + '">'+
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
                            '<button class="saveButton" onclick="return PMOClickVisitors.Methods.UpdateVisitor(' + visitorOrder.ID + ', this)">אישור'+
                            '</button>'+
                            '</td>'+
                            '</tr>';
            $('.bodyOrderVisitors').append(visitor);
            $('.visitorStatus' + i)[0].selectedIndex = visitorStatus == 'טרם נבדק' ? '0': visitorStatus == 'אושר' ? '1' : '2';
            $.each($('.secLevel' + i)[0].options, function(index, option){
                if(option.text == secLevel){
                    $('.secLevel' + i)[0].selectedIndex = index;
                    return false;
                }
            })
        },

        DynamicSort: function(property) {
            var sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                /* next line works with strings and numbers, 
                 * and you may want to customize it to your needs
                 */
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        },

        SoryByColumnVisitors: function(thDiv){
            $.each($(".ms-sortarrowdown-iconouter"),function(i,v){
                if(v.parentElement != thDiv){
                v.children[0].classList.remove("ms-sortarrowup-icon");
                v.children[0].classList.toggle("ms-sortarrowdown-icon");
                v.style.display = "none";
            }});
            if(thDiv.children[1].children[0].classList.contains("ms-sortarrowup-icon")){
                thDiv.children[1].children[0].classList.toggle("ms-sortarrowdown-icon");
                thDiv.children[1].children[0].classList.remove("ms-sortarrowup-icon");
            }
            else{
                thDiv.children[1].children[0].classList.toggle("ms-sortarrowup-icon");
                thDiv.children[1].children[0].classList.remove("ms-sortarrowdown-icon");
            }
            thDiv.children[1].style.display = "inline-block";
            switch(thDiv.children[0].innerText){
                case 'סוג התעודה':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('IDType'));
                    break;
                case 'תז':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('OData__x0049_D1'));
                    break;
                case 'לאום':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('OData__x05de__x05d3__x05d9__x05e0__x05'));
                    break;
                case 'שם משפחה':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('Title'));
                    break;
                case 'שם פרטי':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('FirstName'));
                    break;
                case 'חברה':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('Company'));
                    break;
                case 'תפקיד':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('JobTitle'));
                    break;
                case 'תפקיד בכיר בעבר':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('PrevWork'));
                    break;
                case 'מספר טלפון נייד':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('CellPhone'));
                    break;
                case 'מספר רכב':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('CarNum'));
                    break;
                case 'יוזם הפגישה':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('meetingInit'));
                    break;
                case 'מוכר למזמין':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('knownGuest'));
                    break;
                case 'אופי פגישה':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('meetingCharacter'));
                    break;
                case 'צרכים מיוחדים':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('SpetialNeeds'));
                    break;
                case 'רמת סיווג':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('secLevel'));
                    break;
                case 'הערות':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('Comments'));
                    break;
                case 'סטטוס אישור כניסה':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('visitorStatus'));
                    break;
                case 'אישור קריה':
                    PMOClickVisitors.GlobalVariables.Visitors.value.sort(PMOClickVisitors.Methods.DynamicSort('qiriaNum'));
                    break;
            }
            if(thDiv.children[1].children[0].classList.contains("ms-sortarrowdown-icon"))
                PMOClickVisitors.GlobalVariables.Visitors.value.reverse();
            PMOClickVisitors.Methods.DrawOrderVisitors("read");
        },

        EditData: function(){
            PMOClickVisitors.Methods.DrawOrderVisitors("edit");
            $(".stopEditData")[0].style.display = "block";
            $(".editData")[0].style.display = "none";
        },

        UpdateVisitor: function(visitorId, thisButton){
            var thisTr = thisButton.parentElement.parentElement;
            var itemProperties = {secLevel: thisTr.children[14].children[0].value, Comments: thisTr.children[15].children[0].value, visitorStatus: thisTr.children[16].children[0].value, qiriaNum: thisTr.children[17].children[0].value};
            PMOClick.Methods.UpdateListItemREST(PMOClickVisitors.Lists.Visitors.HE, PMOClickVisitors.Lists.Visitors.EN, visitorId, itemProperties);
            PMOClickVisitors.GlobalVariables.Visitors = PMOClick.Methods.GetListItemsREST(PMOClickVisitors.Lists.Visitors.HE, null, '$filter=byOrder eq ' + parseInt($(".chooseRecord")[0].parentElement.parentElement.children[1].innerText), null, null, null);
            PMOClickVisitors.Methods.DrawOrderVisitors("edit");
            return false;
        },

        OpenTabAction: function(action, idOrder){
            var url = PMOClick.CONSTANTS.SITESERVERRELATIVEURL + '/visitors/_layouts/15/NintexWorkflow/StartWorkflow.aspx?List=';
            url += PMOClick.Methods.GetListItemsREST(PMOClickVisitors.Lists.Settings.EN, "$select=data", "&$filter=description eq 'הזמנת מבקרים'", null, null, null).value[0].data;
            url += '&ID=';
            url += idOrder;
            url +='&TemplateID=';
            url += PMOClick.Methods.GetListItemsREST(PMOClickVisitors.Lists.Settings.EN, "$select=data", "&$filter=description eq '" + action + "'", null, null, null).value[0].data;
            window.open(url, "_blank");
        },

        StopEditData: function(){
            PMOClickVisitors.Methods.DrawOrderVisitors("read");
            $(".stopEditData")[0].style.display = "none";
            $(".editData")[0].style.display = "block";
        }
    }
};