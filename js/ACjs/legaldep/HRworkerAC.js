/**************************************************************************************************************/
/*   Source:          SpDropDown / SpText / SpTextFilter /  DbText                                            */
/*   DispColumnName:  עמודת השלמה אוטומטית בדף                                                                        */
/*   DispSourceList:  רשימת מקור נתונים , SourceColumn: עמודת מקור נתונים                                                   */
/**************************************************************************************************************/    
$(document).ready(function() {
   var new_Columns = [
     { "Source" : "SpDropDown", "DispColumnName" : "שם מועמד", "DispSourceList" : "רשימת מועמדים", "SourceColumn" : "FullNameID" }

   ] 
   //acMain (new_Columns);
   PMOClickAutoComplete.AcMain (new_Columns);
$Employee =$("div[Title='בורר פריטים חיצוניים']").text();
$Candidate=$("input[id='newObjID_שם_מועמד']").val();


if ($Candidate.length > '0'&& $Candidate!='(None)' && $Employee.length == '1'){

    $('nobr:contains("שם עובד")').closest('tr').hide(); 
    $('nobr:contains("שם מועמד")').closest('tr').show(); 
}

else if ($Candidate.length == '0' && $Employee.length > '1'){

    $('nobr:contains("שם מועמד")').closest('tr').hide();
    $('nobr:contains("שם עובד")').closest('tr').show();  
}



$("div[Title='בורר פריטים חיצוניים']").keyup(function (){               
     if ($(this).text() == ""){
        $('nobr:contains("שם מועמד")').closest('tr').show();  
     }
     else{
           $('nobr:contains("שם מועמד")').closest('tr').hide(); 
 
     }              

  }) 

$("img[Title='בחר פריטים חיצוניים']").click(function (){  
function wait(){  
     if ($("div[Title='בורר פריטים חיצוניים']").text() == ""){
        $('nobr:contains("שם מועמד")').closest('tr').show();  
     }
     else{
           $('nobr:contains("שם מועמד")').closest('tr').hide(); 
 
     }              
}
window.setTimeout( wait, 0);
  }) 

  
$("input[id='newObjID_שם_מועמד']").keyup(function (){ 

                  
   if ($(this).val() == ""){
       $('nobr:contains("שם עובד")').closest('tr').show();     
     }
     else{
       $('nobr:contains("שם עובד")').closest('tr').hide();    
     }              
  }) 
 

$("ul[id='SPAutocomplete_NameCandidate']").click(function (){  
     
if ($("input[id= 'newObjID_שם_מועמד']").val() == ""){
        $('nobr:contains("שם עובד")').closest('tr').show();  
     }
     else{
           $('nobr:contains("שם עובד")').closest('tr').hide(); 
 
     }              

  })

});