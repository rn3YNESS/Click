/******************************************************************************/
/*   Source:          SpDropDown / SpText / SpTextFilter /  DbText    */
/*   DispColumnNameעמודת השלמה אוטומטית בדף:     */
/*   DispSourceList:  רשימת מקור נתונים , SourceColumnעמודת מקור נתונים: */
/*******************************************************************************/

$(document).ready(function () {
   var new_Columns = [
      { "Source" : "DbText", "DispColumnName" : "יחידה", "SourceTable" : "T_Department", "SourceTableColumn" : "DepartmentHeb" } 
   ] 
   //acMain (new_Columns);
   PMOClickAutoComplete.AcMain (new_Columns);
});