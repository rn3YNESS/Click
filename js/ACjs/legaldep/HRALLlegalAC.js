
/**************************************************************************************************************/
/*   Source:          SpDropDown / SpText / SpTextFilter /  DbText                                            */
/*   DispColumnName:  עמודת השלמה אוטומטית בדף                                                                */
/*   DispSourceList:  רשימת מקור נתונים , SourceColumn: עמודת מקור נתונים                                     */
/**************************************************************************************************************/      

$(document).ready(function() {
   var new_Columns = [
        { "Source" : "SpDbTextFilter", "DispColumnName" : "בחר שם:", "DispSourceList" : "רשימת מועמדים", "SourceColumn" : "FullNameID", "SourceTable" : "V_NameId", "SourceTableColumn" : "NameId" } 
        ] 
    // PMOClickAutoComplete.AcMain (new_Columns);
    acMain(new_Columns);


});