/***********************************************************/
/*   Source:          SpDropDown / SpText / SpTextFilter /  DbText*/
/*   DispColumnName:  עמודת השלמה אוטומטית בדף               */
/*   DispSourceList:  רשימת מקור נתונים , SourceColumn: עמודת מקור נתונים  */
/***********************************************************/    
$(document).ready(function() {
   var new_Columns = [
     {"Source" : "SpText", "DispColumnName" : "שם היועץ", "DispSourceList" : "פרטי יועצים חיצוניים", "SourceColumn" : "Title" }

] 
   acMain (new_Columns);

});