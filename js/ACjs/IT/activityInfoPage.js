jQuery(document).ready(function($)
{
//get IssueID from Query String
var vals=new Object();
var qs=location.search.substring(1,location.search.length);
qs=decodeURI(qs);
var args=qs.split("&");
for(var i=0; i < args.length; i++){
var nameVal=args[i].split("=");
var temp = unescape (nameVal[1]).split('+');
nameVal[1]=temp.join(' ');
vals[nameVal[0]]=nameVal[1];
}
var issueID=vals["activityFilter"];

//Set the span of activity Filter to the item with value from Query String
$("#actName").text(issueID);
});