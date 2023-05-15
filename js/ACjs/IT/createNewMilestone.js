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
      var issueID = vals["ActivityLookup"];

      //Set the Lookup field with dislay name of "IssueID" to the item with value from Query String
      setLookup("פעילות בנושא",issueID);
});

function setLookup( fieldTitle, lookupVal)
{
    //Set default value for lookups with less that 20 items
    if ( $("select[title='" +fieldTitle+ "']").html() !== null)
    {
       $("select[title='"+ fieldTitle +"']").val(lookupVal);    
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