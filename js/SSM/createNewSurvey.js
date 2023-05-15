var InfoPathCheck;
$(document).ready(function(){
	
    InfoPathCheck = setInterval(function() { HasInfoPathLoaded();}, 100);
	   
 });
     
     function HasInfoPathLoaded() {try{
	console.log('testing');
	
  //  var testDiv = $('#ctl00_ctl37_g_732176b6_248c_4a2d_8432_58248dbbb267_FormControl0_V1_I1_T1');
    
    var testDiv = $('#ctl00_ctl37_g_78c97f3d_cdaa_407e_a6a0_b0698da854e9_FormControl0_V1_I1_T2');
    
    if (testDiv) {
        clearInterval(InfoPathCheck);
        // Do stuff with the InfoPath form here....
        
        getGuid();
    }}
    catch (err){ExecuteOrDelayUntilScriptLoaded(createListItem(err.message),'sp.js'); }
}   

function getGuid(){
     //get "id" from Query String
     var vals = new Object();
     var qs = decodeURIComponent( parent.location.search.substring(1, parent.location.search.length));
     // var qs = parent.location.search.substring(1, parent.location.search.length);
      var args = qs.split("&");
      for (var i=0; i < args.length; i++) {
       var nameVal = args[i].split("=");
       var temp = unescape(nameVal[1]).split('+');
       nameVal[1] = temp.join(' ');
       vals[nameVal[0]] = nameVal[1];
      }
      var param = vals['id'];
      // if(document.getElementById('ctl00_ctl37_g_e42030f4_76bd_433f_ac3f_f1ba04ccb9ee_FormControl0_V1_I1_S2_I1_T1')!=null&&param!=null){

      if(document.getElementById('ctl00_ctl37_g_78c97f3d_cdaa_407e_a6a0_b0698da854e9_FormControl0_V1_I1_T2')!=null&&param!=null){
setGuid(param,qs);}

}
function setGuid(lookupVal,qs)
{try{

if(document.getElementById('ctl00_ctl37_g_78c97f3d_cdaa_407e_a6a0_b0698da854e9_FormControl0_V1_I1_T2').value==""){

document.getElementById('ctl00_ctl37_g_78c97f3d_cdaa_407e_a6a0_b0698da854e9_FormControl0_V1_I1_T3').focus();
$("input[id='ctl00_ctl37_g_78c97f3d_cdaa_407e_a6a0_b0698da854e9_FormControl0_V1_I1_T3']").val(qs);
document.getElementById('ctl00_ctl37_g_78c97f3d_cdaa_407e_a6a0_b0698da854e9_FormControl0_V1_I1_T3').blur();


document.getElementById('ctl00_ctl37_g_78c97f3d_cdaa_407e_a6a0_b0698da854e9_FormControl0_V1_I1_T2').focus();
$("input[id='ctl00_ctl37_g_78c97f3d_cdaa_407e_a6a0_b0698da854e9_FormControl0_V1_I1_T2']").val(lookupVal);
document.getElementById('ctl00_ctl37_g_78c97f3d_cdaa_407e_a6a0_b0698da854e9_FormControl0_V1_I1_T2').blur();





document.getElementById('ctl00_ctl37_g_78c97f3d_cdaa_407e_a6a0_b0698da854e9_FormControl0_V1_I1_S4_I1_T45').focus();}
}
catch(err){ExecuteOrDelayUntilScriptLoaded(createListItem(err.message),'sp.js'); }
}

/*פונקית יצירה של פריט רשימה מאינטרנט*/
function createListItem(txt) {
var clientContext = new SP.ClientContext.get_current();

var list = clientContext.get_web().get_lists().getByTitle('errors');
var itemInfo = new SP.ListItemCreationInformation();
var listItem = list.addItem(itemInfo);
listItem.set_item('Title', txt);
listItem.update();
clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed)
);
}

function onQuerySucceeded() {
SP.UI.Notify.addNotification('שגיאת מערכת',false);
}

function onQueryFailed(sender, args) {
SP.UI.Notify.addNotification('Could not able to create error log: ' + args.get_message(), false);
}
