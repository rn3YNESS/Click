<%-- SPG:

קובץ HTML זה שויך לפריסת דף של SharePoint (קובץ ‎.aspx) בעלת שם זהה. כל עוד הקבצים משויכים, לא תהיה לך אפשרות לערוך את קובץ ה- ‎.aspx, וכל פעולות שינוי השם, ההעברה או המחיקה יוחזרו.

כדי לבנות את פריסת הדף ישירות מתוך קובץ HTML זה, פשוט הזן תוכן במצייני מיקום תוכן. השתמש ביוצר המקטעים ב- http://intpmoclick/_layouts/15/ComponentHome.aspx?Url=http%3A%2F%2Fintpmoclick%2F%5Fcatalogs%2Fmasterpage%2FClick%2Fhtml%2FPageLayouts%2FClickHomePL%2Easpx כדי ליצור ולהתאים אישית מצייני מיקום תוכן נוספים וישויות SharePoint שימושיות אחרות, ולאחר מכן העתק והדבק אותם כמקטעי HTML בקוד ה- HTML. כל העדכונים בתוך מצייני מיקום תוכן בקובץ זה יסונכרנו באופן אוטומטי עם פריסת הדף המשויכת.

 --%>
<%@Page language="C#" Inherits="Microsoft.SharePoint.Publishing.PublishingLayoutPage, Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register TagPrefix="PageFieldFieldValue" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register TagPrefix="Publishing" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
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
            <div class="row" style="height: 100%; overflow-y: auto;">
                <!--    Page Content    -->
                <!--    Main Content    -->
                <div class="col-lg-9 ContAreaRightCol">
                    <div class="row">
                        <!--    WebPart Zone Right Top  -->
                        <div class="col-lg-12">
                            <div data-name="WebPartZone" class="webPartZoneTopRight">
                                
                                
                                <div>
                                    <WebPartPages:WebPartZone runat="server" ID="WebPartZoneRightTop" AllowPersonalization="False" FrameType="TitleBarOnly" Orientation="Vertical">
                                        <ZoneTemplate>
                                            
                                        </ZoneTemplate>
                                    </WebPartPages:WebPartZone>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <!--    WebPart Zone Right Bottom  -->
                        <div class="col-lg-12">
                            <div data-name="WebPartZone" class="webPartZoneBottomRight">
                                
                                
                                <div>
                                    <WebPartPages:WebPartZone runat="server" ID="WebPartZoneRightBottom" AllowPersonalization="False" FrameType="TitleBarOnly" Orientation="Vertical">
                                        <ZoneTemplate>
                                            
                                        </ZoneTemplate>
                                    </WebPartPages:WebPartZone>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <!--    Accordion Information    -->
                <!--    WebPart Zone Left  -->
                <div class="col-lg-3 AccInfoLeftCol">
                    <div data-name="WebPartZone" style="height: 100%; background-color: #e7e9ee;">
                        
                        
                        <div>
                            <WebPartPages:WebPartZone runat="server" ID="WebPartZoneLeft" AllowPersonalization="False" FrameType="TitleBarOnly" Orientation="Vertical">
                                <ZoneTemplate>
                                    
                                </ZoneTemplate>
                            </WebPartPages:WebPartZone>
                        </div>
                        
                    </div>
                </div>
                <!--    End of Page Content    -->
            </div>
        </asp:Content>