var PMOClick = window.PMOClick || {};
PMOClickAutoComplete = {

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
        option: {
            WebURL: "",							// [Optional] The name of the Web (site) which contains the sourceList
            sourceTable: "",					// The name of the table which contains the values
            SourceTableColumn: "",				// The static name of the column which contains the values to filter
            columnName: "",						// The display name of the column in the form
            filter: "",						// [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
            CAMLQueryOptions: "<QueryOptions></QueryOptions>",	// [Optional] For power users, allows specifying the CAMLQueryOptions for the GetListItems call
            CAMLRowLimit: 0,					// [Optional] Override the default view rowlimit and get all appropriate rows
            filterType: "BeginsWith",			// Type of filtering: [BeginsWith, Contains]
            numChars: 0,						// Wait until this number of characters has been typed before attempting any actions
            ignoreCase: false,					// If set to true, the function ignores case, if false it looks for an exact match
            highlightClass: "",					// If a class is supplied, highlight the matched characters in the values by applying that class to a wrapping span
            uniqueVals: false,					// If set to true, the function only adds unique values to the list (no duplicates)
            maxHeight: 99999,					// Sets the maximum number of values to display before scrolling occurs
            slideDownSpeed: "fast",				// Speed at which the div should slide down when values match (milliseconds or ["fast" | "slow"])
            processingIndicator: "_layouts/images/REFRESH.GIF",				// If present, show this while processing
            debug: false						// If true, show error messages;if false, run silent
        },
        sourceObjID:""
    },

    CONSTANTS: {
        AutoCompleteType: {
            AutocompleteListDbTextFilter: "AutocompleteListDbTextFilter",
            AutocompleteListDropDown: "AutocompleteListDropDown",
            AutocompleteListIpDropDown: "AutocompleteListIpDropDown",
            AutocompleteListText: "AutocompleteListText",
            AutocompleteListIpText: "AutocompleteListIpText",
            AutocompleteDB: "AutocompleteDB"
        }
    },

    Pages: {
    },

    Lists: {
    },

    AcMain: function (new_Columns) {
        var newColumns = new_Columns;
        for (i = 0; i < newColumns.length; i++) {
            var curRow = newColumns[i];
            // מידע מרשימה ומבסיס נתונים למסנן טקסט
            if (curRow["Source"] == "SpDbTextFilter") {
                PMOClickAutoComplete.Methods.AutocompleteListDbTextFilter({
                    sourceList: curRow["DispSourceList"],
                    sourceColumn: curRow["SourceColumn"],
                    sourceTable: curRow["SourceTable"],
                    sourceTableColumn: curRow["SourceTableColumn"],
                    columnName: curRow["DispColumnName"],
                    ignoreCase: true,
                    numChars: 1,
                    slideDownSpeed: "fast",
                    filterType: "Contains",
                    debug: false
                });
            }

            // DropDown מידע מרשימה לעמודת
            else if ((curRow["Source"] == "SpDropDown") || (curRow["Source"] == "SP")) {
                PMOClickAutoComplete.Methods.AutocompleteListDropDown({
                    sourceList: curRow["DispSourceList"],
                    sourceColumn: curRow["SourceColumn"],
                    columnName: curRow["DispColumnName"],
                    ignoreCase: true,
                    numChars: 1,
                    slideDownSpeed: "fast",
                    filterType: "Contains",
                    debug: false,
                    filter: curRow["filter"]
                });
            }

            // IpDropDown מידע מרשימה לעמודת - לא פעיל
            else if (curRow["Source"] == "SpIpDropDown") {
                PMOClickAutoComplete.Methods.AutocompleteListIpDropDown({
                    sourceList: curRow["DispSourceList"],
                    sourceColumn: curRow["SourceColumn"],
                    columnName: curRow["DispColumnName"],
                    ignoreCase: true,
                    numChars: 1,
                    slideDownSpeed: "fast",
                    filterType: "Contains",
                    debug: false,
                    filter: curRow["filter"]
                });
            }

            // Text מידע מרשימה לעמודת
            else if (curRow["Source"] == "SpText") {
                PMOClickAutoComplete.Methods.AutocompleteListText({
                    sourceList: curRow["DispSourceList"],
                    sourceColumn: curRow["SourceColumn"],
                    columnName: curRow["DispColumnName"],
                    ignoreCase: true,
                    numChars: 1,
                    slideDownSpeed: "fast",
                    filterType: "Contains",
                    debug: false,
                    filter: curRow["filter"]
                });
            }

            // IpText מידע מרשימה לעמודת
            else if (curRow["Source"] == "SpIpText") {
                PMOClickAutoComplete.Methods.AutocompleteListIpText({
                    sourceList: curRow["DispSourceList"],
                    sourceColumn: curRow["SourceColumn"],
                    columnName: curRow["DispColumnName"],
                    ignoreCase: true,
                    numChars: 1,
                    slideDownSpeed: "fast",
                    filterType: "Contains",
                    debug: false,
                    filter: curRow["filter"]
                });
            }

            // Text מידע מבסיס נתונים לעמודת
            else if ((curRow["Source"] == "DbText") || (curRow["Source"] == "DB")) {
                PMOClickAutoComplete.Methods.AutocompleteDB({
                    sourceTable: curRow["SourceTable"],
                    sourceTableColumn: curRow["SourceTableColumn"],
                    viewSourceColumn: curRow["ViewSourceColumn"],
                    columnName: curRow["DispColumnName"],
                    numChars: 1,
                    slideDownSpeed: "fast",
                    debug: false
                });
            }
        }
    },

    Methods: {
        AutocompleteListDbTextFilter: function (options) {
            var opt = { ...PMOClickAutoComplete.GlobalVariables.option, ...options };
            // Find the input control for the column and save some of its attributes
            var columnObj = $("b:contains(" + opt.columnName + ")").siblings().next() //<br/><input...
            // column not on page 
            if (columnObj.html() === null || columnObj.html() === undefined) {
                if (opt.debug) {
                    PMOClickAutoComplete.Methods.ErrBox("Autocomplete",
                        "columnName: " + opt.columnName,
                        "Change Column name " + opt.columnName);
                }
                return;
            }
            if (opt.columnName === "שם" && opt.debug) {
                PMOClickAutoComplete.Methods.ErrBox("Autocomplete",
                    "columnName: " + opt.columnName,
                    "Change Column name " + opt.columnName);
                return;
            }

            // SpTextFilter PostBack בטל
            columnObj.attr("onchange", ""); // PostBack בטל
            columnObj.css("position", "");
            var columnObjId = columnObj.attr("ID");
            // Create new arrow img (elig)
            var containerArrId = "ArrID_" + columnObjId;
            columnObj.after("<img id='" + containerArrId + "' src='/_catalogs/masterpage/click/images/ewr074.gif' style='width:20px; vertical-align: bottom'; title='Click AutoComplete'/>");
            var curRowInd = { value: -1 };
            var isArrClick = { value: false };
            var containerArrObj = $("#" + containerArrId);
            containerArrObj.after('<p id="loader1"></p>');
            containerArrObj.click(function () { isArrClick.value = true; $(columnObj).keyup(); $(columnObj).focus(); });
            columnObj.css("width", columnObj.width() / 2); // set width
            columnObj.css("height", columnObj.height() - 3); // set height  
            var columnObjWidth = columnObj.width() + 25;
            // Create a div to contain the matching values and add it to the DOM 
            // SpTextFilter
            var containerId = "container_" + columnObjId;
            // add clare filter
            containerArrObj.after("&nbsp;&nbsp;<strong class='ms-rteFontSize-2 ms-rteForeColor-8'><a href='" + window.location.href + "' >​נקה סינון</a></strong><div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");
            $("#" + containerId).css("width", columnObjWidth);
            // Handle keypresses 24/7/14
            $(columnObj).mouseup(function () {
                $(this).select();
                $("#" + containerId).fadeOut(opt.slideUpSpeed);
            }).focusout(function () {
                $("#" + containerId).fadeOut(opt.slideUpSpeed);
                curRowInd.value = -1;
            }).keyup(function (event) {
                var isReturn = PMOClickAutoComplete.Methods.BuildKeyUpEvent(event.which, containerId, curRowInd, isArrClick, $(this).val(), columnObj, opt, PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListDbTextFilter);
                if (isReturn == 0)
                    return;
                else if (isReturn == null)
                    return false;
                // Build out the set of list elements to contain the available values
                var matchArrayList;
                if ((opt.sourceList != "") && (opt.sourceColumn != "")) {
                    matchArrayList = PMOClickAutoComplete.Methods.GetListItems(columnObj, opt, isArrClick);
                }
                if ((opt.sourceTable != "") && (opt.sourceTableColumn != "")) {
                    PMOClickAutoComplete.Methods.GetDbItems(columnObj, opt.sourceTable, opt.sourceTableColumn, containerId, opt, PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListDbTextFilter, matchArrayList);
                }
            }); // end keyup
        }, // End AutocompleteListDbTextFilter

        AutocompleteListDropDown: function (options) {
            //debugger;
            var opt = { ...PMOClickAutoComplete.GlobalVariables.option, ...options };
            // if required column 20/4/17 
            var columnObjOld = $("[Title='" + opt.columnName + "']");
            if (columnObjOld.length == 0) { // אם שדה נדרש 
                var reqField = " שדה נדרש";
                columnObjOld = $("[Title='" + opt.columnName + reqField + "']");
            }
            if (columnObjOld.html() === null || columnObjOld.html() === undefined) {
                if (opt.debug) {
                    PMOClickAutoComplete.Methods.ErrBox("Autocomplete",
                        "columnName: " + opt.columnName,
                        "Change Column name " + opt.columnName);
                }
                return;
            }
            if (opt.columnName === "שם" && opt.debug) {
                PMOClickAutoComplete.Methods.ErrBox("Autocomplete",
                    "columnName: " + opt.columnName,
                    "Change Column name " + opt.columnName);
                return;
            }
            // hide original drop down and create new text input (elig)
            var selectedText;
            // if less then 20 items -> input 
            var columnObj7 = $("input[Title='" + opt.columnName + "']");
            if (columnObj7.length == 0) { // אם שדה נדרש 
                var reqField = " שדה נדרש";
                columnObj7 = $("input[Title='" + opt.columnName + reqField + "']");
            }

            if (columnObj7.length > 0) { // 20 items and up
                columnObj7.hide();
                columnObj7.parent().children('img').hide();
                selectedText = columnObj7[0].value;
            }
            // else more then 20 items -> select 
            else { // less then 20 items
                columnObj7 = $("select[Title='" + opt.columnName + "']");
                if (columnObj7.length == 0) { // אם שדה נדרש 
                    var reqField = " שדה נדרש";
                    columnObj7 = $("select[Title='" + opt.columnName + reqField + "']");
                }
                columnObj7.hide();
                selectedText = columnObj7.find("option:selected")[0].innerText;
            }
            var columnObjId = "newObjID_" + opt.columnName.replace(/\s/g, '_').replace('*', '-'); // replace whitespace recursivly 
            columnObj7.before("<input id='" + columnObjId + "' class='ms-long ms-spellcheck-true'>");
            var columnObj = $("#" + columnObjId);
            columnObj[0].title = opt.columnName;
            columnObj[0].value = selectedText;
            if (columnObj[0].value == "(ללא)") {
                columnObj[0].value = "";
            }
            columnObj.css("class", "ms-long ms-spellcheck-true");
            columnObj.css("width", "350");
            var columnObjId = columnObj.attr("ID");
            var columnObjColor = columnObj7.css("color");

            // Remove the <br/> which isn't needed and messes up the formatting
            columnObj.closest("span").find("br").remove();
            columnObj.wrap("<div style='min-width:400px;'>");
            // Create new arrow img
            // 2col
            var containerArrId = columnObjId.replace('newObjID_', 'ArrID_');
            columnObj.after("<img id='" + containerArrId + "' src='/_catalogs/masterpage/click/images/ewr074.gif' style='width:30px; vertical-align: top'; title='Click AutoComplete'/>");

            var curRowInd = { value: -1 };
            var isArrClick = { value: false };
            var containerArrObj = $("#" + containerArrId);
            containerArrObj.click(function () { isArrClick.value = true; $(columnObj).keyup(); $(columnObj).focus(); });

            var columnObjWidth = columnObj.width() + 22;
            // Create a div to contain the matching values and add it to the DOM
            var containerId = PMOClickAutoComplete.Methods.GenContainerId("Autocomplete", opt.columnName);
            containerArrObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + "; display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");
            $("#" + containerId).css("width", columnObjWidth);

            // Handle keypresses 24/7/14
            $(columnObj).mouseup(function () {
                $(this).select();
                $("#" + containerId).fadeOut(opt.slideUpSpeed);
            }).focusout(function () {
                $("#" + containerId).fadeOut(opt.slideUpSpeed);
                curRowInd.value = -1;
            }).keyup(function (event) {
                var isReturn = PMOClickAutoComplete.Methods.BuildKeyUpEvent(event.which, containerId, curRowInd, isArrClick, $(this).val(), columnObj, opt, PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListDropDown, columnObj7);
                if (isReturn == 0)
                    return;
                else if (isReturn == null)
                    return false;
                // Build out the set of list elements to contain the available values
                var matchArray = PMOClickAutoComplete.Methods.GetListItems(columnObj, opt, isArrClick);
                PMOClickAutoComplete.Methods.BuildListItems(matchArray, opt, columnObj, containerId, columnObjColor, PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListDropDown);
            }); // end keyup
        }, // End AutocompleteListDropDown

        AutocompleteListIpDropDown: function (options) {
            var opt = { ...PMOClickAutoComplete.GlobalVariables.option, ...options };
            if (opt.columnName === "שם" && opt.debug) {
                PMOClickAutoComplete.Methods.ErrBox("Autocomplete",
                    "columnName: " + opt.columnName,
                    "Change Column name " + opt.columnName);
                return;
            }
            // hide original drop down and create new text input (elig)
            var selectedText;
            var columnObj7 = $("#" + opt.columnName);

            if (columnObj7.length == 0) { // אם שדה נדרש 
                var reqField = " שדה נדרש";
                columnObj7 = $("input[Title='" + opt.columnName + reqField + "']");
            }

            if (columnObj7.length > 0) { // 20 items and up
                columnObj7.hide();
                columnObj7.parent().children('img').hide();
                selectedText = columnObj7[0].value;
            }
            // else more then 20 items -> select 
            else { // less then 20 items
                columnObj7 = $("select[Title='" + opt.columnName + "']");
                if (columnObj7.length == 0) { // אם שדה נדרש 
                    var reqField = " שדה נדרש";
                    columnObj7 = $("select[Title='" + opt.columnName + reqField + "']");
                }
                columnObj7.hide();
                selectedText = columnObj7.find("option:selected")[0].innerText;
            }
            var columnObjId = "newObjID_" + opt.columnName.replace(/\s/g, '_').replace('*', '-'); // replace whitespace recursivly 
            columnObj7.before("<input id='" + columnObjId + "' class='ms-long ms-spellcheck-true'>");
            var columnObj = $("#" + columnObjId);

            columnObj[0].title = opt.columnName;
            columnObj[0].value = selectedText;
            if (columnObj[0].value == "(ללא)") {
                columnObj[0].value = "";
            }
            columnObj.css("class", "ms-long ms-spellcheck-true");
            columnObj.css("width", "363");
            var columnObjId = columnObj.attr("ID");
            var columnObjColor = columnObj7.css("color");
            // Remove the <br/> which isn't needed and messes up the formatting
            columnObj.closest("span").find("br").remove();
            columnObj.wrap("<div  style='min-width:400px;' >");
            // Create new arrow img (elig)
            // 2col
            var containerArrId = columnObjId.replace('newObjID_', 'ArrID_');
            columnObj.after("<img id='" + containerArrId + "' src='/_catalogs/masterpage/click/images/ewr074.gif' style='width:21px; vertical-align: top'; title='Click AutoComplete'/>");
            var curRowInd = { value: -1 };
            var isArrClick = { value: false };
            var containerArrObj = $("#" + containerArrId);
            containerArrObj.click(function () { isArrClick.value = true; $(columnObj).keyup(); $(columnObj).focus(); });

            var columnObjWidth = columnObj.width() + 20;
            // Create a div to contain the matching values and add it to the DOM
            var containerId = PMOClickAutoComplete.Methods.GenContainerId("Autocomplete", opt.columnName);
            containerArrObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + "; display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");
            // Handle keypresses 24/7/14
            $(columnObj).mouseup(function () {
                $(this).select();
                $("#" + containerId).fadeOut(opt.slideUpSpeed);
            }).focusout(function () {
                $("#" + containerId).fadeOut(opt.slideUpSpeed);
                curRowInd.value = -1;
            }).keyup(function (event) {
                var isReturn = PMOClickAutoComplete.Methods.BuildKeyUpEvent(event.which, containerId, curRowInd, isArrClick, $(this).val(), columnObj, opt, PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListIpDropDown, columnObj7);
                if (isReturn == 0)
                    return;
                else if (isReturn == null)
                    return false;
                // Build out the set of list elements to contain the available values
                var matchArray = PMOClickAutoComplete.Methods.GetListItems(columnObj, opt, isArrClick);
                PMOClickAutoComplete.Methods.BuildListItems(matchArray, opt, columnObj, containerId, columnObjColor, PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListIpDropDown);
            }); // end keyup
        }, // End AutocompleteListIpDropDown

        AutocompleteListText: function (options) {
            var opt = { ...PMOClickAutoComplete.GlobalVariables.option, ...options };
            // Find the input control for the column and save some of its attributes
            // if required column 20/4/17 
            var columnObj = $("input[Title='" + opt.columnName + "']");
            if (columnObj.length == 0) { // אם שדה נדרש 
                var reqField = " שדה נדרש";
                columnObj = $("input[Title='" + opt.columnName + reqField + "']");
            }
            if (columnObj.html() === null || columnObj.html() === undefined) {
                if (opt.debug) {
                    PMOClickAutoComplete.Methods.ErrBox("Autocomplete",
                        "columnName: " + opt.columnName,
                        "Change Column name " + opt.columnName);
                }
                return;
            }
            var columnObjWidth = columnObj.css("width");
            var columnObjColor = columnObj.css("color");
            columnObj.css("position", "");
            // Remove the <br/> which isn't needed and messes up the formatting
            columnObj.closest("span").find("br").remove();

            //columnObj.wrap("<div>"); 10/4/17
            columnObj.wrap("<div style='min-width:400px;'>");
            // Create new arrow img (elig)
            var containerArrId = "ArrID_" + opt.columnName.replace(/\s/g, '_').replace('*', '-'); // replace whitespace recursivly  
            columnObj.after("<img id='" + containerArrId + "' src='/_catalogs/masterpage/click/images/ewr074.gif' style='width:23px; vertical-align: top'; title='Click AutoComplete'/>");

            var isArrClick = { value: false };
            var containerArrObj = $("#" + containerArrId);
            containerArrObj.click(function () { isArrClick.value = true; $(columnObj).keyup(); $(columnObj).focus(); });
            columnObj.css("width", columnObj.width() - 30); // set width    
            // Create a div to contain the matching values and add it to the DOM
            var containerId = PMOClickAutoComplete.Methods.GenContainerId("Autocomplete", opt.columnName);
            containerArrObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");
            // Handle keypresses
            var curRowInd = { value: -1 };
            // Handle keypresses
            $(columnObj).mouseup(function () {
                $(this).select();
                $("#" + containerId).fadeOut(opt.slideUpSpeed);
            }).focusout(function () {
                $("#" + containerId).fadeOut(opt.slideUpSpeed);
                curRowInd.value = -1;
            }).keyup(function (event) {
                var isReturn = PMOClickAutoComplete.Methods.BuildKeyUpEvent(event.which, containerId, curRowInd, isArrClick, $(this).val(), columnObj, opt, PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListText);
                if (isReturn == 0)
                    return;
                else if (isReturn == null)
                    return false;
                // Build out the set of list elements to contain the available values
                var matchArray = PMOClickAutoComplete.Methods.GetListItems(columnObj, opt, isArrClick);
                PMOClickAutoComplete.Methods.BuildListItems(matchArray, opt, columnObj, containerId, columnObjColor, PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListText);
            }) // end keyup
        }, // End AutocompleteListText

        // Provide suggested values from list's for input column based on characters typed 
        AutocompleteListIpText: function (options) {
            var opt = { ...PMOClickAutoComplete.GlobalVariables.option, ...options };

            // Find the input control for the column and save some of its attributes
            var columnName = opt.columnName;
            var columnObj = $("#" + columnName);
            columnObj.closest('span').css("height", '10px'); // 2 line height -> 1 line height  
            columnObj.css("position", "");
            var columnObjId = columnObj.attr("ID"); // id is uniqe 
            var columnObjColor = columnObj.css("color");
            var columnObjWidth = columnObj.css("width");
            // column not on page 
            if (columnObj.html() === null || columnObj.html() === undefined) {
                if (opt.debug) {
                    PMOClickAutoComplete.Methods.ErrBox("Autocomplete",
                        "columnName: " + opt.columnName,
                        "Change Column name " + opt.columnName);
                }
                return;
            }

            if (opt.columnName === "שם" && opt.debug) {
                PMOClickAutoComplete.Methods.ErrBox("Autocomplete",
                    "columnName: " + opt.columnName,
                    "Change Column name " + opt.columnName);
                return;
            }

            // Remove the <br/> which isn't needed and messes up the formatting
            columnObj.closest("span").find("br").remove();
            // Create new arrow img
            var containerArrId = "ArrID_" + columnObjId;
            columnObj.after("<img id='" + containerArrId + "' src='/_catalogs/masterpage/click/images/ewr074.gif' style='width:18px; vertical-align: top'; title='Click AutoComplete'/>");
            var isArrClick = { value: false };
            var containerArrObj = $("#" + containerArrId);
            containerArrObj.click(function () { isArrClick.value = true; $(columnObj).keyup(); $(columnObj).focus(); });
            columnObj.css("width", columnObj.width() - 12); // set width 30  // 19/4/17 
            // Create a div to contain the matching values and add it to the DOM
            var containerId = "container_" + columnObj.attr("ID");

            containerArrObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");
            $("#" + containerId).css("width", columnObjWidth);

            // Handle keypresses 24/7/14
            var curRowInd = { value: -1 };
            $(columnObj).mouseup(function () {
                $(this).select();
                $("#" + containerId).fadeOut(opt.slideUpSpeed);
            }).focusout(function () {
                $("#" + containerId).fadeOut(opt.slideUpSpeed);
                curRowInd.value = -1;
            }).keyup(function (event) {
                var isReturn = PMOClickAutoComplete.Methods.BuildKeyUpEvent(event.which, containerId, curRowInd, isArrClick, $(this).val(), columnObj, opt, PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListIpText);
                if (isReturn == 0)
                    return;
                else if (isReturn == null)
                    return false;
                // Build out the set of list elements to contain the available values
                var matchArray = PMOClickAutoComplete.Methods.GetListItems(columnObj, opt, isArrClick); //newfunc
                PMOClickAutoComplete.Methods.BuildListItems(matchArray, opt, columnObj, containerId, columnObjColor, PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListIpText);
            }); // end keyup
        }, // End AutocompleteListIpText

        AutocompleteDB: function (options) {
            var opt = { ...PMOClickAutoComplete.GlobalVariables.option, ...options };
            // Find the input control for the column and save some of its attributes
            // if required column 20/4/17 
            var columnObj = $("input[Title='" + opt.columnName + "']");
            if (columnObj.length == 0) { // אם שדה נדרש 
                var reqField = " שדה נדרש";
                columnObj = $("input[Title='" + opt.columnName + reqField + "']");
            }
            if (columnObj.html() === null || columnObj.html() === undefined) {
                if (opt.debug) {
                    PMOClickAutoComplete.Methods.ErrBox("Autocomplete",
                        "columnName: " + opt.columnName,
                        "Change Column name " + opt.columnName);
                }
                return;
            }
            var columnObjWidth = columnObj.css("width");
            columnObj.css("position", "");
            // Remove the <br/> which isn't needed and messes up the formatting
            columnObj.closest("span").find("br").remove();

            //columnObj.wrap("<div>"); 10/4/17
            columnObj.wrap("<div style='min-width:400px;'>");
            // Create new arrow img (elig)
            var containerArrId = "ArrID_" + opt.columnName.replace(/\s/g, '_').replace('*', '-'); // replace whitespace recursivly  
            columnObj.after("<img id='" + containerArrId + "' src='/_catalogs/masterpage/click/images/ewr074.gif' style='width:23px; vertical-align: top'; title='Click AutoComplete'/>");

            var isArrClick = { value: false };
            var containerArrObj = $("#" + containerArrId);
            containerArrObj.after('<p id="loader1"></p>');
            containerArrObj.click(function () { isArrClick.value = true; $(columnObj).keyup(); $(columnObj).focus(); });

            columnObj.css("width", columnObj.width() - 30); // set width    
            // Create a div to contain the matching values and add it to the DOM
            var containerId = PMOClickAutoComplete.Methods.GenContainerId("Autocomplete", opt.columnName);
            containerArrObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");

            // Handle keypresses
            var curRowInd = { value: -1 };
            // Handle keypresses
            $(columnObj).mouseup(function () {
                $(this).select();
                $("#" + containerId).fadeOut(opt.slideUpSpeed);
            }).focusout(function () {
                $("#" + containerId).fadeOut(opt.slideUpSpeed);
                curRowInd.value = -1;
            }).keyup(function (event) {
                var isReturn = PMOClickAutoComplete.Methods.BuildKeyUpEvent(event.which, containerId, curRowInd, isArrClick, $(this).val(), columnObj, opt, PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteDB);
                if (isReturn == 0)
                    return;
                else if (isReturn == null)
                    return false;
                // Build out the set of list elements to contain the available values
                PMOClickAutoComplete.Methods.GetDbItems(columnObj, opt.sourceTable, opt.sourceTableColumn, containerId, opt, PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteDB);
            }) // end keyup
        }, // End AutocompleteDB

        SortUnique: function (Arr) {
            Arr.sort();
            for (var i = 1; i < Arr.length; i++)
                if (Arr[i] == Arr[i - 1])
                    Arr.splice(i, 1);
            return Arr;
        },

        GetListItems: function (columnObj, opt, isArrClick) {
            // Get the column's value
            var columnValue = columnObj.val();
            // Array to hold the matched values
            var matchArray;
            // Build the appropriate CAMLQuery
            var data;
            if (opt.filter == null || opt.filter == "") {
                data = PMOClick.Methods.GetListItemsREST(PMOClick.CONSTANTS.WEBABSOLUTEURL, opt.sourceList, "$Select=" + opt.sourceColumn, null, null, null, "&$top=500");
            }
            else {
                data = PMOClick.Methods.GetListItemsREST(PMOClick.CONSTANTS.WEBABSOLUTEURL, opt.sourceList, "$Select=" + opt.sourceColumn + "," + opt.filter.columnName, null, null, null, "&$top=500");
                debugger
                matchArray = [];
                for (var i = 0; i < data.value.length; i++) {
                    // Make sure we have a match...
                    var firstMatch = eval(data.value[i][opt.filter.columnName] + opt.filter.value);
                    if (firstMatch <= 0) {
                        // ...and that the match is not already in the array if we want uniqueness
                        data.value.splice(i, 1);
                    }
                }
            }
            // if arrow cliced - show all row's
            if (isArrClick.value == true) {
                isArrClick.value = false;
            }
            matchArray = PMOClickAutoComplete.Methods.GetArrFilterAndOrder(opt, columnValue, data.value);
            return matchArray;
        },

        GetArrFilterAndOrder: function (opt, columnValue, data) {
            var matchArray = [];
            var testValue = opt.ignoreCase ? columnValue.toUpperCase() : columnValue;
            if (opt.filterType === "Contains") {
                matchArray = PMOClickAutoComplete.Methods.FilterContains(data, testValue, opt.sourceColumn, opt.ignoreCase, opt.uniqueVals);
            }
            else {
                matchArray = PMOClickAutoComplete.Methods.FilterBeginWith(data, testValue, opt.sourceColumn, opt.ignoreCase, opt.uniqueVals);
            }
            matchArray = PMOClickAutoComplete.Methods.SortUnique(matchArray);
            return matchArray;
        },

        FilterContains: function (data, testValue, sourceColumn, ignoreCase, uniqueVals) {
            var matchArray = [];
            for (var i = 0; i < data.length; i++) {
                var thisValue = data[i][sourceColumn];
                if (thisValue == undefined) {
                    return true; //continue
                }
                var thisValueTest = ignoreCase ? thisValue.toUpperCase() : thisValue;
                // Make sure we have a match...
                var firstMatch = thisValueTest.indexOf(testValue);
                if ((firstMatch >= 0) &&
                    // ...and that the match is not already in the array if we want uniqueness
                    (!uniqueVals || ($.inArray(thisValue, matchArray) === -1))) {
                    matchArray.push(thisValue);
                }
            }
            return matchArray;
        },

        FilterBeginWith: function (data, testValue, sourceColumn, ignoreCase, uniqueVals) {
            var matchArray = [];
            for (var i = 0; i < data.length; i++) {
                var thisValue = data[i][sourceColumn];
                if (thisValue == undefined) {
                    return true; //continue
                }
                var thisValueTest = ignoreCase ? thisValue.toUpperCase() : thisValue;
                // Handles normal case, which is BeginsWith and and other unknown values
                if (testValue === thisValueTest.substr(0, testValue.length) &&
                    // ...and that the match is not already in the array if we want uniqueness
                    (!uniqueVals || ($.inArray(thisValue, matchArray) === -1))) {
                    matchArray.push(thisValue);
                }
            }
            return matchArray;
        },

        // Generate a unique id for a containing div using the function name and the column display name
        GenContainerId: function (funcname, columnName) {
            // var context = new SP.ClientContext.get_current();
            // var listTitle = "Name of List";
            // list = context.get_web().get_lists().getByTitle(listTitle);
            // var listID = list.id;
            // return funcname + "_" + $().SPServices.SPGetStaticFromDisplay({
            //     listName: lst,
            //     columnDisplayName: columnName
            // });
            var id = funcname + "-" + $("input[Title='" + columnName + "']")[0].id;
            if (id != null && id != undefined) {
              //  id = id.replaceAll('$', '');
              id = id.replace('$/g', '');
            }
            return id;
        }, // End of function GenContainerId

        GetDbItems: function (columnObj, sourceTable, sourceColumn, containerId, opt, autoCompleteType, matchArrayList = null) {
            // Get the column's value
            var columnValue = columnObj.val();
            // Array to hold the matched values
            var matchArray = [];
            $("#loader1")[0].style.display = "block";
            PMOClick.Methods.HtmlHttpRequest({
                url: "/_vti_bin/ConnectedItemsAPI/api/ConnectItems/GetTableCol/?tableName=" + sourceTable + "&colName=" + sourceColumn + "&filter=" + columnValue,
                method: "GET",
                headers: { 'accept': 'application/json;odata=verbose' }
            }).then(data => {
                var columnObjColor = columnObj.css("color");
                var items = JSON.parse(data);
                Array.prototype.forEach.call(items, function (item) {
                    matchArray.push(item.Col);
                });
                if (autoCompleteType == PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListDbTextFilter) {
                    if ((matchArrayList != null) && (matchArray != null)) {
                        for (i = 0; i < matchArrayList.length; i++) { //string;#  
                            matchArrayList[i] = matchArrayList[i].replace("string;#", "");
                        }
                        for (i = 0; i < matchArray.length; i++) {
                            matchArray[i] = matchArray[i].replace("  ", " ");
                        }
                        matchArray = matchArrayList.concat(matchArray);
                        matchArray = PMOClickAutoComplete.Methods.SortUnique(matchArray);
                    }
                    else if (matchArrayList != null) {
                        matchArray = matchArrayList;
                    }
                    else if (matchArray != null) {
                        matchArray = matchArray;
                    }
                }
                PMOClickAutoComplete.Methods.BuildListItems(matchArray, opt, columnObj, containerId, columnObjColor, autoCompleteType);
                $("#loader1")[0].style.display = "none";
            })
                .catch(error => {
                    console.log(error);
                });
        },

        BuildKeyUpEvent: function (which, containerId, curRowInd, isArrClick, columnValue, columnObj, opt, autoCompleteType, columnObj7 = null) {
            if (autoCompleteType != PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListDbTextFilter)
                $(":button[innerText*='הוסף']").prop('disabled', true); // כפתור הוסף של שדה בדיקת מידע, אפשר ערכים מרובים לוקח פוקוס של מקש אנטר
            // Handle key down, up, enter
            if (which == 40) { // down
                var rows = $("." + containerId + "_li");
                if (curRowInd.value > -1) {
                    rows[curRowInd.value].style.backgroundColor = "white";
                    rows[curRowInd.value].style.color = "black";
                }
                curRowInd.value = curRowInd.value + 1;
                if (curRowInd.value >= rows.length) {
                    curRowInd.value = 0;
                }
                rows[curRowInd.value].style.backgroundColor = "#3399ff";
                rows[curRowInd.value].style.color = "white";
                return 0;
            }
            else if (which == 38) { // up
                var rows = $("." + containerId + "_li");
                if (curRowInd.value > -1) {
                    rows[curRowInd.value].style.backgroundColor = "white";
                    rows[curRowInd.value].style.color = "black";
                }
                curRowInd.value = curRowInd.value - 1;
                if (curRowInd.value < 0) {
                    curRowInd.value = rows.length - 1;
                }

                rows[curRowInd.value].style.backgroundColor = "#3399ff";
                rows[curRowInd.value].style.color = "white";
                return 0;
            }
            else if (which == 13) { // enter
                if (autoCompleteType != PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListDbTextFilter)
                    $(":button[innerText*='הוסף']").prop('disabled', false); // כפתור הוסף של שדה בדיקת מידע, אפשר ערכים מרובים לוקח פוקוס של מקש אנטר
                else {
                    // SpTextFilter אם ערך לסינון ריק הצג את כל הרשימה
                    if (columnValue == "") {
                        __doPostBack(columnObj.id, ''); // do postback
                    }
                }
                var rows = $("." + containerId + "_li");
                rows[curRowInd.value].click();
                return 0;
            }
            else { // הוקש אות, המשך טיפול רגיל
                curRowInd.value = -1;
            }
            // end - Handle key down, up, enter
            // Hide the container while we're working on it
            $("#" + containerId).hide();
            if (autoCompleteType == PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListIpDropDown || autoCompleteType == PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListDropDown)
                PMOClickAutoComplete.Methods.InitDropDown(columnValue, columnObj7, columnObj);
            if (isArrClick.value == false) {
                // 2col 
                if (columnValue.length == 0) {
                    columnObj.css("background-image", "");
                }
                // Have enough characters been typed yet?
                if (columnValue.length < opt.numChars) {
                    return null;
                }
                isArrClick.value = true;
            }
            else {
                isArrClick.value = false;
            }
            // Show the processingIndicator as a background image in the input element
            columnObj.css({
                "background-image": "url(" + opt.processingIndicator + ")",
                "background-position": "right",
                "background-repeat": "no-repeat"
            });
            return 1;
        },

        BuildListItems: function (matchArray, opt, columnObj, containerId, columnObjColor, autoCompleteType) {
            var out = "";
            // Build out the set of list elements to contain the available values
            for (i = 0; i < matchArray.length; i++) {
                if (autoCompleteType != PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteDB) {
                    //del string#
                    diaseInd = matchArray[i].indexOf("#");
                    if (diaseInd > 0)
                        matchArray[i] = matchArray[i].substr(diaseInd + 1);
                }
                // If a highlightClass has been supplied, wrap a span around each match
                if (opt.highlightClass.length > 0) {
                    // Set up Regex based on whether we want to ignore case
                    var thisRegex = RegExp(columnValue, opt.ignoreCase ? "gi" : "g");
                    // Look for all occurrences
                    var matches = matchArray[i].match(thisRegex);
                    var startLoc = 0;
                    // Loop for each occurrence, wrapping each in a span with the highlightClass CSS class
                    for (var matchNum = 0; matchNum < matches.length; matchNum++) {
                        var thisPos = matchArray[i].indexOf(matches[matchNum], startLoc);
                        var endPos = thisPos + matches[matchNum].length;
                        var thisSpan = "<span class='" + opt.highlightClass + "'>" + matches[matchNum] + "</span>";
                        matchArray[i] = matchArray[i].substr(0, thisPos) + thisSpan + matchArray[i].substr(endPos);
                        startLoc = thisPos + thisSpan.length;
                    }
                }
                // Add the value to the markup for the container
                out += "<li class=" + containerId + "_li style='color:black; display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>"; // Black Text 24/7/14
            }
            // Add all the list elements to the containerId container
            $("#" + containerId).html(out);
            // Set up behavior for the available values in the list element
            $("." + containerId + "_li").click(function () {
                if (autoCompleteType != PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListIpDropDown) {
                    $("#" + containerId).fadeOut(opt.slideUpSpeed);
                    columnObj.val($(this).text());//put the chosen value into drop down container
                    if (autoCompleteType == PMOClickAutoComplete.CONSTANTS.AutoCompleteType.AutocompleteListDbTextFilter)
                   { __doPostBack(columnObj.id, '');}
                ///}
                    
                else {
                    $("#" + containerId).fadeOut(opt.slideUpSpeed);
                    ///**$("#" + columnObjId).val($(this).text());*///
                    $("#" + containerId).val($(this).text());
                    var columnObj7 = $("[Title='" + opt.columnName + "']");
                    
                    // copy selected value from new input to dropdown
                    var selectedVal = columnObj[0].value;

                    if (selectedVal == "") {
                        selectedVal.value = "(ללא)";
                    }
                    if (columnObj7[1].tagName == "SELECT") { // less then 20 items
                        selectedVal = selectedVal.trim();
                       
                        for (i = 0; i < columnObj7[1].length; i++) {
                            if (columnObj7[1].options[i].text == selectedVal)
                                columnObj7[1].options[i].selected = true;
                        }
                    }
                    else { // 20 items and up
                        FilterChoice("", columnObj7[1], selectedVal, ""); //core.js
                    }
                }}
            }).mouseover(function () {
                var mouseoverCss = {
                    "cursor": "hand",
                    "color": "#ffffff",
                    "background": "#3399ff"
                };
                $(this).css(mouseoverCss);
            }).mouseout(function () {
                var mouseoutCss = {
                    "cursor": "inherit",
                    "color": columnObjColor,
                    "background": "transparent"
                };
                $(this).css(mouseoutCss);
            });
            // If we've got some values to show, then show 'em!
            if (out != "") {
                $("#" + containerId).slideDown(opt.slideDownSpeed);
                // Remove the processing indicator
                columnObj.css("background-image", "");
            }
        },

        InitDropDown: function (columnValue, columnObj7, columnObj) {
            if (columnValue == "") { // "" = (ללא)
                if (columnObj7[0].tagName == "SELECT") { // less then 20 items
                    for (i = 0; i < columnObj7[0].length; i++) {
                        if (columnObj7[0].options[i].text == "(ללא)")
                            columnObj7[0].options[i].selected = true;
                    }
                }
                else { // 20 items and up
                    debugger;
                    columnObj.css("background-image", "");
                    FilterChoice("", columnObj7[0], "(ללא)", ""); //core.js
                }
            }
        },

        // Build an error message based on passed parameters
        ErrBox: function (func, param, msg) {
            var errMsg = "<b>Error in function</b><br/>" + func + "<br/>" +
                "<b>Parameter</b><br/>" + param + "<br/>" +
                "<b>Message</b><br/>" + msg + "<br/><br/>" +
                "<span onmouseover='this.style.cursor=\"hand\";' onmouseout='this.style.cursor=\"inherit\";' style='width=100%;text-align:right;'>Click to continue</span></div>";
            modalBox(errMsg);
        }, // End of function ErrBox

        // Call this function to pop up a branded modal msgBox
        modalBox: function (msg) {
            var boxCSS = "position:absolute;width:300px;height:150px;padding:10px;background-color:#000000;color:#ffffff;z-index:1000;font-family:'Arial';font-size:12px;display:none;";
            $("#aspnetForm").parent().append("<div id='msgBox' style=" + boxCSS + ">" + msg);
            var height = $("#msgBox").height();
            var width = $("#msgBox").width();
            var leftVal = ($(window).width() / 2) - (width / 2) + "px";
            //var topVal = ($(window).height() / 2) - (height / 2) - 100 + "px";
            var topVal = ($(window).height() / 2) - (height / 2) + "px";
            $("#msgBox").css({ border: '5px #C02000 solid', left: leftVal, top: topVal }).show().fadeTo("slow", 0.75).click(function () {
                $(this).fadeOut("3000", function () {
                    $(this).remove();
                });
            });
        } // End of function modalBox
    }
}