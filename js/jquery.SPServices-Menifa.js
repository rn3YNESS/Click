     
   
   // check if selected value is from drop down list
   function checkValedItem(ColumnName) { 
   		var columnObj = $("input[Title='" + ColumnName + "']"); // $("#SPAutocomplete_Title");
   		if (columnObj.length == 0){ //אל תבצע בדיקה אם עמודה לא קיימת 
   		   return true;
   		}
   		
   		//var containerDivObj = columnObj.parent().children('div').children(); 
   		var containerId = genContainerId("SPAutocomplete", ColumnName); 
   		var containerDivObj = $("#" + containerId); 	
       
        if(columnObj[0].value == ""){
           return true;
        }
        
		else if ((containerDivObj.css('display') == "none") && (columnObj.css('background-image') == "none" )){
   			return true;
		}
   		else{ 
   			//alert('לא נבחר ערך מהרשימה !');
   			msgBox("בעמודה: "  + ColumnName, " לא נבחר ערך מהרשימה !");
 
			return false
   		}
   }
   
   // ConnectedItems, Provide suggested values from a list for in input column based on characters typed
	$.fn.SPServices.SPAutocompleteConItems = function (options) {

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
			uniqueVals: false,					// If set to true, the function only adds unique values to the list (no duplicates)
			maxHeight: 99999,					// Sets the maximum number of values to display before scrolling occurs
			slideDownSpeed: "fast",				// Speed at which the div should slide down when values match (milliseconds or ["fast" | "slow"])
			processingIndicator: "_layouts/images/REFRESH.GIF",				// If present, show this while processing
			debug: false						// If true, show error messages;if false, run silent
		}, options);

		var matchNum;
		
		opt.numChars = 1;

		// Find the input control for the column and save some of its attributes
		var columnObj = $("input[Title='" + opt.columnName + "']");
		//columnObj.style = "font-size: large";
        
		$("input[Title='" + opt.columnName + "']").css("position", "");
		var columnObjId = columnObj.attr("ID");
		var columnObjColor = columnObj.css("color");
		//var columnObjWidth = columnObj.css("width");
		//var columnObjWidth = 372;


		if(columnObj.html() === null && opt.debug) {
			//errBox("SPServices.SPAutocomplete",
			//	"columnName: " + opt.columnName,
			//	"Column is not an input control or is not found on page");
			return;
		}

		// Remove the <br/> which isn't needed and messes up the formatting
		columnObj.closest("span").find("br").remove();
		columnObj.wrap("<div>");

			

		// Create new arrow img (elig)
		var containerArrId = "SPAutocompleteArr";
	    columnObj.after("<i id='" + containerArrId + "' class='ms-Icon ms-Icon--CaretSolidDown' style='vertical-align: middle; color:#3BD5B5;' title='AutoComplete'/>");
		
		var isArrClick = false;
		var containerArrObj = $("#" + containerArrId); 
		//$("#" + containerArrId).click(function () { opt.numChars = 0; $(columnObj).keyup(); });
		
		containerArrObj.click(function () {isArrClick = true; $(columnObj).keyup(); });
		
		columnObj.css("width", columnObj.width() - 1); // set width  
		columnObjWidth = columnObj.width() + 20;
				
		// Create a div to contain the matching values and add it to the DOM
		var containerId = genContainerId("SPAutocomplete", opt.columnName);		
		//containerArrObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");
		containerArrObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;z-index:40;margin:0'></div>");
	
		$("#" + containerId).css("width", columnObjWidth);
        //


		// Handle keypresses
		$(columnObj).keyup(function () { 

			// Get the column's value
			var columnValue = $(this).val();

			// Hide the container while we're working on it
			$("#" + containerId).hide();
			
			// if not errow cliced (elig)
            if(columnValue.length == 0) {
 				  columnObj.css("background-image", "");
			   }
            
            if(isArrClick == false) {
  			   // Have enough characters been typed yet?
			   if(columnValue.length < opt.numChars) {
 				  return false;
			   }
			}
			//
			
			// Show the the processingIndicator as a background image in the input element
			/*columnObj.css({
				"background-image": "url(" + opt.processingIndicator + ")",
				"background-position": "right",
				"background-repeat": "no-repeat"
			});*/

			// Array to hold the matched values
			var matchArray = [];
			var matchArrayUrl = [];
			var matchArrayId = [];

		
			// Build the appropriate CAMLQuery
			var camlQuery = "<Query><OrderBy><FieldRef Name='" + opt.sourceColumn + "'/></OrderBy><Where>";
			if(opt.CAMLQuery.length > 0) {
				camlQuery += "<And>";
			}
			camlQuery += "<" + opt.filterType + "><FieldRef Name='" + opt.sourceColumn + "'/><Value Type='Text'>" + columnValue + "</Value></" + opt.filterType + ">";			
		
			
			if(opt.CAMLQuery.length > 0) {
				camlQuery += opt.CAMLQuery + "</And>";
			}
			camlQuery += "</Where></Query>";

			
			// if arrow cliced - show all row's (elig)
            if(isArrClick == true) {
			   isArrClick = false;
			   
			   camlQuery = "<Query><OrderBy><FieldRef Name='" + opt.sourceColumn + "'/></OrderBy><Where>";
			   if(opt.CAMLQuery.length > 0) {
				camlQuery += opt.CAMLQuery;
			    }
			camlQuery += "</Where></Query>";
			}
			//   


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
						var thisUrl = $(this).attr("ows_FileRef" );
						var thisId = $(this).attr("ows_UniqueId" );
						thisUrl = thisUrl.substring(thisUrl.indexOf("#")+1);
						thisId = thisId.substring(thisId.indexOf("#")+1);
						
						if (thisValue.indexOf("#") > -1) // if document library 
						{
							thisValue = thisValue.substring(thisValue.indexOf("#")+1);
						} 
						
						var thisValueTest = opt.ignoreCase ? thisValue.toUpperCase() : thisValue;
						//var thisValueTest = opt.ignoreCase ? $(this).attr("ows_" + opt.sourceColumn).toUpperCase() : $(this).attr("ows_" + opt.sourceColumn);

						// Make sure we have a match...
						if(opt.filterType === "Contains") {
							var firstMatch = thisValueTest.indexOf(testValue);
							if((firstMatch >= 0) &&
								// ...and that the match is not already in the array if we want uniqueness
								(!opt.uniqueVals || ($.inArray(thisValue, matchArray) === -1))) {
								//matchArray.push($(this).attr("ows_" + opt.sourceColumn));
								matchArray.push(thisValue);
								matchArrayUrl.push(thisUrl);
								matchArrayId.push(thisId);

							}
						} else {
							// Handles normal case, which is BeginsWith and and other unknown values
							if(testValue === thisValueTest.substr(0,testValue.length) &&
									// ...and that the match is not already in the array if we want uniqueness
									(!opt.uniqueVals || ($.inArray(thisValue, matchArray) === -1))) {
								//matchArray.push($(this).attr("ows_" + opt.sourceColumn));
								matchArray.push(thisValue);
								matchArrayUrl.push(thisUrl);
								matchArrayId.push(thisId);
							}
						}
					});
				}
			});

			// Build out the set of list elements to contain the available values
			var out = "";
			for (i=0; i < matchArray.length; i++) {
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
				//out += "<li title='"+ i +"' style='display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>";
				out += "<li title='"+ i +"' style='height: 15; display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>";
				
				
			}
			
			// Add all the list elements to the containerId container
			$("#" + containerId).html(out);
			// Set up hehavior for the available values in the list element
			$("#" + containerId + " li").click(function () { //debugger;
				$("#" + containerId).fadeOut(opt.slideUpSpeed);
				$("#" + columnObjId).val($(this).text());
				var curArrayInd = $(this)[0].title; 
				$("#" + columnObjId + "Url").val(matchArrayUrl[curArrayInd]);
				$("#" + columnObjId + "Id").val(matchArrayId[curArrayInd]); 
				$("#menifagvChildList")[0].style.display = "none";
								
				//$("#" + columnObjId + "Btn")[0].style.display = "block";
				var conf = confirm("האם לבצע קישור?");
			    if(conf == true){
			         $("#" + columnObjId + "Btn")[0].click();
			    }

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
			if(matchArray.length > 0) {
				$("#" + containerId).slideDown(opt.slideDownSpeed);
			//}
			// Remove the processing indicator
			columnObj.css("background-image", "");
		    }
		    
		}); // end keyup
		
		// elig
		$(columnObj).mouseup(function () {  
		   $(this).select()
		}) // end mouseup


	}; // End $.fn.SPServices.SPAutocompleteList

 
 

	// Provide suggested values from a list for in input column based on characters typed
	$.fn.SPServices.SPAutocompleteList = function (options) {

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
			uniqueVals: false,					// If set to true, the function only adds unique values to the list (no duplicates)
			maxHeight: 99999,					// Sets the maximum number of values to display before scrolling occurs
			slideDownSpeed: "fast",				// Speed at which the div should slide down when values match (milliseconds or ["fast" | "slow"])
			processingIndicator: "_layouts/images/REFRESH.GIF",				// If present, show this while processing
			debug: false						// If true, show error messages;if false, run silent
		}, options);

		var matchNum;
		
		opt.numChars = 1;

		// Find the input control for the column and save some of its attributes
		var columnObj = $("input[Title='" + opt.columnName + "']");
		$("input[Title='" + opt.columnName + "']").css("position", "");
		var columnObjId = columnObj.attr("ID");
		var columnObjColor = columnObj.css("color");
		//var columnObjWidth = columnObj.css("width");
		var columnObjWidth = 372;


		if(columnObj.html() === null && opt.debug) {
			errBox("SPServices.SPAutocomplete",
				"columnName: " + opt.columnName,
				"Column is not an input control or is not found on page");
			return;
		}

		// Remove the <br/> which isn't needed and messes up the formatting
		columnObj.closest("span").find("br").remove();
		columnObj.wrap("<div>");

			

		// Create new arrow img (elig)
		var containerArrId = "SPAutocompleteArr";
	    columnObj.after("<img id='" + containerArrId + "' src='/Style%20Library/Mali/ewr074.gif' style='width:18px; vertical-align: top'; title='AutoComplete '/>");
		
		var isArrClick = false;
		var containerArrObj = $("#" + containerArrId); 
		//$("#" + containerArrId).click(function () { opt.numChars = 0; $(columnObj).keyup(); });
		
		containerArrObj.click(function () {isArrClick = true; $(columnObj).keyup(); });
		
		columnObj.css("width", columnObj.width() - 30); // set width  
		columnObjWidth = columnObj.width() + 18;
				
		// Create a div to contain the matching values and add it to the DOM
		var containerId = genContainerId("SPAutocomplete", opt.columnName);		
		containerArrObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");
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
	
		}).keyup(function (event) { /*debugger;*/ 
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
  			   // Have enough characters been typed yet?
			   if(columnValue.length < opt.numChars) {
 				  return false;
			   }
			}
			//
			
			// Show the the processingIndicator as a background image in the input element
			/*columnObj.css({
				"background-image": "url(" + opt.processingIndicator + ")",
				"background-position": "right",
				"background-repeat": "no-repeat"
			});*/

			// Array to hold the matched values
			var matchArray = [];
			
			// Build the appropriate CAMLQuery
			var camlQuery = "<Query><OrderBy><FieldRef Name='" + opt.sourceColumn + "'/></OrderBy><Where>";
			if(opt.CAMLQuery.length > 0) {
				camlQuery += "<And>";
			}
			camlQuery += "<" + opt.filterType + "><FieldRef Name='" + opt.sourceColumn + "'/><Value Type='Text'>" + columnValue + "</Value></" + opt.filterType + ">";			
			if(opt.CAMLQuery.length > 0) {
				camlQuery += opt.CAMLQuery + "</And>";
			}
			camlQuery += "</Where></Query>";

			
			// if arrow cliced - show all row's (elig)
            if(isArrClick == true) {
			   isArrClick = false;
			   
			   camlQuery = "<Query><OrderBy><FieldRef Name='" + opt.sourceColumn + "'/></OrderBy><Where>";
			   if(opt.CAMLQuery.length > 0) {
				camlQuery += opt.CAMLQuery;
			    }
			camlQuery += "</Where></Query>";
			}
			//   


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
				completefunc: function(xData) {  
					// Handle upper/lower case if ignoreCase = true
					var testValue = opt.ignoreCase ? columnValue.toUpperCase() : columnValue;
					// See which values match and add the ones that do to matchArray
					$(xData.responseXML).SPFilterNode("z:row").each(function() {  
						var thisValue = $(this).attr("ows_" + opt.sourceColumn);
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
				}
			});

			// Build out the set of list elements to contain the available values
			var out = "";
			for (i=0; i < matchArray.length; i++) {
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
			
			// Add all the list elements to the containerId container
			$("#" + containerId).html(out);
			// Set up hehavior for the available values in the list element
			$("#" + containerId + " li").click(function () {
				$("#" + containerId).fadeOut(opt.slideUpSpeed);
				$("#" + columnObjId).val($(this).text());
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
			if(matchArray.length > 0) {
				$("#" + containerId).slideDown(opt.slideDownSpeed);
			//}
			// Remove the processing indicator
			columnObj.css("background-image", "");
		    }
		    
		}); // end keyup
		
		// elig
		$(columnObj).mouseup(function () {  
		   $(this).select()
		}) // end mouseup


	}; // End $.fn.SPServices.SPAutocompleteList

		
	// Provide suggested values from a DB Table for in input column based on characters typed
	$.fn.SPServices.SPAutocompleteDB = function (options) {

		var opt = $.extend({}, {
			WebURL: "",							// [Optional] The name of the Web (site) which contains the sourceList
			sourceList: "",						// The name of the list which contains the values
			sourceColumn: "",					// The static name of the column which contains the values
			columnName: "",						// The display name of the column in the form
			CAMLQuery: "",						// [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
			CAMLQueryOptions: "<QueryOptions></QueryOptions>",	// [Optional] For power users, allows specifying the CAMLQueryOptions for the GetListItems call
			CAMLRowLimit: 0,					// [Optional] Override the default view rowlimit and get all appropriate rows
			filterType: "BeginsWith",			// Type of filtering: [BeginsWith, Contains]
			numChars: 1,						// Wait until this number of characters has been typed before attempting any actions
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
		var columnObj = $("input[Title='" + opt.columnName + "']");
		$("input[Title='" + opt.columnName + "']").css("position", "");
		var columnObjId = columnObj.attr("ID");
		var columnObjColor = columnObj.css("color");
		var columnObjWidth = columnObj.css("width");

		if(columnObj.html() === null && opt.debug) {
			errBox("SPServices.SPAutocompleteDB",
				"columnName: " + opt.columnName,
				"Column is not an input control or is not found on page");
			return;
		}

		// Remove the <br/> which isn't needed and messes up the formatting
		columnObj.closest("span").find("br").remove();
        columnObj.wrap("<div>");

				
        // Create new arrow img (elig)
		var containerArrId = "SPAutocompleteArr";
	    columnObj.after("<img id='" + containerArrId + "' src='/Style%20Library/Mali/ewr074.gif' style='width:18px; vertical-align: top'; title='AutoComplete '/>");
		
		var isArrClick = false;
		var containerArrObj = $("#" + containerArrId); 
		//$("#" + containerArrId).click(function () { opt.numChars = 0; $(columnObj).keyup(); });
		containerArrObj.click(function () {isArrClick = true; $(columnObj).keyup(); $(columnObj).focus(); }); // focus() 24/7/14
		
		columnObj.css("width", columnObj.width() - 18); // set width  
		columnObjWidth = columnObj.width() + 18;
				
		// Create a div to contain the matching values and add it to the DOM
		var containerId = genContainerId("SPAutocomplete", opt.columnName);		
		containerArrObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");
		$("#" + containerId).css("width", columnObjWidth);
        
        // Handle keypresses 24/7/14
		var curRowInd = -1;
		
		
		// Handle keypresses
		//$(columnObj).keyup(function () {
		$(columnObj).mouseup(function () {  
		   $(this).select();
		}).focusout(function () { 
		 	if (window.event.clientX > 10) // click out of scroll bar so close drop doun
		 	   $("#" + containerId).fadeOut(opt.slideUpSpeed);
	
		 	curRowInd = -1;
	
		}).keyup(function (event) { /*debugger;*/ 

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
			
			
			 
			// ajax
			var ajaxUrl = encodeURI("/_layouts/MENIFA/readUser.aspx?ID=1&Filter=" + columnValue);
			
			$.ajax({ 
                type: "Get",
                //url: "readUser.aspx?ID=1",
                url: ajaxUrl,
                dataType: "xml",
                success: function (Data) { 
                     // Array to hold the matched values
					 var matchArray = [];
					 //matchArray.push("ללא"); //
                     
                     $(Data).find('Users').each(function () {
                        $(this).find('User').each(function () {
                            var value = $(this).text();
                            matchArray.push($(this).text()); //elg
       					}); // end each internal 
                     }); // end each external
                          
                     
					 // Build out the set of list elements to contain the available values
					 var out = "";
					 						 
					 for (i=0; i < matchArray.length; i++) {
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
                            
						
					 // Add all the list elements to the containerId container
					 $("#" + containerId).html(out);
							
					 // Set up behavior for the available values in the list element
					 $("#" + containerId + " li").click(function () { 
																
					 $("#" + containerId).fadeOut(opt.slideUpSpeed); 
					 $("#" + columnObjId).val($(this).text()); 
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
					  if(matchArray.length > 0) {
				         $("#" + containerId).slideDown(opt.slideDownSpeed);
			          }
			         
			         // Remove the processing indicator
			         columnObj.css("background-image", "");

                } // end success 
            }); //end ajax
		}) // end keyup
		
		// elig 
		$(columnObj).mouseup(function () {  
		   $(this).select()
		}) // end mouseup
		
	

	}; // End $.fn.SPServices.SPAutocompleteDB


////// PRIVATE FUNCTIONS ////////

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
		return funcname + "_" + $().SPServices.SPGetStaticFromDisplay({
			listName: $().SPServices.SPListNameFromUrl(),
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
	
