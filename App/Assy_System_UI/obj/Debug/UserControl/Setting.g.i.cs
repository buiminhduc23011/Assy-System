﻿#pragma checksum "..\..\..\UserControl\Setting.xaml" "{8829d00f-11b8-4213-878b-770e8597ac16}" "7CB7B545CB69F3876368D001B9FFA5E7590FF0AA8140AD394BE0C96B3E4E63D1"
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using Assy_System_UI.UserControl;
using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Automation;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Markup;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Effects;
using System.Windows.Media.Imaging;
using System.Windows.Media.Media3D;
using System.Windows.Media.TextFormatting;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Shell;


namespace Assy_System_UI.UserControl {
    
    
    /// <summary>
    /// Setting
    /// </summary>
    public partial class Setting : System.Windows.Controls.UserControl, System.Windows.Markup.IComponentConnector {
        
        
        #line 23 "..\..\..\UserControl\Setting.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBox txb_IP_CameraBT;
        
        #line default
        #line hidden
        
        
        #line 27 "..\..\..\UserControl\Setting.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBox txb_Port_CameraBT;
        
        #line default
        #line hidden
        
        
        #line 33 "..\..\..\UserControl\Setting.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBox txb_IP_CameraLV;
        
        #line default
        #line hidden
        
        
        #line 37 "..\..\..\UserControl\Setting.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBox txb_Port_CameraLV;
        
        #line default
        #line hidden
        
        
        #line 43 "..\..\..\UserControl\Setting.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBox txb_ServerPLC_R;
        
        #line default
        #line hidden
        
        
        #line 49 "..\..\..\UserControl\Setting.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBox txb_ServerPLC_W;
        
        #line default
        #line hidden
        
        
        #line 55 "..\..\..\UserControl\Setting.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBox txb_ServerWeb;
        
        #line default
        #line hidden
        
        
        #line 62 "..\..\..\UserControl\Setting.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.Button bt_Save_Setting_Sys;
        
        #line default
        #line hidden
        
        private bool _contentLoaded;
        
        /// <summary>
        /// InitializeComponent
        /// </summary>
        [System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [System.CodeDom.Compiler.GeneratedCodeAttribute("PresentationBuildTasks", "4.0.0.0")]
        public void InitializeComponent() {
            if (_contentLoaded) {
                return;
            }
            _contentLoaded = true;
            System.Uri resourceLocater = new System.Uri("/Assy_System_UI;component/usercontrol/setting.xaml", System.UriKind.Relative);
            
            #line 1 "..\..\..\UserControl\Setting.xaml"
            System.Windows.Application.LoadComponent(this, resourceLocater);
            
            #line default
            #line hidden
        }
        
        [System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [System.CodeDom.Compiler.GeneratedCodeAttribute("PresentationBuildTasks", "4.0.0.0")]
        [System.ComponentModel.EditorBrowsableAttribute(System.ComponentModel.EditorBrowsableState.Never)]
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Design", "CA1033:InterfaceMethodsShouldBeCallableByChildTypes")]
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity")]
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1800:DoNotCastUnnecessarily")]
        void System.Windows.Markup.IComponentConnector.Connect(int connectionId, object target) {
            switch (connectionId)
            {
            case 1:
            this.txb_IP_CameraBT = ((System.Windows.Controls.TextBox)(target));
            return;
            case 2:
            this.txb_Port_CameraBT = ((System.Windows.Controls.TextBox)(target));
            return;
            case 3:
            this.txb_IP_CameraLV = ((System.Windows.Controls.TextBox)(target));
            return;
            case 4:
            this.txb_Port_CameraLV = ((System.Windows.Controls.TextBox)(target));
            return;
            case 5:
            this.txb_ServerPLC_R = ((System.Windows.Controls.TextBox)(target));
            return;
            case 6:
            this.txb_ServerPLC_W = ((System.Windows.Controls.TextBox)(target));
            return;
            case 7:
            this.txb_ServerWeb = ((System.Windows.Controls.TextBox)(target));
            return;
            case 8:
            this.bt_Save_Setting_Sys = ((System.Windows.Controls.Button)(target));
            
            #line 62 "..\..\..\UserControl\Setting.xaml"
            this.bt_Save_Setting_Sys.Click += new System.Windows.RoutedEventHandler(this.bt_Save_Setting_Sys_Click);
            
            #line default
            #line hidden
            return;
            }
            this._contentLoaded = true;
        }
    }
}
