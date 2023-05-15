const searchObject = {
    GlobalVariables: {
        CurrentPage: 1,
        RecordsPerPage: 10,
        ResultsArr: [],
        TempResultsArr: [],
        TotalResults: [],
        TempResultsArr: [],
        Refiners: [
            SPItemType = {
                Key: "סוגי מסמכים",
                Values: []
            },
            SPListItemType = {
                Key: "סוגי פריטים",
                Values: []
            }
        ]

    }
}

const getSearchResults = async() => {
    //Clear DOM
    clearSearchComponents();
    //Clear results array and refiners
    searchObject.GlobalVariables.TotalResults = [];
    searchObject.GlobalVariables.TempResultsArr = [];
    for (const ref of searchObject.GlobalVariables.Refiners) {
        ref.Values = [];
    }

    const querytext = document.getElementById('inptxtSearchBox').value;
    const searchResults = document.getElementById('searchResults');
    const resultsCount = document.getElementById('resultsCount');
    //with sourceid
    const requestUri = buildSearchQuery(`querytext='"${querytext}"'`, "&rowlimit=500", "&selectproperties='Title,Description,HitHighlightedSummary,contentclass,FileType,Created,CreatedBy,FileExtension,Path,LastModifiedTime,OriginalPath,ParentLink,ServerRedirectedEmbedURL,ServerRedirectedPreviewURL,ServerRedirectedURL,UniqueId,IsContainer'", null, "&trimduplicates=false");
    const items = await getData(requestUri);
    //without sourceid
    //var items = PMOClick.Methods.RequestResultsFromSearchAPI("querytext='" + querytext + "'", "&rowlimit=500", "&selectproperties='Title,Description,HitHighlightedSummary,contentclass,FileType,Created,CreatedBy,FileExtension,Path,LastModifiedTime,OriginalPath,ParentLink,ServerRedirectedEmbedURL,ServerRedirectedPreviewURL,ServerRedirectedURL,UniqueId,IsContainer'", null, "&trimduplicates=false");
    if (items.PrimaryQueryResult.RelevantResults.Table.Rows.length > 0) {
        initSearchResults(items);
        resultsCount.innerHTML = items.PrimaryQueryResult.RelevantResults.TotalRows;
    } else {
        searchResults.innerHTML =
            `<div class='resultTitle'>
            לא נמצאו תוצאות
        </div>`;
        resultsCount.innerHTML = 0
    }
}

const initSearchResults = (items) => {
    for (const item of items.PrimaryQueryResult.RelevantResults.Table.Rows) {
        let result = {
            DocId: item.Cells[1].Value,
            Title: item.Cells[2].Value,
            Description: item.Cells[3].Value,
            HitHighlightedSummary: item.Cells[4].Value,
            contentclass: item.Cells[5].Value,
            FileType: item.Cells[6].Value,
            Created: (item.Cells[7].Value === null) ? "" : item.Cells[7].Value,
            CreatedBy: (item.Cells[8].Value === null) ? "" : item.Cells[8].Value,
            FileExtension: item.Cells[9].Value,
            Path: item.Cells[10].Value,
            LastModifiedTime: (item.Cells[11].Value === null) ? "" : item.Cells[11].Value,
            OriginalPath: item.Cells[12].Value,
            ParentLink: item.Cells[13].Value,
            ServerRedirectedEmbedURL: item.Cells[14].Value,
            ServerRedirectedPreviewURL: item.Cells[15].Value,
            ServerRedirectedURL: item.Cells[16].Value,
            UniqueId: item.Cells[17].Value,
            IsContainer: item.Cells[18].Value
        }

        searchObject.GlobalVariables.TotalResults.push(result);

        //Get Refiners 
        if (result.FileExtension != null) {
            buildRef(getFriendlyNameForFileExtension(result.FileExtension.toString()), searchObject.GlobalVariables.Refiners[0].Values, searchObject.GlobalVariables.Refiners[0].Key);
        }
        if (result.contentclass != null) {
            buildRef(result.contentclass.toString(), searchObject.GlobalVariables.Refiners[1].Values, searchObject.GlobalVariables.Refiners[1].Key);
        }
    }
    //Build Pagination element
    buildPagination(searchObject.GlobalVariables.TotalResults);
    // Init Pagination
    changePage(1, searchObject.GlobalVariables.TotalResults);
    //Draw Refiners
    drawRefiners();
    //DrawSearch Results    
}

const buildRef = (itemType, refArr, refKey) => {
    if (refArr.length > 0) {
        if (refKey == "סוגי פריטים") {
            let arr = refArr.filter(x => x === getSerilizeContentClass(itemType));
            if (arr.length === 0) {
                refArr.push(getSerilizeContentClass(itemType));
            }
        } else {
            let itemSplit = itemType.split('_');
            let itemTypeStr = itemSplit[1];
            let arr = refArr.filter(x => x === itemTypeStr);
            if (arr.length === 0) {
                refArr.push(itemTypeStr);

            }
        }
    } else {
        if (refKey == "סוגי פריטים") {
            refArr.push(getSerilizeContentClass(itemType));
        } else {
            let itemSplit = itemType.split('_');
            let itemTypeStr = itemSplit[1];
            refArr.push(itemTypeStr);
        }
    }
}

const getFriendlyNameForFileExtension = (fileExtension) => {
    if (!isNullOrEmpty(fileExtension)) {
        fileExtension = fileExtension.toLowerCase();
        if (fileExtension === 'css') {
            return 'file_CSS';
        } else if (fileExtension === 'hlp') {
            return 'file_Help';
        } else if (fileExtension === 'msi' || fileExtension === 'msp') {
            return 'file_Installer';
        } else if (fileExtension === 'js' || fileExtension === 'jse') {
            return 'file_JavaScript';
        } else if (fileExtension === 'log') {
            return 'file_Log';
        } else if (fileExtension === 'eml' || fileExtension === 'msg') {
            return 'file_Mail';
        } else if (fileExtension === 'accdb' || fileExtension === 'accdt' || fileExtension === 'accdc' || fileExtension === 'accde' || fileExtension === 'accdr') {
            return 'file_Access';
        } else if (fileExtension === 'odc' || fileExtension === 'xls' || fileExtension === 'xlsb' || fileExtension === 'xlsm' || fileExtension === 'xlsx' || fileExtension === 'xlt' || fileExtension === 'xltb' || fileExtension === 'xltm' || fileExtension === 'xltx') {
            return 'file_Excel';
        } else if (fileExtension === 'xsn') {
            return 'file_InfoPath';
        } else if (fileExtension === 'one' || fileExtension === 'onepkg' || fileExtension === 'onetoc2') {
            return 'file_OneNote';
        } else if (fileExtension === 'pot' || fileExtension === 'potm' || fileExtension === 'potx' || fileExtension === 'pps' || fileExtension === 'ppsm' || fileExtension === 'ppsx' || fileExtension === 'ppt' || fileExtension === 'pptm' || fileExtension === 'pptx') {
            return 'file_PowerPoint';
        } else if (fileExtension === 'mpp' || fileExtension === 'mpt') {
            return 'file_Project';
        } else if (fileExtension === 'pub') {
            return 'file_Publisher';
        } else if (fileExtension === 'ascx' || fileExtension === 'master') {
            return 'file_SPDesigner';
        } else if (fileExtension === 'vdw' || fileExtension === 'vdx' || fileExtension === 'vsd' || fileExtension === 'vsl' || fileExtension === 'vss' || fileExtension === 'vst' || fileExtension === 'vsu' || fileExtension === 'vsw' || fileExtension === 'vsx' || fileExtension === 'vtx') {
            return 'file_Visio';
        } else if (fileExtension === 'doc' || fileExtension === 'docm' || fileExtension === 'docx' || fileExtension === 'dot' || fileExtension === 'dotm' || fileExtension === 'dotx' || fileExtension === 'mht' || fileExtension === 'mhtml') {
            return 'file_Word';
        } else if (fileExtension === 'xps') {
            return 'file_XPS';
        } else if (fileExtension === 'wm' || fileExtension === 'wma' || fileExtension === 'wmd' || fileExtension === 'wmp' || fileExtension === 'wms' || fileExtension === 'wmv' || fileExtension === 'wmx' || fileExtension === 'wmz') {
            return 'file_Audio';
        } else if (fileExtension === 'rtf') {
            return 'file_RTF';
        } else if (fileExtension === 'txt') {
            return 'file_Text';
        } else if (isWebPage(fileExtension)) {
            return 'file_WebPage';
        } else if (fileExtension === 'xml') {
            return 'file_XML';
        } else if (fileExtension === 'xsl' || fileExtension === 'xslt') {
            return 'file_XSL';
        } else if (fileExtension === 'zip') {
            return 'file_Zip';
        } else if (fileExtension === 'pdf') {
            return 'file_PDF';
        }
    }
    return 'file_Document';
}

const buildPagination = (currentArr) => {
    let pagePanel = document.getElementById('paginationPanel');
    //Clear container
    pagePanel.innerHTML = "";
    //Get Number of Pages
    var a = calculatePages(currentArr);
    var anchorTag = "";
    if (currentArr > 0) { //Refiner result array not empty
        anchorTag = currentArr;
    } else {
        anchorTag = searchObject.GlobalVariables.ResultsArr;
    }
    //Draw Prev Button
    pagePanel.innerHTML += `<a id="btn_prev" title="הקודם" href="javascript:prevPage()">&raquo;</a>`;
    for (var i = 1; i <= a; i++) {
        pagePanel.innerHTML += `<a id="p${i}" class="pageNumber" href="javascript:changePage('${i}')">&nbsp;&nbsp;${i}&nbsp;&nbsp;</a>`;
    }
    //Hihglight first page
    document.getElementById('p1').classList.add("pageActive");
    //Draw Next Button
    pagePanel.innerHTML += `<a id="btn_next" title="הבא" href="javascript:nextPage()">&laquo;</a>`;
}

const calculatePages = (searchResultArray) => {
    if (isNullOrEmpty(searchResultArray)) {
        searchResultArray = searchObject.GlobalVariables.TotalResults;
    }
    var numberOgPages = Math.ceil(searchResultArray.length / searchObject.GlobalVariables.RecordsPerPage); //The ceil() method rounds a number UPWARDS to the nearest integer, and returns the result.
    if (numberOgPages > 10) {//Max resutls from sharepoint search is 500 (limitaion by product group)
        return 10; //Maximum
    } else {
        return numberOgPages;
    }
}

const isWebPage = (fileExtension) => {
    if (isNullOrEmpty(fileExtension)) {
        return false;
    }
    fileExtension = fileExtension.toLowerCase();
    return fileExtension === 'ascx' || fileExtension === 'asp' || fileExtension === 'aspx' || fileExtension === 'htm' || fileExtension === 'html' || fileExtension === 'jhtml' || fileExtension === 'js' || fileExtension === 'mht' || fileExtension === 'mhtml' || fileExtension === 'mspx' || fileExtension === 'php';
}

const getSerilizeContentClass = (cc) => {
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
    } else {
        return "אחר...";
    }
}

const clearSearchComponents = () => {
    clearSearchResultArea(); //Check 20.7.2022
    //(isEmpty(document.getElementById('paginationPanel'))) ? false: 
    document.getElementById('paginationPanel').innerHTML = "";
    //(isEmpty(document.getElementById('searchResultsRef'))) ? false: 
    document.getElementById('searchResultsRef').innerHTML = "";
}

const clearSearchResultArea = () => {
    var searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";
}


const drawRefiners = () => {
    let refinersContainer = document.getElementById("searchResultsRef");
    refinersContainer.innerHTML = `<h3 class='fldHeadersH3'>מאפייני חיפוש</h3>`;
    for (const refiner of searchObject.GlobalVariables.Refiners) {
        refinersContainer.innerHTML +=
            `<h3 class='fldSubHeaderH3'>
                ${refiner.Key}
            </h3>
            <p>
                <a id='ref_${refiner.Key}' class='refShowAll' style='display:none;' href='javascript:showResultsByRefiner()'>הצג את כל התוצאות</a>
            </p>`;
        for (const ref of refiner.Values) {
            refinersContainer.innerHTML +=
                `<p>
                    <a class='refItem' id='${ref}' href='javascript:showResultsByRefiner("${ref}","${refiner.Key}")'>${ref}</a>
                </p>`;
        }
    }
}

const showResultsByRefiner = (refiner, refinerType) => {
    const resultsCount = document.getElementById('resultsCount');
    const searchResults = document.getElementById('searchResults');
    const refItem = document.getElementsByClassName('refItem');
    const refShowAll = document.getElementById('refShowAll');
    //Clear Results area
    searchResults.innerHTML = "";

    if (isNullOrEmpty(refiner)) { //Show all results
        searchObject.GlobalVariables.TempResultsArr = [];
        buildPagination(searchObject.GlobalVariables.TotalResults);
        changePage(1, searchObject.GlobalVariables.TotalResults);
        document.getElementById(`ref_${refinerType}`).style.display = none;
    } else { //Show results by refiner
        document.getElementById(refiner).style.cssText = "color:#34a9eb;font-weight:bolder";
        var r = null;
        switch (refinerType) {
            case "סוגי מסמכים": //extention
                r = getExtensionForFileFriendlyName(refiner);
                searchObject.GlobalVariables.TempResultsArr = searchObject.GlobalVariables.TotalResults.filter(x => x.FileType === r);
                break;
            case "סוגי פריטים": //contentClass
                r = getContentClassByFriendlyName(getDeSerilizeContentClass(refiner));
                searchObject.GlobalVariables.TempResultsArr = [];
                for (const itemType of r) {
                    let temp = searchObject.GlobalVariables.TotalResults.filter(x => x.contentclass === itemType);
                    searchObject.GlobalVariables.TempResultsArr = searchObject.GlobalVariables.TempResultsArr.concat(temp);
                }
                break;
            default:
                break;
        }

        resultsCount.innerHTML = searchObject.GlobalVariables.TempResultsArr.length;
        buildPagination(searchObject.GlobalVariables.TempResultsArr);
        changePage(1, searchObject.GlobalVariables.TempResultsArr);
    }
}


const changePage = (page, currentArr) => {
    clearSearchResultArea();

    if (isNullOrEmpty(currentArr)) {
        if (searchObject.GlobalVariables.TempResultsArr.length > 0) {
            currentArr = searchObject.GlobalVariables.TempResultsArr;
        } else {
            currentArr = searchObject.GlobalVariables.TotalResults;
        }
    }
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");

    // Validate page
    if (page < 1) page = 1;
    if (page > calculatePages(currentArr)) page = calculatePages(currentArr);

    var recordsPerPage = (currentArr.length / page);
    if (searchObject.GlobalVariables.RecordsPerPage < recordsPerPage) {
        recordsPerPage = searchObject.GlobalVariables.RecordsPerPage;
    }
    for (var i = (page - 1) * searchObject.GlobalVariables.RecordsPerPage; i < (page * recordsPerPage); i++) {
        if (!(searchObject.GlobalVariables.TotalResults[i] === undefined)) { //Check if there is results that are undefined, this is for the last page
            //searchResults.innerHTML += searchObject.GlobalVariables.ResultsArr[i] + "<br>";
            drawResult(currentArr[i], i);
        }
    }
    //Hide-Show Buttons (Prev/Next)
    if (page == 1 || page == 0) {
        btn_prev.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
    }

    if (page == calculatePages(currentArr)) {
        btn_next.style.visibility = "hidden";
    } else {
        btn_next.style.visibility = "visible";
    }

    hihglightPageNumber(page);
}

const prevPage = () => {
    if (searchObject.GlobalVariables.CurrentPage > 1) {
        document.getElementById(`p${searchObject.GlobalVariables.CurrentPage}`).classList.remove('pageActive');
        searchObject.GlobalVariables.CurrentPage--;
        document.getElementById(`p${searchObject.GlobalVariables.CurrentPage}`).classList.add('pageActive');
        if (searchObject.GlobalVariables.TempResultsArr.length > 0) { //Refiner result array not empty
            changePage(searchObject.GlobalVariables.CurrentPage, searchObject.GlobalVariables.TempResultsArr);
        } else {
            changePage(searchObject.GlobalVariables.CurrentPage);
        }
    }
}

const nextPage = () => {
    if (searchObject.GlobalVariables.CurrentPage < calculatePages()) {
        document.getElementById(`p${searchObject.GlobalVariables.CurrentPage}`).classList.remove('pageActive');
        searchObject.GlobalVariables.CurrentPage++;
        document.getElementById(`p${searchObject.GlobalVariables.CurrentPage}`).classList.add('pageActive');
        if (searchObject.GlobalVariables.TempResultsArr.length > 0) { //Refiner result array not empty
            changePage(searchObject.GlobalVariables.CurrentPage, searchObject.GlobalVariables.TempResultsArr);
        } else {
            changePage(searchObject.GlobalVariables.CurrentPage);
        }
    }
}

const hihglightPageNumber = (pageNumber) => {
    searchObject.GlobalVariables.CurrentPage = pageNumber; //Change the current page to the new page
    let a = document.getElementsByClassName('pageNumber pageActive');
    a[0].classList.remove('pageActive');
    document.getElementById(`p${pageNumber}`).classList.add('pageActive');
}

const drawResult = (v, i) => {
    var itemID = v.contentclass + "_" + v.DocId;
    var previewUrl, oosRedirectUrl = null;
    var isContainer = (v.IsContainer === 'true');
    //Check if the result has OOS url
    if (isNullOrEmpty(v.ServerRedirectedEmbedURL)) {
        previewUrl = oosRedirectUrl = v.Path;
    } else {
        previewUrl = v.ServerRedirectedEmbedURL;
        oosRedirectUrl = v.ServerRedirectedURL;
    }
    var iframePreview = getIframePreview(itemID, previewUrl);
    // var itemIcon = searchObject.Methods.GetIconUrlByFileExtension(v);
    // var BrandIconClass=searchObject.Methods.GetIconClassByExtension(v);
    var MsIconClass = getIconClassByExtension2(v);
    var resultSummary = "";
    if (!isNullOrEmpty(v.HitHighlightedSummary)) {
        resultSummary = v.HitHighlightedSummary; // + "</br>";
    }
    var showInLib = v.Path; //'#'; 
    if (v.ParentLink != null) {
        showInLib = v.ParentLink + '?view=7&q=' + v.Title;
    }

    var hoverClass = getHoverClass(v.FileType);
    var result =
        `<div id="${itemID}" style="position:relative; display:block;" name="Item" data-displaytemplate="PDFItem" class="ms-srch-item spResult" onmouseover="showHP('${itemID}')" onmouseout="hideHP('${itemID}')" >        
            <div id="${itemID}_itemBody" class="ms-srch-item-body itemResultBody" onclick="EnsureScriptParams('SearchUI.js', 'HP.Show', 'itemID', '${itemID}_hover', '~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fSearch\u002fItem_PDF_HoverPanel.js', false);">
                <!--Result Icon -->
                <div class="spResult-icon">
                    <span style='color:#ffffff;font-size:20px;'>
                        <i class='ms-Icon  ${MsIconClass}' aria-hidden='true' height='30px' width='30px' ></i>
                    </span>
                </div>
                <!--Result Title-->
                <div id="${itemID}_itemTitle" class="spResult-title">
                    <h3 class="ms-srch-ellipsis">
                        <a class="titleResult" clicktype="Result" id="${itemID}_itemTitleLink" href="javascript:window.open('${v.Path}');"  class="resultTitle ms-srch-item-link" >
                            ${v.Title}
                        </a>
                    </h3>
                </div> 
                <!--Result Summary (Short Description)-->
                <div id="${itemID}_itemSummary" class="itemResultSummary ms-srch-item-summary" >
                    ${resultSummary}
                </div>
                <div id="${itemID}_itemMetadata" class="itemResultMetadata" >
                    <span>
                        <strong style='color:#3bd5b5; '>השתנה : </strong> ${formatDateString(v.LastModifiedTime)}
                    </span>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <span>
                        <strong style='color:#3bd5b5; '>תאריך יצירה : </strong> ${formatDateString(v.Created)}&nbsp;&nbsp;|&nbsp;&nbsp;
                        <strong style='color:#3bd5b5; ;'>נוצר על-ידי : </strong>${v.CreatedBy}
                    </span>
                    </br>
                </div>
            </div>
            <!--Hover Panel-->
            <div id="${itemID}_hover" class="itemResultHoverPanel ms-srch-hover-outerContainer">
                <div class='itemResultHoverPanelInnerContainer ms-srch-hover-innerContainer  ${hoverClass}' id='${itemID}_item_innerHover'>
                    <!--arrow   -->                     
                    <div class='result-hover-arrowBorder-rtl' id='${itemID}_item_hoverArrowBorder'></div>
                    <div class='result-hover-arrow-rtl' id='${itemID}_item_hoverArrow'></div>
                    <!--content-->
                    <div class='ms-srch-hover-content' id='${itemID}_item_hoverContent' data-displaytemplate='PDFHoverPanel'>
                        <div id='${itemID}_item_hoverCommonHeader' class='itemResultHoverPanelInnerHeader ms-srch-hover-header titleBackColor'>
                            <div>
                                <div class='ms-srch-hover-close'></div>
                                <div class='ms-srch-hover-title ms-dlg-heading ms-srch-ellipsis fontHeadFooter'>
                                    ${v.Title}
                                </div>
                            </div>
                        </div>
                        <div class='ms-metadata fontHeadFooter'>
                            ${((v.FileType == null) ? "" : (v.FileType).toUpperCase())}
                        </div>
                        <!--hoverCommonBody-->
                        <div id='${itemID}_item_hoverCommonBody' class='itemResultHoverPanelInnerBody ms-srch-hover-body'>
                        <!--previewf-->
                            <div class='result-hover-viewerContainer' style='display: block; height: 169px;'>
                            ${iframePreview}<!--
                            <iframe id='"+itemID+"_item_hoverViewer' src='"+v.ServerRedirectedEmbedURL+"' scrolling='no' frameborder='0px' class='result-hover-viewer' style='display: block;'></iframe>"-->
                            </div>
                        </div>
                        <!--Actions --> 
                        ${getResultActionPanelForHoverPanel(itemID, oosRedirectUrl, v.Path, v.Title, showInLib, isContainer)}
                    </div>
                </div>
            </div>
        </div>`;
    let searchResults = document.getElementById("searchResults");
    searchResults.innerHTML += result;
}

const showHP = (itemID) => {
    var positionRight = document.getElementById(itemID + "_itemBody").style.width;
    document.getElementById(itemID + "_hover").style.visibility = "visible";
    //document.getElementById(itemID+"_hover").style.right = positionRight;
    document.getElementById(itemID + "_hover").style.opacity = 1;
}

const hideHP = (itemID) => {
    document.getElementById(itemID + "_hover").style.visibility = "hidden";
    document.getElementById(itemID + "_hover").style.position = "absolute";
    document.getElementById(itemID + "_hover").style.opacity = 0;
}

const getResultActionPanelForHoverPanel = (resultID, resultPath, resultMetaDataPath, resultTitle, resultParentUrl, isContainer) => {
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
            actionPanel =
                `<div id='${resultID}_item_hoverCommonActions' class='itemResultHoverPanelInnerActions ms-srch-hover-actions titleBackColor'>
                    <div class='ms-srch-hover-action'>
                        <a clicktype='ActionEdit' id='${resultID}_item_hoverOpen' class='ms-calloutLink ms-uppercase fontHeadFooter' style='margin-right: 10px;' target='_blank' href='${resultPath}' title='פתח תוצאה זו' openapp='ms-word' opencontrol='PdfFile.OpenDocuments'>פתח</a>
                    </div>
                    <div class='ms-srch-hover-action'>
                        <a id='${resultID}_item_hoverFollow' class='ms-calloutLink ms-uppercase fontHeadFooter' target='_blank' href='${resultMetaDataPath}' title='לחץ כדי לעקוב אחר תוצאה זו'> הצג מאפיינים </a>
                    </div>
                    <div class='ms-srch-hover-action'>
                        <a clicktype='ActionSend' id='${resultID}_item_hoverSend' class='ms-calloutLink ms-uppercase fontHeadFooter' title='שלח תוצאה זו למישהו בדואר אלקטרוני' href='mailto:?subject="${resultTitle}&body="${encodeURIComponent(resultMetaDataPath)}'>שלח </a>
                    </div>
                    <div class='ms-srch-hover-action'>
                        <a clicktype='ActionViewLibrary' id='${resultID}_item_hoverParentLink' class='ms-calloutLink ms-uppercase fontHeadFooter' title='פתח את הספריה המכילה את תוצאה זו' target='_blank' href='${resultParentUrl}'>הצג ספריה</a>
                    </div>
                </div>`;
            return actionPanel;
            break;
    }
}

const getHoverClass = (resultType) => {
    if ((resultType == "docx") | (resultType == "xlsx") || (resultType == "pptx") || (resultType == "doc") || (resultType == "xls") || (resultType == "ppt") || (resultType == "pdf")) {
        return "result-hover-wacSize";
    } else {
        return "result-hover-standardSize";
    }
}

const getIconClassByExtension2 = (item, defaultIconPath) => {
    if (item && !isNullOrEmpty(item.FileExtension)) {
        var friendlyNameForFileExtension = getFriendlyNameForFileExtension(item.FileExtension.toString());
        if (friendlyNameForFileExtension === 'file_WebPage') {
            return getIconByContentClass(item);
        }
        if (friendlyNameForFileExtension === 'file_Word') {
            return "ms-Icon--WordDocument";
        } else if (friendlyNameForFileExtension === 'file_PowerPoint') {
            return "ms-Icon--PowerPointDocument";
        } else if (friendlyNameForFileExtension === 'file_Excel') {
            return "ms-Icon--ExcelLogo";
        } else if (friendlyNameForFileExtension === 'file_OneNote') {
            return "ms-Icon--OneNoteLogo";
        } else if (friendlyNameForFileExtension === 'file_Visio') {
            return "ms-Icon--VisioDocument";
        } else if (friendlyNameForFileExtension === 'file_InfoPath' || friendlyNameForFileExtension === 'file_XML') {
            return "ms-Icon--OfficeFormsLogo";
        } else if (friendlyNameForFileExtension === 'file_Access') {
            return "ms-Icon--AccessLogo";
        } else if (friendlyNameForFileExtension === 'file_Publisher') {
            return "ms-Icon--PublisherLogo";
        } else if (friendlyNameForFileExtension === 'file_PDF') {
            return "ms-Icon--PDF";
        } else if (friendlyNameForFileExtension === 'file_Mail') {
            return "ms-Icon--Mail";
        }
    }
    if (!isNullOrEmpty(defaultIconPath)) {
        return defaultIconPath;
    }
    return "ms-Icon--Website";
}

const getIconByContentClass = (item) => {
    if (item.contentclass === 'STS_ListItem_Contacts') {
        return "ms-Icon--ContactInfo";
    } else if (item.contentclass === 'STS_ListItem_Events') {
        return "ms-Icon--Event";
    } else if (item.contentclass === 'STS_ListItem_Tasks') {
        return "ms-Icon--TaskSolid";
    } else if (item.contentclass === 'STS_ListItem_Survey') {
        return "ms-Icon--SurveyQuestions";
    } else if (item.contentclass === 'STS_ListItem_TasksWithTimelineAndHierarchy') {
        return "ms-Icon--TaskLogo";
    } else if (item.contentclass === 'STS_Web' || item.contentclass === 'STS_Site' || item.contentclass === 'STS_List_850' || item.contentclass === 'STS_List_851') {
        return "ms-Icon--FileASPX";
    } else {
        return "ms-Icon--Globe";
    }
}


const getIframePreview = (itemID, itemPathManagedProperty) => {
    if (!isNullOrEmpty(itemPathManagedProperty) && isSameHost(itemPathManagedProperty, getHostName())) {
        var encodedSrcOfIframe = encodeUrlForHtmlAttributes(itemPathManagedProperty);
        //"<iframe id='"+idViewerEncoded+"' src='"+ encodedSrcOfIframe+"' scrolling='no' frameborder='0px' class='result-hover-viewer' style='display: block;'></iframe>";
        return "<iframe id='" + itemID + "_item_hoverViewer' src='" + encodedSrcOfIframe + "' scrolling='no' frameborder='0px' class='result-hover-viewer' style='display: block;'></iframe>";
    }
}

const isSameHost = (c, a) => {
    if (isNullOrEmpty(c) || isNullOrEmpty(a)) return false;
    var b = document.createElement("a");
    b.href = c;
    var d = b.hostname;
    return d.toLowerCase() === a.toLowerCase();
    return true;
}

const getHostName = () => {
    var a = "";
    if (!isNullOrEmpty(window.self.location)) a = window.self.location.hostname;
    return a;
}


const getExtensionForFileFriendlyName = (fileExtension) => {
    if (!isNullOrEmpty(fileExtension)) {
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
            isWebPage(fileExtension)
        }
        if ("file_XML" === 'file_' + fileExtension) {
            return 'xml';
        }
        if ("file_Text" === 'file_' + fileExtension) {
            return 'txt';
        }
    }
    return 'html';
}

const getContentClassByFriendlyName = (fName) => {
    if (!isNullOrEmpty(fName)) {
        if ("STS_List_850".indexOf(fName) > -1 || "STS_ListItem_850".indexOf(fName) > -1) { // Page Library and Page Library list
            return ["STS_List_850", "STS_ListItem_850"];
        }
        if ("STS_List_Survey".indexOf(fName) > -1 || "STS_ListItem_Survey".indexOf(fName) > -1) { // Survey List and Survey List Item
            return ["STS_List_Survey", "STS_ListItem_Survey"];
        }
        if ("STS_List_Announcements".indexOf(fName) > -1 || "STS_ListItem_Announcements".indexOf(fName) > -1) { //Announcements List and Announcements List Item
            return ["STS_List_Announcements", "STS_ListItem_Announcements"];
        }
        if ("STS_List_Contacts".indexOf(fName) > -1 || "STS_ListItem_Contacts".indexOf(fName) > -1) { //Contacts List and Contacts List Item
            return ["STS_List_Contacts", "STS_ListItem_Contacts"];
        }
        if ("STS_List_DiscussionBoard".indexOf(fName) > -1 || "STS_ListItem_DiscussionBoard".indexOf(fName) > -1) { //DiscussionBoard List and DiscussionBoard List Item
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
        } else {
            return ["STS_ListItem_GenericList", "STS_List_GenericList"];
        }
    }
}


const getDeSerilizeContentClass = (cc) => {
    if (cc.indexOf("משימות") > -1) {
        return "Task";
    } else if (cc.indexOf("אירועים") > -1) {
        return "Event";
    } else if (cc.indexOf("אתרים") > -1) {
        return "Site";
    } else if (cc.indexOf("תתי אתרים") > -1) {
        return "Web";
    } else if (cc.indexOf("סקרים") > -1) {
        return "Survey";
    } else if (cc.indexOf("אנשי קשר") > -1) {
        return "Contacts";
    } else if (cc.indexOf("תמונות") > -1) {
        return "PictureLibrary";
    } else if (cc.indexOf("הודעות") > -1) {
        return "Announcements";
    } else if (cc.indexOf("טפסים") > -1) {
        return "XMLForm";
    } else if (cc.indexOf("מסמכים") > -1) {
        return "DocumentLibrary";
    } else if (cc.indexOf("קישורים") > -1) {
        return "Links";
    } else if (cc.indexOf("דפי אינטרנט") > -1) {
        return "WebPageLibrary";
    } else if (cc.indexOf("גאנטים") > -1) {
        return "GanttTasks";
    } else if (cc.indexOf("מעקב בעיות") > -1) {
        return "IssueTracking";
    } else if (cc.indexOf("דיונים") > -1) {
        return "DiscussionBoard";
    } else if (cc.indexOf("דפים") > -1) {
        return "850";
    } else if (cc.indexOf("פריטים") > -1) {
        return "GenericList";
    } else {
        return cc;
    }
}