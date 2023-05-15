/***********************************************************************/
/*   Source:SpDropDown/ SpText/ SpDbTextFilter /  DbText               */
/* DispColumnName:  עמודת השלמה אוטומטית בדף                           */
/* DispSourceList:  רשימת מקור נתונים , SourceColumn: עמודת מקור נתונים*/
/***********************************************************************/ 
$(document).ready(function() {
var new_Columns = [
    { "Source" : "SpDbTextFilter", "DispColumnName" : "חיפוש לפי שם תכנית הלימודים", "DispSourceList" : "טיפול בבקשות", "SourceColumn" : "StudyName" }
     ]
   acMain (new_Columns);

});