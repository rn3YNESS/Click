
/**************************************************************************************************************/
/*   Source:          SpDropDown / SpText / SpTextFilter /  DbText                                            */
/*   DispColumnName:  עמודת השלמה אוטומטית בדף                                                                        */
/*   DispSourceList:  רשימת מקור נתונים , SourceColumn: עמודת מקור נתונים                                                   */
/**************************************************************************************************************/    
$(document).ready(function() {
    var new_Columns = [
      { "Source" : "SpDropDown", "DispColumnName" : "הנושא", "DispSourceList" : "רשימת נושאים", "SourceColumn" : "SubName" },
      { "Source" : "DbText", "DispColumnName" : "שם יחידה", "SourceTable" : "T_Department", "SourceTableColumn" : "DepartmentHeb" }  
    ] 
    PMOClickAutoComplete.AcMain (new_Columns);
    //acMain(new_Columns);
 
 });