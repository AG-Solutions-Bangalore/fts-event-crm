import {
    LayoutDashboard,
    User,
    Network,
    PieChart,
    Languages,
    Briefcase,
    Copy,
    MessageSquare,
    Users,
    Receipt,
    School,
    List,
    Repeat,
    Component,
    FileText,
    Download,

    Type,
    Bell,
    DollarSign,
    Box,
  } from "lucide-react";
  
  const Menuitems = (userTypeId) => {
    const items = [
      {
        navlabel: true,
        subheader: "Home",
      },
      
        
      {
        id: "receipt-list",
        title: "Donation Receipts",
        icon: Receipt,
        href: "/receipt-list",
      },
    ];
  
   
  
    return items;
  };
  
  export default Menuitems;