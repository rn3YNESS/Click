jQuery(document).ready(function($)
{
    //get "IssueID" from Query String
     var vals = new Object();
      var qs = location.search.substring(1, location.search.length);
      var args = qs.split("&");
      for (var i=0; i < args.length; i++) {
       var nameVal = args[i].split("=");
       var temp = unescape(nameVal[1]).split('+');
       nameVal[1] = temp.join(' ');
       vals[nameVal[0]] = nameVal[1];
       }
// Set Name
      var issueID = vals["Name"];
      setTextField("שם אורח",issueID);
//SetCar Number
      var issueID2 = vals["CarNum"];
      setTextField("מספר הרכב",issueID2);
//Set Date
      var parts = vals["Date"].split('-');
      var FormattedDate= parts[2]+'/'+parts[1]+'/'+parts[0];
      setTextField("תאריך כניסה",FormattedDate);
//Set Phone
      var issueID3 = vals["CellPhone"];
      setTextField("טלפון האורח",issueID3);
//Set Worker!!!!!
      var issueID4 = vals["Worker"];
      setTextArea("בורר האנשים",issueID4);

/*set PARKING ZONE!!!!!!!*/
      var issueID4 = vals["Parking"];
      setLookup("חניה חיצונית או פנימית",issueID4);

/*set worker phone*/
	  var issueID5 = vals["Cell2"];
     setTextField("טלפון המזמין",issueID5);

/*set time*/
	  var issueID6 = vals["Time"];
	  var time=issueID6.split(":");
	  var hours=time[0]+":";
	  var mins=time[1];
$("select[name='ctl00$m$g_4d8dc29d_8dd5_49e7_ac64_e1063f1b695d$ctl00$ctl05$ctl01$ctl00$ctl00$ctl04$ctl00$ctl00$DateTimeField$DateTimeFieldDateHours']").val(hours);
$("select[name='ctl00$m$g_4d8dc29d_8dd5_49e7_ac64_e1063f1b695d$ctl00$ctl05$ctl01$ctl00$ctl00$ctl04$ctl00$ctl00$DateTimeField$DateTimeFieldDateMinutes']").val(mins);
    
     
});

function setTextField( fieldTitle, lookupVal)
{
    //Set default value for lookups with less that 20 items
    if ( $("input[title='" +fieldTitle+ "']").html() !== null)
    {
       $("input[title='"+ fieldTitle +"']").val(lookupVal);    
    }
    else
    {
       $("input[title='"+ fieldTitle +" שדה נדרש']").val(lookupVal);    
    }
   
}

function setTextArea( fieldTitle, lookupVal)
{ //$("textarea[title='"+ fieldTitle +"']").val(lookupVal);
$("div[title='בורר האנשים']").html(lookupVal); 
}

function setLookup( fieldTitle, lookupVal)
{
    //Set default value for lookups with less that 20 items
    if ( $("select[title='" +fieldTitle+ "']").html() !== null)
    {
    	if(lookupVal==1){
       $("select[title='"+ fieldTitle +"']").val("פנימית");    
       }
       else{
       $("select[title='"+ fieldTitle +"']").val("חיצונית");
       }
    }
    
}