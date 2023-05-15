
/*********************************************************/
/* Source  : SpDropDown / SpText / SpTextFilter / DbText */
/* DispColumnName  :  עמודת השלמה אוטומטית בדף           */
/* DispSourceList  :  רשימת מקור נתונים ,  SourceColumn  : עמודת מקור נתונים */
/*****************************************************************************/ 
$(document).ready(function() {
     var new_Columns   = [
          { "Source" : "SpDbTextFilter", "DispColumnName" : "הקלד מספר או נושא תביעה", "DispSourceList" : "רשימת תביעות", "SourceColumn" : "fullName" }
          ] 
          acMain(new_Columns);
          //PMOClickAutoComplete.AcMain (new_Columns);
});