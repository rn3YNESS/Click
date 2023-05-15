/***************************************************************************/
/*   Source:          SpDropDown / SpText / SpDbTextFilter /  DbText       */
/*   DispColumnName:  עמודת השלמה אוטומטית בדף                             */
/*   DispSourceList:  רשימת מקור נתונים , SourceColumn: עמודת מקור נתונים  */
/***************************************************************************/ 
$(document).ready(function() {
   var new_Columns = [
     { "Source" : "SpDbTextFilter", "DispColumnName" : "חיפוש מערכת", "DispSourceList" : "מערכות משרד", "SourceColumn" : "System_Name", "CAMLQuery" : "<Eq><FieldRef Name='RoutingEnabled' /><Value Type='Boolean'>1</Value></Eq>" }
     ] 
   acMain (new_Columns);

});