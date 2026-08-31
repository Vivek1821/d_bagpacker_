"use client";

import { useState, useRef, useEffect } from "react";
import {
  FileText, Download, Plus, Trash2, CheckCircle2,
  Building2, User, CreditCard, Shield, Sparkles, RefreshCw, Package, Edit3, Save, X, ArrowRight, Check, Tag, Layers, ChevronDown, Wand2
} from "lucide-react";
import jsPDF from "jspdf";
import { toJpeg } from "html-to-image";
import toast from "react-hot-toast";

export interface LineItem {
  id: string;
  itemType: "scope_package" | "custom_addon";
  packageCode: string; // Freeform editable: e.g. PKG-REEL-01, Travel Logistics, Custom Scope
  description: string; // Freeform editable description
  sacCode: string;
  qty: number;
  rate: number;
}

export interface CampaignPackage {
  id: string;
  code: string;
  name: string;
  tag: string;
  description: string;
  sacCode: string;
  rate: number;
  deliverables: string[];
}

const DEFAULT_PACKAGES: CampaignPackage[] = [
  {
    id: "pkg-1",
    code: "PKG-REEL-01",
    name: "Standard Reel Collaboration",
    tag: "Essential",
    description: "1x Dedicated 9:16 Instagram Reel on @d_bagpacker_ + 3x Story Set + Raw B-Roll Rights",
    sacCode: "998361",
    rate: 35000,
    deliverables: ["1x 9:16 Dedicated Reel", "3x Story Frames with Link", "3-Month Digital Usage"],
  },
  {
    id: "pkg-2",
    code: "PKG-TREK-02",
    name: "Full Expedition & Trek Campaign",
    tag: "Most Popular",
    description: "2x Dedicated 4K Reels + 5x Story Sets + YouTube Shorts Cross-post + Product Placement",
    sacCode: "998361",
    rate: 65000,
    deliverables: ["2x 4K Dedicated Reels", "5x Story Sets", "YouTube Shorts Cross-post", "6-Month Ad Rights"],
  },
  {
    id: "pkg-3",
    code: "PKG-RET-03",
    name: "Quarterly Brand Ambassador Retainer",
    tag: "Retainer (FY 26-27)",
    description: "Monthly 3x Reels + 10x Stories + Exclusive Category Representation + High-Res Photo Pack",
    sacCode: "998361",
    rate: 150000,
    deliverables: ["3x Reels / Month", "10x Story Sets / Month", "Category Exclusivity", "Full Commercial Rights"],
  },
  {
    id: "pkg-4",
    code: "PKG-UGC-04",
    name: "UGC Performance & Whitelisting",
    tag: "UGC Ads",
    description: "3x Creator-style UGC video ad cutdowns + Meta Ad Whitelisting rights for brand handle",
    sacCode: "998361",
    rate: 45000,
    deliverables: ["3x UGC Ad Cutdowns (Hooks)", "Meta Whitelisting Token", "1080x1920 Raw Delivery"],
  },
  {
    id: "pkg-5",
    code: "PKG-STORY-05",
    name: "Dedicated Story Set (3 Frames)",
    tag: "Quick Promo",
    description: "3x High-engagement Instagram Story sequence with direct CTA link sticker and brand tag",
    sacCode: "998361",
    rate: 12000,
    deliverables: ["3x Vertical Story Frames", "Link Sticker & Promo Code", "24-Hr Story Analytics"],
  },
];

// Convert numbers to Indian Rupees in words
function numberToIndianWords(num: number): string {
  const a = [
    "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ",
    "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const n = Math.floor(num);
  if (n === 0) return "Zero Rupees Only";

  const numStr = ("000000000" + n).substr(-9);
  const crore = parseInt(numStr.substr(0, 2));
  const lakh = parseInt(numStr.substr(2, 2));
  const thousand = parseInt(numStr.substr(4, 2));
  const hundred = parseInt(numStr.substr(6, 1));
  const rem = parseInt(numStr.substr(7, 2));

  let str = "";

  if (crore > 0) {
    str += (crore < 20 ? a[crore] : b[Math.floor(crore / 10)] + " " + a[crore % 10]) + "Crore ";
  }
  if (lakh > 0) {
    str += (lakh < 20 ? a[lakh] : b[Math.floor(lakh / 10)] + " " + a[lakh % 10]) + "Lakh ";
  }
  if (thousand > 0) {
    str += (thousand < 20 ? a[thousand] : b[Math.floor(thousand / 10)] + " " + a[thousand % 10]) + "Thousand ";
  }
  if (hundred > 0) {
    str += a[hundred] + "Hundred ";
  }
  if (rem > 0) {
    str += (str !== "" ? "and " : "") + (rem < 20 ? a[rem] : b[Math.floor(rem / 10)] + " " + a[rem % 10]);
  }

  return "Rupees " + str.trim() + " Only";
}

export default function InvoiceGenerator() {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const pkgEditorRef = useRef<HTMLDivElement>(null);
  const packagesSectionRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  // Packages management
  const [packages, setPackages] = useState<CampaignPackage[]>(DEFAULT_PACKAGES);
  const [showPkgManager, setShowPkgManager] = useState(false);
  const [editingPkg, setEditingPkg] = useState<CampaignPackage | null>(null);
  const [pkgForm, setPkgForm] = useState({
    code: "PKG-CUSTOM-01",
    name: "",
    tag: "Custom Scope",
    description: "",
    sacCode: "998361",
    rate: 25000,
    deliverables: "1x Reel, 3x Stories",
  });

  // Load persisted packages from localStorage on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dbg_campaign_packages_2627_v3");
      if (saved) setPackages(JSON.parse(saved));
    } catch {}
  }, []);

  const savePackages = (newPkgs: CampaignPackage[]) => {
    setPackages(newPkgs);
    try {
      localStorage.setItem("dbg_campaign_packages_2627_v3", JSON.stringify(newPkgs));
    } catch {}
  };

  // Autofilled Creator Profile (Persisted)
  const [creator] = useState({
    businessName: "D_BAGPACKER_GIRL_ CREATIVE MEDIA",
    creatorName: "D_BagPacker_Girl_ | Traveler 🇮🇳",
    handle: "@d_bagpacker_",
    email: "hello@dbagpacker.in",
    phone: "+91 98765 43210",
    pan: "ABCDE1234F",
    gstin: "27ABCDE1234F1Z5",
    state: "Maharashtra",
    stateCode: "27",
    bankName: "HDFC Bank Ltd",
    accName: "D BAGPACKER GIRL",
    accNumber: "50100458923145",
    ifsc: "HDFC0000123",
    upiId: "dbagpacker@upi",
  });

  // Client Details (User modifies per deal)
  const [client, setClient] = useState({
    name: "Wildcraft India Pvt. Ltd.",
    contactPerson: "Brand & Marketing Team",
    address: "Regd. Office, Cyber City, Bangalore, Karnataka - 560001",
    gstin: "29AABCW1234K1Z1",
    state: "Karnataka",
    stateCode: "29",
    placeOfSupply: "Karnataka (29)",
  });

  // Invoice Details with FY 2026-27 format
  const [invoice, setInvoice] = useState({
    invoiceNo: `DBG/26-27/001`,
    financialYear: "FY 2026-27",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
    taxType: "IGST" as "IGST" | "CGST_SGST" | "NON_GST",
    notes: "Payment requested within 15 days of invoice date. Deliverables provided as per commercial agreement for FY 2026-27.",
  });

  // Line items - Freeform writable in both Source and Description
  const [items, setItems] = useState<LineItem[]>([
    {
      id: "1",
      itemType: "scope_package",
      packageCode: "PKG-REEL-01",
      description: "Standard Reel Collaboration: 1x Dedicated 9:16 Instagram Reel on @d_bagpacker_ + 3x Story Set",
      sacCode: "998361",
      qty: 1,
      rate: 35000,
    },
    {
      id: "2",
      itemType: "custom_addon",
      packageCode: "TRAVEL-EXP",
      description: "Travel & Location Logistics (On-site Outdoor Shoot Expenses & Accommodation)",
      sacCode: "998361",
      qty: 1,
      rate: 8000,
    },
  ]);

  // Autofetch and add predefined scope package to invoice
  const applyPackageToInvoice = (pkg: CampaignPackage) => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      itemType: "scope_package",
      packageCode: pkg.code,
      description: `${pkg.name}: ${pkg.description}`,
      sacCode: pkg.sacCode,
      qty: 1,
      rate: pkg.rate,
    };
    setItems((prev) => [...prev, newItem]);
    toast.success(`Loaded [${pkg.code}] into Deliverables! ✨`);
  };

  // Add blank custom / out-of-scope item with full write freedom
  const addCustomItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      itemType: "custom_addon",
      packageCode: "CUSTOM-SCOPE",
      description: "",
      sacCode: "998361",
      qty: 1,
      rate: 5000,
    };
    setItems((prev) => [...prev, newItem]);
    toast.success("Added new editable item row 📝");
  };

  // Autofill an existing row from selected package
  const autofillRowFromPackage = (itemId: string, pkg: CampaignPackage) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              itemType: "scope_package",
              packageCode: pkg.code,
              description: `${pkg.name}: ${pkg.description}`,
              sacCode: pkg.sacCode,
              rate: pkg.rate,
            }
          : item
      )
    );
    toast.success(`Autofilled ${pkg.code}!`);
  };

  const handleOpenNewPackage = () => {
    setEditingPkg(null);
    setPkgForm({
      code: `PKG-CUSTOM-0${packages.length + 1}`,
      name: "",
      tag: "Custom Scope",
      description: "",
      sacCode: "998361",
      rate: 30000,
      deliverables: "1x Reel, 3x Stories",
    });
    setShowPkgManager(true);
    setTimeout(() => {
      pkgEditorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleEditPackage = (pkg: CampaignPackage) => {
    setEditingPkg(pkg);
    setPkgForm({
      code: pkg.code,
      name: pkg.name,
      tag: pkg.tag,
      description: pkg.description,
      sacCode: pkg.sacCode,
      rate: pkg.rate,
      deliverables: pkg.deliverables.join(", "),
    });
    setShowPkgManager(true);
    setTimeout(() => {
      pkgEditorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleSavePackage = () => {
    if (!pkgForm.name.trim() || !pkgForm.code.trim()) {
      toast.error("Please enter package title and package code");
      return;
    }

    const delivArray = pkgForm.deliverables.split(",").map((d) => d.trim()).filter(Boolean);

    if (editingPkg) {
      const updated = packages.map((p) =>
        p.id === editingPkg.id
          ? {
              ...p,
              code: pkgForm.code.toUpperCase(),
              name: pkgForm.name,
              tag: pkgForm.tag,
              description: pkgForm.description,
              sacCode: pkgForm.sacCode,
              rate: Number(pkgForm.rate),
              deliverables: delivArray,
            }
          : p
      );
      savePackages(updated);
      toast.success("Package updated successfully! 💼");
    } else {
      const newPkg: CampaignPackage = {
        id: `pkg-${Date.now()}`,
        code: pkgForm.code.toUpperCase(),
        name: pkgForm.name,
        tag: pkgForm.tag,
        description: pkgForm.description,
        sacCode: pkgForm.sacCode,
        rate: Number(pkgForm.rate),
        deliverables: delivArray,
      };
      savePackages([...packages, newPkg]);
      toast.success("New commercial package created! 🚀");
    }

    setShowPkgManager(false);
    setEditingPkg(null);

    // Auto-scroll back to top of packages section
    setTimeout(() => {
      packagesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCancelPackage = () => {
    setShowPkgManager(false);
    setEditingPkg(null);
    packagesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDeletePackage = (id: string) => {
    if (!confirm("Delete this campaign package?")) return;
    const filtered = packages.filter((p) => p.id !== id);
    savePackages(filtered);
    toast.success("Package deleted");
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, val: string | number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: val } : i)));
  };

  // Tax calculations
  const subtotal = items.reduce((acc, curr) => acc + curr.qty * curr.rate, 0);
  const igst = invoice.taxType === "IGST" ? subtotal * 0.18 : 0;
  const cgst = invoice.taxType === "CGST_SGST" ? subtotal * 0.09 : 0;
  const sgst = invoice.taxType === "CGST_SGST" ? subtotal * 0.09 : 0;
  const totalTax = igst + cgst + sgst;
  const grandTotal = subtotal + totalTax;

  // Generate Clean, Native Vector PDF (Selectable text, 0 bitmap lag, 100% smooth scrolling, zero cutoff)
  const generatePDF = async () => {
    setGenerating(true);
    const toastId = toast.loading("Generating official FY 26-27 tax invoice PDF...");

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const margin = 14;
      const contentWidth = 182;
      const rightEdge = margin + contentWidth; // 196mm

      const sanitize = (text: string = "") => {
        return text.replace(/[^\x20-\x7E\n\r]/g, "").trim();
      };

      let y = 16;

      // 1. Top Header Banner
      // TAX INVOICE Title
      doc.setTextColor(15, 23, 42); // slate-900
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("TAX INVOICE", margin, y + 5);

      // FY Badge
      const titleWidth = doc.getTextWidth("TAX INVOICE");
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(margin + titleWidth + 3, y, 22, 5.5, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text("FY 2026-27", margin + titleWidth + 14, y + 3.8, { align: "center" });

      // Subtitle
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text("Original for Recipient  |  Indian GST Compliant", margin, y + 10);

      // Creator Details (Left Column)
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text(sanitize(creator.businessName) || "D_BAGPACKER_GIRL_ CREATIVE MEDIA", margin, y + 15.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85); // slate-700
      doc.text(`Creator: ${sanitize(creator.creatorName)} (${sanitize(creator.handle)})`, margin, y + 19.5);
      doc.text(`Email: ${sanitize(creator.email)} | Phone: ${sanitize(creator.phone)}`, margin, y + 23.5);
      doc.text(`State: ${sanitize(creator.state)} (Code: ${sanitize(creator.stateCode)}) | PAN: ${sanitize(creator.pan)}`, margin, y + 27.5);
      if (creator.gstin) {
        doc.setFont("helvetica", "bold");
        doc.text(`GSTIN: ${sanitize(creator.gstin)}`, margin, y + 31.5);
      }

      // Invoice Details (Right Column)
      const invBadgeText = `INVOICE #${sanitize(invoice.invoiceNo) || "DBG/26-27/001"}`;
      const invBadgeWidth = doc.getTextWidth(invBadgeText) + 8;
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(rightEdge - invBadgeWidth, y, invBadgeWidth, 6, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(invBadgeText, rightEdge - invBadgeWidth / 2, y + 4.2, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Invoice Date: ${sanitize(invoice.invoiceDate)}`, rightEdge, y + 11, { align: "right" });
      doc.text(`Due Date: ${sanitize(invoice.dueDate)}`, rightEdge, y + 15.5, { align: "right" });
      doc.text(`Place of Supply: ${sanitize(client.placeOfSupply)}`, rightEdge, y + 19.5, { align: "right" });
      doc.text(`Financial Year: 2026-27`, rightEdge, y + 23.5, { align: "right" });

      y += 37;

      // 2. Client & Billed-To Box
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.roundedRect(margin, y, contentWidth, 22, 1.5, 1.5, "FD");

      // Left: Billed To
      doc.setTextColor(148, 163, 184); // slate-400
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.text("BILLED TO (CLIENT):", margin + 4, y + 4.5);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text(sanitize(client.name) || "Client Company", margin + 4, y + 9);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      if (client.contactPerson) {
        doc.text(sanitize(client.contactPerson), margin + 4, y + 13);
      }
      doc.text(sanitize(client.address) || "Client Address", margin + 4, y + 17);

      // Right: Tax & State Details
      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.text("TAX & STATE DETAILS:", rightEdge - 4, y + 4.5, { align: "right" });

      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      if (client.gstin) {
        doc.text(`Client GSTIN: ${sanitize(client.gstin)}`, rightEdge - 4, y + 9, { align: "right" });
      }
      doc.text(`State / Code: ${sanitize(client.state)} (${sanitize(client.stateCode)})`, rightEdge - 4, y + 13, { align: "right" });
      doc.text("Category: Digital Content & Influencer Media (SAC 998361)", rightEdge - 4, y + 17, { align: "right" });

      y += 26;

      // 3. Deliverables Table
      // Table Header
      doc.setFillColor(15, 23, 42);
      doc.rect(margin, y, contentWidth, 7, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);

      doc.text("#", margin + 3, y + 4.8);
      doc.text("SCOPE CODE", margin + 10, y + 4.8);
      doc.text("SCOPE & DELIVERABLES DESCRIPTION", margin + 36, y + 4.8);
      doc.text("SAC CODE", margin + 120, y + 4.8, { align: "center" });
      doc.text("QTY", margin + 138, y + 4.8, { align: "center" });
      doc.text("RATE (INR)", margin + 158, y + 4.8, { align: "right" });
      doc.text("AMOUNT (INR)", rightEdge - 3, y + 4.8, { align: "right" });

      y += 7;

      // Table Rows
      items.forEach((item, index) => {
        const itemDesc = sanitize(item.description) || "Deliverables Scope";
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        const descLines = doc.splitTextToSize(itemDesc, 80);
        const rowHeight = Math.max(8, descLines.length * 3.8 + 4);

        // Row background
        if (index % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y, contentWidth, rowHeight, "F");
        }

        // Row Bottom Divider
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y + rowHeight, rightEdge, y + rowHeight);

        // #
        doc.setTextColor(148, 163, 184);
        doc.setFont("helvetica", "normal");
        doc.text(String(index + 1), margin + 3, y + 5);

        // Scope Code (in clean grey badge)
        const codeText = sanitize(item.packageCode) || "CUSTOM";
        doc.setFillColor(241, 245, 249);
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(margin + 8, y + 1.5, 25, 5, 0.8, 0.8, "FD");
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(6.5);
        doc.text(codeText, margin + 20.5, y + 5, { align: "center" });

        // Description
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        doc.text(descLines, margin + 36, y + 4.5);

        // SAC Code
        doc.setTextColor(71, 85, 105);
        doc.text(sanitize(item.sacCode) || "998361", margin + 120, y + 5, { align: "center" });

        // Qty
        doc.text(String(item.qty || 1), margin + 138, y + 5, { align: "center" });

        // Rate
        doc.text(`Rs. ${(item.rate || 0).toLocaleString("en-IN")}`, margin + 158, y + 5, { align: "right" });

        // Amount
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(`Rs. ${((item.qty || 1) * (item.rate || 0)).toLocaleString("en-IN")}`, rightEdge - 3, y + 5, { align: "right" });

        y += rowHeight;
      });

      y += 4;

      // 4. Banking Details (Left) and Tax Calculations (Right)
      const bottomY = y;

      // Left: Bank Details Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, bottomY, 95, 30, 1.5, 1.5, "FD");

      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.text("BANK NEFT / IMPS / UPI PAYMENT DETAILS:", margin + 4, bottomY + 4.5);

      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text(`Bank: ${sanitize(creator.bankName)}`, margin + 4, bottomY + 9.5);
      doc.text(`Account Name: ${sanitize(creator.accName)}`, margin + 4, bottomY + 14);
      doc.text(`Account No: ${sanitize(creator.accNumber)}`, margin + 4, bottomY + 18.5);
      doc.text(`IFSC Code: ${sanitize(creator.ifsc)}`, margin + 4, bottomY + 23);
      doc.setFont("helvetica", "bold");
      doc.text(`Direct UPI ID: ${sanitize(creator.upiId)}`, margin + 4, bottomY + 27.5);

      // Right: Calculation Breakdown
      const calcX = margin + 104;
      let calcY = bottomY + 4;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);

      doc.text("Taxable Value:", calcX, calcY);
      doc.text(`Rs. ${subtotal.toLocaleString("en-IN")}`, rightEdge - 2, calcY, { align: "right" });
      calcY += 5.5;

      if (invoice.taxType === "IGST") {
        doc.text("Integrated GST (IGST 18%):", calcX, calcY);
        doc.text(`Rs. ${igst.toLocaleString("en-IN")}`, rightEdge - 2, calcY, { align: "right" });
        calcY += 5.5;
      } else if (invoice.taxType === "CGST_SGST") {
        doc.text("Central GST (CGST 9%):", calcX, calcY);
        doc.text(`Rs. ${cgst.toLocaleString("en-IN")}`, rightEdge - 2, calcY, { align: "right" });
        calcY += 4.5;
        doc.text("State GST (SGST 9%):", calcX, calcY);
        doc.text(`Rs. ${sgst.toLocaleString("en-IN")}`, rightEdge - 2, calcY, { align: "right" });
        calcY += 5.5;
      }

      // Total Due line
      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(0.4);
      doc.line(calcX, calcY, rightEdge, calcY);
      calcY += 6;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text("Total Amount Due:", calcX, calcY);
      doc.text(`Rs. ${grandTotal.toLocaleString("en-IN")}`, rightEdge - 2, calcY, { align: "right" });

      y = bottomY + 34;

      // 5. Amount in Words Box
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 9, 1, 1, "FD");

      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.text("TOTAL AMOUNT IN WORDS:", margin + 4, y + 3.5);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text(sanitize(numberToIndianWords(grandTotal)), margin + 4, y + 7);

      y += 13;

      // 6. Terms & Notes + Authorized Signatory
      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.text("TERMS & NOTES:", margin, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      const notesLines = doc.splitTextToSize(sanitize(invoice.notes) || "Payment requested within 15 days of invoice date.", 100);
      doc.text(notesLines, margin, y + 4);

      // Signature on Right
      const sigCenterX = rightEdge - 25;
      doc.setDrawColor(148, 163, 184);
      doc.line(sigCenterX - 18, y + 8, sigCenterX + 18, y + 8);

      doc.setFont("times", "italic");
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text("D_BagPacker_Girl_", sigCenterX, y + 6.5, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(15, 23, 42);
      doc.text("Authorized Signatory", sigCenterX, y + 12, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(148, 163, 184);
      doc.text(sanitize(creator.businessName) || "D_BAGPACKER_GIRL_", sigCenterX, y + 16, { align: "center" });

      // Save PDF
      doc.setProperties({
        title: `Invoice_${(invoice.invoiceNo || "001").replace(/[^a-zA-Z0-9_-]/g, "_")}`,
        subject: `Commercial Campaign Tax Invoice (${invoice.financialYear || "FY 2026-27"})`,
        author: creator.businessName || "D_BagPacker_Girl_",
        creator: "D_BagPacker_Girl_ Creator Engine",
      });

      const cleanInvoiceNo = (invoice.invoiceNo || "001").replace(/[^a-zA-Z0-9_-]/g, "_");
      const cleanClientName = (client.name || "Client").replace(/[^a-zA-Z0-9_-]/g, "_");
      const fileName = `Tax_Invoice_${cleanInvoiceNo}_${cleanClientName}.pdf`;

      doc.save(fileName);
      toast.success("Official Tax Invoice PDF downloaded successfully! 📄", { id: toastId });
    } catch (err: any) {
      console.error("PDF Generation Error:", err);
      toast.error(`Error generating PDF: ${err?.message || "Please check details"}`, { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10 min-w-0">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-[var(--card-border)]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="theme-heading font-bold text-lg sm:text-2xl flex items-center gap-2">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent)]" />
              Indian Tax Invoice & Scope Generator
            </h2>
            <span className="bg-emerald-500/20 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
              FY 2026-27
            </span>
          </div>
          <p className="theme-muted text-xs font-mono mt-0.5">
            Indian Law & GST Compliant · SAC 998361 · In-Scope & Custom Add-ons · Non-Editable PDF
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleOpenNewPackage}
            className="glass-card px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:border-[var(--accent)] whitespace-nowrap"
          >
            <Package className="w-4 h-4 text-[var(--accent)]" /> Add / Edit Scope Packages
          </button>
          <button
            onClick={generatePDF}
            disabled={generating}
            className="neon-btn-filled px-5 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            {generating ? "Exporting..." : "Download Official PDF"}
          </button>
        </div>
      </div>

      {/* Campaign Scope & Commercial Package Presets */}
      <div ref={packagesSectionRef} className="glass-card p-5 sm:p-7 rounded-[28px] sm:rounded-[32px] space-y-4 border border-[var(--card-border)] shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-glow)] border border-[var(--accent)] flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div>
              <h3 className="theme-heading font-bold text-sm sm:text-base">Campaign Scope Packages</h3>
              <p className="theme-muted text-[11px] font-mono">
                Single-line Package Codes &bull; 1-Click load into Deliverables & Scope table
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenNewPackage}
            className="neon-btn text-xs font-mono font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1 self-start sm:self-auto whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" /> New Package
          </button>
        </div>

        {/* Responsive Grid of Packages (Single-Line Package Code Badge) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="glass-card-sm p-4 sm:p-5 rounded-2xl flex flex-col justify-between space-y-4 border border-[var(--card-border)] hover:border-[var(--accent)] transition-all group relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-[var(--accent)] text-[#030712] font-black uppercase shadow-sm whitespace-nowrap flex-shrink-0 inline-block">
                      {pkg.code}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[var(--subtle-bg)] theme-subtext border border-[var(--card-border)] whitespace-nowrap truncate">
                      {pkg.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditPackage(pkg); }}
                      className="p-1 text-slate-400 hover:text-[var(--accent)] cursor-pointer rounded"
                      title="Edit package details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {packages.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePackage(pkg.id); }}
                        className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer rounded"
                        title="Delete package"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="theme-heading font-bold text-sm leading-snug">{pkg.name}</h4>
                <p className="theme-muted text-[11px] line-clamp-2 mt-1 leading-relaxed">{pkg.description}</p>

                {/* Deliverables Bullet Scope */}
                {pkg.deliverables && pkg.deliverables.length > 0 && (
                  <div className="mt-3 space-y-1 pt-2 border-t border-[var(--card-border)]/50">
                    {pkg.deliverables.slice(0, 3).map((d, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[10px] font-mono theme-subtext">
                        <Check className="w-3 h-3 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                        <span className="truncate">{d}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Commercial Rate (Left) & Half Attached Docked Button (Right in C| shape) */}
              <div className="pt-3 border-t border-[var(--card-border)]/60 flex items-center justify-between">
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-[9px] font-mono theme-muted uppercase tracking-wider whitespace-nowrap">
                    Commercial Rate
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono font-black text-sm sm:text-base text-[var(--accent)] whitespace-nowrap">
                      ₹{pkg.rate.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[9px] font-mono theme-muted whitespace-nowrap">SAC {pkg.sacCode}</span>
                  </div>
                </div>

                <button
                  onClick={() => applyPackageToInvoice(pkg)}
                  style={{
                    borderRadius: "18px 0px 0px 18px",
                    marginRight: "-1.25rem",
                    background: "var(--accent)",
                    color: "#030712",
                  }}
                  className="pl-3.5 pr-4 py-2 text-[10px] sm:text-[11px] font-bold leading-tight flex flex-col items-center justify-center cursor-pointer shadow-md hover:pl-4.5 transition-all active:scale-95 flex-shrink-0 text-center uppercase tracking-wider border-0"
                >
                  <span className="whitespace-nowrap font-mono font-black text-[10px]">Load Into</span>
                  <span className="whitespace-nowrap flex items-center gap-0.5 text-[9px] font-mono font-black">
                    Invoice <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package Creator / Editor Form (Auto-Scrolls on Edit and Scrolls to Top on Save) */}
      {showPkgManager && (
        <div ref={pkgEditorRef} className="glass-card-lg p-5 sm:p-8 rounded-[28px] sm:rounded-[32px] space-y-5 border-2 border-[var(--accent)] shadow-2xl animate-float-up">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--card-border)]">
            <div>
              <h3 className="theme-heading font-bold text-base sm:text-lg flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[var(--accent)]" />
                {editingPkg ? `Editing Package: ${editingPkg.code}` : "Create New Campaign Scope Package"}
              </h3>
              <p className="theme-muted text-xs font-mono">Changes will be saved and persisted for future invoices</p>
            </div>
            <button onClick={handleCancelPackage} className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">Package Code (Single Line, e.g. PKG-EXP-01)</label>
              <input
                value={pkgForm.code}
                onChange={(e) => setPkgForm({ ...pkgForm, code: e.target.value.toUpperCase() })}
                className="neon-input text-xs font-mono font-bold whitespace-nowrap text-[var(--accent)]"
                placeholder="PKG-EXP-01"
              />
            </div>
            <div>
              <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">Package Title</label>
              <input
                value={pkgForm.name}
                onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })}
                className="neon-input text-xs"
                placeholder="e.g. 1x Reel + 3x Story Package"
              />
            </div>
            <div>
              <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">Badge Tag</label>
              <input
                value={pkgForm.tag}
                onChange={(e) => setPkgForm({ ...pkgForm, tag: e.target.value })}
                className="neon-input text-xs"
                placeholder="e.g. Most Popular / FY 26-27"
              />
            </div>
            <div>
              <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">Standard Rate (₹)</label>
              <input
                type="number"
                value={pkgForm.rate}
                onChange={(e) => setPkgForm({ ...pkgForm, rate: Number(e.target.value) })}
                className="neon-input text-xs font-mono font-bold"
                placeholder="35000"
              />
            </div>
            <div>
              <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">SAC Tax Code</label>
              <input
                value={pkgForm.sacCode}
                onChange={(e) => setPkgForm({ ...pkgForm, sacCode: e.target.value })}
                className="neon-input text-xs font-mono"
                placeholder="998361"
              />
            </div>
            <div>
              <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">Deliverables Scope (Comma separated)</label>
              <input
                value={pkgForm.deliverables}
                onChange={(e) => setPkgForm({ ...pkgForm, deliverables: e.target.value })}
                className="neon-input text-xs"
                placeholder="1x 9:16 Reel, 3x Stories, 3-Month Digital Rights"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">Detailed Scope Description</label>
              <textarea
                value={pkgForm.description}
                onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })}
                rows={2}
                className="neon-input text-xs resize-none"
                placeholder="Includes 1x dedicated 9:16 video on @d_bagpacker_ + 3x stories + raw clips..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSavePackage}
              className="neon-btn-filled px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              {editingPkg ? "Save Changes & Scroll Up" : "Create Package & Scroll Up"}
            </button>
            <button
              onClick={handleCancelPackage}
              className="neon-btn px-5 py-2.5 rounded-full text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Invoice Details & Client Information Form */}
      <div className="glass-card p-5 sm:p-8 rounded-[28px] sm:rounded-[32px] space-y-6">
        <h3 className="theme-heading font-bold text-sm sm:text-lg flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[var(--accent)]" /> Client & Deal Information (FY 2026-27)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          <div>
            <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">Client Brand Name</label>
            <input
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
              className="neon-input text-xs"
              placeholder="e.g. Wildcraft India"
            />
          </div>
          <div>
            <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">Client GSTIN (Optional)</label>
            <input
              value={client.gstin}
              onChange={(e) => setClient({ ...client, gstin: e.target.value })}
              className="neon-input text-xs font-mono uppercase"
              placeholder="29AABCW1234K1Z1"
            />
          </div>
          <div>
            <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">Place of Supply / State</label>
            <input
              value={client.placeOfSupply}
              onChange={(e) => setClient({ ...client, placeOfSupply: e.target.value })}
              className="neon-input text-xs"
              placeholder="Karnataka (29)"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">Client Billing Address</label>
            <input
              value={client.address}
              onChange={(e) => setClient({ ...client, address: e.target.value })}
              className="neon-input text-xs"
            />
          </div>
          <div>
            <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">Tax Type (Indian Law)</label>
            {/* Custom High-Contrast Select Dropdown */}
            <div className="relative">
              <select
                value={invoice.taxType}
                onChange={(e) => setInvoice({ ...invoice, taxType: e.target.value as any })}
                className="w-full bg-[#0f172a] text-white border border-[var(--card-border)] rounded-2xl px-4 py-3 text-xs appearance-none cursor-pointer focus:outline-none focus:border-[var(--accent)] font-medium"
              >
                <option value="IGST" className="bg-[#0f172a] text-white py-2">
                  IGST 18% (Inter-State e.g. MH to KA/DL/TN)
                </option>
                <option value="CGST_SGST" className="bg-[#0f172a] text-white py-2">
                  CGST 9% + SGST 9% (Intra-State within Maharashtra)
                </option>
                <option value="NON_GST" className="bg-[#0f172a] text-white py-2">
                  Non-GST (0% / Exempt Threshold)
                </option>
              </select>
              <ChevronDown className="w-4 h-4 text-[var(--accent)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">Invoice Number (FY 26-27)</label>
            <input
              value={invoice.invoiceNo}
              onChange={(e) => setInvoice({ ...invoice, invoiceNo: e.target.value })}
              className="neon-input text-xs font-mono font-bold text-[var(--accent)] whitespace-nowrap"
            />
          </div>
          <div>
            <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">Invoice Date</label>
            <input
              type="date"
              value={invoice.invoiceDate}
              onChange={(e) => setInvoice({ ...invoice, invoiceDate: e.target.value })}
              className="neon-input text-xs font-mono"
            />
          </div>
          <div>
            <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">Payment Due Date</label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
              className="neon-input text-xs font-mono"
            />
          </div>
        </div>

        {/* Deliverables & Scope Items Table (Freeform Write Freedom in Source & Description) */}
        <div className="pt-4 border-t border-[var(--card-border)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h4 className="theme-heading font-bold text-xs sm:text-sm uppercase font-mono">
                // Deliverables & Scope Items (Writable Source & Description)
              </h4>
              <p className="theme-muted text-[11px]">
                Single-line source codes &bull; Write freely in Description or use quick autofill
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={addCustomItem}
                className="neon-btn-filled px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" /> + Add Blank Item Row
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--accent)] transition-all space-y-3.5 shadow-sm"
              >
                {/* Top Row: Source Code & Quick Preset & Delete Button */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-[var(--card-border)]/50">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono theme-muted uppercase font-bold">
                      #{idx + 1} Scope Source:
                    </span>
                    <input
                      value={item.packageCode}
                      onChange={(e) => updateItem(item.id, "packageCode", e.target.value)}
                      className="bg-[#0f172a] text-[var(--accent)] border border-[var(--card-border)] rounded-xl px-3 py-1 text-xs font-mono font-bold uppercase focus:outline-none focus:border-[var(--accent)] w-36 sm:w-44"
                      placeholder="e.g. PKG-REEL-01"
                    />

                    {/* Quick Preset Dropdown */}
                    <div className="relative">
                      <select
                        onChange={(e) => {
                          const p = packages.find((pkg) => pkg.code === e.target.value);
                          if (p) autofillRowFromPackage(item.id, p);
                        }}
                        className="bg-[#0f172a] text-slate-300 border border-slate-700/80 rounded-xl pl-2.5 pr-6 py-1 text-[11px] font-mono appearance-none cursor-pointer hover:border-[var(--accent)] focus:outline-none"
                        defaultValue=""
                      >
                        <option value="" disabled className="bg-[#0f172a] text-slate-400">
                          ⚡ Autofill from Preset...
                        </option>
                        {packages.map((pkg) => (
                          <option key={pkg.id} value={pkg.code} className="bg-[#0f172a] text-white py-1.5">
                            {pkg.code} — {pkg.name} (₹{pkg.rate.toLocaleString("en-IN")})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[9px] font-mono theme-muted uppercase block">Line Total</span>
                      <span className="font-mono font-black text-sm text-[var(--accent)]">
                        ₹{(item.qty * item.rate).toLocaleString("en-IN")}
                      </span>
                    </div>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 theme-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-xl cursor-pointer transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Middle Row: Full Width Deliverable Description */}
                <div className="space-y-1">
                  <label className="theme-muted text-[10px] font-mono block uppercase font-bold">
                    Deliverables & Scope Description (Write Freely)
                  </label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    rows={2}
                    className="neon-input text-xs resize-none leading-relaxed w-full"
                    placeholder="Type deliverables, stories, reels, buyout rights, shoot location..."
                  />
                </div>

                {/* Bottom Row: Numerical Metrics (SAC Code, Quantity, Unit Rate) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">
                      SAC Tax Code
                    </label>
                    <input
                      value={item.sacCode}
                      onChange={(e) => updateItem(item.id, "sacCode", e.target.value)}
                      className="neon-input text-xs font-mono font-bold"
                      placeholder="998361"
                    />
                  </div>

                  <div>
                    <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">
                      Quantity (Units)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, "qty", Math.max(1, Number(e.target.value)))}
                      className="neon-input text-xs font-mono font-bold"
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <label className="theme-muted text-[10px] font-mono block mb-1 uppercase font-bold">
                      Unit Rate (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                      className="neon-input text-xs font-mono font-bold text-[var(--accent)]"
                      placeholder="35000"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live PDF Preview Canvas (Single Line Scope Code Column) */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 px-2">
          <div>
            <p className="theme-muted text-xs font-mono uppercase tracking-wider">// Live Indian Tax Invoice Preview (FY 2026-27)</p>
            <span className="text-[10px] font-mono text-[var(--accent)] font-bold">🔒 Flattened & Non-Editable by Client</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generatePDF}
              disabled={generating}
              className="neon-btn-filled px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50 whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>{generating ? "Exporting PDF..." : "Download Official PDF"}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="glass-card px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:border-[var(--accent)] whitespace-nowrap"
              title="Print / Save as PDF via Browser Print"
            >
              <FileText className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Print Preview</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto pb-6 -mx-2 px-2 flex justify-center scroll-smooth overscroll-contain">
          <div
            className="bg-white text-slate-900 p-8 sm:p-10 w-[750px] min-w-[750px] font-sans"
            ref={invoiceRef}
            style={{ margin: 0, borderRadius: "0px", boxSizing: "border-box" }}
          >
          {/* Top Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">TAX INVOICE</h1>
                <span className="bg-slate-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap">
                  FY 2026-27
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 mt-0.5">Original for Recipient · Indian GST Compliant</p>
              <div className="mt-3 text-xs space-y-0.5 text-slate-700">
                <p className="font-bold text-sm text-slate-900">{creator.businessName}</p>
                <p>Creator: {creator.creatorName} ({creator.handle})</p>
                <p>Email: {creator.email} | Phone: {creator.phone}</p>
                <p>State: {creator.state} (Code: {creator.stateCode}) | PAN: {creator.pan}</p>
                {creator.gstin && <p className="font-mono font-bold">GSTIN: {creator.gstin}</p>}
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded text-xs font-mono font-bold whitespace-nowrap">
                INVOICE #{invoice.invoiceNo}
              </div>
              <p className="text-xs text-slate-600 font-mono">Invoice Date: <strong>{invoice.invoiceDate}</strong></p>
              <p className="text-xs text-slate-600 font-mono">Due Date: <strong>{invoice.dueDate}</strong></p>
              <p className="text-xs text-slate-600 font-mono">Place of Supply: <strong>{client.placeOfSupply}</strong></p>
              <p className="text-xs text-slate-500 font-mono">Financial Year: <strong>2026-27</strong></p>
            </div>
          </div>

          {/* Billed To Box */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl mb-6 text-xs border border-slate-200">
            <div>
              <p className="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">BILLED TO (CLIENT):</p>
              <p className="font-bold text-sm text-slate-900">{client.name}</p>
              <p className="text-slate-600 mt-0.5">{client.contactPerson}</p>
              <p className="text-slate-600 leading-relaxed">{client.address}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">TAX & STATE DETAILS:</p>
              {client.gstin && <p className="font-mono">Client GSTIN: <strong>{client.gstin}</strong></p>}
              <p>State / Code: <strong>{client.state} ({client.stateCode})</strong></p>
              <p>Service Category: <strong>Digital Content & Influencer Media (SAC 998361)</strong></p>
            </div>
          </div>

          {/* Itemized Table with Single-Line Scope Code */}
          <table className="w-full text-left text-xs mb-6 border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-900 font-bold uppercase font-mono text-[11px]">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Scope Code</th>
                <th className="py-2.5 px-3">Scope & Deliverables Description</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">SAC Code</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Qty</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Rate (₹)</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="py-3 px-3 font-mono text-slate-500">{index + 1}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800 text-[11px] whitespace-nowrap">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 whitespace-nowrap inline-block">
                      {item.packageCode || "SCOPE"}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-900">{item.description}</td>
                  <td className="py-3 px-3 font-mono text-center text-slate-600 whitespace-nowrap">{item.sacCode}</td>
                  <td className="py-3 px-3 font-mono text-center whitespace-nowrap">{item.qty}</td>
                  <td className="py-3 px-3 font-mono text-right whitespace-nowrap">₹{item.rate.toLocaleString("en-IN")}</td>
                  <td className="py-3 px-3 font-mono text-right font-bold text-slate-900 whitespace-nowrap">
                    ₹{(item.qty * item.rate).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculations & Total Breakdown */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            <div className="col-span-7 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <p className="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider">BANK NEFT / IMPS / UPI PAYMENT DETAILS:</p>
              <div className="grid grid-cols-2 gap-2 text-slate-800 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Bank:</span>
                  <strong>{creator.bankName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Account Name:</span>
                  <strong>{creator.accName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Account No:</span>
                  <strong>{creator.accNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">IFSC Code:</span>
                  <strong>{creator.ifsc}</strong>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 text-slate-800 font-mono text-[11px]">
                <span className="text-slate-400 text-[10px]">Direct UPI ID:</span> <strong>{creator.upiId}</strong>
              </div>
            </div>

            <div className="col-span-5 text-right space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Value:</span>
                <span className="font-mono font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {invoice.taxType === "IGST" && (
                <div className="flex justify-between text-slate-600">
                  <span>Integrated GST (IGST 18%):</span>
                  <span className="font-mono font-semibold">₹{igst.toLocaleString("en-IN")}</span>
                </div>
              )}
              {invoice.taxType === "CGST_SGST" && (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>Central GST (CGST 9%):</span>
                    <span className="font-mono font-semibold">₹{cgst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>State GST (SGST 9%):</span>
                    <span className="font-mono font-semibold">₹{sgst.toLocaleString("en-IN")}</span>
                  </div>
                </>
              )}
              <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-sm sm:text-base font-bold text-slate-900">
                <span>Total Amount Due:</span>
                <span className="font-mono font-black text-slate-950">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="p-3 bg-slate-100 rounded-lg text-xs font-mono text-slate-800 mb-6 border border-slate-200">
            <span className="text-slate-500 font-bold uppercase text-[10px] block">Total Amount in Words:</span>
            <span className="font-bold text-slate-900">{numberToIndianWords(grandTotal)}</span>
          </div>

          {/* Footer Signature & Stamp */}
          <div className="flex justify-between items-end border-t border-slate-200 pt-6 text-xs">
            <div className="max-w-xs text-[10px] text-slate-500 leading-relaxed">
              <p className="font-bold text-slate-700 uppercase mb-0.5">Terms & Notes:</p>
              <p>{invoice.notes}</p>
            </div>

            <div className="text-right">
              <div className="w-32 h-10 border-b border-slate-400 mx-auto mb-1 flex items-center justify-center">
                <span className="font-serif italic text-sm text-slate-600">D_BagPacker_Girl_</span>
              </div>
              <p className="font-bold text-slate-900 text-xs">Authorized Signatory</p>
              <p className="text-[10px] text-slate-400 font-mono">{creator.businessName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
