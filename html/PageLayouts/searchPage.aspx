<%-- SPG:

קובץ HTML זה שויך לפריסת דף של SharePoint (קובץ ‎.aspx) בעלת שם זהה. כל עוד הקבצים משויכים, לא תהיה לך אפשרות לערוך את קובץ ה- ‎.aspx, וכל פעולות שינוי השם, ההעברה או המחיקה יוחזרו.

כדי לבנות את פריסת הדף ישירות מתוך קובץ HTML זה, פשוט הזן תוכן במצייני מיקום תוכן. השתמש ביוצר המקטעים ב- http://pmoclick19/_layouts/15/ComponentHome.aspx?Url=http%3A%2F%2Fpmoclick19%2F%5Fcatalogs%2Fmasterpage%2FClick%2Fhtml%2FPageLayouts%2FsearchPage%2Easpx כדי ליצור ולהתאים אישית מצייני מיקום תוכן נוספים וישויות SharePoint שימושיות אחרות, ולאחר מכן העתק והדבק אותם כמקטעי HTML בקוד ה- HTML. כל העדכונים בתוך מצייני מיקום תוכן בקובץ זה יסונכרנו באופן אוטומטי עם פריסת הדף המשויכת.

 --%>
<%@Page language="C#" Inherits="Microsoft.SharePoint.Publishing.PublishingLayoutPage, Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register TagPrefix="PageFieldFieldValue" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register TagPrefix="Publishing" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register TagPrefix="PageFieldTextField" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<asp:Content runat="server" ContentPlaceHolderID="PlaceHolderPageTitle">
            <SharePoint:ProjectProperty Property="Title" runat="server">
            </SharePoint:ProjectProperty>
            
            
            <PageFieldFieldValue:FieldValue FieldName="fa564e0f-0c70-4ab9-b863-0177e6ddd247" runat="server">
            </PageFieldFieldValue:FieldValue>
            
        </asp:Content><asp:Content runat="server" ContentPlaceHolderID="PlaceHolderAdditionalPageHead">
            
            
            
            <Publishing:EditModePanel runat="server" id="editmodestyles">
                <SharePoint:CssRegistration name="&lt;% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/editmode15.css %&gt;" After="&lt;% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %&gt;" runat="server">
                </SharePoint:CssRegistration>
            </Publishing:EditModePanel>
            
        </asp:Content><asp:Content runat="server" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea">
            
            
            <PageFieldFieldValue:FieldValue FieldName="fa564e0f-0c70-4ab9-b863-0177e6ddd247" runat="server">
            </PageFieldFieldValue:FieldValue>
            
        </asp:Content><asp:Content runat="server" ContentPlaceHolderID="PlaceHolderMain">
            <div>
                
                
                
                <Publishing:EditModePanel runat="server" CssClass="edit-mode-panel">
                    <PageFieldTextField:TextField FieldName="fa564e0f-0c70-4ab9-b863-0177e6ddd247" runat="server">
                    </PageFieldTextField:TextField>
                </Publishing:EditModePanel>
                
            </div>
            <br />
            <div class="row" style="position: absolute; height: 100%;">
                <!--RIGHT CLICK WP AREA-->
                <div id="LeftWPzone" class="col-lg-3" style="overflow: hidden;">
                    <div data-name="WebPartZone">
                        
                        
                        <div>
                            <WebPartPages:WebPartZone runat="server" ID="x169b6c8130b54a2eafcb875bab56fd0a" AllowPersonalization="False" FrameType="TitleBarOnly" Orientation="Vertical">
                                <ZoneTemplate>
                                    
                                </ZoneTemplate>
                            </WebPartPages:WebPartZone>
                        </div>
                        
                    </div>
                </div>
                <!--LEFT CLICK WP AREA-->
                <div id="RightWPzone" class="col-lg-8" style="height: 100%; overflow-y: auto;">
                    <div data-name="WebPartZone">
                        
                        
                        <div>
                            <WebPartPages:WebPartZone runat="server" ID="x169b6c8130b54a2eafcb875bab56fd0b" AllowPersonalization="False" FrameType="TitleBarOnly" Orientation="Vertical">
                                <ZoneTemplate>
                                    
                                </ZoneTemplate>
                            </WebPartPages:WebPartZone>
                        </div>
                        
                    </div>
                </div>
            </div>
        </asp:Content>