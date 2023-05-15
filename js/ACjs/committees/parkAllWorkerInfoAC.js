/******************************************************************/
/*     Source:  SpDropDown /SpText /SpDbTextFilter /DbText       */
/*     DispColumnName:  עמודת השלמה אוטומטית בדף               */
/*     DispSourceList:  רשימת מקור נתונים ,SourceColumn: עמודת מקור נתונים  */
/***************************************************************************/ 
$(document).ready(function() {
     var new_Columns = [
     { "Source":"SpDbTextFilter", "DispColumnName":"בחר עובד:", "SourceTable":"V_NameId", "SourceTableColumn":"NameId" }
     ] 
     acMain (new_Columns);

});