/***********************************************************************/
/*   Source:SpDropDown/ SpText/ SpDbTextFilter /  DbText               */
/* DispColumnName:  עמודת השלמה אוטומטית בדף                           */
/* DispSourceList:  רשימת מקור נתונים , SourceColumn: עמודת מקור נתונים*/
/***********************************************************************/ 
$(document).ready(function() {
var new_Columns = [
   // { "Source" : "SpDbTextFilter", "DispColumnName" : "בחר שם", "SourceTable" : "V_NameId", "SourceTableColumn" : "NameId" }
     {"Source" : "SpDbTextFilter", "DispColumnName" : "בחר שם", "DispSourceList" : "טיפול בבקשות", "SourceColumn" : "NameALL" }]
   acMain (new_Columns);

});