
jQuery(document).ready(function ($) {
    //**** js #1 ****/
    if ((location.search).indexOf("0x010800B813442B4E33564691E6C2E7E93251D9008B97F1246A24D341961F9171D63FB2DE") > 1 ) {
        $("body").css("background-color", "red");
    }

    //***** js #2 create new task*****/
    $('iframe').contents().find("head").append($("<style type='text/css'>  .ms-formbody{font-family: arial;}  </style>"));

    
    if ((location.href).indexOf("new") > 1 ) {
    //get "IssueID" from Query String
    var vals = new Object();
    var qs = location.search.substring(1, location.search.length);
    var args = qs.split("&");
    for (var i = 0; i < args.length; i++) {
        var nameVal = args[i].split("=");
        var temp = unescape(nameVal[1]).split('+');
        nameVal[1] = temp.join(' ');
        vals[nameVal[0]] = nameVal[1];
    }
    var issueID = vals["ActivityLookup"];

    //Set the Lookup field with dislay name of "IssueID" to the item with value from Query String
    setLookup("פרויקט", issueID);

    /*** js#3 add new project ***/
    addNewProject();
}

});

function addNewProject() {
    //יצירת אלמנט מסוג DIV
    var div = document.createElement("DIV");
    //מילוי האלמנט בפקודה של פתיחת קישור בפופ אפ עם הפרמטר של כתובת היעד לפתיחה
    div.innerHTML=  "<a href='#' onClick=javascript:OpenPopUpPage('/sites/it/InfoSecTeam/Lists/projectList/NewForm.aspx?IsDlg=1',RefreshPage)>הוסף פרויקט</a>";
    //לכידת האלמנט שאחריו רוצים להוסיך את הקישור
    var element = document.getElementById("_x05e4__x05e8__x05d5__x05d9__x05_1093dad9-1194-42c9-9894-afff6f259461_$LookupField");
    //הוספת האלמנט לטופס
        element.parentNode.insertBefore(div, element.nextSibling);
    }
    

function setLookup( fieldTitle, lookupVal)
{      


    //Set default value for lookups with less that 20 items
    if ( $("[title='" +fieldTitle+ "']").html() !== null)
    {
       $("[title='"+ fieldTitle +"']").val(lookupVal);    
    }
    else
    {
        //get the hiddent input using the "optHid" attribute of displayed Input
        hiddenInput = $("input[title='" +fieldTitle +"']").attr("optHid");
        //set value in the hidden input
        $("input[id='" +hiddenInput +"']").attr("value",lookupVal)

        //get the string of choices from the input element so we can set displayed value
        choices = $("input[title='" +fieldTitle +"']").attr("choices");
        
        //turn choices string into an array so we can iterate through it
        choiceArray = choices.split("|");
        
        //improve performance by iterating over every other entry (just look at values)
        for (index = 1; index < choiceArray.length; index = index + 2)
        {
            if (choiceArray[index] == lookupVal){
                //set the displayed input which is the PREVIOUS entry in array
                $("input[title='" +fieldTitle +"']").val(choiceArray[index - 1]);    
            }
        }
    }
}
