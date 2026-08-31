"use client";

import { useState, useRef, useEffect } from "react";
import {
  FileText, Download, Plus, Trash2, CheckCircle2,
  Building2, User, CreditCard, Shield, Sparkles, RefreshCw, Package, Edit3, Save, X, ArrowRight, Check
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

interface LineItem {
  id: string;
  description: string;
  sacCode: string;
  qty: number;
  rate: number;
}

interface CampaignPackage {
  id: string;
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
    name: "Standard Reel Collaboration",
    tag: "Essential",
    description: "1x Dedicated 9:16 Instagram Reel on @d_bagpacker_ + 3x Story Set + Raw B-Roll Rights",
    sacCode: "998361",
    rate: 35000,
    deliverables: ["1x 9:16 Dedicated Reel", "3x Story Frames with Link", "3-Month Digital Usage"],
  },
  {
    id: "pkg-2",
    name: "Full Expedition & Trek Campaign",
    tag: "Most Popular",
    description: "2x Dedicated 4K Reels + 5x Story Sets + YouTube Shorts Cross-post + Product Placement",
    sacCode: "998361",
    rate: 65000,
    deliverables: ["2x 4K Dedicated Reels", "5x Story Sets", "YouTube Shorts Cross-post", "6-Month Ad Rights"],
  },
  {
    id: "pkg-3",
    name: "Quarterly Brand Ambassador Retainer",
    tag: "Retainer (FY 26-27)",
    description: "Monthly 3x Reels + 10x Stories + Exclusive Category Representation + High-Res Photo Pack",
    sacCode: "998361",
    rate: 150000,
    deliverables: ["3x Reels / Month", "10x Story Sets / Month", "Category Exclusivity", "Full Commercial Rights"],
  },
  {
    id: "pkg-4",
    name: "UGC Performance & Whitelisting",
    tag: "UGC Ads",
    description: "3x Creator-style UGC video ad cutdowns + Meta Ad Whitelisting rights for brand handle",
    sacCode: "998361",
    rate: 45000,
    deliverables: ["3x UGC Ad Cutdowns (Hooks)", "Meta Whitelisting Token", "1080x1920 Raw Delivery"],
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
  const [generating, setGenerating] = useState(false);

  // Packages management
  const [packages, setPackages] = useState<CampaignPackage[]>(DEFAULT_PACKAGES);
  const [showPkgManager, setShowPkgManager] = useState(false);
  const [editingPkg, setEditingPkg] = useState<CampaignPackage | null>(null);
  const [pkgForm, setPkgForm] = useState({
    name: "",
    tag: "Custom",
    description: "",
    sacCode: "998361",
    rate: 25000,
    deliverables: "1x Reel, 3x Stories",
  });

  // Load persisted packages from localStorage on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dbg_campaign_packages_2627");
      if (saved) setPackages(JSON.parse(saved));
    } catch {}
  }, []);

  const savePackages = (newPkgs: CampaignPackage[]) => {
    setPackages(newPkgs);
    try {
      localStorage.setItem("dbg_campaign_packages_2627", JSON.stringify(newPkgs));
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

  // Line items
  const [items, setItems] = useState<LineItem[]>([
    {
      id: "1",
      description: "1x Dedicated 9:16 Instagram Reel on @d_bagpacker_ (Outdoor Travel & Gear Integration)",
      sacCode: "998361",
      qty: 1,
      rate: 35000,
    },
    {
      id: "2",
      description: "3x Instagram Story Frames with Swipe-up / Link Sticker & Brand Tag",
      sacCode: "998361",
      qty: 1,
      rate: 10000,
    },
    {
      id: "3",
      description: "3-Month Digital Advertising & Whitelisting Usage Rights",
      sacCode: "998361",
      qty: 1,
      rate: 15000,
    },
  ]);

  const applyPackageToInvoice = (pkg: CampaignPackage) => {
    setItems([
      {
        id: Date.now().toString(),
        description: `${pkg.name}: ${pkg.description}`,
        sacCode: pkg.sacCode,
        qty: 1,
        rate: pkg.rate,
      },
    ]);
    toast.success(`Loaded "${pkg.name}" into invoice scope! ✨`);
  };

  const handleSavePackage = () => {
    if (!pkgForm.name.trim()) {
      toast.error("Please enter package name");
      return;
    }

    const delivArray = pkgForm.deliverables.split(",").map((d) => d.trim()).filter(Boolean);

    if (editingPkg) {
      const updated = packages.map((p) =>
        p.id === editingPkg.id
          ? {
              ...p,
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
  };

  const handleEditPackage = (pkg: CampaignPackage) => {
    setEditingPkg(pkg);
    setPkgForm({
      name: pkg.name,
      tag: pkg.tag,
      description: pkg.description,
      sacCode: pkg.sacCode,
      rate: pkg.rate,
      deliverables: pkg.deliverables.join(", "),
    });
    setShowPkgManager(true);
  };

  const handleDeletePackage = (id: string) => {
    if (!confirm("Delete this campaign package?")) return;
    const filtered = packages.filter((p) => p.id !== id);
    savePackages(filtered);
    toast.success("Package deleted");
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: "Additional Deliverable / Story Set / Raw Footage Rights",
        sacCode: "998361",
        qty: 1,
        rate: 5000,
      },
    ]);
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

  // Generate Non-Editable Flattened PDF
  const generatePDF = async () => {
    if (!invoiceRef.current) return;
    setGenerating(true);
    toast.loading("Generating official FY 26-27 tax invoice PDF...", { id: "pdf-gen" });

    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");

      pdf.setProperties({
        title: `Invoice_${invoice.invoiceNo.replace(/\//g, "_")}_${client.name.replace(/[^a-zA-Z0-9]/g, "_")}`,
        subject: `Commercial Campaign Tax Invoice (${invoice.financialYear})`,
        author: creator.businessName,
        creator: "D_BagPacker_Girl_ Creator Engine",
      });

      pdf.save(`Invoice_${invoice.invoiceNo.replace(/\//g, "_")}_${client.name.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
      toast.success("Tax Invoice PDF downloaded successfully! 📄", { id: "pdf-gen" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF. Please try again.", { id: "pdf-gen" });
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
            <span className="bg-emerald-500/20 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full">
              FY 2026-27
            </span>
          </div>
          <p className="theme-muted text-xs font-mono mt-0.5">
            Indian Law & GST Compliant · SAC 998361 · Non-Editable Flattened PDF Export
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => {
              setEditingPkg(null);
              setPkgForm({ name: "", tag: "Custom", description: "", sacCode: "998361", rate: 30000, deliverables: "1x Reel, 3x Stories" });
              setShowPkgManager(true);
            }}
            className="glass-card px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:border-[var(--accent)]"
          >
            <Package className="w-4 h-4 text-[var(--accent)]" /> Add / Edit Packages
          </button>
          <button
            onClick={generatePDF}
            disabled={generating}
            className="neon-btn-filled px-5 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg"
          >
            <Download className="w-4 h-4" />
            {generating ? "Exporting..." : "Download Official PDF"}
          </button>
        </div>
      </div>

      {/* Campaign Scope & Commercial Package Presets (Redesigned Premium UI) */}
      <div className="glass-card p-5 sm:p-7 rounded-[28px] sm:rounded-[32px] space-y-4 border border-[var(--card-border)] shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-glow)] border border-[var(--accent)] flex items-center justify-center">
              <Package className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div>
              <h3 className="theme-heading font-bold text-sm sm:text-base">Campaign Scope Packages</h3>
              <p className="theme-muted text-[11px] font-mono">1-Click load commercial package into invoice deliverables</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingPkg(null);
              setPkgForm({ name: "", tag: "Custom", description: "", sacCode: "998361", rate: 35000, deliverables: "" });
              setShowPkgManager(true);
            }}
            className="neon-btn text-xs font-mono font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" /> New Package
          </button>
        </div>

        {/* Responsive Grid for all mobile screens (Galaxy Z Fold 280px+) to 4K */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="glass-card-sm p-4 sm:p-5 rounded-2xl flex flex-col justify-between space-y-3.5 border border-[var(--card-border)] hover:border-[var(--accent)] transition-all group relative overflow-hidden"
            >
              {/* Package Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[var(--accent-glow)] text-[var(--accent)] font-bold uppercase tracking-wider border border-[var(--accent)]/30">
                    {pkg.tag}
                  </span>
                  <div className="flex items-center gap-1.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditPackage(pkg); }}
                      className="p-1 text-slate-400 hover:text-[var(--accent)] cursor-pointer rounded"
                      title="Edit package"
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

                <h4 className="theme-heading font-bold text-sm leading-snug line-clamp-1">{pkg.name}</h4>
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

              {/* Price & 1-Click Load Scope Button */}
              <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between gap-2">
                <div>
                  <span className="text-[9px] font-mono theme-muted uppercase block">Standard Rate</span>
                  <span className="font-mono font-extrabold text-sm sm:text-base text-[var(--accent)]">
                    ₹{pkg.rate.toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  onClick={() => applyPackageToInvoice(pkg)}
                  className="neon-btn-filled px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  Load Scope <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package Creator / Editor Modal */}
      {showPkgManager && (
        <div className="glass-card-lg p-5 sm:p-8 rounded-[28px] sm:rounded-[32px] space-y-5 border border-[var(--accent)] shadow-2xl animate-float-up">
          <div className="flex items-center justify-between">
            <h3 className="theme-heading font-bold text-base sm:text-lg">
              {editingPkg ? "Edit Campaign Package" : "Create New Campaign Scope Package"}
            </h3>
            <button onClick={() => setShowPkgManager(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Package Title</label>
              <input
                value={pkgForm.name}
                onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })}
                className="neon-input text-xs"
                placeholder="e.g. 1x Reel + 3x Story Package"
              />
            </div>
            <div>
              <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Badge Tag</label>
              <input
                value={pkgForm.tag}
                onChange={(e) => setPkgForm({ ...pkgForm, tag: e.target.value })}
                className="neon-input text-xs"
                placeholder="e.g. Most Popular / FY 26-27"
              />
            </div>
            <div>
              <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Standard Rate (₹)</label>
              <input
                type="number"
                value={pkgForm.rate}
                onChange={(e) => setPkgForm({ ...pkgForm, rate: Number(e.target.value) })}
                className="neon-input text-xs font-mono font-bold"
                placeholder="35000"
              />
            </div>
            <div>
              <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">SAC Tax Code</label>
              <input
                value={pkgForm.sacCode}
                onChange={(e) => setPkgForm({ ...pkgForm, sacCode: e.target.value })}
                className="neon-input text-xs font-mono"
                placeholder="998361"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Detailed Scope Description</label>
              <textarea
                value={pkgForm.description}
                onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })}
                rows={2}
                className="neon-input text-xs resize-none"
                placeholder="Includes 1x dedicated 9:16 video on @d_bagpacker_ + 3x stories + raw clips..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Deliverables Scope (Comma separated)</label>
              <input
                value={pkgForm.deliverables}
                onChange={(e) => setPkgForm({ ...pkgForm, deliverables: e.target.value })}
                className="neon-input text-xs"
                placeholder="1x 9:16 Reel, 3x Stories, 3-Month Digital Rights"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSavePackage}
              className="neon-btn-filled px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              {editingPkg ? "Save Changes" : "Create Package"}
            </button>
            <button
              onClick={() => setShowPkgManager(false)}
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
            <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Client Brand Name</label>
            <input
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
              className="neon-input text-xs"
              placeholder="e.g. Wildcraft India"
            />
          </div>
          <div>
            <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Client GSTIN (Optional)</label>
            <input
              value={client.gstin}
              onChange={(e) => setClient({ ...client, gstin: e.target.value })}
              className="neon-input text-xs font-mono uppercase"
              placeholder="29AABCW1234K1Z1"
            />
          </div>
          <div>
            <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Place of Supply / State</label>
            <input
              value={client.placeOfSupply}
              onChange={(e) => setClient({ ...client, placeOfSupply: e.target.value })}
              className="neon-input text-xs"
              placeholder="Karnataka (29)"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Client Billing Address</label>
            <input
              value={client.address}
              onChange={(e) => setClient({ ...client, address: e.target.value })}
              className="neon-input text-xs"
            />
          </div>
          <div>
            <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Tax Type</label>
            <select
              value={invoice.taxType}
              onChange={(e) => setInvoice({ ...invoice, taxType: e.target.value as any })}
              className="neon-input text-xs"
            >
              <option value="IGST">IGST 18% (Inter-State e.g. MH to KA/DL/TN)</option>
              <option value="CGST_SGST">CGST 9% + SGST 9% (Intra-State within Maharashtra)</option>
              <option value="NON_GST">Non-GST (0% / Exempt Threshold)</option>
            </select>
          </div>
          <div>
            <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Invoice Number (FY 26-27)</label>
            <input
              value={invoice.invoiceNo}
              onChange={(e) => setInvoice({ ...invoice, invoiceNo: e.target.value })}
              className="neon-input text-xs font-mono font-bold text-[var(--accent)]"
            />
          </div>
          <div>
            <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Invoice Date</label>
            <input
              type="date"
              value={invoice.invoiceDate}
              onChange={(e) => setInvoice({ ...invoice, invoiceDate: e.target.value })}
              className="neon-input text-xs font-mono"
            />
          </div>
          <div>
            <label className="theme-muted text-[10px] font-mono block mb-1 uppercase">Payment Due Date</label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
              className="neon-input text-xs font-mono"
            />
          </div>
        </div>

        {/* Line Items Editor */}
        <div className="pt-4 border-t border-[var(--card-border)] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="theme-heading font-bold text-xs sm:text-sm uppercase font-mono">// Deliverables & Scope Items</h4>
            <button
              onClick={addItem}
              className="neon-btn px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Scope Row
            </button>
          </div>

          <div className="space-y-2.5">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center glass-card-sm p-3 rounded-2xl">
                <div className="col-span-12 sm:col-span-6">
                  <input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="neon-input text-xs"
                    placeholder="Deliverable description..."
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    value={item.sacCode}
                    onChange={(e) => updateItem(item.id, "sacCode", e.target.value)}
                    className="neon-input text-xs font-mono text-center"
                    placeholder="SAC 998361"
                  />
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, "qty", Number(e.target.value))}
                    className="neon-input text-xs font-mono text-center"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                    className="neon-input text-xs font-mono font-bold"
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 theme-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live PDF Preview Canvas (This gets exported to non-editable PDF) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-2">
          <p className="theme-muted text-xs font-mono uppercase tracking-wider">// Live Indian Tax Invoice Preview (FY 2026-27)</p>
          <span className="text-[10px] font-mono text-[var(--accent)] font-bold">🔒 Flattened & Non-Editable by Client</span>
        </div>

        <div
          className="bg-white text-slate-900 rounded-[24px] shadow-2xl p-6 sm:p-12 max-w-4xl mx-auto font-sans overflow-x-auto border border-slate-200"
          ref={invoiceRef}
        >
          {/* Top Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">TAX INVOICE</h1>
                <span className="bg-slate-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
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
              <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded text-xs font-mono font-bold">
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

          {/* Itemized Table */}
          <table className="w-full text-left text-xs mb-6 border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-900 font-bold uppercase font-mono text-[11px]">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Scope & Deliverables Description</th>
                <th className="py-2.5 px-3 text-center">SAC Code</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Rate (₹)</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="py-3 px-3 font-mono text-slate-500">{index + 1}</td>
                  <td className="py-3 px-3 font-medium text-slate-900">{item.description}</td>
                  <td className="py-3 px-3 font-mono text-center text-slate-600">{item.sacCode}</td>
                  <td className="py-3 px-3 font-mono text-center">{item.qty}</td>
                  <td className="py-3 px-3 font-mono text-right">₹{item.rate.toLocaleString("en-IN")}</td>
                  <td className="py-3 px-3 font-mono text-right font-bold text-slate-900">
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
  );
}
