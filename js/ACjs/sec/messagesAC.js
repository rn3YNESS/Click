/***************************************************************************************/
/*   Source:          SpDropDown / SpText / SpTextFilter /  DbText                     */
/*   DispColumnNameעמודת השלמה אוטומטית בדף:                                          */
/*   DispSourceList:  רשימת מקור נתונים , SourceColumnעמודת מקור נתונים:              */                                 
/***************************************************************************************/
$(document).ready(function () {
   var new_Columns = [
      { 
"Source" : "SpDropDown", 
"DispColumnName" : "איש קשר*",  
"DispSourceList" : "אנשי קשר",    
"SourceColumn" :  "FullName1"
} 
   ] 
   //acMain (new_Columns);
   PMOClickAutoComplete.AcMain (new_Columns);
} ) ;