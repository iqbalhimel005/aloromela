import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheck, Package, Users, BarChart3, LogOut,
  RefreshCw, ChevronDown
} from "lucide-react";

const API = "/api";

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  mobile: string;
  address: string;
  totalAmount: string;
  paymentMethod: string;
  paymentNumber: string | null;
  status: OrderStatus;
  notes: string | null;
  createdAt: string;
  items: Array<{ bookTitle: string; quantity: number; price: number }>;
}

interface Customer {
  id: number;
  name: string;
  mobile: string;
  district: string;
  upazila: string;
  postOffice: string | null;
  village: string | null;
  isVerified: boolean;
  createdAt: string;
}

interface Stats {
  totalOrders: number;
  totalCustomers: number;
  totalBooks: number;
  totalRevenue: string;
  pendingOrders: number;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "অপেক্ষমাণ",
  confirmed: "নিশ্চিত",
  shipped: "পাঠানো হয়েছে",
  delivered: "বিতরণ হয়েছে",
  cancelled: "বাতিল",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const PAYMENT_LABELS: Record<string, string> = {
  cash: "ক্যাশ",
  bkash: "বিকাশ",
  nagad: "নগদ",
  rocket: "রকেট",
  "sonali-bank": "সোনালী ব্যাংক",
  "islami-bank": "ইসলামী ব্যাংক",
};

export function Admin() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem("admin_token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"stats" | "orders" | "customers">("stats");
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const { toast } = useToast();

  const headers = { "x-admin-password": token ?? "", "Content-Type": "application/json" };

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [statsRes, ordersRes, customersRes] = await Promise.all([
        fetch(`${API}/admin/stats`, { headers }),
        fetch(`${API}/admin/orders`, { headers }),
        fetch(`${API}/admin/customers`, { headers }),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (customersRes.ok) setCustomers(await customersRes.json());
    } catch {
      toast({ variant: "destructive", title: "ডেটা লোড করতে সমস্যা হয়েছে" });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const login = async () => {
    const res = await fetch(`${API}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      sessionStorage.setItem("admin_token", data.token);
      setToken(data.token);
    } else {
      toast({ variant: "destructive", title: "পাসওয়ার্ড সঠিক নয়" });
    }
  };

  const logout = () => {
    sessionStorage.removeItem("admin_token");
    setToken(null);
  };

  const updateStatus = async (orderId: number, status: OrderStatus) => {
    const res = await fetch(`${API}/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      toast({ title: "স্ট্যাটাস আপডেট হয়েছে" });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="bg-card border rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">অ্যাডমিন প্যানেল</h1>
              <p className="text-sm text-muted-foreground">আলোরমেলা বুকশপ</p>
            </div>
          </div>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="ব্যবহারকারীর নাম"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
            />
            <Input
              type="password"
              placeholder="পাসওয়ার্ড দিন"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
            />
            <Button className="w-full" onClick={login}>লগইন করুন</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="bg-card border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">অ্যাডমিন প্যানেল — আলোরমেলা</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            রিফ্রেশ
          </Button>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4 mr-1" />
            লগআউট
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex gap-2 mb-6 border-b">
          {[
            { key: "stats", label: "ড্যাশবোর্ড", icon: BarChart3 },
            { key: "orders", label: `অর্ডার (${orders.length})`, icon: Package },
            { key: "customers", label: `গ্রাহক (${customers.length})`, icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as typeof tab)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === "stats" && stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "মোট অর্ডার", value: stats.totalOrders, color: "text-blue-600" },
              { label: "অপেক্ষমাণ", value: stats.pendingOrders, color: "text-yellow-600" },
              { label: "মোট গ্রাহক", value: stats.totalCustomers, color: "text-green-600" },
              { label: "মোট বই", value: stats.totalBooks, color: "text-purple-600" },
              { label: "মোট আয়", value: `৳${Number(stats.totalRevenue).toLocaleString()}`, color: "text-emerald-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-card rounded-xl border p-4 text-center">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "orders" && (
          <div className="space-y-3">
            {orders.length === 0 && <p className="text-muted-foreground text-center py-12">কোনো অর্ডার নেই</p>}
            {orders.map(order => (
              <div key={order.id} className="bg-card border rounded-xl overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm font-bold text-primary">{order.orderNumber}</span>
                    <span className="font-medium">{order.customerName}</span>
                    <span className="text-muted-foreground text-sm">{order.mobile}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                    <span className="text-sm">{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg font-mono">৳{Number(order.totalAmount).toLocaleString()}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`} />
                  </div>
                </div>
                {expandedOrder === order.id && (
                  <div className="border-t p-4 bg-muted/20 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">ঠিকানা</p>
                        <p className="font-medium">{order.address}</p>
                      </div>
                      {order.paymentNumber && (
                        <div>
                          <p className="text-muted-foreground">পেমেন্ট নম্বর</p>
                          <p className="font-medium">{order.paymentNumber}</p>
                        </div>
                      )}
                      {order.notes && (
                        <div>
                          <p className="text-muted-foreground">নোট</p>
                          <p className="font-medium">{order.notes}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-muted-foreground">তারিখ</p>
                        <p className="font-medium">{new Date(order.createdAt).toLocaleString("bn-BD")}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-2">অর্ডারকৃত বই</p>
                      <div className="space-y-1">
                        {Array.isArray(order.items) && order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm bg-card rounded px-3 py-2 border">
                            <span>{item.bookTitle}</span>
                            <span className="text-muted-foreground">{item.quantity}টি × ৳{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-2">স্ট্যাটাস পরিবর্তন করুন</p>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(STATUS_LABELS) as OrderStatus[]).map(s => (
                          <button
                            key={s}
                            onClick={() => updateStatus(order.id, s)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                              order.status === s
                                ? STATUS_COLORS[s] + " border-current"
                                : "bg-card text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            {STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "customers" && (
          <div className="bg-card border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  {["নাম", "মোবাইল", "জেলা", "উপজেলা", "যাচাইকৃত", "তারিখ"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">কোনো গ্রাহক নেই</td></tr>
                )}
                {customers.map((c, i) => (
                  <tr key={c.id} className={i % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 font-mono">{c.mobile}</td>
                    <td className="px-4 py-3">{c.district}</td>
                    <td className="px-4 py-3">{c.upazila}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${c.isVerified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {c.isVerified ? "হ্যাঁ" : "না"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(c.createdAt).toLocaleDateString("bn-BD")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
