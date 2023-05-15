/***********************************************************/
/*   Source:          SpDropDown / SpText / SpTextFilter /  DbText                       */
/*   DispColumnName:  עמודת השלמה אוטומטית בדף                                    */
/*   DispSourceList:  רשימת מקור נתונים , SourceColumn: עמודת מקור נתונים  */
/***********************************************************/    
$(document).ready(function() {
   var new_Columns = [
     { 

"Source" : "SpDropDown", 
"DispColumnName" : "איש קשר*", 
"DispSourceList" : "אנשי קשר", 
"SourceColumn" : "FullName1" 

     } ] 
     PMOClickAutoComplete.AcMain (new_Columns);

});