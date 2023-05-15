/**************************************************************************************************************/
/*   Source:          SpDropDown / SpText / SpTextFilter /  DbText                                            */
/*   DispColumnName:  עמודת השלמה אוטומטית בדף                                                                        */
/*   DispSourceList:  רשימת מקור נתונים , SourceColumn: עמודת מקור נתונים                                                   */
/**************************************************************************************************************/ 
$(document).ready(function() {
   var new_Columns = [
     { "Source" : "SpDropDown", "DispColumnName" : "שם המערכת *", "DispSourceList" : "מערכות משרד", "SourceColumn" : "System_Name"}
     ] 
   //acMain (new_Columns);
   PMOClickAutoComplete.AcMain (new_Columns);
});