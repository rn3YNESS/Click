/**************************************************************************************************************/
/*   Source:          SpDropDown / SpText / SpTextFilter /  DbText                                            */
/*   DispColumnName:  עמודת השלמה אוטומטית בדף                                                                        */
/*   DispSourceList:  רשימת מקור נתונים , SourceColumn: עמודת מקור נתונים                                                   */
/**************************************************************************************************************/    
$(document).ready(function() {
    var new_Columns = [
      { "Source" : "SpDropDown", "DispColumnName" : "מאת", "DispSourceList" : "אנשי קשר", "SourceColumn" : "FullName1" }//,
     // { "Source" : "DbText", "DispColumnName" : "שם יחידה", "SourceTable" : "T_Department", "SourceTableColumn" : "DepartmentHeb" }  
    ] 
    //acMain (new_Columns);
    PMOClickAutoComplete.AcMain (new_Columns);
 
 });