<%-- SPG:

קובץ HTML זה שויך לפריסת דף של SharePoint (קובץ ‎.aspx) בעלת שם זהה. כל עוד הקבצים משויכים, לא תהיה לך אפשרות לערוך את קובץ ה- ‎.aspx, וכל פעולות שינוי השם, ההעברה או המחיקה יוחזרו.

כדי לבנות את פריסת הדף ישירות מתוך קובץ HTML זה, פשוט הזן תוכן במצייני מיקום תוכן. השתמש ביוצר המקטעים ב- http://intpmoclick/_layouts/15/ComponentHome.aspx?Url=http%3A%2F%2Fintpmoclick%2F%5Fcatalogs%2Fmasterpage%2FClick%2Fviews%2FPageLayouts%2FSharePointOOTBPL%2Easpx כדי ליצור ולהתאים אישית מצייני מיקום תוכן נוספים וישויות SharePoint שימושיות אחרות, ולאחר מכן העתק והדבק אותם כמקטעי HTML בקוד ה- HTML. כל העדכונים בתוך מצייני מיקום תוכן בקובץ זה יסונכרנו באופן אוטומטי עם פריסת הדף המשויכת.

 --%>
<%@Page language="C#" Inherits="Microsoft.SharePoint.Publishing.PublishingLayoutPage, Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register TagPrefix="PageFieldFieldValue" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register TagPrefix="Publishing" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register TagPrefix="PageFieldTextField" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register TagPrefix="PageFieldRichImageField" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register TagPrefix="PageFieldRichHtmlField" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register TagPrefix="PageFieldSummaryLinkFieldControl" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register TagPrefix="PageFieldDateTimeField" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<asp:Content runat="server" ContentPlaceHolderID="PlaceHolderPageTitle">
            
            
            <PageFieldFieldValue:FieldValue FieldName="fa564e0f-0c70-4ab9-b863-0177e6ddd247" runat="server">
            </PageFieldFieldValue:FieldValue>
            
        </asp:Content><asp:Content runat="server" ContentPlaceHolderID="PlaceHolderAdditionalPageHead">
            
            
            
            <Publishing:EditModePanel runat="server" id="editmodestyles">
                <SharePoint:CssRegistration name="&lt;% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/editmode15.css %&gt;" After="&lt;% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %&gt;" runat="server">
                </SharePoint:CssRegistration>
            </Publishing:EditModePanel>
            
        </asp:Content><asp:Content runat="server" ContentPlaceHolderID="PlaceHolderTitleBreadcrumb">
            <SharePoint:ListSiteMapPath runat="server" SiteMapProviders="SPSiteMapProvider,SPContentMapProvider" RenderCurrentNodeAsLink="false" PathSeparator="" CssClass="ms-breadcrumb" NodeStyle-CssClass="ms-breadcrumbNode" CurrentNodeStyle-CssClass="ms-breadcrumbCurrentNode" RootNodeStyle-CssClass="ms-breadcrumbRootNode" NodeImageOffsetX="0" NodeImageOffsetY="289" NodeImageWidth="16" NodeImageHeight="16" NodeImageUrl="/_layouts/15/images/fgimg.png?rev=43" RTLNodeImageOffsetX="0" RTLNodeImageOffsetY="312" RTLNodeImageWidth="16" RTLNodeImageHeight="16" RTLNodeImageUrl="/_layouts/15/images/fgimg.png?rev=43" HideInteriorRootNodes="true" SkipLinkText="" />
        </asp:Content><asp:Content runat="server" ContentPlaceHolderID="PlaceHolderTopNavBar">
            <SharePoint:AspMenu ID="TopNavigationMenu" Runat="server" EnableViewState="false" DataSourceID="topSiteMap" AccessKey="&lt;%$Resources:wss,navigation_accesskey%&gt;" UseSimpleRendering="true" UseSeparateCss="false" Orientation="Horizontal" StaticDisplayLevels="2" AdjustForShowStartingNode="true" MaximumDynamicDisplayLevels="2" SkipLinkText="" />
            
        </asp:Content><asp:Content runat="server" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea">
            <SharePoint:SPTitleBreadcrumb runat="server" RenderCurrentNodeAsLink="true" SiteMapProvider="SPContentMapProvider" CentralAdminSiteMapProvider="SPXmlAdminContentMapProvider" SkipLinkText="">
            
            <PATHSEPARATORTEMPLATE>
            <SharePoint:ClusteredDirectionalSeparatorArrow runat="server" />
            </PATHSEPARATORTEMPLATE>
            </SharePoint:SPTitleBreadcrumb>
            
            
            <PageFieldFieldValue:FieldValue FieldName="fa564e0f-0c70-4ab9-b863-0177e6ddd247" runat="server">
            </PageFieldFieldValue:FieldValue>
            
        </asp:Content><asp:Content runat="server" ContentPlaceHolderID="PlaceHolderPageDescription">
        </asp:Content><asp:Content runat="server" ContentPlaceHolderID="PlaceHolderSearchArea">
            <div id="searchInputBox">
                <SharePoint:DelegateControl runat="server" ControlId="SmallSearchInputBox" />
                
            </div>
        </asp:Content><asp:Content runat="server" ContentPlaceHolderID="PlaceHolderLeftNavBar">
            <SharePoint:DelegateControl runat="server" ControlId="QuickLaunchTop" />
            <a id="startNavigation" name="startNavigation" tabIndex="-1">
            </a>
            <div>
            </div>
            <div>
            </div>
            <div>
            </div>
            <div>
            </div>
            <div>
            </div>
            <div class="ms-core-sideNavBox-removeLeftMargin">
                <SharePoint:SPNavigationManager id="QuickLaunchNavigationManager" runat="server" QuickLaunchControlId="V4QuickLaunchMenu" ContainedControl="QuickLaunch" EnableViewState="false">
                <SharePoint:DelegateControl runat="server" ControlId="QuickLaunchDataSource">
                <Template_Controls>
                <asp:SiteMapDataSource SiteMapProvider="SPNavigationProvider" ShowStartingNode="False" id="QuickLaunchSiteMap" StartingNodeUrl="sid:1025" runat="server" />
                </Template_Controls>
                </SharePoint:DelegateControl>
                <SharePoint:AspMenu id="V4QuickLaunchMenu" runat="server" EnableViewState="false" DataSourceId="QuickLaunchSiteMap" UseSimpleRendering="true" Orientation="Vertical" StaticDisplayLevels="3" AdjustForShowStartingNode="true" MaximumDynamicDisplayLevels="0" SkipLinkText="" />
                </SharePoint:SPNavigationManager>
                <SharePoint:SPNavigationManager id="TreeViewNavigationManagerV4" runat="server" ContainedControl="TreeView" CssClass="ms-tv-box">
                <SharePoint:SPLinkButton runat="server" NavigateUrl="~site/_layouts/15/viewlsts.aspx" id="idNavLinkSiteHierarchyV4" Text="&lt;%$Resources:wss,treeview_header%&gt;" accesskey="&lt;%$Resources:wss,quiklnch_allcontent_AK%&gt;" CssClass="ms-tv-header" />
                <SharePoint:DelegateControl runat="server" ControlId="TreeViewAndDataSource">
                <Template_Controls>
                <SharePoint:SPHierarchyDataSourceControl runat="server" id="TreeViewDataSourceV4" RootContextObject="Web" IncludeDiscussionFolders="true" />
                <SharePoint:SPRememberScroll runat="server" id="TreeViewRememberScrollV4" onscroll="javascript:_spRecordScrollPositions(this);" style="overflow: auto;">
                <SharePoint:SPTreeView id="WebTreeViewV4" runat="server" ShowLines="false" DataSourceId="TreeViewDataSourceV4" ExpandDepth="0" SelectedNodeStyle-CssClass="ms-tv-selected" NodeStyle-CssClass="ms-tv-item" SkipLinkText="" NodeIndent="12" ExpandImageUrl="/_layouts/15/images/tvclosed.png?rev=43" ExpandImageUrlRtl="/_layouts/15/images/tvclosedrtl.png?rev=43" CollapseImageUrl="/_layouts/15/images/tvopen.png?rev=43" CollapseImageUrlRtl="/_layouts/15/images/tvopenrtl.png?rev=43" NoExpandImageUrl="/_layouts/15/images/tvblank.gif?rev=43">
                </SharePoint:SPTreeView>
                </SharePoint:SPRememberScroll>
                </Template_Controls>
                </SharePoint:DelegateControl>
                </SharePoint:SPNavigationManager>
                <div>
                    <div class="ms-core-listMenu-verticalBox">
                        <SharePoint:ClusteredSPLinkButton runat="server" id="idNavLinkViewAll" PermissionsString="ViewFormPages" NavigateUrl="~site/_layouts/15/viewlsts.aspx" Text="&lt;%$Resources:wss,AllSiteContentMore%&gt;" ToolTip="&lt;%$Resources:wss,AllSiteContentMore%&gt;" accesskey="&lt;%$Resources:wss,quiklnch_allcontent_AK%&gt;" CssClass="ms-core-listMenu-item ms-core-listMenu-heading" />
                        
                    </div>
                </div>
            </div>
            <SharePoint:DelegateControl runat="server" ControlId="QuickLaunchBottom" />
        </asp:Content><asp:Content runat="server" ContentPlaceHolderID="PlaceHolderMain">
            <div>
                
                
                
                <Publishing:EditModePanel runat="server" CssClass="edit-mode-panel">
                    <PageFieldTextField:TextField FieldName="fa564e0f-0c70-4ab9-b863-0177e6ddd247" runat="server">
                    </PageFieldTextField:TextField>
                </Publishing:EditModePanel>
                
            </div>
            <div>
                
                
                <PageFieldRichImageField:RichImageField FieldName="3de94b06-4120-41a5-b907-88773e493458" runat="server">
                    
                </PageFieldRichImageField:RichImageField>
                
            </div>
            <div>
                
                
                <PageFieldRichHtmlField:RichHtmlField FieldName="f55c4d88-1f2e-4ad9-aaa8-819af4ee7ee8" runat="server">
                    
                </PageFieldRichHtmlField:RichHtmlField>
                
            </div>
            <div>
                
                
                <PageFieldSummaryLinkFieldControl:SummaryLinkFieldControl FieldName="b3525efe-59b5-4f0f-b1e4-6e26cb6ef6aa" runat="server">
                    
                </PageFieldSummaryLinkFieldControl:SummaryLinkFieldControl>
                
            </div>
            <div>
                
                
                <PageFieldTextField:TextField FieldName="d3429cc9-adc4-439b-84a8-5679070f84cb" runat="server">
                    
                </PageFieldTextField:TextField>
                
            </div>
            <div>
                
                
                <PageFieldDateTimeField:DateTimeField FieldName="71316cea-40a0-49f3-8659-f0cefdbdbd4f" runat="server">
                    
                </PageFieldDateTimeField:DateTimeField>
                
            </div>
            <div>
                
                
                <PageFieldRichHtmlField:RichHtmlField FieldName="66f500e9-7955-49ab-abb1-663621727d10" runat="server">
                    
                </PageFieldRichHtmlField:RichHtmlField>
                
            </div>
        </asp:Content><asp:Content runat="server" ContentPlaceHolderID="PlaceHolderFormDigest">
            <SharePoint:FormDigest runat="server" />
        </asp:Content><asp:Content runat="server" ContentPlaceHolderID="PlaceHolderBodyAreaClass">
        </asp:Content>