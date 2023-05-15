
/**************************************************************************************************************/
/*   Source:          SpDropDown / SpText / SpIpText / SpTextFilter /  DbText                                 */
/*   DispColumnName:  עמודת השלמה אוטומטית בדף                                                                */
/*   DispSourceList:  רשימת מקור נתונים , SourceColumn: עמודת מקור נתונים                                     */
/**************************************************************************************************************/ 
$(document).ready(function() {
   var new_Columns = [

     { "Source" : "SpDropDown", "DispColumnName" : "קישור לפניה", "DispSourceList" : "רשימת פניות ועדת בלאי", "SourceColumn" : "requestID" } 
       
     ] 
   //acMain (new_Columns);
   PMOClickAutoComplete.AcMain (new_Columns);

});