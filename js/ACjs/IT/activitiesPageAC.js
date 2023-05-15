
/***************************************************************************/
/*   Source:          SpDropDown / SpText / SpDbTextFilter /  DbText       */
/*   DispColumnName:  עמודת השלמה אוטומטית בדף                             */
/*   DispSourceList:  רשימת מקור נתונים , SourceColumn: עמודת מקור נתונים  */
/***************************************************************************/ 
$(document).ready(function() {
   var new_Columns = [
     { "Source" : "SpDbTextFilter", "DispColumnName" : "חיפוש פעילויות פתוחות", "DispSourceList" : "רשימת פעילויות", "SourceColumn" : "Title", "CAMLQuery" : "<Neq><FieldRef Name='Activity_Status'></FieldRef><Value Type='Lookup'>3. הושלמה</Value></Neq>" }
     ] 
   acMain (new_Columns);
   //PMOClickAutoComplete.AcMain (new_Columns);

});