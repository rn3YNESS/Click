var PMOClick = window.PMOClick || {};


PMOClickDocsLink = {

  BrowserDetails: {
    IsIE: false,
    TrueVersion: 0,
    ActingVersion: 0,
    CompatibilityMode: false
  },

  GlobalVariables: {
    AllDocsArr: {
      DocLibID: null,
      DocLibTitle: null,
      Documents: []
    },
    LinkItems: [],
    SelectedWeb: null,
    ItemDetails: {
      SiteUrl: "",
      ListID: "",
      ItemID: "",
      ItemGuid: ""
    },
  },

  Pages: {

  },

  Lists: {
    DocsLink: {
      HE: "",
      EN: "DocsLinks"
    }
  },

  Init: function () {
    var isSelected = false;
    let itemDetails = JSON.parse(PMOClick.Methods.GetSessionStorage("CurrentLinkedItem"));
    PMOClickDocsLink.GlobalVariables.ItemDetails.SiteUrl = decodeURIComponent(itemDetails.url.split('&')[0].split('=')[1]);
    PMOClickDocsLink.GlobalVariables.ItemDetails.ListID = itemDetails.url.split('&')[1].split('=')[1];
    PMOClickDocsLink.GlobalVariables.ItemDetails.ItemID = itemDetails.url.split('&')[2].split('=')[1];
    var parentWeb = PMOClickDocsLink.GlobalVariables.ItemDetails.SiteUrl;
    if (parentWeb.substr(parentWeb.lastIndexOf('/') - 5, 5) != 'sites' && parentWeb != PMOClick.CONSTANTS.WEBAPPLICATIONURL)
      parentWeb = PMOClick.CONSTANTS.WEBAPPLICATIONURL + PMOClick.Methods.SPRequest(false, PMOClickDocsLink.GlobalVariables.ItemDetails.SiteUrl + "/_api/web/parentweb", "GET", "application/json;", { accept: "application/json;odata=nometadata" }, null, null).ServerRelativeUrl;
    var path = '"' + parentWeb + '*"';
    var searchResults = PMOClick.Methods.RequestResultsFromSearchAPI("querytext='contentclass:STS_Site OR contentclass:STS_Web Path:" + path + "'&selectproperties='Title,Path'&rowlimit=500&trimduplicates=false")
    if (PMOClickDocsLink.GlobalVariables.ItemDetails.SiteUrl == PMOClick.CONSTANTS.WEBAPPLICATIONURL)
      searchResults.PrimaryQueryResult.RelevantResults.Table.Rows = searchResults.PrimaryQueryResult.RelevantResults.Table.Rows.filter(element => !element.Cells[3].Value.includes("sites"));
    // var parentWeb = "";
    var select = document.getElementById("allWebs");
    // if(a != "sites"){
    //   parentWeb = PMOClick.Methods.SPRequest(false, PMOClickDocsLink.GlobalVariables.ItemDetails.SiteUrl + "/_api/web/parentweb", "GET", "application/json;", { accept: "application/json;odata=nometadata" }, null, null);
    //   requestUri = parentWeb.ServerRelativeUrl == undefined ? PMOClick.CONSTANTS.WEBABSOLUTEURL+ "/_api/web/webs" : PMOClick.CONSTANTS.WEBABSOLUTEURL + "/" + parentWeb.ServerRelativeUrl + "/_api/web/webs";    
    //   if(parentWeb.ServerRelativeUrl != undefined){
    //     var option = document.createElement("option");
    //     var textnode = document.createTextNode(parentWeb.Title);
    //     option.setAttribute('id',parentWeb.ServerRelativeUrl);
    //     option.appendChild(textnode); 
    //     select.appendChild(option);
    //   }
    //   else{
    //     var option = document.createElement("option");
    //     var textnode = document.createTextNode("מערכת קליק");
    //     option.setAttribute('id',PMOClick.CONSTANTS.WEBABSOLUTEURL);
    //     option.appendChild(textnode); 
    //     select.appendChild(option);
    //   }
    // }
    // else{
    //   requestUri = PMOClickDocsLink.GlobalVariables.ItemDetails.SiteUrl + "/_api/web/webs";  
    //   var option = document.createElement("option");
    //   var textnode = document.createTextNode(parentWeb.Title);
    //   option.setAttribute('id', PMOClickDocsLink.GlobalVariables.ItemDetails.SiteUrl);
    //   option.appendChild(textnode); 
    //   select.appendChild(option);  
    // }
    // //Get all webs        
    // var allWebs = PMOClick.Methods.SPRequest(false, requestUri, "GET", "application/json;", { accept: "application/json;odata=nometadata" }, null, null);
    if (searchResults) {
      searchResults.PrimaryQueryResult.RelevantResults.Table.Rows.forEach(function (element, i) {
        var option = document.createElement("option");
        var textnode = document.createTextNode(element.Cells[2].Value);
        option.setAttribute('id', element.Cells[3].Value);
        option.appendChild(textnode);
        select.appendChild(option);
        var url = element.Cells[3].Value;
        if (url[url.length - 1] == '/')
          url = url.substr(0, url.length - 1);
        if (PMOClickDocsLink.GlobalVariables.ItemDetails.SiteUrl == url && !isSelected) {
          select.selectedIndex = i + 1;
          isSelected = true;
        }
      });
    }
    PMOClickDocsLink.Methods.DrawAllLibrarys(select.options[select.selectedIndex].id)
    PMOClick.Methods.HtmlHttpRequest({
      url: "/_vti_bin/ConnectedItemsAPI/api/ConnectItems/GetDocLinks/?siteUrl=" + PMOClickDocsLink.GlobalVariables.ItemDetails.SiteUrl + "&listId=" + PMOClickDocsLink.GlobalVariables.ItemDetails.ListID + "&itemId=" + PMOClickDocsLink.GlobalVariables.ItemDetails.ItemID + "&webAppUrl=" + PMOClick.CONSTANTS.WEBAPPLICATIONURL,
      method: "GET",
      headers: { 'accept': 'application/json;odata=verbose' }
    }
    ).then(data => {
      PMOClickDocsLink.GlobalVariables.LinkItems = JSON.parse(data);
      PMOClickDocsLink.Methods.InitConnectedItemsGet();
    })
      .catch(error => {
        console.log(error);
      });
  },

  Load: function () {

  },


  Methods: {
    InitConnectedItemsGet: function () {
      document.getElementById("linkedItems").innerHTML = ''; //Empty UL
      PMOClickDocsLink.Methods.DrawTitleLinks();
      PMOClickDocsLink.GlobalVariables.ItemDetails.ItemGuid = PMOClickDocsLink.GlobalVariables.LinkItems[PMOClickDocsLink.GlobalVariables.LinkItems.length - 1].ItemArray[0];
      if (PMOClickDocsLink.GlobalVariables.LinkItems.length == 1) {
        var h3 = document.getElementById("DocLinkTitle");
        h3.innerHTML = '';
        var textTitleDoc = document.createTextNode(PMOClickDocsLink.GlobalVariables.LinkItems[0].ItemArray[1]);
        h3.appendChild(textTitleDoc);
      }
      else {
        for (var i = 0; i < PMOClickDocsLink.GlobalVariables.LinkItems.length - 1; i++) {
          let linkItem = PMOClickDocsLink.GlobalVariables.LinkItems[i];
          PMOClickDocsLink.Methods.DrawLinkItem(linkItem.ItemArray);
        }
        var h3 = document.getElementById("DocLinkTitle");
        h3.innerHTML = '';
        var textTitleDoc = document.createTextNode(PMOClickDocsLink.GlobalVariables.LinkItems[PMOClickDocsLink.GlobalVariables.LinkItems.length - 1].ItemArray[1]);
        h3.appendChild(textTitleDoc);
      }
    },

    InitConnectedItems: function () {
      document.getElementById("linkedItems").innerHTML = ''; //Empty UL
      PMOClickDocsLink.Methods.DrawTitleLinks();
      PMOClickDocsLink.GlobalVariables.LinkItems.forEach(linkItem => {
        PMOClickDocsLink.Methods.DrawLinkItem(linkItem.ItemArray);
      });
    },

    DrawAllLibrarys: function (webUrl) {
      if (webUrl != "") {
        PMOClickDocsLink.GlobalVariables.SelectedWeb = webUrl;
        var requestUri = (PMOClick.Methods.isNullOrEmptyString(PMOClickDocsLink.GlobalVariables.SelectedWeb)) ? _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists?$select=Title,Id,BaseTemplate&$filter=(BaseTemplate eq 101) or  (BaseTemplate eq 171)" : PMOClickDocsLink.GlobalVariables.SelectedWeb + "/_api/web/lists?$select=Title,Id,BaseTemplate&$filter=(BaseTemplate eq 101) or  (BaseTemplate eq 171)";
        var allDocLibs = PMOClick.Methods.SPRequest(false, requestUri, "GET", "application/json;", { accept: "application/json;odata=nometadata" }, null, null);
        //Draw
        if (allDocLibs) {
          PMOClickDocsLink.Methods.DrawTitleLib();
          allDocLibs.value.forEach(element => {
            PMOClickDocsLink.Methods.AddLib(element);
          });
        }
      }
      else {
        PMOClickDocsLink.Methods.DrawTitleLib();
      }
      document.getElementById("libsDiv").style.display = "block";
    },

    DrawAllItems: function (docLibTitle, docLibID, baseTemplate) {
      var requestUri = PMOClickDocsLink.GlobalVariables.SelectedWeb + "/_api/web/lists/GetByTitle('" + docLibTitle + "')/items?$select=Title,id,FileRef,FileLeafRef,UniqueId&$filter=FSObjType eq 0&$top=500";
      PMOClickDocsLink.GlobalVariables.AllDocsArr.DocLibID = docLibID;
      PMOClickDocsLink.GlobalVariables.AllDocsArr.DocLibTitle = docLibTitle;
      PMOClickDocsLink.GlobalVariables.AllDocsArr.Documents = PMOClick.Methods.SPRequest(false, requestUri, "GET", "application/json;", { accept: "application/json;odata=nometadata" }, null, null);
      PMOClickDocsLink.Methods.Autocomplete(document.getElementById("AutocompleteInput"), PMOClickDocsLink.GlobalVariables.AllDocsArr.Documents.value, baseTemplate);
      //Draw
      if (PMOClickDocsLink.GlobalVariables.AllDocsArr.Documents) {
        if (PMOClickDocsLink.GlobalVariables.AllDocsArr.Documents.value.length == 0) {
          var ul = document.getElementById("allDocs");
          ul.innerHTML = '';
          var li = document.createElement("li");
          var row = document.createElement("div");
          row.setAttribute('class', 'row');
          var col = document.createElement("div");
          col.setAttribute('class', 'col-lg-12 col-md-12 col-sm-12');
          col.setAttribute('style', 'text-align: center;');
          var textnode = document.createTextNode("אין נתונים להצגה במיקום זה");
          col.appendChild(textnode);
          row.appendChild(col)
          li.appendChild(row);
          ul.appendChild(li);
        }
        else {
          PMOClickDocsLink.Methods.DrawTitle();
          PMOClickDocsLink.GlobalVariables.AllDocsArr.Documents.value.forEach(element => {
            PMOClickDocsLink.Methods.DrawDoc(element, baseTemplate);
          });
        }
      }
    },

    //linkedItems
    DrawLinkItem: function (linkItem) {
      var ul = document.getElementById("linkedItems");
      var row = document.createElement("div");
      row.setAttribute('class', 'row linkitem');
      var li = document.createElement("li");
      var iDelete = document.createElement("i");
      iDelete.setAttribute('class', 'ms-Icon ms-Icon--Delete imgStyle pointer');
      iDelete.setAttribute('style', 'padding-right: 5px;');
      var deleteLinkCol = document.createElement("div");
      deleteLinkCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1 pointer');
      iDelete.setAttribute('title', 'הסר קישור');
      deleteLinkCol.setAttribute('style', 'padding-left: 30px;');
      var params = "childId=" + linkItem[1] + "&childUrl=" + linkItem[2] + "&gGuid=" + linkItem[0] + "&itemGuig=" + PMOClickDocsLink.GlobalVariables.ItemDetails.ItemGuid + "&webAppUrl=" + PMOClick.CONSTANTS.WEBAPPLICATIONURL + "&parentUrl=" + PMOClickDocsLink.GlobalVariables.ItemDetails.SiteUrl + "&listId=" + PMOClickDocsLink.GlobalVariables.ItemDetails.ListID;
      deleteLinkCol.setAttribute('onclick', 'PMOClickDocsLink.Methods.DeleteLink(\"' + params + '\")');
      deleteLinkCol.appendChild(iDelete);
      row.appendChild(deleteLinkCol);
      var lineCol = document.createElement("div");
      lineCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1 lineBetweenTd');
      lineCol.setAttribute('style', 'padding-right: 0;');
      lineCol.appendChild(document.createTextNode('|'));
      row.appendChild(lineCol);
      var titleTextnode = document.createTextNode(linkItem[3]);
      var iType = document.createElement("i");
      linkItem[4].includes("D") ? iType.setAttribute('class', 'ms-Icon ms-Icon--FolderListMirrored imgStyle') : iType.setAttribute('class', 'ms-Icon ms-Icon--TaskManager imgStyle');
      var typeCol = document.createElement("div");
      typeCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1');
      typeCol.setAttribute('style', 'padding-right: 3px;');
      typeCol.appendChild(iType);
      row.appendChild(typeCol);
      var lineCol = document.createElement("div");
      lineCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1 lineBetweenTd');
      lineCol.setAttribute('style', 'padding-left: 0px; padding-right: 9px;');
      lineCol.appendChild(document.createTextNode('|'));
      row.appendChild(lineCol);
      var aTitle = document.createElement("a");
      aTitle.setAttribute('href', 'javascript:PMOClick.Methods.OpenWindow(\"' + linkItem[2] + '\")');
      aTitle.setAttribute('class', 'aDocsColor');
      aTitle.appendChild(titleTextnode);
      var titleCol = document.createElement("div");
      titleCol.setAttribute('class', 'col-lg-7 col-md-7 col-sm-7');
      titleCol.appendChild(aTitle);
      row.appendChild(titleCol);
      li.appendChild(row);
      ul.appendChild(li);
    },

    DrawTitleLinks: function () {
      var ul = document.getElementById("linkedItems");
      ul.innerHTML = ''; //Empty UL
      var row = document.createElement("div");
      row.setAttribute('class', 'row linkitemTitle');
      var li = document.createElement("li");
      var titleTextnode = document.createTextNode('סוג');
      var title2Textnode = document.createTextNode('פריט');
      var titleCol = document.createElement("div");
      titleCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1');
      row.appendChild(titleCol);
      var lineCol = document.createElement("div");
      lineCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1 lineBetweenTd');
      lineCol.appendChild(document.createTextNode('|'));
      row.appendChild(lineCol);
      var span = document.createElement("span");
      span.appendChild(titleTextnode);
      var title2Col = document.createElement("div");
      title2Col.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1');
      title2Col.setAttribute('style', 'padding-left: 0px; padding-right: 0;');
      title2Col.appendChild(span);
      row.appendChild(title2Col);
      var lineCol = document.createElement("div");
      lineCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1 lineBetweenTd');
      lineCol.appendChild(document.createTextNode('|'));
      row.appendChild(lineCol);
      var title3Col = document.createElement("div");
      title3Col.setAttribute('class', 'col-lg-4 col-md-4 col-sm-4');
      title3Col.appendChild(title2Textnode);
      row.appendChild(title3Col);
      li.appendChild(row);
      ul.appendChild(li);
    },

    DrawTitleLib: function () {
      var ul = document.getElementById("allDocLibsPerWeb");
      ul.innerHTML = ''; //Empty UL
      var row = document.createElement("div");
      row.setAttribute('class', 'row linkitemTitle titleFont');
      var li = document.createElement("li");
      var titleTextnode = document.createTextNode('סוג');
      var title2Textnode = document.createTextNode('פריט');
      var span = document.createElement("span");
      span.appendChild(titleTextnode);
      var titleCol = document.createElement("div");
      titleCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1');
      titleCol.setAttribute('style', 'padding-left: 0px; padding-right: 9.2px;');
      titleCol.appendChild(span);
      row.appendChild(titleCol);
      var lineCol = document.createElement("div");
      lineCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1 lineBetweenTd');
      lineCol.appendChild(document.createTextNode('|'));
      row.appendChild(lineCol);
      var title2Col = document.createElement("div");
      title2Col.setAttribute('class', 'col-lg-4 col-md-4 col-sm-4');
      title2Col.appendChild(title2Textnode);
      row.appendChild(title2Col);
      li.appendChild(row);
      ul.appendChild(li);
    },

    DrawTitle: function () {
      var ul = document.getElementById("allDocs");
      ul.innerHTML = ''; //Empty UL
      var row = document.createElement("div");
      row.setAttribute('class', 'row linkitemTitle');
      var li = document.createElement("li");
      var titleTextnode = document.createTextNode('סוג');
      var title2Textnode = document.createTextNode('פריט');
      var title3Col = document.createElement("div");
      title3Col.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1');
      row.appendChild(title3Col);
      var lineCol = document.createElement("div");
      lineCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1 lineBetweenTd');
      lineCol.appendChild(document.createTextNode('|'));
      row.appendChild(lineCol);
      var span = document.createElement("span");
      span.appendChild(titleTextnode);
      var titleCol = document.createElement("div");
      titleCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1');
      titleCol.setAttribute('style', 'padding-left: 0px; padding-right: 0;');
      titleCol.appendChild(span);
      row.appendChild(titleCol);
      var lineCol = document.createElement("div");
      lineCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1 lineBetweenTd');
      lineCol.appendChild(document.createTextNode('|'));
      row.appendChild(lineCol);
      var title2Col = document.createElement("div");
      title2Col.setAttribute('class', 'col-lg-4 col-md-4 col-sm-4');
      title2Col.appendChild(title2Textnode);
      row.appendChild(title2Col);
      li.appendChild(row);
      ul.appendChild(li);
    },

    AddLib: function (element) {
      var ul = document.getElementById("allDocLibsPerWeb");
      var row = document.createElement("div");
      row.setAttribute('class', 'row linkitem');
      var li = document.createElement("li");
      li.setAttribute('id', element.Id);
      li.setAttribute('onclick', 'PMOClickDocsLink.Methods.DrawAllItems(\'' + element.Title + '\',\'' + element.Id + '\',\'' + element.BaseTemplate + '\')');
      li.setAttribute('title', 'הצג נתונים');
      var iType = document.createElement("i");
      element.BaseTemplate == '101' ? iType.setAttribute('class', 'ms-Icon ms-Icon--FolderListMirrored imgStyle') : iType.setAttribute('class', 'ms-Icon ms-Icon--TaskManager imgStyle');
      var typeCol = document.createElement("div");
      typeCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1');
      typeCol.setAttribute('style', 'padding-left: 0;');
      typeCol.appendChild(iType);
      row.appendChild(typeCol);
      var lineCol = document.createElement("div");
      lineCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1 lineBetweenTd');
      lineCol.appendChild(document.createTextNode('|'));
      row.appendChild(lineCol);
      var titleTextnode = document.createTextNode(element.Title);
      var titleCol = document.createElement("div");
      titleCol.setAttribute('class', 'col-lg-9 col-md-9 col-sm-9');
      titleCol.appendChild(titleTextnode);
      row.appendChild(titleCol);
      li.appendChild(row);
      ul.appendChild(li);
    },

    DrawDoc: function (element, baseTemplate) {
      var ul = document.getElementById("allDocs");
      var row = document.createElement("div");
      row.setAttribute('class', 'row linkitem');
      var li = document.createElement("li");
      li.setAttribute('id', element.Id);
      var iAddLink = document.createElement("i");
      iAddLink.setAttribute('style', 'padding-right: 5px;');
      iAddLink.setAttribute('class', 'ms-Icon ms-Icon--AddLink imgStyle');
      var insertLinkCol = document.createElement("div");
      insertLinkCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1 pointer');
      insertLinkCol.setAttribute('style', 'padding-left: 30px;');
      insertLinkCol.setAttribute('title', 'הוסף קישור');
      var source = baseTemplate == '101' ? 'D' : 'I';
      insertLinkCol.setAttribute('onclick', 'PMOClickDocsLink.Methods.InsertLink("' + element.UniqueId + '","' + element.FileLeafRef + '","' + PMOClick.CONSTANTS.WEBAPPLICATIONURL + element.FileRef + '","' + source + '")');
      insertLinkCol.appendChild(iAddLink);
      row.appendChild(insertLinkCol);
      var lineCol = document.createElement("div");
      lineCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1 lineBetweenTd');
      lineCol.setAttribute('style', 'padding-right: 0;');
      lineCol.appendChild(document.createTextNode('|'));
      row.appendChild(lineCol);
      var iType = document.createElement("i");
      baseTemplate == '101' ? iType.setAttribute('class', 'ms-Icon ms-Icon--FolderListMirrored imgStyle') : iType.setAttribute('class', 'ms-Icon ms-Icon--TaskManager imgStyle');
      var typeCol = document.createElement("div");
      typeCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1');
      typeCol.setAttribute('style', 'padding-right: 0;');
      typeCol.appendChild(iType);
      row.appendChild(typeCol);
      var lineCol = document.createElement("div");
      lineCol.setAttribute('class', 'col-lg-1 col-md-1 col-sm-1 lineBetweenTd');
      lineCol.setAttribute('style', 'padding-right: 4px;');
      lineCol.appendChild(document.createTextNode('|'));
      row.appendChild(lineCol);
      if (source == 'D') {
        var titleTextnode = document.createTextNode(element.FileLeafRef);
      }
      else {
        var titleTextnode = document.createTextNode(element.Title);
      }
      var aTitle = document.createElement("a");
      if (source == 'D') {
        aTitle.setAttribute('href', "javascript:PMOClick.Methods.OpenWindow('" + element.FileRef + "')");
      }
      else { aTitle.setAttribute('href', "javascript:PMOClick.Methods.OpenWindow('" + PMOClick.CONSTANTS.WEBABSOLUTEURL + element.FileRef.slice(0, element.FileRef.lastIndexOf('/') + 1) + "dispform.aspx?ID=" + element.ID + "')"); }
      aTitle.setAttribute('class', 'aDocsColor');
      aTitle.appendChild(titleTextnode);
      var titleCol = document.createElement("div");
      titleCol.setAttribute('class', 'col-lg-7 col-md-7 col-sm-7');
      titleCol.appendChild(aTitle);
      row.appendChild(titleCol);
      li.appendChild(row);
      ul.appendChild(li);
    },

    InsertLink: function (uniqueId, fileLeafRef, fileUrl, source) {
      var parentSiteUrl = PMOClickDocsLink.GlobalVariables.ItemDetails.SiteUrl;
      var parentURL = parentSiteUrl.substring(parentSiteUrl.indexOf(PMOClick.CONSTANTS.WEBAPPLICATIONURL) + PMOClick.CONSTANTS.WEBAPPLICATIONURL.length);
      var bodyn = JSON.stringify({ 'ParentDocId': PMOClickDocsLink.GlobalVariables.ItemDetails.ItemID, 'ParentDocUrl': parentURL, 'ParentListId': decodeURIComponent(PMOClickDocsLink.GlobalVariables.ItemDetails.ListID), 'ChildDocId': uniqueId, 'ChildDocUrl': fileUrl.substring(fileUrl.indexOf(PMOClick.CONSTANTS.WEBAPPLICATIONURL) + PMOClick.CONSTANTS.WEBAPPLICATIONURL.length), 'ChildName': fileLeafRef, 'ChildSource': source, 'UserName': PMOClick.User.DisplayName, 'WebAppUrl': PMOClick.CONSTANTS.WEBAPPLICATIONURL });
      PMOClick.Methods.HtmlHttpRequest({
        url: "/_vti_bin/ConnectedItemsAPI/api/ConnectItems/CreateConnetion/",
        method: "POST",
        body: bodyn,
        headers: { 'content-type': 'application/json;odata=verbose' }
      }
      ).then(data => {
        if (JSON.parse(data) == null) {
          alert("לא ניתן לקשר מסמך לעצמו");
        }
        else if (JSON.parse(data).length > 0) {
          PMOClickDocsLink.GlobalVariables.LinkItems = JSON.parse(data);
          PMOClickDocsLink.Methods.InitConnectedItems();
        }
        else {
          alert("לא ניתן לבצע קישור נוסף ! כדי לבצע קישור יש לנתק אחד מהפריטים");
        }
      })
        .catch(error => {
          console.log(error);
        });
    },

    DeleteLink: function (params) {
      PMOClick.Methods.HtmlHttpRequest({
        url: "/_vti_bin/ConnectedItemsAPI/api/ConnectItems/DeleteConnetion/?" + params,
        method: "GET",
        headers: { 'accept': 'application/json;odata=verbose' }
      }
      ).then(data => {
        PMOClickDocsLink.GlobalVariables.LinkItems = JSON.parse(data);
        PMOClickDocsLink.Methods.InitConnectedItems();
      })
        .catch(error => {
          console.log(error);
        });
    },

    LinkItem: function () {
      var itemTolinke = "MicrosoftDemo";
      var docTitle = document.getElementById("AutocompleteInput").value;
      var doc = PMOClickDocsLink.GlobalVariables.AllDocsArr.Documents.value.filter(d => {
        if (d.Title == docTitle)
          return d.Id;
      });
      //Create document as folder
      var f = PMOClick.Methods.GetFolderREST(PMOClickDocsLink.Lists.DocsLink.EN, itemTolinke);
      var isFolderExist = (f.value.length > 0) ? true : false;
      if (!isFolderExist) {
        PMOClick.Methods.CreateFolderREST(PMOClickDocsLink.Lists.DocsLink.EN, PMOClickDocsLink.Lists.DocsLink.EN, itemTolinke);
      }
      //Add list item represent the linked doc
      var uId = PMOClickDocsLink.GlobalVariables.AllDocsArr.DocLibID + "#" + doc[0].Id;
      var requestUri = PMOClick.CONSTANTS.WEBAPPLICATIONURL + "/_api/web/lists/GetByTitle('" + PMOClickDocsLink.Lists.DocsLink.EN + "')/items?$select=Title,Id&$filter=" + encodeURIComponent("((FSObjType eq 0) and (UniqId eq '" + uId + "'))");
      var isLinkExist = PMOClick.Methods.SPRequest(false, requestUri, "GET", "application/json;", { accept: "application/json;odata=nometadata" }, null, null);
      if (isLinkExist.value.length == 0) {
        var fileDetails = PMOClick.Methods.GetItemFileDetails(PMOClickDocsLink.GlobalVariables.SelectedWeb, PMOClickDocsLink.GlobalVariables.AllDocsArr.DocLibTitle, doc[0].Id);
        PMOClick.Methods.CreateItemInsideFolder(PMOClickDocsLink.Lists.DocsLink.EN, PMOClickDocsLink.Lists.DocsLink.EN, itemTolinke, { "Title": fileDetails.d.FileLeafRef, "DocID": doc[0].Id.toString(), "DocSource": fileDetails.d.FileRef.toString(), "UniqId": uId.toString(), "LinksCounter": "" });
        PMOClickDocsLink.Methods.AddLinkItem(doc[0].Title, doc[0].Title, null, "linkedItems", null);
      }
      else {
        var fileRef = PMOClick.Methods.GetItemFileDetails(PMOClick.CONSTANTS.WEBAPPLICATIONURL, PMOClickDocsLink.Lists.DocsLink.EN, isLinkExist.value[0].Id);
        var splitURL = fileRef.d.FileRef.split('/');
        if (splitURL[splitURL.length - 2] != itemTolinke) {
          var itemsToLink = PMOClick.Methods.GetItemsInFolder(PMOClickDocsLink.Lists.DocsLink.EN, splitURL[splitURL.length - 2]);
          itemsToLink.value.forEach(element => {
            PMOClickDocsLink.Methods.AddLinkItem(element.Title, element.UniqId.substr(0, element.UniqId.indexOf('#')), null, "linkedItems", null);
            var fileDetailsFromFolder = PMOClick.Methods.GetItemFileDetails(PMOClick.CONSTANTS.WEBAPPLICATIONURL, PMOClickDocsLink.Lists.DocsLink.EN, element.Id);
            PMOClick.Methods.MoveItemToFolder(PMOClickDocsLink.Lists.DocsLink.EN, itemTolinke, fileDetailsFromFolder);
          });
        }
        else {
          alert("קישור קיים");
        }
      }
    },

    Autocomplete: function (inp, arr, baseTemplate) {
      /*the autocomplete function takes two arguments,
      the text field element and an array of possible autocompleted values:*/
      var currentFocus;
      /*execute a function when someone writes in the text field:*/
      inp.addEventListener("input", function (e) {
        document.getElementById("allDocs").innerHTML = '';
        var a, b, i, val = this.value;
        if (val.length == 0) {
          if (PMOClickDocsLink.GlobalVariables.AllDocsArr.Documents.value.length == 0) {
            var ul = document.getElementById("allDocs");
            ul.innerHTML = '';
            var li = document.createElement("li");
            var row = document.createElement("div");
            row.setAttribute('class', 'row');
            var col = document.createElement("div");
            col.setAttribute('class', 'col-lg-12 col-md-12 col-sm-12');
            col.setAttribute('style', 'text-align: center;');
            var textnode = document.createTextNode("אין נתונים להצגה במיקום זה");
            col.appendChild(textnode);
            row.appendChild(col)
            li.appendChild(row);
            ul.appendChild(li);
          }
          else {
            PMOClickDocsLink.Methods.DrawTitle();
            PMOClickDocsLink.GlobalVariables.AllDocsArr.Documents.value.forEach(element => {
              PMOClickDocsLink.Methods.DrawDoc(element, baseTemplate);
            });
          }
        }
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        // a = document.createElement("DIV");
        // a.setAttribute("id", this.id + "autocomplete-list");
        // a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        // this.parentNode.appendChild(a);
        /*for each item in the array...*/
        if (PMOClickDocsLink.GlobalVariables.AllDocsArr.Documents.value.length == 0) {
          var ul = document.getElementById("allDocs");
          ul.innerHTML = '';
          var li = document.createElement("li");
          var row = document.createElement("div");
          row.setAttribute('class', 'row');
          var col = document.createElement("div");
          col.setAttribute('class', 'col-lg-12 col-md-12 col-sm-12');
          col.setAttribute('style', 'text-align: center;');
          var textnode = document.createTextNode("אין נתונים להצגה במיקום זה");
          col.appendChild(textnode);
          row.appendChild(col)
          li.appendChild(row);
          ul.appendChild(li);
        }
        else {
          PMOClickDocsLink.Methods.DrawTitle();
          for (var i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].FileLeafRef.toUpperCase().includes(val.toUpperCase())) {
              PMOClickDocsLink.Methods.DrawDoc(arr[i], baseTemplate);
              // var li = document.createElement("li");
              // var textnode = document.createTextNode(arr[i].Title);
              // li.appendChild(textnode); 
              /*create a DIV element for each matching element:*/
              /*make the matching letters bold:*/
              /*insert a input field that will hold the current array item's value:*/
              /*execute a function when someone clicks on the item value (DIV element):*/
              // li.addEventListener("click", function(e) {
              //     /*insert the value for the autocomplete text field:*/
              //     inp.value = this.getElementsByTagName("input")[0].value;
              //     /*close the list of autocompleted values,
              //     (or any other open lists of autocompleted values:*/
              //     closeAllLists();
              // });
              // document.getElementById("allDocs").appendChild(li);
            }
          }
        }
      });
      /*execute a function presses a key on the keyboard:*/
      inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
      });
      function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
      }
      function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
        }
      }
      function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }
      /*execute a function when someone clicks in the document:*/
      document.addEventListener("click", function (e) {
        closeAllLists(e.target);
      });
    }
  }
}