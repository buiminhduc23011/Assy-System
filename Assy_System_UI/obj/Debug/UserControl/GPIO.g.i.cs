﻿#pragma checksum "..\..\..\UserControl\GPIO.xaml" "{8829d00f-11b8-4213-878b-770e8597ac16}" "B17480AACDF99B0190A672E3E01A1E5044F9CA4C99EF96A0B61567945454D502"
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
    /// GPIO
    /// </summary>
    public partial class GPIO : System.Windows.Controls.UserControl, System.Windows.Markup.IComponentConnector {
        
        
        #line 21 "..\..\..\UserControl\GPIO.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.Button bt_IO_BT;
        
        #line default
        #line hidden
        
        
        #line 33 "..\..\..\UserControl\GPIO.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.Button bt_IO_LV;
        
        #line default
        #line hidden
        
        
        #line 45 "..\..\..\UserControl\GPIO.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.Button bt_IO_Drill;
        
        #line default
        #line hidden
        
        
        #line 57 "..\..\..\UserControl\GPIO.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.Button bt_IO_DC;
        
        #line default
        #line hidden
        
        
        #line 69 "..\..\..\UserControl\GPIO.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.Button bt_IO_Output;
        
        #line default
        #line hidden
        
        
        #line 82 "..\..\..\UserControl\GPIO.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.StackPanel Pn_GPIO;
        
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
            System.Uri resourceLocater = new System.Uri("/Assy_System_UI;component/usercontrol/gpio.xaml", System.UriKind.Relative);
            
            #line 1 "..\..\..\UserControl\GPIO.xaml"
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
            this.bt_IO_BT = ((System.Windows.Controls.Button)(target));
            
            #line 28 "..\..\..\UserControl\GPIO.xaml"
            this.bt_IO_BT.Click += new System.Windows.RoutedEventHandler(this.bt_IO_BT_Click);
            
            #line default
            #line hidden
            return;
            case 2:
            this.bt_IO_LV = ((System.Windows.Controls.Button)(target));
            
            #line 40 "..\..\..\UserControl\GPIO.xaml"
            this.bt_IO_LV.Click += new System.Windows.RoutedEventHandler(this.bt_IO_LV_Click);
            
            #line default
            #line hidden
            return;
            case 3:
            this.bt_IO_Drill = ((System.Windows.Controls.Button)(target));
            
            #line 52 "..\..\..\UserControl\GPIO.xaml"
            this.bt_IO_Drill.Click += new System.Windows.RoutedEventHandler(this.bt_IO_Drill_Click);
            
            #line default
            #line hidden
            return;
            case 4:
            this.bt_IO_DC = ((System.Windows.Controls.Button)(target));
            
            #line 64 "..\..\..\UserControl\GPIO.xaml"
            this.bt_IO_DC.Click += new System.Windows.RoutedEventHandler(this.bt_IO_DC_Click);
            
            #line default
            #line hidden
            return;
            case 5:
            this.bt_IO_Output = ((System.Windows.Controls.Button)(target));
            
            #line 76 "..\..\..\UserControl\GPIO.xaml"
            this.bt_IO_Output.Click += new System.Windows.RoutedEventHandler(this.bt_IO_Output_Click);
            
            #line default
            #line hidden
            return;
            case 6:
            this.Pn_GPIO = ((System.Windows.Controls.StackPanel)(target));
            return;
            }
            this._contentLoaded = true;
        }
    }
}

