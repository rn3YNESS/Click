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
     var orderID = vals["orderId"];

      //Set the Lookup field with dislay name of "IssueID" to the item with value from Query String
     //alert(orderID);

     //setTimeout(function(){ 
     //setLookup("#ctl00_ctl37_g_d4ef2f35_b801_4a47_bb15_dd5f5f73b3e2_FormControl0_V1_I1_D39",orderID);
     //}, 200);

     var new_Columns = [
      { "Source" : "SpIpText", "DispColumnName" : "ctl00_ctl37_g_d4ef2f35_b801_4a47_bb15_dd5f5f73b3e2_FormControl0_V1_I1_T1", "DispSourceList" : "אנשי קשר", "SourceColumn" :"FullName"}
     ] 
   acMain (new_Columns);

});

function setSelectValue(theSelect,value){
  Array.prototype.forEach.call(theSelect.children,function(el){if(el.value==value.toString()){el.selected=true}});
}

function setLookup( fieldTitle, lookupVal)
{
if($(fieldTitle)[0].length&&lookupVal.length)
	{
	console.log("found");// ctl00_ctl37_g_d4ef2f35_b801_4a47_bb15_dd5f5f73b3e2_FormControl0_V1_I1_D41
	$('#ctl00_ctl37_g_d4ef2f35_b801_4a47_bb15_dd5f5f73b3e2_FormControl0_V1_I1_D39')[0].focus();
	setTimeout(function(){
    	setSelectValue($('#ctl00_ctl37_g_d4ef2f35_b801_4a47_bb15_dd5f5f73b3e2_FormControl0_V1_I1_D39')[0],lookupVal.toString());
    	$('#ctl00_ctl37_g_d4ef2f35_b801_4a47_bb15_dd5f5f73b3e2_FormControl0_V1_I1_D39')[0].blur();
		$('#ctl00_ctl37_g_d4ef2f35_b801_4a47_bb15_dd5f5f73b3e2_FormControl0_V1_I1_D39').trigger("change");
		$('#ctl00_ctl37_g_d4ef2f35_b801_4a47_bb15_dd5f5f73b3e2_FormControl0_V1_I1_T13')[0].focus();
    //id="ctl00_ctl37_g_d4ef2f35_b801_4a47_bb15_dd5f5f73b3e2_FormControl0_V1_I1_T13"
     	}, 300);
	}
else
	{
	console.log("not found");
	}

}





