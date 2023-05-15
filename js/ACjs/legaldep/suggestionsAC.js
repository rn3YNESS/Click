/**************************************************************************************************************/
/*   Source:          SpDropDown / SpText / SpTextFilter /  DbText                                            */
/*   DispColumnName:  עמודת השלמה אוטומטית בדף                                                                        */
/*   DispSourceList:  רשימת מקור נתונים , SourceColumn: עמודת מקור נתונים                                                   */
/**************************************************************************************************************/ 
$(document).ready(function() {
   var new_Columns = [
     { "Source" : "SpDbTextFilter", "DispColumnName" : "הקלד נושא", "DispSourceList" : "נושאי הצעות החלטה", "SourceColumn" : "Title" }
     ] 
   acMain (new_Columns);

});