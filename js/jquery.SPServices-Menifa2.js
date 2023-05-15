 ///////////////////////////////////////////
 //           Menifa AutoComplete         //
 //         for SP list or DB table       //
 //  Eli Goldreich     Date 24/3/15       //
 //  Update Sp16       Date 18/7/17        //
 ///////////////////////////////////////////
   

////// PRIVATE MENIFA FUNCTIONS ////////
  
 	
	var newColumns;
	function acMain (new_Columns){ //debugger;
	   newColumns = new_Columns;
       
  	   for (i = 0; i < newColumns.length; i++) { 
           var curRow = newColumns[i];
           
           	//debugger	   
		   // מידע מרשימה ומבסיס נתונים למסנן טקסט
		   if(curRow["Source"] == "SpDbTextFilter"){
	    	   $().SPServices.SPAutocompleteListDbTextFilter({	
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
    	   else if( (curRow["Source"] == "SpDropDown") || (curRow["Source"] == "SP") ){
    	   //if(curRow["Source"] == "SpDropDown"){
	    	   //$().SPServices.SPAutocompleteListDropDown({	
				SPAutocompleteListDropDown({
			   sourceList: curRow["DispSourceList"],
			   sourceColumn: curRow["SourceColumn"],
			   columnName: curRow["DispColumnName"],
			   ignoreCase: true,
			   numChars: 1,
			   slideDownSpeed: "fast",
			   filterType: "Contains",
			   debug: false,
			   CAMLQuery: curRow["CAMLQuery"]
		       });
		   }
		   
		   // IpDropDown מידע מרשימה לעמודת - לא פעיל
    	   else if(curRow["Source"] == "SpIpDropDown"){
	    	   $().SPServices.SPAutocompleteListIpDropDown({	
			   sourceList: curRow["DispSourceList"],
			   sourceColumn: curRow["SourceColumn"],
			   columnName: curRow["DispColumnName"],
			   ignoreCase: true,
			   numChars: 1,
			   slideDownSpeed: "fast",
			   filterType: "Contains",
			   debug: false,
			   CAMLQuery: curRow["CAMLQuery"]
		       });
		   }

		   

		   // Text מידע מרשימה לעמודת
		   else if(curRow["Source"] == "SpText"){
	    	   $().SPServices.SPAutocompleteListText({	
			   sourceList: curRow["DispSourceList"],
			   sourceColumn: curRow["SourceColumn"],
			   columnName: curRow["DispColumnName"],
			   ignoreCase: true,
			   numChars: 1,
			   slideDownSpeed: "fast",
			   filterType: "Contains",
			   debug: false,
			   CAMLQuery: curRow["CAMLQuery"]
		       });
		   }
		   
		   // IpText מידע מרשימה לעמודת
		   else if(curRow["Source"] == "SpIpText"){
	    	   $().SPServices.SPAutocompleteListIpText({	
			   sourceList: curRow["DispSourceList"],
			   sourceColumn: curRow["SourceColumn"],
			   columnName: curRow["DispColumnName"],
			   ignoreCase: true,
			   numChars: 1,
			   slideDownSpeed: "fast",
			   filterType: "Contains",
			   debug: false,
			   CAMLQuery: curRow["CAMLQuery"]
		       });
		   }


		   
		   // Text מידע מבסיס נתונים לעמודת
		   //else if(curRow["Source"] == "DbText"){
		   else if( (curRow["Source"] == "DbText") || (curRow["Source"] == "DB") ){  
		        $().SPServices.SPAutocompleteDB({	
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


	
	}
	
		
	function PreSaveAction (){        
    var isOk = true;
       for (j = 0; j < newColumns.length; j++) { //debugger;
          var curRow = newColumns[j];  
          if(checkValedItem(curRow["Source"], curRow["DispColumnName"]) == false){
             isOk = false;
	         break; 
          }
       }

    return isOk; 
	}
   
 
   // check if selected value is from drop down list
   function checkValedItem(Source, ColumnName) { 
    		   		
   		//if Source == "DB" then object is input 
   		//if Source == "SP" then object is input or select 
   		//var columnObj = $("input[Title='" + ColumnName + "']"); 
   		var columnObj = $("[Title='" + ColumnName + "']"); 
   		if (columnObj.length == 0){ //אל תבצע בדיקה אם עמודה לא קיימת 
   		   return true;
   		}
   		
   		if (Source == "SP"){  // if Source == "SP"
   		   var columnObjId = "newObjID_" + ColumnName.replace(' ', '_').replace('*', '-');
   		   columnObj = $("#" + columnObjId);
   		}

		
   		var containerId = genContainerId("SPAutocomplete", ColumnName); 
   		var containerDivObj = $("#" + containerId); 	
           
        if (columnObj.css('background-image') != "none" ){
            msgBox("בעמודה: "  + ColumnName, " לא נבחר ערך מהרשימה !");
   			return false;
		}

        
        if (containerDivObj[0].all.length == 0){ // אם רשימה ריקה אל תבדוק
           return true;
        }
        
        if (columnObj[0].value == ""){ // אפשר מחרוזת ריקה
           return true;
        }
         
        else{  // בדוק אם ערך מחרוזת מופיע ברשימה
	        for (i = 0; i < containerDivObj[0].all.length; i++){
	           if (containerDivObj[0].all[i].innerText == columnObj[0].value ){
	               return true;
	 		   }
	        }
	        
	        msgBox("בעמודה: "  + ColumnName, " לא נבחר ערך מהרשימה !");
 		    return false;
		}    
        
   }
   
   
	// add sortUnique function for Array object
	/*
	Array.prototype.sortUnique = function() { // error missing ";" 
 	    this.sort();
	    for (var i=1;i<this.length;i++)
	        if (this[i] == this[i-1])
	            this.splice(i, 1);
	    return this;
	}
	*/	
	function sortUnique(Arr) // new sortUnique function for menifa 2016
	{  
 	    Arr.sort();
	    for (var i=1;i<Arr.length;i++)
	        if (Arr[i] == Arr[i-1])
	            Arr.splice(i, 1);
	    return Arr;
	}
	//
	
   
   function getListItems(columnObj, opt, isArrClick) { //debugger;
   
   		    // Get the column's value
		    var columnValue = columnObj.val();
   		
   		    // Array to hold the matched values
			var matchArray = [];
						
			// Build the appropriate CAMLQuery
			var camlQuery;
			if (columnValue == ""){ // אם מחרוזת ריקה הבא את כל הערכים
			    camlQuery = "<Query><OrderBy><FieldRef Name='" + opt.sourceColumn + "'/></OrderBy></Query>"; 
			}
			else{ 
				camlQuery = "<Query><OrderBy><FieldRef Name='" + opt.sourceColumn + "'/></OrderBy><Where>";
				if(opt.CAMLQuery.length > 0) {
					camlQuery += "<And>";
				}
				
				camlQuery += "<" + opt.filterType + "><FieldRef Name='" + opt.sourceColumn + "'/><Value Type='Text'>" + columnValue + "</Value></" + opt.filterType + ">";			
				
				if(opt.CAMLQuery.length > 0) {
					camlQuery += opt.CAMLQuery + "</And>";
				}
				camlQuery += "</Where></Query>";
			}
			
			// if arrow cliced - show all row's (elig)
            if(isArrClick == true) {
			   isArrClick = false;
			   
			   camlQuery = "<Query><OrderBy><FieldRef Name='" + opt.sourceColumn + "'/></OrderBy><Where>";
			   if(opt.CAMLQuery.length > 0) {
				camlQuery += opt.CAMLQuery;
			    }
			camlQuery += "</Where></Query>";
			}

			// 30/4/17  root site value must be:  /
			opt.WebURL = $().SPServices.SPGetCurrentSite();  
			
	
			// Call GetListItems to find all of the potential values
			$().SPServices({
				operation: "GetListItems",
				async: false,
				webURL: opt.WebURL,
				listName: opt.sourceList,
				CAMLQuery: camlQuery,
				CAMLQueryOptions: opt.CAMLQueryOptions,
				CAMLViewFields: "<ViewFields><FieldRef Name='" + opt.sourceColumn + "' /></ViewFields>",
				CAMLRowLimit: opt.CAMLRowLimit,
				completefunc: function(xData) { //debugger; 
					
					// Handle upper/lower case if ignoreCase = true
					var testValue = opt.ignoreCase ? columnValue.toUpperCase() : columnValue;
					// See which values match and add the ones that do to matchArray
					$(xData.responseXML).SPFilterNode("z:row").each(function() { //debugger;  
						var thisValue = $(this).attr("ows_" + opt.sourceColumn);
						
						// 20/4/2015 ignor ows_MetaInfo rows
						if(thisValue == undefined){
						   return true; //continue
						}
						//
						
						var thisValueTest = opt.ignoreCase ? $(this).attr("ows_" + opt.sourceColumn).toUpperCase() : $(this).attr("ows_" + opt.sourceColumn);
						// Make sure we have a match...
						if(opt.filterType === "Contains") {
							var firstMatch = thisValueTest.indexOf(testValue);
							if((firstMatch >= 0) &&
								// ...and that the match is not already in the array if we want uniqueness
								(!opt.uniqueVals || ($.inArray(thisValue, matchArray) === -1))) {
								matchArray.push($(this).attr("ows_" + opt.sourceColumn));
							}
						} else {
							// Handles normal case, which is BeginsWith and and other unknown values
							if(testValue === thisValueTest.substr(0,testValue.length) &&
									// ...and that the match is not already in the array if we want uniqueness
									(!opt.uniqueVals || ($.inArray(thisValue, matchArray) === -1))) {
								matchArray.push($(this).attr("ows_" + opt.sourceColumn));
							}
						}
					});

				} // end completefunc
			}); //end SPServices
			
			return matchArray; 
   }
   
      
   function getDbItems(columnObj, sourceTable, sourceColumn) { //debugger;
            // Get the column's value
		    var columnValue = columnObj.val();
		    var out = "";
		    // Array to hold the matched values
		    var matchArray = [];
		    
            // ajax (web api)
			//var ajaxUrl = encodeURI("/_layouts/MENIFA/readTableColumnSo.aspx?Filter=" + columnValue + "&Table="+sourceTable+"&Column="+sourceColumn);
			var ajaxUrl = encodeURI("/_vti_bin/ConnectedItemsAPI/api/ConnectItems/GetTableCol/?tableName=" +sourceTable+ "&colName=" +sourceColumn+ "&filter="+columnValue);
			
			
			$.ajax({ 
                type: "Get",
                //type: "POST",
  				async: false, // By default, the AJAX calls are asynchronous.  You can specify false to require a synchronous call.
                
                url: ajaxUrl,
                dataType: "json",
                success: function (data) { //debugger;
           
                  $.each(data, function (key, item) {
                     matchArray.push(item.Col); 
                  });   
 				}, // end success
				
				error: function (Data) { //debugger;
                   matchArray.push(Data.statusText);
 				} // end error

            }); //end ajax      

			return matchArray;
   }
   
   
   // This function OVERRIDE jquery.SPServices-2013.01.min.js.  returns the StaticName for a column based on the DisplayName.
	$.fn.SPServices.SPGetStaticFromDisplay = function (options) { //debugger; 

		var opt = $.extend({}, {
			webURL: "", 					// URL of the target Web.  If not specified, the current Web is used.
			listName: "",					// The name or GUID of the list
			columnDisplayName: "",			// DisplayName of the column
			columnDisplayNames: {}			// DisplayNames of the columns - added in v0.7.2 to allow multiple columns
		}, options);

		
		var staticName = "";
		var staticNames = {};
		var nameCount = opt.columnDisplayNames.length > 0 ? opt.columnDisplayNames.length : 1;

		
		// 6/4/17 elig // if root site
		var siteUrl = window.location.href; 
		if (siteUrl.indexOf("sites") == -1) 
		{
		   //opt.WebURL = "/"; 20/4/17
		   opt.webURL = "/";
		}
		else
			opt.webURL = siteUrl.substring(siteUrl.indexOf("SiteUrl=")+8, siteUrl.indexOf("&"));
		//
        

		$().SPServices({
			operation: "GetList",
			async: false,
			cacheXML: true,
			webURL: opt.webURL,
			listName: opt.listName,
			completefunc: function(xData) {
				if(nameCount > 1) {
					for(i=0; i < nameCount; i++) {
						staticNames[opt.columnDisplayNames[i]] = $(xData.responseXML).find("Field[DisplayName='" + opt.columnDisplayNames[i] + "']").attr("StaticName");
					}
				} else {
					staticName = $(xData.responseXML).find("Field[DisplayName='" + opt.columnDisplayName + "']").attr("StaticName");
				}
			}
		});

		return (nameCount > 1) ? staticNames : staticName;

	}; // End $.fn.SPServices.SPGetStaticFromDisplay


   
   

////// END PRIVATE MENIFA FUNCTIONS ////////


	
	// Provide suggested values from list's and Db for TextFilter based on characters typed 
	$.fn.SPServices.SPAutocompleteListDbTextFilter = function (options) { 

		var opt = $.extend({}, {
			WebURL: "",							// [Optional] The name of the Web (site) which contains the sourceList
			sourceList: "",						// The name of the list which contains the values
			sourceColumn: "",					// The static name of the column which contains the values
			sourceTable: "",		    		// The name of the Table which contains the values 
			sourceTableColumn: "",				// The static name of the Table column which contains the values
			columnName: "",						// The display name of the column in the form
			CAMLQuery: "",						// [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
			CAMLQueryOptions: "<QueryOptions></QueryOptions>",	// [Optional] For power users, allows specifying the CAMLQueryOptions for the GetListItems call
			CAMLRowLimit: 0,					// [Optional] Override the default view rowlimit and get all appropriate rows
			filterType: "BeginsWith",			// Type of filtering: [BeginsWith, Contains]
			numChars: 0,						// Wait until this number of characters has been typed before attempting any actions
			ignoreCase: false,					// If set to true, the function ignores case, if false it looks for an exact match
			highlightClass: "",					// If a class is supplied, highlight the matched characters in the values by applying that class to a wrapping span
			uniqueVals: true,					// If set to true, the function only adds unique values to the list (no duplicates)
			maxHeight: 99999,					// Sets the maximum number of values to display before scrolling occurs
			slideDownSpeed: "fast",				// Speed at which the div should slide down when values match (milliseconds or ["fast" | "slow"])
			processingIndicator: "_layouts/images/REFRESH.GIF",				// If present, show this while processing
			debug: false						// If true, show error messages;if false, run silent
		}, options);

		var matchNum;
		
//debugger;				
		// Find the input control for the column and save some of its attributes
		
		// SpTextFilter Change columnObj
		//var columnObj = $("input[Title='" + opt.columnName + "']");
		//var columnObj = $('b:contains("מסנן טקסט")').siblings().next(); //<br/><input...
		var columnObj = $("b:contains("+ opt.columnName +")").siblings().next() //<br/><input...

		
		// SpTextFilter PostBack בטל
		var onChange1 = columnObj.attr("onchange");
		columnObj.attr("onchange", ""); // PostBack בטל
	    /*sergey remove browser autocomplete */
		columnObj.attr("autocomplete","off");
		columnObj.css("position", "");
		var columnObjId = columnObj.attr("ID");
		var columnObjColor = columnObj.css("color");
		//var columnObjWidth = columnObj.css("width");
		
		// column not on page 
		if(columnObj.html() === null) {
		   if(opt.debug){
		      errBox("SPServices.SPAutocomplete",
				"columnName: " + opt.columnName,
				"Change Column name " + opt.columnName );
		   }
		   return;
		}
	
		if(opt.columnName === "שם" && opt.debug) {
			errBox("SPServices.SPAutocomplete",
				"columnName: " + opt.columnName,
				"Change Column name " + opt.columnName );
			return;
		}
 
 
		// Remove the <br/> which isn't needed and messes up the formatting
		//columnObj.closest("span").find("br").remove(); //<div..><b>מסנן טקסט</b><br/><input.../></div>
		//columnObj.wrap("<div>");
		
			
		// Create new arrow img (elig)
		var containerArrId = "ArrID_" + columnObjId;
		
	    //columnObj.after("<img id='" + containerArrId + "' src='/Style%20Library/Mali/ewr074.gif' style='width:18px; vertical-align: top'; title='Menifa AutoComplete'/>");
	    //*sergey*columnObj.after("<img id='" + containerArrId + "' src='/_catalogs/masterpage/click/images/ewr074.gif' style='width:20px; vertical-align: bottom'; title='Menifa AutoComplete'/>");
		columnObj.after("<i id='" + containerArrId + "' class='ms-Icon ms-Icon--StockDown' aria-hidden='true' style='color:#355e7e;font-size:17px;vertical-align: bottom; border: 1px solid #355e7e;border-top-left-radius:5px' title='Click Autocomplete'></i>");			
				
		var isArrClick = false;
		var containerArrObj = $("#" + containerArrId); 
		//$("#" + containerArrId).click(function () { opt.numChars = 0; $(columnObj).keyup(); });
		containerArrObj.click(function () {isArrClick = true; $(columnObj).keyup(); $(columnObj).focus(); });
				
		//columnObj.css("width", columnObj.width() - 130); // set width
		columnObj.css("width", columnObj.width() /2 ); // set width

		columnObj.css("height", columnObj.height() - 3); // set height  
		var columnObjWidth = columnObj.width() + 25;
//debugger;				
		// Create a div to contain the matching values and add it to the DOM
		
		// SpTextFilter
		//var containerId = genContainerId("SPAutocomplete", opt.columnName); // not working 
		var containerId = "container_" + columnObjId;
					
		// add clare filter
		//containerArrObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");
	    containerArrObj.after("&nbsp;&nbsp;<strong class='ms-rteFontSize-2 ms-rteForeColor-8'><a href='" + window.location.href + "' >​נקה סינון</a></strong><div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");



	    $("#" + containerId).css("width", columnObjWidth);
		
		// Handle keypresses 24/7/14
		var curRowInd = -1;
		
		//$(columnObj).keyup(function () {
		$(columnObj).mouseup(function () {  
		   $(this).select();
		}).focusout(function () { 
		 	if (window.event.clientX > 10) // if click out of scroll bar so close drop doun
		 	   $("#" + containerId).fadeOut(opt.slideUpSpeed);
	
		 	curRowInd = -1;
	
		}).keyup(function (event) { //debugger;
            
           //$( ":button[innerText*='הוסף']" ).prop('disabled', true); // כפתור הוסף של שדה בדיקת מידע, אפשר ערכים מרובים לוקח פוקוס של מקש אנטר
 
            
			// Handle key down, up, enter 24/7/14
			if ( event.which == 40 ) { // down
				var rows = $("#" + containerId + " li");
				
				if(curRowInd > -1){
					rows[curRowInd].style.backgroundColor = "white";
					rows[curRowInd].style.color = "black";
				}
				
				curRowInd = curRowInd +1;
				if(curRowInd >= rows.length){
					curRowInd = 0;	
				}
				
				rows[curRowInd].style.backgroundColor = "#3399ff";
				rows[curRowInd].style.color = "white"; 
				return
			}
			else if ( event.which == 38 ) { // up
				var rows = $("#" + containerId + " li");
				
				if(curRowInd > -1){
					rows[curRowInd].style.backgroundColor = "white";
					rows[curRowInd].style.color = "black";
				}
				
				curRowInd = curRowInd -1;
				if(curRowInd < 0){
					curRowInd = rows.length -1;	
				}
				
				rows[curRowInd].style.backgroundColor = "#3399ff";
				rows[curRowInd].style.color = "white"; 
									       		
				return
			}
            else if ( event.which == 13 ) { // enter
       		 	//$( ":button[innerText*='הוסף']" ).prop('disabled', false); // כפתור הוסף של שדה בדיקת מידע, אפשר ערכים מרובים לוקח פוקוס של מקש אנטר
 
           		// SpTextFilter אם ערך לסינון ריק הצג את כל הרשימה
           		var columnValue = $(this).val();
           		if(columnValue == ""){
					__doPostBack(columnObj.id,''); // do postback
           		}
           		//
            	
            	var rows = $("#" + containerId + " li");
            	rows[curRowInd].click();
            	return;
			}
	
			else{ // הוקש אות, המשך טיפול רגיל
			   curRowInd = -1;
			}
 			// end - Handle key down, up, enter
			
			// Get the column's value
			var columnValue = $(this).val();
			
			// Hide the container while we're working on it
			$("#" + containerId).hide();
           
            if(isArrClick == false) { 
  			   if(columnValue.length == 0) {
   			      columnObj.css("background-image", "");
   			   }
   			   
  			   //Have enough characters been typed yet?
			   if(columnValue.length < opt.numChars) {
 				  return false;
			   }
			}
			
			// Show the the processingIndicator as a background image in the input element
			columnObj.css({
				"background-image": "url(" + opt.processingIndicator + ")",
				"background-position": "right",
				"background-repeat": "no-repeat"
			});

			//
			// Build out the set of list elements to contain the available values
			//var matchArray = getListItems(columnObj, opt, isArrClick); //newfunc
//debugger			
			var matchArrayList;
			var matchArrayDb;
			var matchArray;
			if ( (opt.sourceList != "" ) &&(opt.sourceColumn  != "") ){
			   matchArrayList = getListItems(columnObj, opt, isArrClick); 
			}
			
			if ( (opt.sourceTable != "" ) &&(opt.sourceTableColumn  != "") ){
			   var matchArrayDb = getDbItems(columnObj, opt.sourceTable, opt.sourceTableColumn);
			}
			
			
			if( (matchArrayList != null) && (matchArrayDb != null) ){ //debugger;
				for (i=0; i < matchArrayList.length; i++) { //string;#  
				   matchArrayList[i] = matchArrayList[i].replace("string;#", "");
				}
				
				for (i=0; i < matchArrayDb.length; i++) { 
				   matchArrayDb[i] = matchArrayDb[i].replace("  ", " ");
				}
			
				matchArray = matchArrayList.concat(matchArrayDb);
				//matchArray.sortUnique(); // menifa2016
				matchArray = sortUnique(matchArray);
			}
			else if( matchArrayList != null) {
				matchArray = matchArrayList;
			}
			else if( matchArrayDb != null) {
				matchArray = matchArrayDb;
			}


			
			//

			
			var out = "";
 
			//out += "<li style='display: block;position: relative;cursor: pointer;'>(ללא)</li>";
			for (i=0; i < matchArray.length; i++) { 
				//del string#
					diaseInd = matchArray[i].indexOf("#");
					if (diaseInd > 0)
					   matchArray[i] = matchArray[i].substr(diaseInd +1);
				
				// If a highlightClass has been supplied, wrap a span around each match
				if(opt.highlightClass.length > 0) {
					// Set up Regex based on whether we want to ignore case
					var thisRegex = RegExp(columnValue, opt.ignoreCase ? "gi" : "g");
					// Look for all occurrences
					var matches = matchArray[i].match(thisRegex);
					var startLoc = 0;
					// Loop for each occurrence, wrapping each in a span with the highlightClass CSS class
					for (matchNum=0; matchNum < matches.length; matchNum++) {
						var thisPos = matchArray[i].indexOf(matches[matchNum], startLoc);
						var endPos = thisPos + matches[matchNum].length;
						var thisSpan = "<span class='" + opt.highlightClass + "'>" + matches[matchNum] + "</span>";
						matchArray[i] = matchArray[i].substr(0, thisPos) + thisSpan + matchArray[i].substr(endPos);
						startLoc = thisPos + thisSpan.length;
					}
				}
				// Add the value to the markup for the container
				//out += "<li style='display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>";
				out += "<li style='color:black; display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>"; // Black Text 24/7/14

			}
			//
			
			//debugger;			
			// Add all the list elements to the containerId container
			$("#" + containerId).html(out);
			
			// Set up behavior for the available values in the list element
			$("#" + containerId + " li").click(function () {  
				$("#" + containerId).fadeOut(opt.slideUpSpeed);
				$("#" + columnObjId).val($(this).text());
				
				// SpTextFilter do PostBack 
           		__doPostBack(columnObj.id,''); // do postback
 	       		//
					
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
			//if(matchArray.length > 0) {
			if(out != "") {
				$("#" + containerId).slideDown(opt.slideDownSpeed);
			//}
			// Remove the processing indicator
			columnObj.css("background-image", "");
			
		    }
		    
		}); // end keyup
	
	}; // End $.fn.SPServices.SPAutocompleteListDbTextFilter



    
	
	// Provide suggested values from list's for input column based on characters typed - blankValue = (ללא)
	// Todo !!!!!!!!!! work only on more then 20 items
	//$.fn.SPServices.SPAutocompleteListDropDown = function (options) { 
		function SPAutocompleteListDropDown(options) { 

		var opt = $.extend({}, {
			WebURL: "",							// [Optional] The name of the Web (site) which contains the sourceList
			sourceList: "",						// The name of the list which contains the values
			sourceColumn: "",					// The static name of the column which contains the values
			columnName: "",						// The display name of the column in the form
			CAMLQuery: "",						// [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
			CAMLQueryOptions: "<QueryOptions></QueryOptions>",	// [Optional] For power users, allows specifying the CAMLQueryOptions for the GetListItems call
			CAMLRowLimit: 0,					// [Optional] Override the default view rowlimit and get all appropriate rows
			filterType: "BeginsWith",			// Type of filtering: [BeginsWith, Contains]
			numChars: 0,						// Wait until this number of characters has been typed before attempting any actions
			ignoreCase: false,					// If set to true, the function ignores case, if false it looks for an exact match
			highlightClass: "",					// If a class is supplied, highlight the matched characters in the values by applying that class to a wrapping span
			uniqueVals: true,					// If set to true, the function only adds unique values to the list (no duplicates)
			maxHeight: 99999,					// Sets the maximum number of values to display before scrolling occurs
			slideDownSpeed: "fast",				// Speed at which the div should slide down when values match (milliseconds or ["fast" | "slow"])
			processingIndicator: "_layouts/images/REFRESH.GIF",				// If present, show this while processing
			debug: false						// If true, show error messages;if false, run silent
		}, options);

		var matchNum;
//debugger;				
		// Find the input control for the column and save some of its attributes
		/*var columnObj = $("input[Title='" + opt.columnName + "']");
		$("input[Title='" + opt.columnName + "']").css("position", "");
		var columnObjId = columnObj.attr("ID");
		var columnObjColor = columnObj.css("color");
		var columnObjWidth = columnObj.css("width");*/
		
		// 20/4/2015 if column not on page 
		//var columnObj = $("input[Title='" + opt.columnName + "']");
		
		//var columnObjOld = $("[Title='" + opt.columnName + "']");
		
		// if required column 20/4/17 
		var columnObjOld = $("[Title='" + opt.columnName + "']");
		if (columnObjOld.length == 0){ // אם שדה נדרש 
		   var reqField = " שדה נדרש";
		   columnObjOld = $("[Title='" + opt.columnName + reqField + "']");
		}
		//var columnObjOld = $("[Title='" + opt.columnName + "']");
		
		if(columnObjOld.html() === null || columnObjOld.html() === undefined) {
		   if(opt.debug){
		      errBox("SPServices.SPAutocomplete",
				"columnName: " + opt.columnName,
				"Change Column name " + opt.columnName );
		   }
		   return;
		}
		//
	
		if(opt.columnName === "שם" && opt.debug) {
			errBox("SPServices.SPAutocomplete",
				"columnName: " + opt.columnName,
				"Change Column name " + opt.columnName );
			return;
		}
		
		// hide original drop down and create new text input (elig)
        var selectedText;		
/*		
		// if required column 20/4/17 
		var selectedText;
		var columnObj7 = $("input[Title='" + opt.columnName + "']");
		if (columnObj7.length > 0){ // 20 items and up
		   columnObj7.hide();
		   columnObj7.parent().children('img').hide();
		   selectedText = columnObj7[0].value; 
		}
		
		else{ // less then 20 items
		   columnObj7 = $("select[Title='" + opt.columnName + "']");
		   columnObj7.hide();
		   selectedText = columnObj7.find("option:selected")[0].innerText;
        }   
*/        
        
		
		// if less then 20 items -> input 
		var columnObj7 = $("input[Title='" + opt.columnName + "']");
		if (columnObj7.length == 0){ // אם שדה נדרש 
		   var reqField = " שדה נדרש";
		   columnObj7 = $("input[Title='" + opt.columnName + reqField + "']");
		}
		
		if (columnObj7.length > 0){ // 20 items and up
		   columnObj7.hide();
		   columnObj7.parent().children('img').hide();
		   selectedText = columnObj7[0].value; 
		}
		
		// else more then 20 items -> select 
		else{ // less then 20 items
		   columnObj7 = $("select[Title='" + opt.columnName + "']");
		   if (columnObj7.length == 0){ // אם שדה נדרש 
		   var reqField = " שדה נדרש";
		   columnObj7 = $("select[Title='" + opt.columnName + reqField + "']");
		   }

		   columnObj7.hide();
		   selectedText = columnObj7.find("option:selected")[0].innerText;
        }   



//debugger;
        //var columnObjId = "newObjID_" + opt.columnName.replace(' ', '_').replace('*', '-'); // replace first space
        var columnObjId = "newObjID_" + opt.columnName.replace(/\s/g, '_').replace('*', '-'); // replace whitespace recursivly 
        //var columnObjId = "newObjID_" + opt.columnName.replace(/ /g, '_').replace('*', '-'); // replace space recursivly 
        //columnObj7.before("<input id='" + columnObjId + "'>");
        columnObj7.before("<input id='" + columnObjId + "' class='ms-long ms-spellcheck-true'>");
               
        var columnObj = $("#" + columnObjId);
		//
                            
        columnObj[0].title = opt.columnName;
        columnObj[0].value = selectedText;
        if( columnObj[0].value == "(ללא)"){
           columnObj[0].value = "";
        }    
              
        columnObj.css("class", "ms-long ms-spellcheck-true"); 
        columnObj.css("width", "363");

        
        var columnObjId = columnObj.attr("ID");
        var columnObjColor = columnObj7.css("color");
		
		
		// Remove the <br/> which isn't needed and messes up the formatting
		columnObj.closest("span").find("br").remove();
				
		//columnObj.wrap("<div>"); 10/4/17
	    columnObj.wrap("<div  style='min-width:400px;' >");
		
//debugger;			
		// Create new arrow img (elig)
		// 2col
		//var containerArrId = "SPAutocompleteArr";
		var containerArrId = columnObjId.replace('newObjID_', 'ArrID_');  
		//
	    //columnObj.after("<img id='" + containerArrId + "' src='/Style%20Library/Mali/ewr074.gif' style='width:24px; vertical-align: top'; title='Menifa AutoComplete'/>");
	    //*sergey*columnObj.after("<img id='" + containerArrId + "' src='/_catalogs/masterpage/click/images/ewr074.gif' style='width:23px; vertical-align: top'; title='Menifa AutoComplete'/>");
		columnObj.after("<i id='" + containerArrId + "' class='ms-Icon ms-Icon--StockDown' aria-hidden='true' style='color:#355e7e;font-size:17px;vertical-align: bottom; border: 1px solid #355e7e;' title='Click Autocomplete'></i>");				
		var isArrClick = false;
		var containerArrObj = $("#" + containerArrId); 
		//$("#" + containerArrId).click(function () { opt.numChars = 0; $(columnObj).keyup(); });
		
		containerArrObj.click(function () {isArrClick = true; $(columnObj).keyup(); $(columnObj).focus(); });
				
		var columnObjWidth = columnObj.width() + 22;

				
		// Create a div to contain the matching values and add it to the DOM
		var containerId = genContainerId("SPAutocomplete", opt.columnName);		
		containerArrObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + "; display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");
		$("#" + containerId).css("width", columnObjWidth);
		
		// Handle keypresses 24/7/14
		var curRowInd = -1;
		
		//$(columnObj).keyup(function () {
		$(columnObj).mouseup(function () {  
		   $(this).select();
		}).focusout(function () { 
		 	if (window.event.clientX > 10) // click out of scroll bar so close drop doun
		 	   $("#" + containerId).fadeOut(opt.slideUpSpeed);
	
		 	curRowInd = -1;
	
		}).keyup(function (event) { //debugger; 
           $( ":button[innerText*='הוסף']" ).prop('disabled', true); // כפתור הוסף של שדה בדיקת מידע, אפשר ערכים מרובים לוקח פוקוס של מקש אנטר
 
            
			// Handle key down, up, enter 24/7/14
			if ( event.which == 40 ) { // down
				var rows = $("#" + containerId + " li");
				
				if(curRowInd > -1){
					rows[curRowInd].style.backgroundColor = "white";
					rows[curRowInd].style.color = "black";
				}
				
				curRowInd = curRowInd +1;
				if(curRowInd >= rows.length){
					curRowInd = 0;	
				}
				
				rows[curRowInd].style.backgroundColor = "#3399ff";
				rows[curRowInd].style.color = "white"; 
				return
			}
			else if ( event.which == 38 ) { // up
				var rows = $("#" + containerId + " li");
				
				if(curRowInd > -1){
					rows[curRowInd].style.backgroundColor = "white";
					rows[curRowInd].style.color = "black";
				}
				
				curRowInd = curRowInd -1;
				if(curRowInd < 0){
					curRowInd = rows.length -1;	
				}
				
				rows[curRowInd].style.backgroundColor = "#3399ff";
				rows[curRowInd].style.color = "white"; 
				return
			}
            else if ( event.which == 13 ) { // enter
       		 	$( ":button[innerText*='הוסף']" ).prop('disabled', false); // כפתור הוסף של שדה בדיקת מידע, אפשר ערכים מרובים לוקח פוקוס של מקש אנטר
 
            	var rows = $("#" + containerId + " li");
            	rows[curRowInd].click();
            	return;
			}
	
			else{ // הוקש אות, המשך טיפול רגיל
			   curRowInd = -1;
			}
 			// end - Handle key down, up, enter
			
			// Get the column's value
			var columnValue = $(this).val();
			
			// Hide the container while we're working on it
			$("#" + containerId).hide();
			            
            // save every "" (elig)
            if( columnValue == "" ) { // "" = (ללא)
  			   
  			   if (columnObj7[0].tagName == "SELECT"){ // less then 20 items
   			       for (i=0;i<columnObj7[0].length;i++)
        		   {
        		      if (columnObj7[0].options[i].text == "(ללא)")
           			     columnObj7[0].options[i].selected = true;
        		   }
        		}   
        		else{ // 20 items and up
        		   columnObj.css("background-image", "");
  			       FilterChoice("", columnObj7[0], "(ללא)", ""); //core.js

        		}

			}
           
            if(isArrClick == false) { 
  			   
  			   // 2col 
  			   if(columnValue.length == 0) {
   			      columnObj.css("background-image", "");
   			   }
   			   //
  			   
  			   // Have enough characters been typed yet?
			   if(columnValue.length < opt.numChars) {
 				  return false;
			   }
			}
			//
			
			// 2col
			// Show the the processingIndicator as a background image in the input element
			columnObj.css({
				"background-image": "url(" + opt.processingIndicator + ")",
				"background-position": "right",
				"background-repeat": "no-repeat"
			});
			
			//
			// Build out the set of list elements to contain the available values
			var matchArray = getListItems(columnObj, opt, isArrClick); //newfunc
			var out = "";
 
			//out += "<li style='display: block;position: relative;cursor: pointer;'>(ללא)</li>";
			for (i=0; i < matchArray.length; i++) { 
				//del string#
					diaseInd = matchArray[i].indexOf("#");
					if (diaseInd > 0)
					   matchArray[i] = matchArray[i].substr(diaseInd +1);
				
				// If a highlightClass has been supplied, wrap a span around each match
				if(opt.highlightClass.length > 0) {
					// Set up Regex based on whether we want to ignore case
					var thisRegex = RegExp(columnValue, opt.ignoreCase ? "gi" : "g");
					// Look for all occurrences
					var matches = matchArray[i].match(thisRegex);
					var startLoc = 0;
					// Loop for each occurrence, wrapping each in a span with the highlightClass CSS class
					for (matchNum=0; matchNum < matches.length; matchNum++) {
						var thisPos = matchArray[i].indexOf(matches[matchNum], startLoc);
						var endPos = thisPos + matches[matchNum].length;
						var thisSpan = "<span class='" + opt.highlightClass + "'>" + matches[matchNum] + "</span>";
						matchArray[i] = matchArray[i].substr(0, thisPos) + thisSpan + matchArray[i].substr(endPos);
						startLoc = thisPos + thisSpan.length;
					}
				}
				// Add the value to the markup for the container
				//out += "<li style='display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>";
				out += "<li style='color:black; display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>"; // Black Text 24/7/14

			}

			//
				
			//debugger;
			// Add all the list elements to the containerId container
			$("#" + containerId).html(out);
			// Set up hehavior for the available values in the list element
			$("#" + containerId + " li").click(function () {  
				$("#" + containerId).fadeOut(opt.slideUpSpeed);
				$("#" + columnObjId).val($(this).text()); 
				
				// copy selected value from new input to dropdown
				//debugger;
				var selectedVal = columnObj[0].value;
				  
				if( selectedVal == ""){
           			selectedVal.value = "(ללא)";
        		}  
   			    
   			    if (columnObj7[0].tagName == "SELECT"){ // less then 20 items
   			       selectedVal = selectedVal.trim(); //22.1.15 
   			       for (i=0;i<columnObj7[0].length;i++)
        		   {
        		      if (columnObj7[0].options[i].text == selectedVal)
           			     columnObj7[0].options[i].selected = true;
        		   }
        		}   
        		else{ // 20 items and up
         		   FilterChoice("", columnObj7[0], selectedVal, ""); //core.js
        		}
  				//
					
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
			//if(matchArray.length > 0) {
			if(out != "") {
				$("#" + containerId).slideDown(opt.slideDownSpeed);
			//}
			// Remove the processing indicator
			columnObj.css("background-image", "");
			
		    }
		    
		}); // end keyup
		
	}; // End $.fn.SPServices.SPAutocompleteListDropDown
	
	
		// Provide suggested values from list's for input column based on characters typed - blankValue = (ללא)
	// Todo !!!!!!!!!! work only on more then 20 items
	$.fn.SPServices.SPAutocompleteListIpDropDown = function (options) { 

		var opt = $.extend({}, {
			WebURL: "",							// [Optional] The name of the Web (site) which contains the sourceList
			sourceList: "",						// The name of the list which contains the values
			sourceColumn: "",					// The static name of the column which contains the values
			columnName: "",						// The display name of the column in the form
			CAMLQuery: "",						// [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
			CAMLQueryOptions: "<QueryOptions></QueryOptions>",	// [Optional] For power users, allows specifying the CAMLQueryOptions for the GetListItems call
			CAMLRowLimit: 0,					// [Optional] Override the default view rowlimit and get all appropriate rows
			filterType: "BeginsWith",			// Type of filtering: [BeginsWith, Contains]
			numChars: 0,						// Wait until this number of characters has been typed before attempting any actions
			ignoreCase: false,					// If set to true, the function ignores case, if false it looks for an exact match
			highlightClass: "",					// If a class is supplied, highlight the matched characters in the values by applying that class to a wrapping span
			uniqueVals: true,					// If set to true, the function only adds unique values to the list (no duplicates)
			maxHeight: 99999,					// Sets the maximum number of values to display before scrolling occurs
			slideDownSpeed: "fast",				// Speed at which the div should slide down when values match (milliseconds or ["fast" | "slow"])
			processingIndicator: "_layouts/images/REFRESH.GIF",				// If present, show this while processing
			debug: false						// If true, show error messages;if false, run silent
		}, options);

		var matchNum;
//debugger;				
		// Find the input control for the column and save some of its attributes
		/*var columnObj = $("input[Title='" + opt.columnName + "']");
		$("input[Title='" + opt.columnName + "']").css("position", "");
		var columnObjId = columnObj.attr("ID");
		var columnObjColor = columnObj.css("color");
		var columnObjWidth = columnObj.css("width");*/
		
		// 20/4/2015 if column not on page 
		//var columnObj = $("input[Title='" + opt.columnName + "']");
		
		//var columnObjOld = $("[Title='" + opt.columnName + "']");
		
		// if required column 20/4/17 
		//var columnObjOld = $("[Title='" + opt.columnName + "']");
		//if (columnObjOld.length == 0){ // אם שדה נדרש 
		//   var reqField = " שדה נדרש";
		//   columnObjOld = $("[Title='" + opt.columnName + reqField + "']");
		//}
		//var columnObjOld = $("[Title='" + opt.columnName + "']");
		
		
		//if(columnObjOld.html() === null) {
		//   if(opt.debug){
		//      errBox("SPServices.SPAutocomplete",
		//		"columnName: " + opt.columnName,
		//		"Change Column name " + opt.columnName );
		//   }
		//   return;
		//}
		//
	
		if(opt.columnName === "שם" && opt.debug) {
			errBox("SPServices.SPAutocomplete",
				"columnName: " + opt.columnName,
				"Change Column name " + opt.columnName );
			return;
		}
		
		// hide original drop down and create new text input (elig)
        var selectedText;		
/*		
		// if required column 20/4/17 
		var selectedText;
		var columnObj7 = $("input[Title='" + opt.columnName + "']");
		if (columnObj7.length > 0){ // 20 items and up
		   columnObj7.hide();
		   columnObj7.parent().children('img').hide();
		   selectedText = columnObj7[0].value; 
		}
		
		else{ // less then 20 items
		   columnObj7 = $("select[Title='" + opt.columnName + "']");
		   columnObj7.hide();
		   selectedText = columnObj7.find("option:selected")[0].innerText;
        }   
*/        
        
//debugger;		
		// if less then 20 items -> input 
		//var columnObj7 = $("input[Title='" + opt.columnName + "']");
		var columnObj7 = $("#" + opt.columnName);
		
				
		
		if (columnObj7.length == 0){ // אם שדה נדרש 
		   var reqField = " שדה נדרש";
		   columnObj7 = $("input[Title='" + opt.columnName + reqField + "']");
		}
		
		if (columnObj7.length > 0){ // 20 items and up
		   columnObj7.hide();
		   columnObj7.parent().children('img').hide();
		   selectedText = columnObj7[0].value; 
		}
		
		// else more then 20 items -> select 
		else{ // less then 20 items
		   columnObj7 = $("select[Title='" + opt.columnName + "']");
		   if (columnObj7.length == 0){ // אם שדה נדרש 
		   var reqField = " שדה נדרש";
		   columnObj7 = $("select[Title='" + opt.columnName + reqField + "']");
		   }

		   columnObj7.hide();
		   selectedText = columnObj7.find("option:selected")[0].innerText;
        }   



//debugger;
        //var columnObjId = "newObjID_" + opt.columnName.replace(' ', '_').replace('*', '-'); // replace first space
        var columnObjId = "newObjID_" + opt.columnName.replace(/\s/g, '_').replace('*', '-'); // replace whitespace recursivly 
        //var columnObjId = "newObjID_" + opt.columnName.replace(/ /g, '_').replace('*', '-'); // replace space recursivly 
        //columnObj7.before("<input id='" + columnObjId + "'>");
        columnObj7.before("<input id='" + columnObjId + "' class='ms-long ms-spellcheck-true'>");
               
        var columnObj = $("#" + columnObjId);
        
                                  
        columnObj[0].title = opt.columnName;
        columnObj[0].value = selectedText;
        if( columnObj[0].value == "(ללא)"){
           columnObj[0].value = "";
        }    
              
        columnObj.css("class", "ms-long ms-spellcheck-true"); 
        columnObj.css("width", "363");

        
        var columnObjId = columnObj.attr("ID");
        var columnObjColor = columnObj7.css("color");
		
		
		// Remove the <br/> which isn't needed and messes up the formatting
		columnObj.closest("span").find("br").remove();
				
		//columnObj.wrap("<div>"); 10/4/17
	    columnObj.wrap("<div  style='min-width:400px;' >");
		
//debugger;			
		// Create new arrow img (elig)
		// 2col
		//var containerArrId = "SPAutocompleteArr";
		var containerArrId = columnObjId.replace('newObjID_', 'ArrID_');  
		//
	    //columnObj.after("<img id='" + containerArrId + "' src='/Style%20Library/Mali/ewr074.gif' style='width:24px; vertical-align: top'; title='Menifa AutoComplete'/>");
	    //*sergey*columnObj.after("<img id='" + containerArrId + "' src='/_catalogs/masterpage/click/images/ewr074.gif' style='width:21px; vertical-align: top'; title='Menifa AutoComplete'/>");
		columnObj.after("<i id='" + containerArrId + "' class='ms-Icon ms-Icon--StockDown' aria-hidden='true' style='color:#355e7e;font-size:17px;vertical-align: bottom; border: 1px solid #355e7e;' title='Click Autocomplete'></i>");		;
        		
		var isArrClick = false;
		var containerArrObj = $("#" + containerArrId); 
		//$("#" + containerArrId).click(function () { opt.numChars = 0; $(columnObj).keyup(); });
		
		containerArrObj.click(function () {isArrClick = true; $(columnObj).keyup(); $(columnObj).focus(); });
				
		var columnObjWidth = columnObj.width() + 20;

				
		// Create a div to contain the matching values and add it to the DOM
		var containerId = genContainerId("SPAutocomplete", opt.columnName);		
		containerArrObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + "; display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");
		
		// Handle keypresses 24/7/14
		var curRowInd = -1;
		
		//$(columnObj).keyup(function () {
		$(columnObj).mouseup(function () {  
		   $(this).select();
		}).focusout(function () { 
		 	if (window.event.clientX > 10) // click out of scroll bar so close drop doun
		 	   $("#" + containerId).fadeOut(opt.slideUpSpeed);
	
		 	curRowInd = -1;
	
		}).keyup(function (event) { //debugger; 
           $( ":button[innerText*='הוסף']" ).prop('disabled', true); // כפתור הוסף של שדה בדיקת מידע, אפשר ערכים מרובים לוקח פוקוס של מקש אנטר
 
            
			// Handle key down, up, enter 24/7/14
			if ( event.which == 40 ) { // down
				var rows = $("#" + containerId + " li");
				
				if(curRowInd > -1){
					rows[curRowInd].style.backgroundColor = "white";
					rows[curRowInd].style.color = "black";
				}
				
				curRowInd = curRowInd +1;
				if(curRowInd >= rows.length){
					curRowInd = 0;	
				}
				
				rows[curRowInd].style.backgroundColor = "#3399ff";
				rows[curRowInd].style.color = "white"; 
				return
			}
			else if ( event.which == 38 ) { // up
				var rows = $("#" + containerId + " li");
				
				if(curRowInd > -1){
					rows[curRowInd].style.backgroundColor = "white";
					rows[curRowInd].style.color = "black";
				}
				
				curRowInd = curRowInd -1;
				if(curRowInd < 0){
					curRowInd = rows.length -1;	
				}
				
				rows[curRowInd].style.backgroundColor = "#3399ff";
				rows[curRowInd].style.color = "white"; 
				return
			}
            else if ( event.which == 13 ) { // enter
       		 	$( ":button[innerText*='הוסף']" ).prop('disabled', false); // כפתור הוסף של שדה בדיקת מידע, אפשר ערכים מרובים לוקח פוקוס של מקש אנטר
 
            	var rows = $("#" + containerId + " li");
            	rows[curRowInd].click();
            	return;
			}
	
			else{ // הוקש אות, המשך טיפול רגיל
			   curRowInd = -1;
			}
 			// end - Handle key down, up, enter
			
			// Get the column's value
			var columnValue = $(this).val();
			
			// Hide the container while we're working on it
			$("#" + containerId).hide();
			            
            // save every "" (elig)
            if( columnValue == "" ) { // "" = (ללא)
  			   
  			   if (columnObj7[0].tagName == "SELECT"){ // less then 20 items
   			       for (i=0;i<columnObj7[0].length;i++)
        		   {
        		      if (columnObj7[0].options[i].text == "(ללא)")
           			     columnObj7[0].options[i].selected = true;
        		   }
        		}   
        		else{ // 20 items and up
        		   columnObj.css("background-image", "");
  			       FilterChoice("", columnObj7[0], "(ללא)", ""); //core.js

        		}

			}
           
            if(isArrClick == false) { 
  			   
  			   // 2col 
  			   if(columnValue.length == 0) {
   			      columnObj.css("background-image", "");
   			   }
   			   //
  			   
  			   // Have enough characters been typed yet?
			   if(columnValue.length < opt.numChars) {
 				  return false;
			   }
			}
			//
			
			// 2col
			// Show the the processingIndicator as a background image in the input element
			columnObj.css({
				"background-image": "url(" + opt.processingIndicator + ")",
				"background-position": "right",
				"background-repeat": "no-repeat"
			});
			
			//
			// Build out the set of list elements to contain the available values
			var matchArray = getListItems(columnObj, opt, isArrClick); //newfunc
			var out = "";
 
			//out += "<li style='display: block;position: relative;cursor: pointer;'>(ללא)</li>";
			for (i=0; i < matchArray.length; i++) { 
				//del string#
					diaseInd = matchArray[i].indexOf("#");
					if (diaseInd > 0)
					   matchArray[i] = matchArray[i].substr(diaseInd +1);
				
				// If a highlightClass has been supplied, wrap a span around each match
				if(opt.highlightClass.length > 0) {
					// Set up Regex based on whether we want to ignore case
					var thisRegex = RegExp(columnValue, opt.ignoreCase ? "gi" : "g");
					// Look for all occurrences
					var matches = matchArray[i].match(thisRegex);
					var startLoc = 0;
					// Loop for each occurrence, wrapping each in a span with the highlightClass CSS class
					for (matchNum=0; matchNum < matches.length; matchNum++) {
						var thisPos = matchArray[i].indexOf(matches[matchNum], startLoc);
						var endPos = thisPos + matches[matchNum].length;
						var thisSpan = "<span class='" + opt.highlightClass + "'>" + matches[matchNum] + "</span>";
						matchArray[i] = matchArray[i].substr(0, thisPos) + thisSpan + matchArray[i].substr(endPos);
						startLoc = thisPos + thisSpan.length;
					}
				}
				// Add the value to the markup for the container
				//out += "<li style='display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>";
				out += "<li style='color:black; display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>"; // Black Text 24/7/14

			}

			//
				
			//debugger;
			// Add all the list elements to the containerId container
			$("#" + containerId).html(out);
			// Set up hehavior for the available values in the list element
			$("#" + containerId + " li").click(function () { //debugger;  
				$("#" + containerId).fadeOut(opt.slideUpSpeed);
				$("#" + columnObjId).val($(this).text()); 
				
				// copy selected value from new input to dropdown
				//debugger;
				var selectedVal = columnObj[0].value;
				  
				if( selectedVal == ""){
           			selectedVal.value = "(ללא)";
        		}  
 //debugger;  			    
   			    if (columnObj7[0].tagName == "SELECT"){ // less then 20 items
   			       selectedVal = selectedVal.trim(); //22.1.15
   			       
				   //columnObj7[0].focus(); //27/4/17	 
   			       
   			       for (i=0;i<columnObj7[0].length;i++)
        		   {
        		      if (columnObj7[0].options[i].text == selectedVal)
           			     columnObj7[0].options[i].selected = true;
        		   }
        		}   
        		else{ // 20 items and up
         		   FilterChoice("", columnObj7[0], selectedVal, ""); //core.js
        		}
  				//
					
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
			//if(matchArray.length > 0) {
			if(out != "") {
				$("#" + containerId).slideDown(opt.slideDownSpeed);
			//}
			// Remove the processing indicator
			columnObj.css("background-image", "");
			
		    }
		    
		}); // end keyup
		
	}; // End $.fn.SPServices.SPAutocompleteListIpDropDown
	
	
	
	// Provide suggested values from list's for input column based on characters typed 
	$.fn.SPServices.SPAutocompleteListText = function (options) { 

		var opt = $.extend({}, {
			WebURL: "",							// [Optional] The name of the Web (site) which contains the sourceList
			sourceList: "",						// The name of the list which contains the values
			sourceColumn: "",					// The static name of the column which contains the values
			columnName: "",						// The display name of the column in the form
			CAMLQuery: "",						// [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
			CAMLQueryOptions: "<QueryOptions></QueryOptions>",	// [Optional] For power users, allows specifying the CAMLQueryOptions for the GetListItems call
			CAMLRowLimit: 0,					// [Optional] Override the default view rowlimit and get all appropriate rows
			filterType: "BeginsWith",			// Type of filtering: [BeginsWith, Contains]
			numChars: 0,						// Wait until this number of characters has been typed before attempting any actions
			ignoreCase: false,					// If set to true, the function ignores case, if false it looks for an exact match
			highlightClass: "",					// If a class is supplied, highlight the matched characters in the values by applying that class to a wrapping span
			uniqueVals: true,					// If set to true, the function only adds unique values to the list (no duplicates)
			maxHeight: 99999,					// Sets the maximum number of values to display before scrolling occurs
			slideDownSpeed: "fast",				// Speed at which the div should slide down when values match (milliseconds or ["fast" | "slow"])
			processingIndicator: "_layouts/images/REFRESH.GIF",				// If present, show this while processing
			debug: false						// If true, show error messages;if false, run silent
		}, options);

		var matchNum;
		
//debugger;				
		// Find the input control for the column and save some of its attributes
		
		// if  required column 9/4/17 
		//var columnName = opt.columnName.replace("*", "שדה נדרש");
		//var columnObj = $("input[Title='" + columnName + "']");
		
		// if required column 20/4/17 
		var columnObj = $("input[Title='" + opt.columnName + "']");
		if (columnObj.length == 0){ // אם שדה נדרש 
		   var reqField = " שדה נדרש";
		   columnObj = $("input[Title='" + opt.columnName + reqField + "']");
		}
		
				
		//$("input[Title='" + opt.columnName + "']").css("position", "");
		columnObj.css("position", "");
				
		//elig 23/3/17 (columnObjId not in use for SP16)
		//var columnObjId = columnObj.attr("ID"); // id is uniqe 
		
		var columnObjColor = columnObj.css("color");
		var columnObjWidth = columnObj.css("width");
		
		// column not on page 
		if(columnObj.html() === null) {
		   if(opt.debug){
		      errBox("SPServices.SPAutocomplete",
				"columnName: " + opt.columnName,
				"Change Column name " + opt.columnName );
		   }
		   return;
		}
	
		if(opt.columnName === "שם" && opt.debug) {
			errBox("SPServices.SPAutocomplete",
				"columnName: " + opt.columnName,
				"Change Column name " + opt.columnName );
			return;
		}
 
 
		// Remove the <br/> which isn't needed and messes up the formatting
		columnObj.closest("span").find("br").remove(); 
		
		//columnObj.wrap("<div>"); 10/4/17
		columnObj.wrap("<div  style='min-width:400px;' >");

		
			
		// Create new arrow img (elig)
        // elig 23/3/17
		//var containerArrId = "ArrID_" + columnObjId;
		var containerArrId = "ArrID_" + opt.columnName.replace(/\s/g, '_').replace('*', '-'); // replace whitespace recursivly  
//debugger;		
	    //columnObj.after("<img id='" + containerArrId + "' src='/Style%20Library/Mali/ewr074.gif' style='width:18px; vertical-align: top'; title='Menifa AutoComplete'/>");
	    //*sergey*columnObj.after("<img id='" + containerArrId + "' src='/_catalogs/masterpage/click/images/ewr074.gif' style='width:23px; vertical-align: top'; title='Menifa AutoComplete'/>");
		columnObj.after("<i id='" + containerArrId + "' class='ms-Icon ms-Icon--StockDown' aria-hidden='true' style='color:#355e7e;font-size:17px;vertical-align: bottom; border: 1px solid #355e7e;' title='Click Autocomplete'></i>");				
       	
		var isArrClick = false;
		var containerArrObj = $("#" + containerArrId); 
		//$("#" + containerArrId).click(function () { opt.numChars = 0; $(columnObj).keyup(); });
		containerArrObj.click(function () {isArrClick = true; $(columnObj).keyup(); $(columnObj).focus(); });
				
		columnObj.css("width", columnObj.width() - 30); // set width

//debugger;				
		// Create a div to contain the matching values and add it to the DOM
		var containerId = genContainerId("SPAutocomplete", opt.columnName); // not working 
		//var containerId = "container_" + columnObjId; // SpTextFilter
					
		containerArrObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");
		$("#" + containerId).css("width", columnObjWidth);
		
		// Handle keypresses 24/7/14
		var curRowInd = -1;
		
		//$(columnObj).keyup(function () {
		$(columnObj).mouseup(function () {  
		   $(this).select();
		}).focusout(function () { 
		 	if (window.event.clientX > 10) // if click out of scroll bar so close drop doun
		 	   $("#" + containerId).fadeOut(opt.slideUpSpeed);
	
		 	curRowInd = -1;
	
		}).keyup(function (event) { //debugger;
            
           $( ":button[innerText*='הוסף']" ).prop('disabled', true); // כפתור הוסף של שדה בדיקת מידע, אפשר ערכים מרובים לוקח פוקוס של מקש אנטר
 
            
			// Handle key down, up, enter 24/7/14
			if ( event.which == 40 ) { // down
				var rows = $("#" + containerId + " li");
				
				if(curRowInd > -1){
					rows[curRowInd].style.backgroundColor = "white";
					rows[curRowInd].style.color = "black";
				}
				
				curRowInd = curRowInd +1;
				if(curRowInd >= rows.length){
					curRowInd = 0;	
				}
				
				rows[curRowInd].style.backgroundColor = "#3399ff";
				rows[curRowInd].style.color = "white"; 
				return
			}
			else if ( event.which == 38 ) { // up
				var rows = $("#" + containerId + " li");
				
				if(curRowInd > -1){
					rows[curRowInd].style.backgroundColor = "white";
					rows[curRowInd].style.color = "black";
				}
				
				curRowInd = curRowInd -1;
				if(curRowInd < 0){
					curRowInd = rows.length -1;	
				}
				
				rows[curRowInd].style.backgroundColor = "#3399ff";
				rows[curRowInd].style.color = "white"; 
									       		
				return
			}
            else if ( event.which == 13 ) { // enter
       		 	$( ":button[innerText*='הוסף']" ).prop('disabled', false); // כפתור הוסף של שדה בדיקת מידע, אפשר ערכים מרובים לוקח פוקוס של מקש אנטר
           		            	
            	var rows = $("#" + containerId + " li");
            	rows[curRowInd].click();
            	return;
			}
	
			else{ // הוקש אות, המשך טיפול רגיל
			   curRowInd = -1;
			}
 			// end - Handle key down, up, enter
			
			// Get the column's value
			var columnValue = $(this).val();
			
			// Hide the container while we're working on it
			$("#" + containerId).hide();
           
            if(isArrClick == false) { 
  			   if(columnValue.length == 0) {
   			      columnObj.css("background-image", "");
   			   }
   			   
  			   //Have enough characters been typed yet?
			   if(columnValue.length < opt.numChars) {
 				  return false;
			   }
			}
			
			// Show the the processingIndicator as a background image in the input element
			columnObj.css({
				"background-image": "url(" + opt.processingIndicator + ")",
				"background-position": "right",
				"background-repeat": "no-repeat"
			});
			
			//
			// Build out the set of list elements to contain the available values
			var matchArray = getListItems(columnObj, opt, isArrClick); //newfunc
			var out = "";
 
			//out += "<li style='display: block;position: relative;cursor: pointer;'>(ללא)</li>";
			for (i=0; i < matchArray.length; i++) { 
				//del string#
					diaseInd = matchArray[i].indexOf("#");
					if (diaseInd > 0)
					   matchArray[i] = matchArray[i].substr(diaseInd +1);
				
				// If a highlightClass has been supplied, wrap a span around each match
				if(opt.highlightClass.length > 0) {
					// Set up Regex based on whether we want to ignore case
					var thisRegex = RegExp(columnValue, opt.ignoreCase ? "gi" : "g");
					// Look for all occurrences
					var matches = matchArray[i].match(thisRegex);
					var startLoc = 0;
					// Loop for each occurrence, wrapping each in a span with the highlightClass CSS class
					for (matchNum=0; matchNum < matches.length; matchNum++) {
						var thisPos = matchArray[i].indexOf(matches[matchNum], startLoc);
						var endPos = thisPos + matches[matchNum].length;
						var thisSpan = "<span class='" + opt.highlightClass + "'>" + matches[matchNum] + "</span>";
						matchArray[i] = matchArray[i].substr(0, thisPos) + thisSpan + matchArray[i].substr(endPos);
						startLoc = thisPos + thisSpan.length;
					}
				}
				// Add the value to the markup for the container
				//out += "<li style='display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>";
				out += "<li style='color:black; display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>"; // Black Text 24/7/14

			}
			//

			//debugger;			
			// Add all the list elements to the containerId container
			$("#" + containerId).html(out);
//debugger;			
			// Set up behavior for the available values in the list element
			$("#" + containerId + " li").click(function () {  
				$("#" + containerId).fadeOut(opt.slideUpSpeed);
								
			   // elig 23/3/17
			   //$("#" + columnObjId).val($(this).text());
			   columnObj.val($(this).text()); 
				
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
			//if(matchArray.length > 0) {
			if(out != "") {
				$("#" + containerId).slideDown(opt.slideDownSpeed);
			//}
			// Remove the processing indicator
			columnObj.css("background-image", "");
			
		    }
		    
		}); // end keyup
	
	}; // End $.fn.SPServices.SPAutocompleteListText
	
	// Provide suggested values from list's for input column based on characters typed 
	$.fn.SPServices.SPAutocompleteListIpText = function (options) { 

		var opt = $.extend({}, {
			WebURL: "",							// [Optional] The name of the Web (site) which contains the sourceList
			sourceList: "",						// The name of the list which contains the values
			sourceColumn: "",					// The static name of the column which contains the values
			columnName: "",						// The display name of the column in the form
			CAMLQuery: "",						// [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
			CAMLQueryOptions: "<QueryOptions></QueryOptions>",	// [Optional] For power users, allows specifying the CAMLQueryOptions for the GetListItems call
			CAMLRowLimit: 0,					// [Optional] Override the default view rowlimit and get all appropriate rows
			filterType: "BeginsWith",			// Type of filtering: [BeginsWith, Contains]
			numChars: 0,						// Wait until this number of characters has been typed before attempting any actions
			ignoreCase: false,					// If set to true, the function ignores case, if false it looks for an exact match
			highlightClass: "",					// If a class is supplied, highlight the matched characters in the values by applying that class to a wrapping span
			uniqueVals: true,					// If set to true, the function only adds unique values to the list (no duplicates)
			maxHeight: 99999,					// Sets the maximum number of values to display before scrolling occurs
			slideDownSpeed: "fast",				// Speed at which the div should slide down when values match (milliseconds or ["fast" | "slow"])
			processingIndicator: "_layouts/images/REFRESH.GIF",				// If present, show this while processing
			debug: false						// If true, show error messages;if false, run silent
		}, options);

		var matchNum;
		
//debugger;				
		// Find the input control for the column and save some of its attributes
		
		// if  required column 9/4/17 
		//var columnName = opt.columnName.replace("*", "שדה נדרש");
		
		// get ip columnObj 19/4/17 // not working
		//var columnObj = $("input[Title='" + columnName + "']");
		//var colTitle = $("span").filter(function() { return ($(this).text() === 'Title') }).first();
		//var columnObj = colTitle.closest('td').next('td').find('input');
		
		var columnName = opt.columnName;
		//var columnObj = $("#ctl00_ctl41_g_e1d817dd_4806_4a03_847b_7018719b577a_FormControl0_V1_I1_T4");
		var columnObj = $("#" + columnName);
		
		columnObj.closest('span').css("height", '10px'); // 2 line height -> 1 line height  
		//
		
	
		//var columnObj = $("input[Title='" + opt.columnName + "']");
				
		//$("input[Title='" + opt.columnName + "']").css("position", "");
		columnObj.css("position", "");
				
		var columnObjId = columnObj.attr("ID"); // id is uniqe 
		
		var columnObjColor = columnObj.css("color");
		var columnObjWidth = columnObj.css("width");
		
		// column not on page 
		if(columnObj.html() === null) {
		   if(opt.debug){
		      errBox("SPServices.SPAutocomplete",
				"columnName: " + opt.columnName,
				"Change Column name " + opt.columnName );
		   }
		   return;
		}
	
		if(opt.columnName === "שם" && opt.debug) {
			errBox("SPServices.SPAutocomplete",
				"columnName: " + opt.columnName,
				"Change Column name " + opt.columnName );
			return;
		}
 

		// Remove the <br/> which isn't needed and messes up the formatting
		columnObj.closest("span").find("br").remove(); 
		
		//columnObj.wrap("<div>"); 10/4/17
		//columnObj.wrap("<div  style='min-width:400px;' >"); //19/4/17
			
		
		// Create new arrow img (elig)
        // elig 23/3/17
		var containerArrId = "ArrID_" + columnObjId;
		//var containerArrId = "ArrID_" + opt.columnName.replace(/\s/g, '_').replace('*', '-'); // replace whitespace recursivly  
//debugger;		
	    //columnObj.after("<img id='" + containerArrId + "' src='/Style%20Library/Mali/ewr074.gif' style='width:18px; vertical-align: top'; title='Menifa AutoComplete'/>");
	    //*sergey*columnObj.after("<img id='" + containerArrId + "' src='/_catalogs/masterpage/click/images/ewr074.gif' style='width:18px; vertical-align: top'; title='Menifa AutoComplete'/>");
		columnObj.after("<i id='" + containerArrId + "' class='ms-Icon ms-Icon--StockDown' aria-hidden='true' style='color:#355e7e;font-size:17px;vertical-align: bottom; border: 1px solid #355e7e;' title='Click Autocomplete'></i>");				
       	
		var isArrClick = false;
		var containerArrObj = $("#" + containerArrId); 
		//$("#" + containerArrId).click(function () { opt.numChars = 0; $(columnObj).keyup(); });
		containerArrObj.click(function () {isArrClick = true; $(columnObj).keyup(); $(columnObj).focus(); });
				
		columnObj.css("width", columnObj.width() - 12); // set width 30  // 19/4/17 
		
				
		// Create a div to contain the matching values and add it to the DOM
		//var containerId = genContainerId("SPAutocomplete", opt.columnName); // not working for ip
		//var containerId = "container_" + columnObjId; // // not working for ip
		var containerId = "container_" + columnObj.attr("ID");
					
		containerArrObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");
		$("#" + containerId).css("width", columnObjWidth);
		
		// Handle keypresses 24/7/14
		var curRowInd = -1;
		

		//$(columnObj).keyup(function () {
		$(columnObj).mouseup(function () {  
		   $(this).select();
		}).focusout(function () { 
		 	if (window.event.clientX > 10) // if click out of scroll bar so close drop doun
		 	   $("#" + containerId).fadeOut(opt.slideUpSpeed);
	
		 	curRowInd = -1;
	
		}).keyup(function (event) { //debugger;
 
           $( ":button[innerText*='הוסף']" ).prop('disabled', true); // כפתור הוסף של שדה בדיקת מידע, אפשר ערכים מרובים לוקח פוקוס של מקש אנטר
 
            
			// Handle key down, up, enter 24/7/14
			if ( event.which == 40 ) { // down
				var rows = $("#" + containerId + " li");
				
				if(curRowInd > -1){
					rows[curRowInd].style.backgroundColor = "white";
					rows[curRowInd].style.color = "black";
				}
				
				curRowInd = curRowInd +1;
				if(curRowInd >= rows.length){
					curRowInd = 0;	
				}
				
				rows[curRowInd].style.backgroundColor = "#3399ff";
				rows[curRowInd].style.color = "white"; 
				return
			}
			else if ( event.which == 38 ) { // up
				var rows = $("#" + containerId + " li");
				
				if(curRowInd > -1){
					rows[curRowInd].style.backgroundColor = "white";
					rows[curRowInd].style.color = "black";
				}
				
				curRowInd = curRowInd -1;
				if(curRowInd < 0){
					curRowInd = rows.length -1;	
				}
				
				rows[curRowInd].style.backgroundColor = "#3399ff";
				rows[curRowInd].style.color = "white"; 
									       		
				return
			}
            else if ( event.which == 13 ) { // enter
       		 	$( ":button[innerText*='הוסף']" ).prop('disabled', false); // כפתור הוסף של שדה בדיקת מידע, אפשר ערכים מרובים לוקח פוקוס של מקש אנטר
           		            	
            	var rows = $("#" + containerId + " li");
            	rows[curRowInd].click();
            	return;
			}
	
			else{ // הוקש אות, המשך טיפול רגיל
			   curRowInd = -1;
			}
 			// end - Handle key down, up, enter
			
			// Get the column's value
			var columnValue = $(this).val();
			
			// Hide the container while we're working on it
			$("#" + containerId).hide();
           
            if(isArrClick == false) { 
  			   if(columnValue.length == 0) {
   			      columnObj.css("background-image", "");
   			   }
   			   
  			   //Have enough characters been typed yet?
			   if(columnValue.length < opt.numChars) {
 				  return false;
			   }
			}
			
			// Show the the processingIndicator as a background image in the input element
			columnObj.css({
				"background-image": "url(" + opt.processingIndicator + ")",
				"background-position": "right",
				"background-repeat": "no-repeat"
			});
			
			//
			// Build out the set of list elements to contain the available values
			var matchArray = getListItems(columnObj, opt, isArrClick); //newfunc
			var out = "";
 
			//out += "<li style='display: block;position: relative;cursor: pointer;'>(ללא)</li>";
			for (i=0; i < matchArray.length; i++) { 
				//del string#
					diaseInd = matchArray[i].indexOf("#");
					if (diaseInd > 0)
					   matchArray[i] = matchArray[i].substr(diaseInd +1);
				
				// If a highlightClass has been supplied, wrap a span around each match
				if(opt.highlightClass.length > 0) {
					// Set up Regex based on whether we want to ignore case
					var thisRegex = RegExp(columnValue, opt.ignoreCase ? "gi" : "g");
					// Look for all occurrences
					var matches = matchArray[i].match(thisRegex);
					var startLoc = 0;
					// Loop for each occurrence, wrapping each in a span with the highlightClass CSS class
					for (matchNum=0; matchNum < matches.length; matchNum++) {
						var thisPos = matchArray[i].indexOf(matches[matchNum], startLoc);
						var endPos = thisPos + matches[matchNum].length;
						var thisSpan = "<span class='" + opt.highlightClass + "'>" + matches[matchNum] + "</span>";
						matchArray[i] = matchArray[i].substr(0, thisPos) + thisSpan + matchArray[i].substr(endPos);
						startLoc = thisPos + thisSpan.length;
					}
				}
				// Add the value to the markup for the container
				//out += "<li style='display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>";
				out += "<li style='color:black; display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>"; // Black Text 24/7/14

			}
			//

			//debugger;			
			// Add all the list elements to the containerId container
			$("#" + containerId).html(out);
			
			// Set up behavior for the available values in the list element
			$("#" + containerId + " li").click(function () {  
				$("#" + containerId).fadeOut(opt.slideUpSpeed);
//debugger;								
			   // elig 23/3/17
			   //$("#" + columnObjId).val($(this).text());
			   columnObj.focus(); // 27/4/17 only in ip select value with mouse not working !!! 
			   columnObj.val($(this).text()); 
				
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
			//if(matchArray.length > 0) {
			if(out != "") {
				$("#" + containerId).slideDown(opt.slideDownSpeed);
			//}
			// Remove the processing indicator
			columnObj.css("background-image", "");
			
		    }
		    
		}); // end keyup
	
	}; // End $.fn.SPServices.SPAutocompleteListText

	
	
	// Provide suggested values from a DB Table for input column based on characters typed
	$.fn.SPServices.SPAutocompleteDB = function (options) {

		var opt = $.extend({}, {
			WebURL: "",							// [Optional] The name of the Web (site) which contains the sourceList
			sourceTable: "",					// The name of the table which contains the values
			SourceTableColumn: "",				// The static name of the column which contains the values to filter
			columnName: "",						// The display name of the column in the form
			CAMLQuery: "",						// [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
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
		}, options);

				
		var matchNum;

		// Find the input control for the column and save some of its attributes
		
		// if  required column 9/4/17 
        //var columnName = opt.columnName.replace("*", "שדה נדרש");
        //var columnObj = $("input[Title='" + columnName + "']");
		//$("input[Title='" + columnName + "']").css("position", "");
		
		// if required column 20/4/17 
		var columnObj = $("input[Title='" + opt.columnName + "']");
		$("input[Title='" + opt.columnName + "']").css("position", "");
		if (columnObj.length == 0){ // אם שדה נדרש 
		   var reqField = " שדה נדרש";
		   columnObj = $("input[Title='" + opt.columnName + reqField + "']");
		   columnObj.css("position", "");
		}
		
		//elig 23/3/17 (columnObjId not in use for SPAutocompleteDB)
		//var columnObjId = columnObj.attr("ID"); // id is uniqe 
				
		
		var columnObjColor = columnObj.css("color");
		var columnObjWidth = columnObj.css("width");
//debugger;
				
		if(columnObj.html() === null) {
		   if(opt.debug){
		      errBox("SPServices.SPAutocomplete",
				"columnName: " + opt.columnName,
				"Change Column name " + opt.columnName );
		   }
		   return;
		}

		
		// Remove the <br/> which isn't needed and messes up the formatting
		columnObj.closest("span").find("br").remove();
                
        //columnObj.wrap("<div>"); 10/4/17
        columnObj.wrap("<div  style='min-width:400px;' >");

				
        // Create new arrow img (elig)
        // elig 23/3/17
		//var containerArrId = "ArrID_" + columnObjId;
		var containerArrId = "ArrID_" + opt.columnName.replace(/\s/g, '_').replace('*', '-'); // replace whitespace recursivly  
//debugger;		
		//
	    //columnObj.after("<img id='" + containerArrId + "' src='/Style%20Library/Mali/ewr074.gif' style='width:24px; vertical-align: top'; title='Menifa AutoComplete'/>");
	    //*sergey*columnObj.after("<img id='" + containerArrId + "' src='/_catalogs/masterpage/click/images/ewr074.gif' style='width:23px; vertical-align: top'; title='Menifa AutoComplete'/>");
	    //columnObj.after("<img id='" + containerArrId + "' src='C:\\Users\\elig\\Desktop\\arrow-down-01-128.png' style='width:22px; vertical-align: top; border-style:solid; border-color:gray; border-width:1px'; title='Menifa AutoComplete'/>");
		columnObj.after("<i id='" + containerArrId + "' class='ms-Icon ms-Icon--StockDown' aria-hidden='true' style='color:#355e7e;font-size:17px;vertical-align: bottom; border: 1px solid #355e7e;border-radus-top-left:3px' title='Click Autocomplete'></i>");		
				
		var isArrClick = false;
		var containerArrObj = $("#" + containerArrId); 
		//$("#" + containerArrId).click(function () { opt.numChars = 0; $(columnObj).keyup(); });
		containerArrObj.click(function () {isArrClick = true; $(columnObj).keyup(); $(columnObj).focus(); }); // focus() 24/7/14
		
		//columnObj.css("width", columnObj.width() - 18); // set width
		columnObj.css("width", columnObj.width() - 30); // set width    
		
//debugger;				
		// Create a div to contain the matching values and add it to the DOM
		var containerId = genContainerId("SPAutocomplete", opt.columnName);		
		containerArrObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");
		$("#" + containerId).css("width", columnObjWidth);
        
        // Handle keypresses 24/7/14
		var curRowInd = -1;
		
		
		// Handle keypresses
		//$(columnObj).keyup(function () {
		$(columnObj).mouseup(function () { 
		   $(this).select(); //isArrClick = true; $(columnObj).keyup();
		}).focusout(function () { 
		 	if (window.event.clientX > 10) // click out of scroll bar so close drop doun
		 	   $("#" + containerId).fadeOut(opt.slideUpSpeed);
	
		 	curRowInd = -1;
	
		}).keyup(function (event) { //debugger; 

		    $( ":button[innerText*='הוסף']" ).prop('disabled', true); // כפתור הוסף של שדה בדיקת מידע, אפשר ערכים מרובים לוקח פוקוס של מקש אנטר
 
            
			// Handle key down, up, enter 24/7/14
			if ( event.which == 40 ) { // down
				var rows = $("#" + containerId + " li");
				
				if(curRowInd > -1){
					rows[curRowInd].style.backgroundColor = "white";
					rows[curRowInd].style.color = "black";
				}
				
				curRowInd = curRowInd +1;
				if(curRowInd >= rows.length){
					curRowInd = 0;	
				}
				
				rows[curRowInd].style.backgroundColor = "#3399ff";
				rows[curRowInd].style.color = "white"; 
				return
			}
			else if ( event.which == 38 ) { // up
				var rows = $("#" + containerId + " li");
				
				if(curRowInd > -1){
					rows[curRowInd].style.backgroundColor = "white";
					rows[curRowInd].style.color = "black";
				}
				
				curRowInd = curRowInd -1;
				if(curRowInd < 0){
					curRowInd = rows.length -1;	
				}
				
				rows[curRowInd].style.backgroundColor = "#3399ff";
				rows[curRowInd].style.color = "white"; 
				return
			}
            else if ( event.which == 13 ) { // enter
            	//debugger;
       		 	$( ":button[innerText*='הוסף']" ).prop('disabled', false); // כפתור הוסף של שדה בדיקת מידע, אפשר ערכים מרובים לוקח פוקוס של מקש אנטר
 
            	var rows = $("#" + containerId + " li");
            	rows[curRowInd].click();
            	return;
			}
									
			else{ // הוקש אות, המשך טיפול רגיל
			   curRowInd = -1;
			}
 			// end - Handle key down, up, enter
  

			// Get the column's value
			var columnValue = $(this).val();
				
			// Hide the container while we're working on it
			$("#" + containerId).hide();

                
            // if not errow cliced (elig)
            if(columnValue.length == 0) {
 				  columnObj.css("background-image", "");
			   }
			   
            if(isArrClick == false) {
               // 2col 
  			   if(columnValue.length == 0) {
   			      columnObj.css("background-image", "");
   			   }
   			   //
   			   
  			   // Have enough characters been typed yet?
			   if(columnValue.length < opt.numChars) {
 				  return false;
			   }
			}   
			else{   
			   isArrClick = false;
			}
			//   


			// Show the processingIndicator as a background image in the input element
			columnObj.css({
				"background-image": "url(" + opt.processingIndicator + ")",
				"background-position": "right",
				"background-repeat": "no-repeat"
			});
//debugger;			
			//
			// Build out the set of list elements to contain the available values
			var matchArray = getDbItems(columnObj, opt.sourceTable, opt.sourceTableColumn);

			var out = "";
 
			// Build out the set of list elements to contain the available values
			for (i=0; i < matchArray.length; i++) { //debugger;
			   // If a highlightClass has been supplied, wrap a span around each match
			   if(opt.highlightClass.length > 0) {
			      // Set up Regex based on whether we want to ignore case
				  var thisRegex = RegExp(columnValue, opt.ignoreCase ? "gi" : "g");
				  // Look for all occurrences
				  var matches = matchArray[i].match(thisRegex);
				  var startLoc = 0;
				  // Loop for each occurrence, wrapping each in a span with the highlightClass CSS class
				  for (matchNum=0; matchNum < matches.length; matchNum++) {
				     var thisPos = matchArray[i].indexOf(matches[matchNum], startLoc);
					 var endPos = thisPos + matches[matchNum].length;
					 var thisSpan = "<span class='" + opt.highlightClass + "'>" + matches[matchNum] + "</span>";
					 matchArray[i] = matchArray[i].substr(0, thisPos) + thisSpan + matchArray[i].substr(endPos);
					 startLoc = thisPos + thisSpan.length;
				  }
			   }  
			   // Add the value to the markup for the container
			   //out += "<li style='display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>";
			   out += "<li style='color:black; display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>"; // Black Text 24/7/14
			}		 
            //        
						
			// Add all the list elements to the containerId container
      	    $("#" + containerId).html(out);
//debugger;							
			// Set up behavior for the available values in the list element
			$("#" + containerId + " li").click(function () { //debugger; 
			   $("#" + containerId).fadeOut(opt.slideUpSpeed); 
			   
			   // elig 23/3/17
			   //$("#" + columnObjId).val($(this).text());
			   columnObj.val($(this).text());  
			
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
				
//debugger;					  					  
			// If we've got some values to show, then show 'em!
			//if(matchArray.length > 0) {
			if(out != "") {
			   $("#" + containerId).slideDown(opt.slideDownSpeed);
				//}
			    // Remove the processing indicator
			    columnObj.css("background-image", "");
            }
		}) // end keyup
		
		// elig 
		$(columnObj).mouseup(function () {  
		   $(this).select()
		}) // end mouseup

	}; // End $.fn.SPServices.SPAutocompleteDB



////// PRIVATE SPServices  FUNCTIONS ////////

	// Get the current context (as much as we can) on startup
	// See: http://johnliu.net/blog/2012/2/3/sharepoint-javascript-current-page-context-info.html
	function SPServicesContext() {
	
		// SharePoint 2010 gives us a context variable
		if(typeof _spPageContextInfo !== "undefined") {
			this.thisSite = _spPageContextInfo.webServerRelativeUrl;
			this.thisList = _spPageContextInfo.pageListId;
			this.thisUserId = _spPageContextInfo.userId;
		// In SharePoint 2007, we know the site and UserId
		} else {
			this.thisSite = (typeof L_Menu_BaseUrl !== "undefined") ? L_Menu_BaseUrl : "";
			this.thisList = "";
			this.thisUserId = (typeof _spUserId !== "undefined") ? _spUserId : undefined;
		}
		
	} // End of function SPServicesContext


	// Display a column (field) formatted correctly based on its definition in the list.
	// NOTE: Currently not dealing with locale differences.
	//   columnXML			The XML node for the column from a GetList operation
	//   columnValue		The text representation of the column's value
	//   opt				The current set of options
	function showColumn(listXML, columnXML, columnValue, opt) {

		if(typeof columnValue === "undefined") {
			return "";
		}

		var i;
		var outString = "";
		var dispUrl;
		var numDecimals;
		var outArray =[];
		var webUrl = opt.relatedWebURL.length > 0 ? opt.relatedWebURL : $().SPServices.SPGetCurrentSite();

		switch(columnXML.attr("Type")) {
			case "Text":
				outString = columnValue;
				break;
			case "URL":
				switch(columnXML.attr("Format")) {
					// URL as hyperlink
					case "Hyperlink":
						outString = "<a href='" + columnValue.substring(0, columnValue.search(",")) + "'>" +
							columnValue.substring(columnValue.search(",") + 1) + "</a>";
						break;
					// URL as image
					case "Image":
						outString = "<img alt='" + columnValue.substring(columnValue.search(",") + 1) +
							"' src='" + columnValue.substring(0, columnValue.search(",")) + "'/>";
						break;
					// Just in case
					default:
						outString = columnValue;
						break;						
				}
				break;
			case "User":
			case "UserMulti":
				var userMultiValues = columnValue.split(";#");
				for(i=0; i < userMultiValues.length; i = i+2) {
					outArray.push("<a href='/_layouts/userdisp.aspx?ID=" + userMultiValues[i] +
						"&Source=" + escapeUrl(location.href) + "'>" +
						userMultiValues[i+1] +  "</a>");
				}
				outString = outArray.join(", ");
				break;
			case "Calculated":
				var calcColumn = columnValue.split(";#");
				outString = calcColumn[1];
				break;
			case "Number":
				numDecimals = columnXML.attr("Decimals");
				outString = typeof numDecimals === "undefined" ?
					parseFloat(columnValue).toString() :
					parseFloat(columnValue).toFixed(numDecimals).toString();
				break;
			case "Currency":
				numDecimals = columnXML.attr("Decimals");
				outString = typeof numDecimals === "undefined" ?
					parseFloat(columnValue).toFixed(2).toString() :
					parseFloat(columnValue).toFixed(numDecimals).toString();
				break;
			case "Lookup":
				switch(columnXML.attr("Name")) {
					case "FileRef":
						// Get the display form URL for the lookup source list
						dispUrl = listXML.attr("BaseType") === "1" ? listXML.attr("RootFolder") + SLASH + "Forms/DispForm.aspx" :
							listXML.attr("RootFolder") + SLASH + "DispForm.aspx";
						outString = "<a href='" + dispUrl +
							"?ID=" + columnValue.substring(0, columnValue.search(";#")) + "&RootFolder=*&Source=" + escapeUrl(location.href) + "'>" +
							columnValue.substring(columnValue.search(";#") + 2) + "</a>";
						break;
					case "FileDirRef":
						// Get the display form URL for the lookup source list
						dispUrl = SLASH + columnValue.substring(columnValue.search(";#") + 2);
						outString = "<a href='" + dispUrl + "'>" +
							columnValue.substring(columnValue.search(";#") + 2) + "</a>";
						break;
					// Any other lookup column
					default:
						// Get the display form URL for the lookup source list
						dispUrl = getListFormUrl(columnXML.attr("List"), "DisplayForm");
						outString = "<a href='" + opt.relatedWebURL + SLASH + dispUrl +
							"?ID=" + columnValue.substring(0, columnValue.search(";#")) + "&RootFolder=*&Source=" + escapeUrl(location.href) + "'>" +
							columnValue.substring(columnValue.search(";#") + 2) + "</a>";
						break;						
				}
				break;
			case "LookupMulti":
				// Get the display form URL for the lookup source list
				dispUrl = getListFormUrl(columnXML.attr("List"), "DisplayForm");
				// Show all the values as links to the items, separated by commas
				outString = "";
				if(columnValue.length > 0) {
					var lookupMultiValues = columnValue.split(";#");
					for(i=0; i < lookupMultiValues.length / 2; i++) {
						outArray.push("<a href='" + webUrl + SLASH + dispUrl +
							"?ID=" + lookupMultiValues[i * 2] + "&RootFolder=*&Source=" + escapeUrl(location.href) + "'>" +
							lookupMultiValues[(i * 2) + 1] + "</a>");
					}
				}
				outString = outArray.join(", ");
				break;
			case "File":
				fileName = columnValue.substring(columnValue.search(";#") + 2);
				outString = "<a href='" + listXML.attr("RootFolder") + SLASH + fileName + "'>" + fileName + "</a>";
				break;
			case "Counter":
				outString = columnValue;
				break;
			case "DateTime":
				outString = columnValue;
				break;
			default:
				outString = columnValue;
				break;
		}
		return outString;
	} // End of function showColumn


	// Show a single attribute of a node, enclosed in a table
	//   node				The XML node
	//   opt				The current set of options
	function showAttrs(node) {
		var i;
		var out = "<table class='ms-vb' width='100%'>";
		for (i=0; i < node.attributes.length; i++) {
			out += "<tr><td width='10px' style='font-weight:bold;'>" + i + "</td><td width='100px'>" +
				node.attributes.item(i).nodeName + "</td><td>" + checkLink(node.attributes.item(i).nodeValue) + "</td></tr>";
		}
		out += "</table>";
		return out;
	} // End of function showAttrs


	// Find a dropdown (or multi-select) in the DOM. Returns the dropdown onject and its type:
	// S = Simple (select);C = Compound (input + select hybrid);M = Multi-select (select hybrid)
	function DropdownCtl(colName) {
		// Simple
		if((this.Obj = $("select[Title='" + colName + "']")).length === 1) {
			this.Type = "S";
		// Compound
		} else if((this.Obj = $("input[Title='" + colName + "']")).length === 1) {
			this.Type = "C";
		// Multi-select: This will find the multi-select column control in English and most other languages sites where the Title looks like 'Column Name possible values'
		} else if((this.Obj = $("select[ID$='SelectCandidate'][Title^='" + colName + " ']")).length === 1) {
			this.Type = "M";
		// Multi-select: This will find the multi-select column control on a Russian site (and perhaps others) where the Title looks like 'Выбранных значений: Column Name'
		} else if((this.Obj = $("select[ID$='SelectCandidate'][Title$=': " + colName + "']")).length === 1) {
			this.Type = "M";
		// Multi-select: This will find the multi-select column control on a German site (and perhaps others) where the Title looks like 'Mögliche Werte für &quot;Column name&quot;.'
		} else if((this.Obj = $("select[ID$='SelectCandidate'][Title$='\"" + colName + "\".']")).length === 1) {
			this.Type = "M";
		// Multi-select: This will find the multi-select column control on a Italian site (and perhaps others) where the Title looks like "Valori possibili Column name"
		} else if((this.Obj = $("select[ID$='SelectCandidate'][Title$=' " + colName + "']")).length === 1) {
			this.Type = "M";
		} else {
			this.Type = null;
		}
	} // End of function DropdownCtl



	// Find the MultiLookupPickerdata input element. The structures are slightly different in 2013 vs. prior versions.
	function MultiLookupPicker(o) {

		// Find input element that contains 'MultiLookup' and ends with 'data'. This holds all available values.
	 	this.MultiLookupPickerdata = o.closest("span").find("input[id*='MultiLookup'][id$='data']");

		// The ids in 2013 are different than prior versions, so we need to parse them out.
		var thisMultiLookupPickerdataId = this.MultiLookupPickerdata.attr("id");
	 	var thisIdEndLoc = thisMultiLookupPickerdataId.indexOf("Multi");
	 	var thisIdEnd = thisMultiLookupPickerdataId.substr(thisIdEndLoc);
	 	var thisMasterId = thisMultiLookupPickerdataId.substr(0, thisIdEndLoc) + thisIdEnd.substr(0, thisIdEnd.indexOf("_") + 1) + "m";

	 	this.master = window[thisMasterId];

	} // End of function MultiLookupPicker



	// Returns the selected value(s) for a dropdown in an array. Expects a dropdown object as returned by the DropdownCtl function.
	// If matchOnId is true, returns the ids rather than the text values for the selection options(s).
	function getDropdownSelected(columnSelect, matchOnId) {

		var columnSelectSelected = [];
		
		switch(columnSelect.Type) {
			case "S":
				if(matchOnId) {
					columnSelectSelected.push(columnSelect.Obj.find("option:selected").val() || []);
				} else {
					columnSelectSelected.push(columnSelect.Obj.find("option:selected").text() || []);
				}
				break;
			case "C":
				if(matchOnId) {
					columnSelectSelected.push($("input[id='"+ columnSelect.Obj.attr("optHid") + "']").val() || []);
				} else {
					columnSelectSelected.push(columnSelect.Obj.attr("value") || []);
				}				
				break;
			case "M":
				var columnSelections = columnSelect.Obj.closest("span").find("select[ID$='SelectResult']");
				$(columnSelections).find("option").each(function() {
					columnSelectSelected.push($(this).html());
				});
				break;
			default:
				break;
		}
		return columnSelectSelected;

	} // End of function getDropdownSelected
	
	// Build an error message based on passed parameters
	function errBox(func, param, msg) {
		var errMsg = "<b>Error in function</b><br/>" + func + "<br/>" +
			"<b>Parameter</b><br/>" + param + "<br/>" +
			"<b>Message</b><br/>" + msg + "<br/><br/>" +
			"<span onmouseover='this.style.cursor=\"hand\";' onmouseout='this.style.cursor=\"inherit\";' style='width=100%;text-align:right;'>Click to continue</span></div>";
		modalBox(errMsg);
	} // End of function errBox
	
	// Build an Hebrew message box based on passed parameters
	function msgBox(header, msg) {
		var errMsg = "<br/><div style='text-align:left; width:300px;'><img src='/_layouts/images/Warning.ico'/></div>" + 
			"<b>" + header + "<br/>" + msg + "<br/></b><br/><br/><br/>" +
			"<div onmouseover='this.style.cursor=\"hand\";' onmouseout='this.style.cursor=\"inherit\";' style='text-align:left; width:300px;'>הקש להמשך</div>";
			
		modalBox(errMsg);
	} // End of function errBox


	// Call this function to pop up a branded modal msgBox
	function modalBox(msg) {
		var boxCSS = "position:absolute;width:300px;height:150px;padding:10px;background-color:#000000;color:#ffffff;z-index:1000;font-family:'Arial';font-size:12px;display:none;";
		$("#aspnetForm").parent().append("<div id='SPServices_msgBox' style=" + boxCSS + ">" + msg);
		var height = $("#SPServices_msgBox").height();
		var width = $("#SPServices_msgBox").width();
		var leftVal = ($(window).width() / 2) - (width / 2) + "px";
		//var topVal = ($(window).height() / 2) - (height / 2) - 100 + "px";
		var topVal = ($(window).height() / 2) - (height / 2) + "px";
		$("#SPServices_msgBox").css({border:'5px #C02000 solid', left:leftVal, top:topVal}).show().fadeTo("slow", 0.75).click(function () {
			$(this).fadeOut("3000", function () {
				$(this).remove();
			});
		});
	} // End of function modalBox

	// Generate a unique id for a containing div using the function name and the column display name
	function genContainerId(funcname, columnName) {
		//debugger 
		var lst = $().SPServices.SPListNameFromUrl();
		return funcname + "_" + $().SPServices.SPGetStaticFromDisplay({
			listName: lst,
			columnDisplayName: columnName
		});
	} // End of function genContainerId
	
	// Get the URL for a specified form for a list
	function getListFormUrl(l, f) {

		var u;
		$().SPServices({
			operation: "GetFormCollection",
			async: false,
			listName: l,
			completefunc: function (xData) {
				u = $(xData.responseXML).find("Form[Type='" + f + "']").attr("Url");
			}
		});
		return u;

	} // End of function getListFormUrl

	// Add the option values to the SOAPEnvelope.payload for the operation
	//	opt = options for the call
	//	paramArray = an array of option names to add to the payload
	//		"paramName" if the parameter name and the option name match
	//		["paramName", "optionName"] if the parameter name and the option name are different (this handles early "wrappings" with inconsistent naming)
	function addToPayload(opt, paramArray) {

		var i;

		for (i=0; i < paramArray.length; i++) {
			// the parameter name and the option name match
			if(typeof paramArray[i] === "string") {
				SOAPEnvelope.payload += wrapNode(paramArray[i], opt[paramArray[i]]);
			// the parameter name and the option name are different 
			} else if(paramArray[i].length === 2) {
				SOAPEnvelope.payload += wrapNode(paramArray[i][0], opt[paramArray[i][1]]);
			// something isn't right, so report it
			} else {
				errBox(opt.operation, "paramArray[" + i + "]: " + paramArray[i], "Invalid paramArray element passed to addToPayload()");
			}
		}
	} // End of function addToPayload

	// Finds the td which contains a form field in default forms using the comment which contains:
	//	<!--  FieldName="Title"
	//		FieldInternalName="Title"
	//		FieldType="SPFieldText"
	//	-->
	// as the "anchor" to find it. Necessary because SharePoint doesn't give all field types ids or specific classes.
	function findFormField(columnName) {
		var thisFormBody;
		// There's no easy way to find one of these columns; we'll look for the comment with the columnName
		var searchText = RegExp("FieldName=\"" + columnName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "\"", "gi");
		// Loop through all of the ms-formbody table cells
		$("td.ms-formbody, td.ms-formbodysurvey").each(function() {
			// Check for the right comment
			if(searchText.test($(this).html())) {
				thisFormBody = $(this);
				// Found it, so we're done
				return false;
			}
		});
		return thisFormBody;
	} // End of function findFormField

	// The SiteData operations have the same names as other Web Service operations. To make them easy to call and unique, I'm using
	// the SiteData prefix on their names. This function replaces that name with the right name in the SOAPEnvelope.
	function siteDataFixSOAPEnvelope(SOAPEnvelope, siteDataOperation) {
		var siteDataOp = siteDataOperation.substring(8);
		SOAPEnvelope.opheader = SOAPEnvelope.opheader.replace(siteDataOperation, siteDataOp);
		SOAPEnvelope.opfooter = SOAPEnvelope.opfooter.replace(siteDataOperation, siteDataOp);
		return SOAPEnvelope;
	} // End of function siteDataFixSOAPEnvelope

	// Wrap an XML node (n) around a value (v)
	function wrapNode(n, v) {
		var thisValue = typeof v !== "undefined" ? v : "";
		return "<" + n + ">" + thisValue + "</" + n + ">";
	}

	// Generate a random number for sorting arrays randomly
	function randOrd() {
		return (Math.round(Math.random())-0.5);
	}

	// If a string is a URL, format it as a link, else return the string as-is
	function checkLink(s) {
		return ((s.indexOf("http") === 0) || (s.indexOf(SLASH) === 0)) ? "<a href='" + s + "'>" + s + "</a>" : s;
	}

	// Get the filename from the full URL
	function fileName(s) {
		return s.substring(s.lastIndexOf(SLASH)+1,s.length);
	}

/* Taken from http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/ */
	var xml_special_to_escaped_one_map = {
		'&': '&amp;',
		'"': '&quot;',
		'<': '&lt;',
		'>': '&gt;'};
	var escaped_one_to_xml_special_map = {
		'&amp;': '&',
		'&quot;': '"',
		'&lt;': '<',
		'&gt;': '>'};
	
	function encodeXml(string) {
		return string.replace(/([\&"<>])/g, function(str, item) {
			return xml_special_to_escaped_one_map[item];
		});
	}
	function decodeXml(string) {
		return string.replace(/(&quot;|&lt;|&gt;|&amp;)/g,
			function(str, item) {
				return escaped_one_to_xml_special_map[item];
		});
	}
/* Taken from http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/ */

	// Escape column values
	function escapeColumnValue(s) {
		if(typeof s === "string") {
			return s.replace(/&(?![a-zA-Z]{1,8};)/g, "&amp;");
		} else {
			return s;
		}
	}

	// Escape Url
	function escapeUrl(u) {
		return u.replace(/&/g,'%26');
	}

	// Split values like 1;#value into id and value								
	function SplitIndex(s) {
		var spl = s.split(";#");
		this.id = spl[0];
		this.value = spl[1];
	}

	function pad(n) {
		return n < 10 ? "0" + n : n;
	}
	
