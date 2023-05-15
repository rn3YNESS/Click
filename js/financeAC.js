/**************************************************************************************************************/
/*   Source:          SpDropDown / SpText / SpDbTextFilter /  DbText                                            */
/*   DispColumnName:  עמודת השלמה אוטומטית בדף                                                                        */
/*   DispSourceList:  רשימת מקור נתונים , SourceColumn: עמודת מקור נתונים                                                   */
/**************************************************************************************************************/      

$(document).ready(function() {
   var new_Columns = [
        { "Source" : "SpDbTextFilter", "DispColumnName" : "בחר שם:", "DispSourceList" : "רישום נסיעות", "SourceColumn" : "Title" } 
        ] 
   acMain (new_Columns);

});