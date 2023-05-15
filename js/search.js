var PMOClick = window.PMOClick || {};


PMOClick.Search = {

    BrowserDetails: {
        IsIE: false,
        TrueVersion: 0,
        ActingVersion: 0,
        CompatibilityMode: false
    },

    User: {
        LogInName: null,
        ID: null,
        DisplayName: null,
        Email: null
    },

    GlobalVariables: {
        CurrentPage: 1,
        RecordsPerPage: 5,
        ResultsArr: [],
        TempResultsArr: [],
        TotalResults: [],
        TempResultsArr: [],
        Refiners: {
            SPItemType: {
                Key: "סוגי מסמכים",
                Values: []
            },
            SPListItemType: {
                Key: "סוגי פריטים",
                Values: []
            }
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

    },

    Load: function () {

    },


    Methods: {

        DrawSearch: function () {
            $('#navBox').empty();
            var searchbox =
                "<!--HTML-->" +
                // "<h1>חיפוש ב - <img  src='/_catalogs/masterpage/click/images/ClickLogo93x42.png' alt='מערכת קליק'></img></h1>" +
                "<!--REST API fieldset-->" +
                "<fieldset>" +
                "<legend>" +

                "</legend>" +
                "<!--SearchBox -->" +
                "<div class='fldContainer-12'>" +
                "<div class='topnav'>" +
                "<div class='search-container'>" +
                "<div class='searchBox-container row'>"+
                "<div style='margin: 0; height: 35px; padding-left: 0;' class='col-lg-10'>"+
                "<input type='text' placeholder='חפש...' name='search' id='inptxtSearchBox' autocomplete='off'>"+
                "</div>"+
                "<div class='col-lg-2' style='height:35px;padding-left: 10px;margin: 0;'>"+
                "<button id='searchButton' type='button' onclick='PMOClick.Search.Methods.GetSearchResults()''>"+
                "<i class='fa fa-search'><img style='width:25px; height:25px;' src='/_catalogs/masterpage/click/images/SearchIcon.png'</i>"+
                "</button>"+
                "</div>"+
                "</div>"+
                "</div>" +
                "</div>" +
                "</div>" +
                "<!--Search Results-->" +
                "<div class='fldContainer-2'>" +
                "<div class='fldRow' id='searchResultsRef'>" +
                "</div>" +
                "</div>" +
                "<div class='fldContainer-9'>" +
                "<div class='fldRow' id='searchResults'>" +
                "</div>" +
                "<div class='pagination'>" +
                "</div>"
            "</div>" +
                "</fieldset>";

            $('#navBox').append(searchbox);
            var input = document.getElementById("inptxtSearchBox");
            input.addEventListener("keypress", function (event) {
                if (event.keyCode == 13) {
                    event.preventDefault();
                    PMOClick.Search.Methods.GetSearchResults();
                }
            });
        },

        GetSearchResults: function () {
            //Clear DOM
            PMOClick.Search.Methods.ClearSearchComponents();
            //Clear results array and refiners
            PMOClick.Search.GlobalVariables.TotalResults = [];
            PMOClick.Search.GlobalVariables.TempResultsArr = [];
            PMOClick.Search.GlobalVariables.Refiners.SPItemType.Values = [];
            PMOClick.Search.GlobalVariables.Refiners.SPListItemType.Values = [];

            var querytext = document.getElementById('inptxtSearchBox').value;
            //with sourceid
            var items = PMOClick.Methods.RequestResultsFromSearchAPI("querytext='" + querytext + "'", "&rowlimit=500", "&selectproperties='Title,Description,HitHighlightedSummary,contentclass,FileType,Created,CreatedBy,FileExtension,Path,LastModifiedTime,OriginalPath,ParentLink,ServerRedirectedEmbedURL,ServerRedirectedPreviewURL,ServerRedirectedURL,UniqueId,IsContainer'", null, "&trimduplicates=false&sourceid='244b0683-9629-49af-92ac-3ad66b10923b'");
            //without sourceid
            //var items = PMOClick.Methods.RequestResultsFromSearchAPI("querytext='" + querytext + "'", "&rowlimit=500", "&selectproperties='Title,Description,HitHighlightedSummary,contentclass,FileType,Created,CreatedBy,FileExtension,Path,LastModifiedTime,OriginalPath,ParentLink,ServerRedirectedEmbedURL,ServerRedirectedPreviewURL,ServerRedirectedURL,UniqueId,IsContainer'", null, "&trimduplicates=false");
            if (items.PrimaryQueryResult.RelevantResults.Table.Rows.length > 0) {
                PMOClick.Search.Methods.InitSearchResults(items);
            }
            else {
                var noResults = "<div class='resultTitle'>" +
                    "לא נמצאו תוצאות" +
                    "</div>";
                $('#searchResults').append(noResults);
            }
        },

        ClearSearchComponents: function () {
            PMOClick.Search.Methods.ClearSearchResultArea();
            $('.pagination').empty(); //Clear element
            $('#searchResultsRef').empty();//Clear Ref Panel            
        },

        ClearSearchResultArea: function () {
            var searchResults = document.getElementById("searchResults");
            searchResults.innerHTML = "";
        },

        InitSearchResults: function (items) {
            $.each(items.PrimaryQueryResult.RelevantResults.Table.Rows, function (i, v) {
                var result = {
                    DocId: v.Cells[1].Value,
                    Title: v.Cells[2].Value,
                    Description: v.Cells[3].Value,
                    HitHighlightedSummary: v.Cells[4].Value,
                    contentclass: v.Cells[5].Value,
                    FileType: v.Cells[6].Value,
                    Created: (v.Cells[7].Value === null)? "" : v.Cells[7].Value,
                    CreatedBy: (v.Cells[8].Value === null)? "" : v.Cells[8].Value,
                    FileExtension: v.Cells[9].Value,
                    Path: v.Cells[10].Value,
                    LastModifiedTime: (v.Cells[11].Value === null)? "" : v.Cells[11].Value,
                    OriginalPath: v.Cells[12].Value,
                    ParentLink: v.Cells[13].Value,
                    ServerRedirectedEmbedURL: v.Cells[14].Value,
                    ServerRedirectedPreviewURL: v.Cells[15].Value,
                    ServerRedirectedURL: v.Cells[16].Value,
                    UniqueId: v.Cells[17].Value,
                    IsContainer: v.Cells[18].Value
                };
                PMOClick.Search.GlobalVariables.TotalResults.push(result);

                //Get Refiners 
                if (result.FileExtension != null) {
                    PMOClick.Search.Methods.BuildRef(PMOClick.Search.Methods.GetFriendlyNameForFileExtension(result.FileExtension.toString()), PMOClick.Search.GlobalVariables.Refiners.SPItemType.Values,PMOClick.Search.GlobalVariables.Refiners.SPItemType.Key);
                }
                if (result.contentclass != null) {
                    PMOClick.Search.Methods.BuildRef(result.contentclass.toString(), PMOClick.Search.GlobalVariables.Refiners.SPListItemType.Values,PMOClick.Search.GlobalVariables.Refiners.SPListItemType.Key);
                }
            });

            //Build Pagination element
            PMOClick.Search.Methods.BuildPagination(PMOClick.Search.GlobalVariables.TotalResults);
            // Init Pagination
            PMOClick.Search.Methods.ChangePage(1, PMOClick.Search.GlobalVariables.TotalResults);
            //Draw Refiners
            PMOClick.Search.Methods.DrawRefiners();
            //DrawSearch Results

        },

        BuildRef: function (itemType, refArr,refKey) {
            var ccItem = null;
            if(refKey == "סוגי פריטים"){
                ccItem = itemType;
                if (!PMOClick.Methods.IsInArray(PMOClick.Search.Methods.GetSerilizeContentClass(ccItem), refArr, false)) {
                    refArr.push(PMOClick.Search.Methods.GetSerilizeContentClass(ccItem));
                }
            }
            else{
                var itemSplit = itemType.split('_');
                var itemTypeStr = itemSplit[1];
                if (!PMOClick.Methods.IsInArray(itemTypeStr, refArr, false)) {
                    refArr.push(itemTypeStr);
                }
            }
        },

        GetSerilizeContentClass: function (cc) {
            if (cc.indexOf("STS_Web") > -1 || cc.indexOf("STS_Site") > -1) { // Site
                return "אתרים";
            }
            if (cc.indexOf("STS_ListItem_850") > -1 || cc.indexOf("STS_List_850") > -1) { // Page
                return "דפים";
            }
            if (cc.indexOf("STS_ListItem_DocumentLibrary") > -1 || cc.indexOf("STS_List_DocumentLibrary") > -1) { // Document Library Items
                return "מסמכים";
            }
            if (cc.indexOf("STS_ListItem_GenericList") > -1 || cc.indexOf("STS_List_GenericList") > -1) { // Custom List Item
                return "פריטים";
            }
            if (cc.indexOf("STS_ListItem_Links") > -1 || cc.indexOf("STS_List_Links") > -1) { // Links List Item
                return "קישורים";
            }
            if (cc.indexOf("STS_ListItem_Tasks") > -1 || cc.indexOf("STS_List_Tasks") > -1) { // Tasks List Item
                return "משימות";
            }
            if (cc.indexOf("STS_ListItem_Events") > -1 || cc.indexOf("STS_List_Events") > -1) { // Events List Item
                return "אירועים";
            }
            if (cc.indexOf("STS_ListItem_Announcements") > -1 || cc.indexOf("STS_List_Announcements") > -1) { // Announcements List Item
                return "הודעות";
            }            
            if (cc.indexOf("STS_ListItem_Contacts") > -1 || cc.indexOf("STS_List_Contacts") > -1) { // Contacts List Item
                return "אנשי קשר";
            }
            if (cc.indexOf("STS_ListItem_DiscussionBoard") > -1 || cc.indexOf("STS_List_DiscussionBoard") > -1) { // Discussion List Item
                return "דיונים";
            }
            if (cc.indexOf("STS_ListItem_IssueTracking") > -1 || cc.indexOf("STS_List_IssueTracking") > -1) { // Issue Tracking List Item
                return "מעקב בעיות";
            }
            if (cc.indexOf("STS_ListItem_GanttTasks") > -1 || cc.indexOf("STS_List_GanttTasks") > -1) { // Project Tasks List Item
                return "גאנטים";
            }
            if (cc.indexOf("STS_ListItem_Survey") > -1 || cc.indexOf("STS_List_Survey") > -1) { // Survey List Item
                return "סקרים";
            }
            if (cc.indexOf("STS_ListItem_PictureLibrary") > -1 || cc.indexOf("STS_List_PictureLibrary") > -1) { // Picture Library Item
                return "תמונות";
            }
            if (cc.indexOf("STS_ListItem_WebPageLibrary") > -1 || cc.indexOf("STS_List_WebPageLibrary") > -1) { // Web Page Library Item
                return "דפי אינטרנט";
            }
            if (cc.indexOf("STS_ListItem_XMLForm") > -1 || cc.indexOf("STS_List_XMLForm") > -1) { // Form Library Item
                return "טפסים";
            }
            else {
                return "אחר...";
            }
        },

        GetDeSerilizeContentClass: function (cc) {
            if (cc.indexOf("משימות") > -1) {
                return "Task";
            }
            else if (cc.indexOf("אירועים") > -1) {
                return "Event";
            }
            else if (cc.indexOf("אתרים") > -1) {
                return "Site";
            }
            else if (cc.indexOf("תתי אתרים") > -1) {
                return "Web";
            }
            else if (cc.indexOf("סקרים") > -1) {
                return "Survey";
            }
            else if (cc.indexOf("אנשי קשר") > -1) {
                return "Contacts";
            }
            else if (cc.indexOf("תמונות") > -1) {
                return "PictureLibrary";
            }
            else if (cc.indexOf("הודעות") > -1) {
                return "Announcements";
            }
            else if (cc.indexOf("טפסים") > -1) {
                return "XMLForm";
            }
            else if (cc.indexOf("מסמכים") > -1) {
                return "DocumentLibrary";
            }
            else if (cc.indexOf("קישורים") > -1) {
                return "Links";
            }
            else if (cc.indexOf("דפי אינטרנט") > -1) {
                return "WebPageLibrary";
            }
            else if (cc.indexOf("גאנטים") > -1) {
                return "GanttTasks";
            }
            else if (cc.indexOf("מעקב בעיות") > -1) {
                return "IssueTracking";
            }
            else if (cc.indexOf("דיונים") > -1) {
                return "DiscussionBoard";
            }
            else if (cc.indexOf("דפים") > -1) {
                return "850";
            }
            else if (cc.indexOf("פריטים") > -1) {
                return "GenericList";
            }
            else {
                return cc;
            }
        },

        ChangePage: function (page, currentArr) {
            PMOClick.Search.Methods.ClearSearchResultArea();

            if (PMOClick.Methods.IsNullOrUndefined(currentArr)) {
                if (PMOClick.Search.GlobalVariables.TempResultsArr.length > 0) {
                    currentArr = PMOClick.Search.GlobalVariables.TempResultsArr;
                }
                else {
                    currentArr = PMOClick.Search.GlobalVariables.TotalResults;
                }
            }
            var btn_next = document.getElementById("btn_next");
            var btn_prev = document.getElementById("btn_prev");

            // Validate page
            if (page < 1) page = 1;
            if (page > PMOClick.Search.Methods.NumPages(currentArr)) page = PMOClick.Search.Methods.NumPages(currentArr);

            var recordsPerPage = (currentArr.length / page);
            if (PMOClick.Search.GlobalVariables.RecordsPerPage < recordsPerPage) {
                recordsPerPage = PMOClick.Search.GlobalVariables.RecordsPerPage;
            }
            for (var i = (page - 1) * PMOClick.Search.GlobalVariables.RecordsPerPage; i < (page * recordsPerPage); i++) {
                if (!(PMOClick.Search.GlobalVariables.TotalResults[i] === undefined)) { //Check if there is results that are undefined, this is for the last page
                    //searchResults.innerHTML += PMOClick.Search.GlobalVariables.ResultsArr[i] + "<br>";
                    PMOClick.Search.Methods.DrawResult(currentArr[i], i);
                }
            }
            //Hide-Show Buttons (Prev/Next)
            if (page == 1 || page == 0) {
                btn_prev.style.visibility = "hidden";
            } else {
                btn_prev.style.visibility = "visible";
            }

            if (page == PMOClick.Search.Methods.NumPages(currentArr)) {
                btn_next.style.visibility = "hidden";
            } else {
                btn_next.style.visibility = "visible";
            }

            PMOClick.Search.Methods.HihglightPageNumber(page);
        },

        NumPages: function (searchResultArray) {
            if (PMOClick.Methods.IsNullOrUndefined(searchResultArray)) {
                searchResultArray = PMOClick.Search.GlobalVariables.TotalResults;
            }
            var numberOgPages = Math.ceil(searchResultArray.length / PMOClick.Search.GlobalVariables.RecordsPerPage); //The ceil() method rounds a number UPWARDS to the nearest integer, and returns the result.
            if (numberOgPages > 10) {
                return 10;
            }
            else {
                return numberOgPages;
            }
        },

        PrevPage: function () {
            if (PMOClick.Search.GlobalVariables.CurrentPage > 1) {
                $('#p' + PMOClick.Search.GlobalVariables.CurrentPage).removeClass("pageActive");
                PMOClick.Search.GlobalVariables.CurrentPage--;
                $('#p' + PMOClick.Search.GlobalVariables.CurrentPage).addClass("pageActive"); //Hihglight prev page
                if (PMOClick.Search.GlobalVariables.TempResultsArr.length > 0) {//Refiner result array not empty
                    PMOClick.Search.Methods.ChangePage(PMOClick.Search.GlobalVariables.CurrentPage, PMOClick.Search.GlobalVariables.TempResultsArr);
                }
                else {
                    PMOClick.Search.Methods.ChangePage(PMOClick.Search.GlobalVariables.CurrentPage);
                }
            }
        },

        NextPage: function () {
            if (PMOClick.Search.GlobalVariables.CurrentPage < PMOClick.Search.Methods.NumPages()) {
                $('#p' + PMOClick.Search.GlobalVariables.CurrentPage).removeClass("pageActive");
                PMOClick.Search.GlobalVariables.CurrentPage++;
                $('#p' + PMOClick.Search.GlobalVariables.CurrentPage).addClass("pageActive"); //Hihglight next page
                if (PMOClick.Search.GlobalVariables.TempResultsArr.length > 0) {//Refiner result array not empty
                    PMOClick.Search.Methods.ChangePage(PMOClick.Search.GlobalVariables.CurrentPage, PMOClick.Search.GlobalVariables.TempResultsArr);
                }
                else {
                    PMOClick.Search.Methods.ChangePage(PMOClick.Search.GlobalVariables.CurrentPage);
                }
            }
        },

        HihglightPageNumber: function (pageNumber) {
            PMOClick.Search.GlobalVariables.CurrentPage = pageNumber; //Change the current page to the new page
            $('.pageNumber.pageActive').removeClass("pageActive");
            $('#p' + pageNumber).addClass("pageActive"); //Hihglight choosen page
        },

        ShowHP: function (itemID) {
            var positionRight = document.getElementById(itemID + "_itemBody").style.width;
            document.getElementById(itemID + "_hover").style.visibility = "visible";
            //document.getElementById(itemID+"_hover").style.right = positionRight;
            document.getElementById(itemID + "_hover").style.opacity = null;
        },

        HideHP: function (itemID) {
            document.getElementById(itemID + "_hover").style.visibility = "hidden";
            document.getElementById(itemID + "_hover").style.position = "absolute";
            document.getElementById(itemID + "_hover").style.opacity = 0;
        },

        GetHoverClass: function (resultType) {
            if ((resultType == "docx") | (resultType == "xlsx") || (resultType == "pptx") || (resultType == "doc") || (resultType == "xls") || (resultType == "ppt") || (resultType == "pdf")) {
                return "result-hover-wacSize";
            }
            else {
                return "result-hover-standardSize";
            }
        },

        GetIframePreview: function (itemID, itemPathManagedProperty) {
            if (!PMOClick.Search.Methods.IsNullOrUndefined(itemPathManagedProperty) && PMOClick.Search.Methods.IsSameHost(itemPathManagedProperty, PMOClick.Search.Methods.GetHostName())) {
                var encodedSrcOfIframe = PMOClick.Methods.EncodeUrlForHtmlAttributes(itemPathManagedProperty);
                //"<iframe id='"+idViewerEncoded+"' src='"+ encodedSrcOfIframe+"' scrolling='no' frameborder='0px' class='result-hover-viewer' style='display: block;'></iframe>";
                return "<iframe id='" + itemID + "_item_hoverViewer' src='" + encodedSrcOfIframe + "' scrolling='no' frameborder='0px' class='result-hover-viewer' style='display: block;'></iframe>";
            }
        },

        IsSameHost: function (c, a) {
            /*if (PMOClick.Methods.IsNullOrUndefined(c) || PMOClick.Methods.IsNullOrUndefined(a)) return false;
            var b = document.createElement("a");
            b.href = c;
            var d = b.hostname;
            return d.toLowerCase() === a.toLowerCase();*/
            return true;
        },

        GetHostName: function () {
            var a = "";
            if (!PMOClick.Methods.IsNullOrUndefined(window.self.location)) a = window.self.location.hostname;
            return a;
        },

        DrawResult: function (v, i) {
            var itemID = v.contentclass + "_" + v.DocId;
            var previewUrl, oosRedirectUrl = null;
            var isContainer = (v.IsContainer === 'true');
            //Check if the result has OOS url
            if (PMOClick.Methods.isNullOrEmptyString(v.ServerRedirectedEmbedURL)) {
                previewUrl = oosRedirectUrl = v.Path;
            }
            else {
                previewUrl = v.ServerRedirectedEmbedURL;
                oosRedirectUrl = v.ServerRedirectedURL;
            }
            var iframePreview = PMOClick.Search.Methods.GetIframePreview(itemID, previewUrl);
            // var itemIcon = PMOClick.Search.Methods.GetIconUrlByFileExtension(v);
            // var BrandIconClass=PMOClick.Search.Methods.GetIconClassByExtension(v);
            var MsIconClass = PMOClick.Search.Methods.GetIconClassByExtension2(v);
            var resultSummary = "";
            if (!PMOClick.Methods.IsNullOrUndefined(v.HitHighlightedSummary)) {
                resultSummary = v.HitHighlightedSummary;// + "</br>";
            }
            var showInLib = v.Path;//'#'; 
            if (v.ParentLink != null) {
                showInLib = v.ParentLink + '?view=7&q=' + v.Title;
            }

            var hoverClass = PMOClick.Search.Methods.GetHoverClass(v.FileType);
            var result =
                "<div id=\"" + itemID + "\" style=\"position:relative; display:block;\" name=\"Item\" data-displaytemplate=\"PDFItem\" class=\"ms-srch-item spResult\" onmouseover=\"PMOClick.Search.Methods.ShowHP('" + itemID + "')\" onmouseout=\"PMOClick.Search.Methods.HideHP('" + itemID + "')\" >" +
                //\"EnsureScriptParams('SearchUI.js', 'HP.Show', 'itemID', '" + itemID + "_hover', '~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fSearch\u002fItem_PDF_HoverPanel.js', false);\"  onmouseout=\"EnsureScriptParams('SearchUI.js', 'HP.Hide');\">" +
                "<div id=\"" + itemID + "_itemBody\" class=\"ms-srch-item-body itemResultBody\" onclick=\"EnsureScriptParams('SearchUI.js', 'HP.Show', 'itemID', '" + itemID + "_hover', '~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fSearch\u002fItem_PDF_HoverPanel.js', false);\">" +
                //Result Icon
                "<div class=\"spResult-icon\">" +
                    // "<img class='ms-BrandIcon--icon16 "+BrandIconClass+"' onload=\"this.style.display='inline'\" src=\"" + itemIcon + "\" style=\"display: inline;\">" +
                    //"<div class='ms-BrandIcon--icon48 "+BrandIconClass+"'></div>"+
                    "<span style='color:#ffffff;font-size:20px;'><i class='ms-Icon "+MsIconClass+"' aria-hidden='true' height='30px' width='30px' ></i></span>"+
                "</div>" +
                //Result Title
                "<div id=\"" + itemID + "_itemTitle\" class=\"spResult-title\">" +
                "<h3 class=\"ms-srch-ellipsis\">" +
                "<a class=\"titleResult\" clicktype=\"Result\" id=\"itemID_itemTitleLink\" href=\"javascript:window.open('" + v.Path + "');\"  class=\"resultTitle ms-srch-item-link\" >" +
                v.Title +
                "</a>" +
                "</h3>" +
                "</div>" +
                //Result Summary (Short Description)
                "<div id=\"" + itemID + "_itemSummary\" class=\"itemResultSummary ms-srch-item-summary\" >" +
                resultSummary +
                "</div>" +
                "<div id=\"" + itemID + "_itemMetadata\" class=\"itemResultMetadata\" >" +
                "<span><strong style='color:#3bd5b5; '>השתנה : </strong>" + PMOClick.Methods.FormatDateString(v.LastModifiedTime) + "</span>" +
                "&nbsp;&nbsp;|&nbsp;&nbsp;<span><strong style='color:#3bd5b5; '>תאריך יצירה : </strong>" + PMOClick.Methods.FormatDateString(v.Created) + "&nbsp;&nbsp;|&nbsp;&nbsp;<strong style='color:#3bd5b5; ;'>נוצר על-ידי : </strong>" + v.CreatedBy + "</span></br>" +
                "</div>" +
                "</div>" +
                //Hover Panel
                "<div id=\"" + itemID + "_hover\" class=\"itemResultHoverPanel ms-srch-hover-outerContainer\" style=\"display: block;  visibility: hidden; right:650px; top: -42px; width: 326px; opacity: 0;\">" +
                "<div class='itemResultHoverPanelInnerContainer ms-srch-hover-innerContainer " + hoverClass + "' id='" + itemID + "_item_innerHover'>" +
                //arrow                        
                "<div class='result-hover-arrowBorder-rtl' id='" + itemID + "_item_hoverArrowBorder'>" +
                "</div>" +
                "<div class='result-hover-arrow-rtl' id='" + itemID + "_item_hoverArrow'></div>" +
                //content
                "<div class='ms-srch-hover-content' id='" + itemID + "_item_hoverContent' data-displaytemplate='PDFHoverPanel'>" +
                "<div id='" + itemID + "_item_hoverCommonHeader' class='itemResultHoverPanelInnerHeader ms-srch-hover-header titleBackColor'>" +
                "<div>" +
                "<div class='ms-srch-hover-close'>" +
                "</div>" +
                "<div class='ms-srch-hover-title ms-dlg-heading ms-srch-ellipsis fontHeadFooter'>" +
                v.Title +
                "</div>" +
                "</div>" +
                "</div>" +
                "<div class='ms-metadata fontHeadFooter'>" +
                ((v.FileType == null) ? "" : (v.FileType).toUpperCase()) +
                "</div>" +
                //hoverCommonBody
                "<div id='" + itemID + "_item_hoverCommonBody' class='itemResultHoverPanelInnerBody ms-srch-hover-body'>" +
                //previewf
                "<div class='result-hover-viewerContainer' style='display: block; height: 169px;'>" +
                iframePreview + //"<iframe id='"+itemID+"_item_hoverViewer' src='"+v.ServerRedirectedEmbedURL+"' scrolling='no' frameborder='0px' class='result-hover-viewer' style='display: block;'></iframe>"+
                "</div>" +
                //MetaData
                // "<div class='result-hover-subTitle'>" +
                // "<h3 class='ms-soften'>השתנה לאחרונה</h3>" +
                // "</div>" +
                // "<div class='itemResultHoverPanelInnerBodyText result-hover-text ms-srch-ellipsis' id='" + itemID + "_item_hoverLastModified'>" +
                // PMOClick.Methods.FormatDateString(v.LastModifiedTime) +
                // "</div>" +
                // "<div class='result-hover-subTitle'>" +
                // "<h3 class='ms-soften'>נוצר על-ידי</h3>" +
                // "</div>" +
                // "<div class='itemResultHoverPanelInnerBodyText result-hover-text'> " +
                // "<span id='" + itemID + "_item_author0' title='" + v.CreatedBy + "'>" +
                // v.CreatedBy +
                // "</span>" +
                // "</div>" +
                "</div>" +
                //Actions  
                PMOClick.Search.Methods.GetResultActionPanelForHoverPanel(itemID, oosRedirectUrl, v.Path, v.Title, showInLib, isContainer) +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>";
            $('#searchResults').append(result);
        },

        GetResultActionPanelForHoverPanel: function (resultID, resultPath, resultMetaDataPath, resultTitle, resultParentUrl, isContainer) {
            var resultType = null;
            var editItemUrl = null;
            if (resultMetaDataPath.indexOf("DispForm") > -1) {
                resultType = "EditableListItem";
                var a = resultPath.split('/');
                var lIndex = a.indexOf("Lists");
                editItemUrl = resultPath.replace("DispForm.aspx", "EditForm.aspx");
                editItemUrl += "&Source=/" + a[lIndex] + "/" + a[lIndex + 1];
            }
            if (isContainer) {
                resultType = "Container";
            }
            if (resultPath.indexOf("Wopi") > -1) {
                resultType = "EditableItem";
            }
            switch (resultType) {
                case "EditableListItem":
                    actionPanel = "<div id='" + resultID + "_item_hoverCommonActions' class='itemResultHoverPanelInnerActions ms-srch-hover-actions titleBackColor'>" +
                        "<div class='ms-srch-hover-action'>" +
                        "<a id='" + resultID + "_item_hoverFollow' class='ms-calloutLink ms-uppercase fontHeadFooter' style='margin-right: 10px;' target='_blank' href='" + resultMetaDataPath + "' title='לחץ כדי לעקוב אחר תוצאה זו'> הצג מאפיינים </a>" +
                        "</div>" +
                        "<div class='ms-srch-hover-action'>" +
                        "<a clicktype='ActionEdit' id='" + resultID + "_item_hoverOpen' class='ms-calloutLink ms-uppercase fontHeadFooter' target='_blank' href='" + editItemUrl + "' title='ערוך תוצאה זו'>ערוך</a>" +
                        "</div>" +
                        "<div class='ms-srch-hover-action'>" +
                        "<a clicktype='ActionSend' id='" + resultID + "_item_hoverSend' class='ms-calloutLink ms-uppercase fontHeadFooter' title='שלח תוצאה זו למישהו בדואר אלקטרוני' href='mailto:?subject=" + resultTitle + "&body=" + encodeURIComponent(resultMetaDataPath) + "'>שלח </a>" +
                        "</div>" +
                        "<div class='ms-srch-hover-action'>" +
                        "<a clicktype='ActionViewLibrary' id='" + resultID + "_item_hoverParentLink' class='ms-calloutLink ms-uppercase fontHeadFooter' title='פתח את הספריה המכילה את תוצאה זו' target='_blank' href='" + resultParentUrl + "'>הצג ספריה</a>" +
                        "</div>" +
                        "</div>";
                    return actionPanel;
                    break;
                case "Container":
                    actionPanel = "<div id='" + resultID + "_item_hoverCommonActions' class='itemResultHoverPanelInnerActions ms-srch-hover-actions titleBackColor'>" +
                        "<div class='ms-srch-hover-action'>" +
                        "<a clicktype='ActionEdit' id='" + resultID + "_item_hoverOpen' class='ms-calloutLink ms-uppercase fontHeadFooter' style='margin-right: 10px;' target='_blank' href='" + resultPath + "' title='פתח תוצאה זו' >פתח</a>" +
                        "</div>" +
                        "<div class='ms-srch-hover-action'>" +
                        "<a clicktype='ActionSend' id='" + resultID + "_item_hoverSend' class='ms-calloutLink ms-uppercase fontHeadFooter' title='שלח תוצאה זו למישהו בדואר אלקטרוני' href='mailto:?subject=" + resultTitle + "&body=" + encodeURIComponent(resultMetaDataPath) + "'>שלח </a>" +
                        "</div>" +
                        "<div class='ms-srch-hover-action'>" +
                        "<a clicktype='ActionViewLibrary' id='" + resultID + "_item_hoverParentLink' class='ms-calloutLink ms-uppercase fontHeadFooter' title='פתח את הספריה המכילה את תוצאה זו' target='_blank' href='" + resultParentUrl + "'>הצג ספריה</a>" +
                        "</div>" +
                        "</div>";
                    return actionPanel;
                    break;
                case "EditableItem":
                    actionPanel = "<div id='" + resultID + "_item_hoverCommonActions' class='itemResultHoverPanelInnerActions ms-srch-hover-actions titleBackColor'>" +
                        "<div class='ms-srch-hover-action'>" +
                        "<a clicktype='ActionEdit' id='" + resultID + "_item_hoverOpen' class='ms-calloutLink ms-uppercase fontHeadFooter' style='margin-right: 10px;' target='_blank' href='" + resultPath + "' title='פתח תוצאה זו' openapp='ms-word' opencontrol='PdfFile.OpenDocuments'>פתח</a>" +
                        "</div>" +
                        "<div class='ms-srch-hover-action'>" +
                        "<a id='" + resultID + "_item_hoverFollow' class='ms-calloutLink ms-uppercase fontHeadFooter' target='_blank' href='" + resultMetaDataPath + "' title='לחץ כדי לעקוב אחר תוצאה זו'> הצג מאפיינים </a>" +
                        "</div>" +
                        "<div class='ms-srch-hover-action'>" +
                        "<a clicktype='ActionSend' id='" + resultID + "_item_hoverSend' class='ms-calloutLink ms-uppercase fontHeadFooter' title='שלח תוצאה זו למישהו בדואר אלקטרוני' href='mailto:?subject=" + resultTitle + "&body=" + encodeURIComponent(resultMetaDataPath) + "'>שלח </a>" +
                        "</div>" +
                        "<div class='ms-srch-hover-action'>" +
                        "<a clicktype='ActionViewLibrary' id='" + resultID + "_item_hoverParentLink' class='ms-calloutLink ms-uppercase fontHeadFooter' title='פתח את הספריה המכילה את תוצאה זו' target='_blank' href='" + resultParentUrl + "'>הצג ספריה</a>" +
                        "</div>" +
                        "</div>";
                    return actionPanel;
                    break;
                default:
                    actionPanel = "<div id='" + resultID + "_item_hoverCommonActions' class='itemResultHoverPanelInnerActions ms-srch-hover-actions titleBackColor'>" +
                        "<div class='ms-srch-hover-action'>" +
                        "<a clicktype='ActionEdit' id='" + resultID + "_item_hoverOpen' class='ms-calloutLink ms-uppercase fontHeadFooter' style='margin-right: 10px;' target='_blank' href='" + resultPath + "' title='פתח תוצאה זו' openapp='ms-word' opencontrol='PdfFile.OpenDocuments'>פתח</a>" +
                        "</div>" +
                        "<div class='ms-srch-hover-action'>" +
                        "<a id='" + resultID + "_item_hoverFollow' class='ms-calloutLink ms-uppercase fontHeadFooter' target='_blank' href='" + resultMetaDataPath + "' title='לחץ כדי לעקוב אחר תוצאה זו'> הצג מאפיינים </a>" +
                        "</div>" +
                        "<div class='ms-srch-hover-action'>" +
                        "<a clicktype='ActionSend' id='" + resultID + "_item_hoverSend' class='ms-calloutLink ms-uppercase fontHeadFooter' title='שלח תוצאה זו למישהו בדואר אלקטרוני' href='mailto:?subject=" + resultTitle + "&body=" + encodeURIComponent(resultMetaDataPath) + "'>שלח </a>" +
                        "</div>" +
                        "<div class='ms-srch-hover-action'>" +
                        "<a clicktype='ActionViewLibrary' id='" + resultID + "_item_hoverParentLink' class='ms-calloutLink ms-uppercase fontHeadFooter' title='פתח את הספריה המכילה את תוצאה זו' target='_blank' href='" + resultParentUrl + "'>הצג ספריה</a>" +
                        "</div>" +
                        "</div>";
                    return actionPanel;
                    break;
            }
        },

        ShowPopUp: function (i) {
            var popup = document.getElementById(i);
            popup.classList.toggle("show");
        },

        HidePopUp: function (i) {
            var popup = document.getElementById(i);
            popup.classList.remove("show");
        },

        DrawRefiners: function () {
            $('#searchResultsRef').append("<h3 class='fldHeadersH3'>מאפייני חיפוש</h3>");
            $.each(PMOClick.Search.GlobalVariables.Refiners, function (i, v) {
                $('#searchResultsRef').append(
                    "<h3 style='color:rgb(139,107,253);'>" +
                    v.Key +
                    "</h3>" +
                    "<p>" +
                    "<a id='ref" + i + "' class='refShowAll' style='display:none;' href='javascript:PMOClick.Search.Methods.ShowResultsByRefiner()'>הצג את כל התוצאות</a>" +
                    "</p>");
                $.each(v.Values, function (a, b) {
                    $('#searchResultsRef').append("<p><a class='refItem' id='"+b+"' href='javascript:PMOClick.Search.Methods.ShowResultsByRefiner(\"" + b + "\",\"" + i + "\")'>" + b + "</a></p>");
                });
            });
        },

        ShowResultsByRefiner: function (refiner, refinerType) {
            //Highlight choosen category
            $('.refItem').css({"color":"white","font-weight":"normal"});
            $('.refShowAll').css({"color":"white","font-weight":"normal"});
            //Clear Results area
            $('#searchResults').empty();

            if (PMOClick.Methods.IsNullOrUndefined(refiner)) {//Show all results
                PMOClick.Search.GlobalVariables.TempResultsArr = [];
                PMOClick.Search.Methods.BuildPagination(PMOClick.Search.GlobalVariables.TotalResults);
                PMOClick.Search.Methods.ChangePage(1, PMOClick.Search.GlobalVariables.TotalResults);
                $('.refShowAll').css('display', 'none');
            }
            else {//Show results by refiner
                document.getElementById(refiner).style.cssText = "color:#34a9eb;font-weight:bolder";
                var r = null;
                switch (refinerType) {
                    case "SPItemType"://extention
                        r = PMOClick.Search.Methods.GetExtensionForFileFriendlyName(refiner);
                        PMOClick.Search.GlobalVariables.TempResultsArr = PMOClick.Methods.FilterArrayByValue(PMOClick.Search.GlobalVariables.TotalResults, r, "FileType");
                        break;
                    case "SPListItemType"://contentClass
                        r = PMOClick.Search.Methods.GetContentClassByFriendlyName(PMOClick.Search.Methods.GetDeSerilizeContentClass(refiner));
                        PMOClick.Search.GlobalVariables.TempResultsArr = [];
                        $.each(r, function(i, v){
                            items = PMOClick.Methods.FilterArrayByValue(PMOClick.Search.GlobalVariables.TotalResults, v, "contentclass");
                            $.each(items, function(i, item){
                                PMOClick.Search.GlobalVariables.TempResultsArr.push(item);
                            })
                        })
                    default:
                        break;
                }

                PMOClick.Search.Methods.BuildPagination(PMOClick.Search.GlobalVariables.TempResultsArr);
                PMOClick.Search.Methods.ChangePage(1, PMOClick.Search.GlobalVariables.TempResultsArr);
                $('#ref' + refinerType).css('display', 'block');
            }
        },
        GetIconUrlByContentClass : function(item){
            if (item.contentclass === 'STS_ListItem_Contacts') {
                return SP.Utilities.VersionUtility.getImageUrl('CONTACTS.PNG');
            }
            else if (item.contentclass === 'STS_ListItem_Events') {
                return SP.Utilities.VersionUtility.getImageUrl('ALLMEET.GIF');
            }
            else if (item.contentclass === 'STS_ListItem_TasksWithTimelineAndHierarchy') {
                return SP.Utilities.VersionUtility.getImageUrl('completeallwftasks.gif');
            }
            else if (item.contentclass === 'STS_Web' || item.contentclass === 'STS_Site') {
                return SP.Utilities.VersionUtility.getImageUrl('mb_siteworkspace.png');
            }
            else if (item.contentclass === 'STS_List_850' || item.contentclass === 'STS_List_851') {
                return SP.Utilities.VersionUtility.getImageUrl('docset_welcomepage_big.png');
            }            
            else{
                return SP.Utilities.VersionUtility.getImageUrl('icon_data_Default.png');
            }
        },

        GetIconUrlByFileExtension: function (item, defaultIconPath) {
            if (item && !PMOClick.Search.Methods.IsNullOrUndefined(item.FileExtension)) {
                var friendlyNameForFileExtension = PMOClick.Search.Methods.GetFriendlyNameForFileExtension(item.FileExtension.toString());
                if(friendlyNameForFileExtension === 'file_WebPage'){
                    return PMOClick.Search.Methods.GetIconUrlByContentClass(item);
                }
                if (friendlyNameForFileExtension === 'file_Word') {
                    return SP.Utilities.VersionUtility.getImageUrl('icdocx.png');
                }
                else if (friendlyNameForFileExtension === 'file_PowerPoint') {
                    return SP.Utilities.VersionUtility.getImageUrl('icpptx.png');
                }
                else if (friendlyNameForFileExtension === 'file_Excel') {
                    return SP.Utilities.VersionUtility.getImageUrl('icxlsx.png');
                }
                else if (friendlyNameForFileExtension === 'file_OneNote') {
                    return SP.Utilities.VersionUtility.getImageUrl('icone.png');
                }
                else if (friendlyNameForFileExtension === 'file_Visio') {
                    return SP.Utilities.VersionUtility.getImageUrl('icvisiogeneric.png');
                }
                else if (friendlyNameForFileExtension === 'file_InfoPath') {
                    return SP.Utilities.VersionUtility.getImageUrl('icinfopathgeneric.png');
                }
                else if (friendlyNameForFileExtension === 'file_Access') {
                    return SP.Utilities.VersionUtility.getImageUrl('icaccdb.png');
                }
                else if (friendlyNameForFileExtension === 'file_Publisher') {
                    return SP.Utilities.VersionUtility.getImageUrl('icpub.png');
                }
                else if (friendlyNameForFileExtension === 'file_PDF') {
                    return SP.Utilities.VersionUtility.getImageUrl('icpdf.png');
                }
                else if (friendlyNameForFileExtension === 'file_Mail') {
                    return SP.Utilities.VersionUtility.getImageUrl('icmsg.png');
                }
            }
            if (!PMOClick.Search.Methods.IsNullOrUndefined(defaultIconPath)) {
                return defaultIconPath;
            }
            return SP.Utilities.VersionUtility.getImageUrl('html16.png');
        },

        GetIconClassByExtension : function(item){
            if (item.contentclass === 'STS_ListItem_Contacts') {
                return SP.Utilities.VersionUtility.getImageUrl('CONTACTS.PNG');
            }
            else if (item.contentclass === 'STS_ListItem_Events') {
                return SP.Utilities.VersionUtility.getImageUrl('ALLMEET.GIF');
            }
            else if (item.contentclass === 'STS_ListItem_TasksWithTimelineAndHierarchy') {
                return SP.Utilities.VersionUtility.getImageUrl('completeallwftasks.gif');
            }
            else if (item.contentclass === 'STS_Web' || item.contentclass === 'STS_Site') {
                return SP.Utilities.VersionUtility.getImageUrl('mb_siteworkspace.png');
            }
            else if (item.contentclass === 'STS_List_850' || item.contentclass === 'STS_List_851') {
                return SP.Utilities.VersionUtility.getImageUrl('docset_welcomepage_big.png');
            }            
            else{
                return SP.Utilities.VersionUtility.getImageUrl('icon_data_Default.png');
            }
        },

        GetIconClassByExtension: function (item, defaultIconPath) {
            if (item && !PMOClick.Search.Methods.IsNullOrUndefined(item.FileExtension)) {
                var friendlyNameForFileExtension = PMOClick.Search.Methods.GetFriendlyNameForFileExtension(item.FileExtension.toString());
                if(friendlyNameForFileExtension === 'file_WebPage'){
                    return "ms-BrandIcon--delve";
                }
                if (friendlyNameForFileExtension === 'file_Word') {
                    return "ms-BrandIcon--word";
                }
                else if (friendlyNameForFileExtension === 'file_PowerPoint') {
                    return "ms-BrandIcon--powerpoint";
                }
                else if (friendlyNameForFileExtension === 'file_Excel') {
                    return "ms-BrandIcon--excel";
                }
                else if (friendlyNameForFileExtension === 'file_OneNote') {
                    return "ms-BrandIcon--onenote";
                }
                else if (friendlyNameForFileExtension === 'file_Visio') {
                    return "ms-BrandIcon--visio";
                }
                else if (friendlyNameForFileExtension === 'file_InfoPath') {
                    return "ms-BrandIcon--forms";
                }
                else if (friendlyNameForFileExtension === 'file_Access') {
                    return "ms-BrandIcon--access";
                }
                else if (friendlyNameForFileExtension === 'file_Publisher') {
                    return "ms-BrandIcon--onenote";
                }
                else if (friendlyNameForFileExtension === 'file_PDF') {
                    return "ms-BrandIcon--pdf";
                }
                else if (friendlyNameForFileExtension === 'file_Mail') {
                    return "ms-BrandIcon--outlook";
                }
            }
            if (!PMOClick.Search.Methods.IsNullOrUndefined(defaultIconPath)) {
                return defaultIconPath;
            }
            return SP.Utilities.VersionUtility.getImageUrl('html16.png');
        },

        GetIconByContentClass: function(item){
            if (item.contentclass === 'STS_ListItem_Contacts') {
                return "ms-Icon--ContactInfo";
            }
            else if (item.contentclass === 'STS_ListItem_Events') {
                return "ms-Icon--Event";
            }
            else if (item.contentclass === 'STS_ListItem_Tasks') {
                return "ms-Icon--TaskSolid";
            }
            else if (item.contentclass === 'STS_ListItem_Survey') {
                return "ms-Icon--SurveyQuestions";
            }
            else if (item.contentclass === 'STS_ListItem_TasksWithTimelineAndHierarchy') {
                return "ms-Icon--TaskLogo";            
            }
            else if (item.contentclass === 'STS_Web' || item.contentclass === 'STS_Site' || item.contentclass === 'STS_List_850' || item.contentclass === 'STS_List_851') {
                return "ms-Icon--FileASPX";
            }     
            else{
                return "ms-Icon--Globe";
            }
        },

        GetIconClassByExtension2: function (item, defaultIconPath) {
            if (item && !PMOClick.Search.Methods.IsNullOrUndefined(item.FileExtension)) {
                var friendlyNameForFileExtension = PMOClick.Search.Methods.GetFriendlyNameForFileExtension(item.FileExtension.toString());
                if(friendlyNameForFileExtension === 'file_WebPage'){
                    return PMOClick.Search.Methods.GetIconByContentClass(item);
                }
                if (friendlyNameForFileExtension === 'file_Word') {
                    return "ms-Icon--WordDocument";
                }
                else if (friendlyNameForFileExtension === 'file_PowerPoint') {
                    return "ms-Icon--PowerPointDocument";
                }
                else if (friendlyNameForFileExtension === 'file_Excel') {
                    return "ms-Icon--ExcelLogo";
                }
                else if (friendlyNameForFileExtension === 'file_OneNote') {
                    return "ms-Icon--OneNoteLogo";
                }
                else if (friendlyNameForFileExtension === 'file_Visio') {
                    return "ms-Icon--VisioDocument";
                }
                else if (friendlyNameForFileExtension === 'file_InfoPath' || friendlyNameForFileExtension === 'file_XML') {
                    return "ms-Icon--OfficeFormsLogo";
                }
                else if (friendlyNameForFileExtension === 'file_Access') {
                    return "ms-Icon--AccessLogo";
                }
                else if (friendlyNameForFileExtension === 'file_Publisher') {
                    return "ms-Icon--PublisherLogo";
                }
                else if (friendlyNameForFileExtension === 'file_PDF') {
                    return "ms-Icon--PDF";
                }
                else if (friendlyNameForFileExtension === 'file_Mail') {
                    return "ms-Icon--Mail";
                }
            }
            if (!PMOClick.Search.Methods.IsNullOrUndefined(defaultIconPath)) {
                return defaultIconPath;
            }
            return "ms-Icon--Website";
        },

        GetContentClassByFriendlyName: function (fName) {
            if (!PMOClick.Search.Methods.IsNullOrUndefined(fName)) {
                if ("STS_List_850".indexOf(fName) > -1 || "STS_ListItem_850".indexOf(fName) > -1) {// Page Library and Page Library list
                    return ["STS_List_850", "STS_ListItem_850"];
                }
                if ("STS_List_Survey".indexOf(fName) > -1 || "STS_ListItem_Survey".indexOf(fName) > -1) {// Survey List and Survey List Item
                    return ["STS_List_Survey", "STS_ListItem_Survey"];
                }
                if ("STS_List_Announcements".indexOf(fName) > -1 || "STS_ListItem_Announcements".indexOf(fName) > -1) {//Announcements List and Announcements List Item
                    return ["STS_List_Announcements", "STS_ListItem_Announcements"];
                }
                if ("STS_List_Contacts".indexOf(fName) > -1 || "STS_ListItem_Contacts".indexOf(fName) > -1) {//Contacts List and Contacts List Item
                    return ["STS_List_Contacts", "STS_ListItem_Contacts"];
                }
                if ("STS_List_DiscussionBoard".indexOf(fName) > -1 || "STS_ListItem_DiscussionBoard".indexOf(fName) > -1) {//DiscussionBoard List and DiscussionBoard List Item
                    return ["STS_List_DiscussionBoard", "STS_ListItem_DiscussionBoard"];
                }
                if ("STS_ListItem_Task".indexOf(fName) > -1 || "STS_List_Tasks".indexOf(fName) > -1) {
                    return ["STS_ListItem_Tasks", "STS_List_Tasks"];
                }
                if ("STS_Site".indexOf(fName) > -1 || "STS_Web".indexOf(fName) > -1) {
                    return ["STS_Site", "STS_Web"];
                }
                if ("STS_List".indexOf(fName) > -1) {
                    return ["STS_List"];
                }
                if ("STS_List_Events".indexOf(fName) > -1 || "STS_ListItem_Events".indexOf(fName) > -1) {
                    return ["STS_List_Events", "STS_ListItem_Events"];
                }
                if ("STS_ListItem_GenericList".indexOf(fName) > -1 || "STS_List_GenericList".indexOf(fName) > -1) {
                    return ["STS_ListItem_GenericList", "STS_List_GenericList"];
                }
                if ("STS_ListItem_DocumentLibrary".indexOf(fName) > -1 || "STS_List_DocumentLibrary".indexOf(fName) > -1) {
                    return ["STS_ListItem_DocumentLibrary", "STS_List_DocumentLibrary"];
                }
                if ("STS_List_WebPageLibrary".indexOf(fName) > -1 || "STS_ListItem_WebPageLibrary".indexOf(fName) > -1) {
                    return ["STS_List_WebPageLibrary", "STS_ListItem_WebPageLibrary"];
                }
                if ("STS_ListItem_XMLForm".indexOf(fName) > -1 || "STS_List_XMLForm".indexOf(fName) > -1) {
                    return ["STS_ListItem_XMLForm", "STS_List_XMLForm"];
                }
                if ("STS_ListItem_Links".indexOf(fName) > -1 || "STS_List_Links".indexOf(fName) > -1) {
                    return ["STS_ListItem_Links", "STS_List_Links"];
                }
                if ("STS_ListItem_IssueTracking".indexOf(fName) > -1 || "STS_List_IssueTracking".indexOf(fName) > -1) {
                    return ["STS_ListItem_IssueTracking", "STS_List_IssueTracking"];
                }
                if ("STS_ListItem_GanttTasks".indexOf(fName) > -1 || "STS_List_GanttTasks".indexOf(fName) > -1) {
                    return ["STS_ListItem_GanttTasks", "STS_List_GanttTasks"];
                }
                if ("STS_ListItem_PictureLibrary".indexOf(fName) > -1 || "STS_List_PictureLibrary".indexOf(fName) > -1) {
                    return ["STS_ListItem_PictureLibrary", "STS_List_PictureLibrary"];
                }
                else {
                    return ["STS_ListItem_GenericList", "STS_List_GenericList"];
                }
            }
        },

        GetExtensionForFileFriendlyName: function (fileExtension) {
            if (!PMOClick.Search.Methods.IsNullOrUndefined(fileExtension)) {
                if ("file_Mail" === 'file_' + fileExtension) {
                    return 'msg';
                }
                if ("file_PDF" === 'file_' + fileExtension) {
                    return 'pdf';
                }
                if ("file_Publisher" === 'file_' + fileExtension) {
                    return 'pub';
                }
                if ("file_Access" === 'file_' + fileExtension) {
                    return 'msg';
                }
                if ("file_InfoPath" === 'file_' + fileExtension) {
                    return 'xsn';
                }
                if ("file_Visio" === 'file_' + fileExtension) {
                    return 'vsd';
                }
                if ("file_OneNote" === 'file_' + fileExtension) {
                    return 'one';
                }
                if ("file_Excel" === 'file_' + fileExtension) {
                    return 'xlsx';
                }
                if ("file_PowerPoint" === 'file_' + fileExtension) {
                    return 'pptx';
                }
                if ("file_Word" === 'file_' + fileExtension) {
                    return 'docx';
                }
                if ("file_WebPage" === 'file_' + fileExtension) {
                    PMOClick.Search.Methods.IsWebPage(fileExtension)
                }
                if ("file_XML" === 'file_' + fileExtension) {
                    return 'xml';
                }
                if ("file_Text" === 'file_' + fileExtension) {
                    return 'txt';
                }
            }
            return 'html';
        },

        GetFriendlyNameForFileExtension: function (fileExtension) {
            if (!PMOClick.Search.Methods.IsNullOrUndefined(fileExtension)) {
                fileExtension = fileExtension.toLowerCase();
                if (fileExtension === 'css') {
                    return 'file_CSS';
                }
                else if (fileExtension === 'hlp') {
                    return 'file_Help';
                }
                else if (fileExtension === 'msi' || fileExtension === 'msp') {
                    return 'file_Installer';
                }
                else if (fileExtension === 'js' || fileExtension === 'jse') {
                    return 'file_JavaScript';
                }
                else if (fileExtension === 'log') {
                    return 'file_Log';
                }
                else if (fileExtension === 'eml' || fileExtension === 'msg') {
                    return 'file_Mail';
                }
                else if (fileExtension === 'accdb' || fileExtension === 'accdt' || fileExtension === 'accdc' || fileExtension === 'accde' || fileExtension === 'accdr') {
                    return 'file_Access';
                }
                else if (fileExtension === 'odc' || fileExtension === 'xls' || fileExtension === 'xlsb' || fileExtension === 'xlsm' || fileExtension === 'xlsx' || fileExtension === 'xlt' || fileExtension === 'xltb' || fileExtension === 'xltm' || fileExtension === 'xltx') {
                    return 'file_Excel';
                }
                else if (fileExtension === 'xsn') {
                    return 'file_InfoPath';
                }
                else if (fileExtension === 'one' || fileExtension === 'onepkg' || fileExtension === 'onetoc2') {
                    return 'file_OneNote';
                }
                else if (fileExtension === 'pot' || fileExtension === 'potm' || fileExtension === 'potx' || fileExtension === 'pps' || fileExtension === 'ppsm' || fileExtension === 'ppsx' || fileExtension === 'ppt' || fileExtension === 'pptm' || fileExtension === 'pptx') {
                    return 'file_PowerPoint';
                }
                else if (fileExtension === 'mpp' || fileExtension === 'mpt') {
                    return 'file_Project';
                }
                else if (fileExtension === 'pub') {
                    return 'file_Publisher';
                }
                else if (fileExtension === 'ascx' || fileExtension === 'master') {
                    return 'file_SPDesigner';
                }
                else if (fileExtension === 'vdw' || fileExtension === 'vdx' || fileExtension === 'vsd' || fileExtension === 'vsl' || fileExtension === 'vss' || fileExtension === 'vst' || fileExtension === 'vsu' || fileExtension === 'vsw' || fileExtension === 'vsx' || fileExtension === 'vtx') {
                    return 'file_Visio';
                }
                else if (fileExtension === 'doc' || fileExtension === 'docm' || fileExtension === 'docx' || fileExtension === 'dot' || fileExtension === 'dotm' || fileExtension === 'dotx' || fileExtension === 'mht' || fileExtension === 'mhtml') {
                    return 'file_Word';
                }
                else if (fileExtension === 'xps') {
                    return 'file_XPS';
                }
                else if (fileExtension === 'wm' || fileExtension === 'wma' || fileExtension === 'wmd' || fileExtension === 'wmp' || fileExtension === 'wms' || fileExtension === 'wmv' || fileExtension === 'wmx' || fileExtension === 'wmz') {
                    return 'file_Audio';
                }
                else if (fileExtension === 'rtf') {
                    return 'file_RTF';
                }
                else if (fileExtension === 'txt') {
                    return 'file_Text';
                }
                else if (PMOClick.Search.Methods.IsWebPage(fileExtension)) {
                    return 'file_WebPage';
                }
                else if (fileExtension === 'xml') {
                    return 'file_XML';
                }
                else if (fileExtension === 'xsl' || fileExtension === 'xslt') {
                    return 'file_XSL';
                }
                else if (fileExtension === 'zip') {
                    return 'file_Zip';
                }
                else if (fileExtension === 'pdf') {
                    return 'file_PDF';
                }
            }
            return 'file_Document';
        },

        IsNullOrUndefined: function (str) {
            if (PMOClick.Methods.IsNullOrUndefined(str)) {
                return true;
            }
            else {
                return PMOClick.Methods.isNullOrEmptyString(str.trim());
            }
        },

        IsWebPage: function (fileExtension) {
            if (PMOClick.Search.Methods.IsNullOrUndefined(fileExtension)) {
                return false;
            }
            fileExtension = fileExtension.toLowerCase();
            return fileExtension === 'ascx' || fileExtension === 'asp' || fileExtension === 'aspx' || fileExtension === 'htm' || fileExtension === 'html' || fileExtension === 'jhtml' || fileExtension === 'js' || fileExtension === 'mht' || fileExtension === 'mhtml' || fileExtension === 'mspx' || fileExtension === 'php';
        },


        BuildPagination: function (currentArr) {
            $('.pagination').empty()//Clear container
            //Get Number of Pages
            var a = PMOClick.Search.Methods.NumPages(currentArr);
            var anchorTag = "";
            if (currentArr > 0) {//Refiner result array not empty
                anchorTag = currentArr;
            }
            else {
                anchorTag = PMOClick.Search.GlobalVariables.ResultsArr;
            }

            $('.pagination').append('<a id="btn_prev" href="javascript:PMOClick.Search.Methods.PrevPage()">&raquo;</a>'); //Draw Prev Button
            for (var i = 1; i <= a; i++) {
                $('.pagination').append('<a id="p' + i + '" class="pageNumber" href="javascript:PMOClick.Search.Methods.ChangePage(' + i + ')">&nbsp;&nbsp;' + i  + '&nbsp;&nbsp;</a>');
            }
            $('#p1').addClass("pageActive"); //Hihglight first page
            $('.pagination').append('<a id="btn_next" href="javascript:PMOClick.Search.Methods.NextPage()">&laquo;</a>'); //Draw Next Button
        }
    }
}