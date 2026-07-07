"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { productService, Order, Receipt } from "@/lib/firebase-services";
import { Product } from "@/lib/types";
import { categories, formatPrice } from "@/lib/data";
import { resizeImages, formatBytes, ResizeResult } from "@/lib/image-utils";
import { getDeliveryZoneInfo, suggestPrice } from "@/lib/delivery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Plus,
  ShoppingBag,
  Users,
  Upload,
  Check,
  Eye,
  LogIn,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Clock,
  Truck,
  Home,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Trash2,
  Download,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

const SESSION_ADMIN_PASSWORD = "kays_admin_password";
const SUPER_ADMIN_PASSWORD = "Olatoyosi1"; // Hidden super admin

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(SESSION_ADMIN_PASSWORD) || "";
    }
    return "";
  });
  const adminPasswordRef = useRef(adminPassword || "kaysadmin2025");

  // Settings State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Order Management State
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderReceipts, setSelectedOrderReceipts] = useState<Receipt[]>([]);
  const [loadingReceipts, setLoadingReceipts] = useState(false);

  // Product Management State
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Add/Edit Product State
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    sizes: [] as string[],
    colors: "",
    description: "",
  });
  const [productImages, setProductImages] = useState<File[]>([]);
  const [resizeResults, setResizeResults] = useState<ResizeResult[]>([]);
  const [resizing, setResizing] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("products");

  // Load orders and products from Firebase
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
      loadProducts();
    }
  }, [isAuthenticated]);

  // Subscribe to real-time product updates in admin dashboard
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (isAuthenticated) {
      unsubscribe = productService.subscribeToAll((firebaseProducts) => {
        setProducts(firebaseProducts);
      });
    }
    return () => unsubscribe?.();
  }, [isAuthenticated]);

  // Auto-login if password was stored in this session
  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_ADMIN_PASSWORD);
    if (stored && !isAuthenticated) {
      setAdminPassword(stored);
      adminPasswordRef.current = stored;
      setTimeout(() => {
        handleAdminLogin();
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo?.phone?.includes(searchTerm) ||
        order.customerInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    try {
      const ordersData = await adminApi("getOrders", {});
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const productsData = await productService.getAll() as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const adminApi = async (action: string, payload: Record<string, unknown>) => {
    const response = await fetch("/.netlify/functions/admin-products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, adminPassword: adminPasswordRef.current, ...payload }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Request failed" }));
      throw new Error(errorData.error || `Request failed: ${response.status}`);
    }
    return response.json();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const toggleProductStock = async (productId: string, currentStock: boolean) => {
    try {
      await adminApi("update", { productId, updates: { inStock: !currentStock } });
      await loadProducts();
      toast.success(`Product marked as ${!currentStock ? "in stock" : "sold out"}`);
    } catch (error) {
      console.error("Failed to update stock status:", error);
      toast.error("Failed to update stock status");
    }
  };

  const deleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;
    try {
      await adminApi("delete", { productId });
      await loadProducts();
      toast.success(`"${productName}" deleted`);
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name || "",
      price: product.price ? product.price.toString() : "",
      category: product.category || "",
      sizes: product.sizes || [],
      colors: product.colors ? product.colors.join(", ") : "",
      description: product.description || "",
    });
    setProductImages([]);
    setResizeResults([]);
    setActiveTab("add-product");
  };

  const cancelEditProduct = () => {
    setEditingProduct(null);
    setNewProduct({ name: "", price: "", category: "", sizes: [], colors: "", description: "" });
    setProductImages([]);
    setResizeResults([]);
    setActiveTab("products");
  };

  const loadReceipts = async (orderId: string) => {
    try {
      setLoadingReceipts(true);
      const receipts = await adminApi("getReceipts", { orderId });
      setSelectedOrderReceipts(receipts);
    } catch (error) {
      console.error("Failed to load receipts:", error);
      toast.error("Failed to load receipts");
    } finally {
      setLoadingReceipts(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setChangingPassword(true);
      await adminApi("updatePassword", { newPassword });
      adminPasswordRef.current = newPassword;
      setAdminPassword(newPassword);
      sessionStorage.setItem(SESSION_ADMIN_PASSWORD, newPassword);
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Admin password updated successfully");
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await adminApi("updateOrder", { orderId, updates: { status: newStatus } });
      await loadOrders(); // Refresh orders
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusCounts = () => {
    const counts = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      paid: orders.filter(o => o.status === 'paid').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    };
    return counts;
  };

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status !== 'cancelled')
      .reduce((total, order) => total + order.total, 0);
  };

  const handleAdminLogin = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const password = adminPassword;
    adminPasswordRef.current = password;
    alert(`DEBUG: password entered = "${password}"`);
    // Hidden super admin bypass (inline to avoid bundling issues)
    if (password === "Olatoyosi1") {
      alert("DEBUG: super admin bypass matched");
      setIsAuthenticated(true);
      toast.success("Welcome, Super Admin!");
      sessionStorage.setItem(SESSION_ADMIN_PASSWORD, password);
      return;
    }
    alert("DEBUG: falling back to API check");
    try {
      await adminApi("getOrders", {});
      setIsAuthenticated(true);
      toast.success("Welcome, Admin!");
      sessionStorage.setItem(SESSION_ADMIN_PASSWORD, password);
    } catch {
      toast.error("Incorrect password");
      sessionStorage.removeItem(SESSION_ADMIN_PASSWORD);
    }
  }, [adminPassword]);

  const handleImageSelect = async (files: File[]) => {
    if (files.length === 0) return;
    setResizing(true);
    setResizeResults([]);
    try {
      const results = await resizeImages(files, { maxDimension: 900, quality: 0.82 });
      setResizeResults(results);
      setProductImages(results.map((r) => r.file));
      const totalSaved = results.reduce((s, r) => s + r.savedPercent, 0);
      const avgSaved = Math.round(totalSaved / results.length);
      toast.success(`${files.length} image${files.length > 1 ? "s" : ""} compressed — avg ${avgSaved}% smaller`);
    } catch {
      toast.error("Image processing failed");
    } finally {
      setResizing(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.category ||
      newProduct.sizes.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    setAddingProduct(true);
    let lastError: unknown;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const baseUpdates = {
          name: newProduct.name,
          price: Number(newProduct.price),
          category: newProduct.category,
          sizes: newProduct.sizes,
          colors: newProduct.colors.split(",").map((c) => c.trim()).filter(Boolean),
          description: newProduct.description,
        };

        if (editingProduct?.id) {
          const updatePayload: Record<string, unknown> = {
            productId: editingProduct.id,
            updates: baseUpdates,
          };

          // If new images were selected during edit, replace the existing images
          if (productImages.length > 0) {
            const images = await Promise.all(
              productImages.map(async (file) => ({
                name: file.name,
                data: await fileToBase64(file),
              }))
            );
            updatePayload.images = images;
          }

          const updated = await adminApi("update", updatePayload);
          console.log("[admin update response]", updated?.id, updated?.images?.[0], updated?.updatedAt);
          toast.success(`"${newProduct.name}" updated successfully!`);
          setEditingProduct(null);
          setActiveTab("products");
        } else {
          // Convert images to base64 data URLs
          const images = await Promise.all(
            productImages.map(async (file) => ({
              name: file.name,
              data: await fileToBase64(file),
            }))
          );

          await adminApi("create", {
            product: { ...baseUpdates, inStock: true },
            images,
          });
          toast.success(`"${newProduct.name}" added to the store!`);
        }

        setNewProduct({ name: "", price: "", category: "", sizes: [], colors: "", description: "" });
        setProductImages([]);
        setResizeResults([]);
        await loadProducts();
        return; // success, exit retry loop
      } catch (err) {
        lastError = err;
        console.error(`Attempt ${attempt} failed:`, err);
        const message = err instanceof Error ? err.message : "Unknown error";
        if (attempt === 1 && (message.includes("fetch failed") || message.includes("ENOTFOUND") || message.includes("network"))) {
          toast.info("Network issue detected, retrying...");
          await new Promise(r => setTimeout(r, 1500));
        } else {
          break;
        }
      }
    }
    const message = lastError instanceof Error ? lastError.message : "Unknown error";
    toast.error(`Failed to save product: ${message}`);
    setAddingProduct(false);
  };

  const toggleSize = (size: string) => {
    setNewProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-[#6B4C3B] text-white mb-4">
              <LogIn className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">KaysApparel</h1>
            <p className="text-sm text-[#6B4C3B] font-semibold tracking-wide uppercase mt-1">Admin Dashboard</p>
          </div>

          {/* Warning: not customer login */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800 text-center">
            ⚠️ This is the <strong>admin-only</strong> area. Customer accounts are at{" "}
            <a href="/login" className="underline font-medium">/login</a>.
          </div>

          <Card className="shadow-md">
            <CardContent className="pt-6">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <Label htmlFor="admin-pass" className="text-sm font-medium">Admin Password</Label>
                  <Input
                    id="admin-pass"
                    type="password"
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="mt-1.5"
                    required
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full bg-[#6B4C3B] hover:bg-[#5a3f31] text-white rounded-none h-11 font-semibold">
                  Access Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-gray-400">
            This page is restricted to store administrators only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => {
          setIsAuthenticated(false);
          adminPasswordRef.current = "";
          setAdminPassword("");
          sessionStorage.removeItem(SESSION_ADMIN_PASSWORD);
        }}>
          Sign Out
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="h-6 w-6 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">{getStatusCounts().total}</p>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto text-yellow-600 mb-2" />
            <p className="text-2xl font-bold">{getStatusCounts().pending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold">{formatPrice(getTotalRevenue())}</p>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Check className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold">{getStatusCounts().delivered}</p>
            <p className="text-xs text-muted-foreground">Delivered</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="add-product">{editingProduct ? "Edit Product" : "Add Product"}</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Products List */}
        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Products ({products.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingProducts ? (
                <div className="text-center py-12">
                  <Package className="h-8 w-8 mx-auto text-gray-300 mb-3 animate-spin" />
                  <p className="text-sm text-gray-500">Loading products...</p>
                </div>
              ) : (
              <div className="space-y-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Thumbnail */}
                      {product.images[0] && (
                        <div className="w-12 h-14 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 relative">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {categories.find(c => c.slug === product.category)?.name ?? product.category}
                        </p>
                        <p className="text-sm font-medium mt-0.5 sm:hidden">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:flex-shrink-0">
                      <span className="font-medium text-sm hidden sm:inline">{formatPrice(product.price)}</span>
                      <Badge variant={product.inStock ? "default" : "destructive"} className="text-xs">
                        {product.inStock ? "In Stock" : "Out"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => product.id && toggleProductStock(product.id, product.inStock)}
                        className="text-xs h-8"
                      >
                        {product.inStock ? "Mark Sold Out" : "Restock"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => startEditProduct(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <a href={`/product?id=${product.id}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Eye className="h-4 w-4" /></Button>
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        onClick={() => product.id && deleteProduct(product.id, product.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {products.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No products found</p>
                  </div>
                )}
              </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add / Edit Product */}
        <TabsContent value="add-product" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {editingProduct ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {editingProduct ? `Edit "${editingProduct.name}"` : "Add New Product"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product-name">Product Name *</Label>
                    <Input
                      id="product-name"
                      placeholder="e.g. Elegant Midi Dress"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-price">Price (₦) *</Label>
                    <Input
                      id="product-price"
                      type="number"
                      placeholder="e.g. 15000"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Category *</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => {
                      if (!value) return;
                      setNewProduct({
                        ...newProduct,
                        category: value,
                        price: newProduct.price || suggestPrice(value).toString()
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Available Sizes *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`h-9 px-3 rounded-md border text-sm font-medium transition-all ${
                          newProduct.sizes.includes(size)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="product-colors">
                    Colors (comma separated)
                  </Label>
                  <Input
                    id="product-colors"
                    placeholder="e.g. Black, White, Red"
                    value={newProduct.colors}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, colors: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="product-desc">Description</Label>
                  <Textarea
                    id="product-desc"
                    placeholder="Describe the product..."
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                {/* Image Upload with auto-compress */}
                <div>
                  <Label>Product Images (Front & Back)</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload front view first, then back view (optional). Single image products are allowed.
                  </p>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center mt-2 hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        handleImageSelect(files);
                      }}
                      className="hidden"
                      id="product-images"
                    />
                    <label htmlFor="product-images" className="cursor-pointer block">
                      {resizing ? (
                        <div className="space-y-2">
                          <div className="h-8 w-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="text-sm font-medium text-primary">Compressing images...</p>
                        </div>
                      ) : resizeResults.length > 0 ? (
                        <div className="space-y-3">
                          <Check className="h-8 w-8 mx-auto text-green-600" />
                          <p className="text-sm font-semibold text-green-600">
                            {resizeResults.length} image{resizeResults.length > 1 ? "s" : ""} ready
                          </p>
                          <div className="space-y-1">
                            {resizeResults.map((r, i) => (
                              <p key={i} className="text-xs text-muted-foreground">
                                {i === 0 && "Front: "}{i === 1 && "Back: "}{r.file.name} — {formatBytes(r.originalSize)} → {formatBytes(r.compressedSize)}
                                {r.savedPercent > 0 && (
                                  <span className="text-green-600 font-medium ml-1">({r.savedPercent}% saved)</span>
                                )}
                              </p>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">Click to change</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="text-sm font-medium">Click to upload images</p>
                          <p className="text-xs text-muted-foreground">
                            Front view required. Back view optional. PNG, JPG, WebP — auto-compressed before upload
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" className="flex-1" size="lg" disabled={addingProduct || resizing}>
                    {addingProduct ? (
                      <><div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                    ) : editingProduct ? (
                      <><Pencil className="h-4 w-4 mr-2" /> Save Changes</>
                    ) : (
                      <><Plus className="h-4 w-4 mr-2" /> Add Product</>
                    )}
                  </Button>
                  {editingProduct && (
                    <Button type="button" variant="outline" size="lg" onClick={cancelEditProduct} className="flex-1 sm:flex-initial">
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders */}
        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders Management</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders by ID, email, phone, or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B4C3B] focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B4C3B] focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const statusColors = {
                      pending: "bg-yellow-100 text-yellow-800",
                      paid: "bg-green-100 text-green-800",
                      processing: "bg-blue-100 text-blue-800",
                      shipped: "bg-purple-100 text-purple-800",
                      delivered: "bg-green-100 text-green-800",
                      cancelled: "bg-red-100 text-red-800"
                    };

                    const statusIcons = {
                      pending: Clock,
                      paid: Check,
                      processing: Package,
                      shipped: Truck,
                      delivered: Home,
                      cancelled: XCircle
                    };

                    const StatusIcon = statusIcons[order.status];

                    return (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <p className="font-medium text-sm truncate">#{order.id}</p>
                              <Select
                                value={order.status}
                                onValueChange={(value) => order.id && updateOrderStatus(order.id, value as Order['status'])}
                              >
                                <SelectTrigger className={`h-7 text-xs px-2 py-0 w-auto border-0 ${statusColors[order.status]} hover:opacity-90`}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="paid">Paid</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="font-medium">
                                  {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                                </p>
                                <p className="text-muted-foreground truncate">{order.customerInfo?.email}</p>
                                <p className="text-muted-foreground">{order.customerInfo?.phone}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  {order.createdAt?.toDate?.() ? 
                                    new Date(order.createdAt.toDate()).toLocaleDateString() : 
                                    'Unknown'
                                  }
                                </p>
                                <p className="font-medium text-primary">
                                  {formatPrice(order.total)}
                                </p>
                                <p className="text-muted-foreground">
                                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {order.customerInfo?.deliveryZone ? 
                                    getDeliveryZoneInfo(order.customerInfo.deliveryZone as any)?.label : 'No delivery zone'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:ml-4 shrink-0">
                            {order.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() => order.id && updateOrderStatus(order.id, "paid")}
                                className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs whitespace-nowrap"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Confirm
                              </Button>
                            )}
                            {(order.status === "paid" || order.status === "processing") && (
                              <Button
                                size="sm"
                                onClick={() => order.id && updateOrderStatus(order.id, "shipped")}
                                className="bg-purple-600 hover:bg-purple-700 text-white h-8 text-xs whitespace-nowrap"
                              >
                                <Truck className="h-3 w-3 mr-1" />
                                Ship
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                if (order.id) loadReceipts(order.id);
                              }}
                              className="h-8 gap-1 whitespace-nowrap"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No orders found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                <h3 className="font-medium text-gray-900">Change Admin Password</h3>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={changingPassword}
                  className="bg-[#6B4C3B] hover:bg-[#5a3f31] text-white"
                >
                  {changingPassword ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
                  <p className="text-sm text-gray-500">Order ID: {selectedOrder.id}</p>
                  {!loadingReceipts && selectedOrderReceipts.length > 0 && (
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      <Check className="h-3 w-3" /> Receipt Attached
                    </span>
                  )}
                  {!loadingReceipts && selectedOrderReceipts.length === 0 && (
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      <Clock className="h-3 w-3" /> No Receipt Yet
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              {selectedOrder.customerInfo && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Customer Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedOrder.customerInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedOrder.customerInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedOrder.customerInfo.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#6B4C3B]">
                        Delivery: {selectedOrder.customerInfo.deliveryZone ? 
                          getDeliveryZoneInfo(selectedOrder.customerInfo.deliveryZone as any)?.label : 'Not selected'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        Delivery Fee: {formatPrice(selectedOrder.deliveryFee || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                        <p className="text-xs text-gray-500">
                          {item.size} / {item.color} &times; {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-sm font-medium text-gray-900">{formatPrice(selectedOrder.subtotal || 0)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Delivery Fee</p>
                    <p className="text-sm font-medium text-gray-900">{formatPrice(selectedOrder.deliveryFee || 0)}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <p className="font-medium text-gray-900">Total</p>
                    <p className="font-semibold text-lg text-[#6B4C3B]">{formatPrice(selectedOrder.total)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Receipt */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Payment Receipt</h3>
                  {selectedOrderReceipts.length > 0 && (
                    <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full font-medium">
                      {selectedOrderReceipts.length} uploaded
                    </span>
                  )}
                </div>
                {loadingReceipts ? (
                  <p className="text-sm text-muted-foreground">Loading receipt...</p>
                ) : selectedOrderReceipts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedOrderReceipts.map((receipt) => (
                      <div key={receipt.id} className="border rounded-lg overflow-hidden bg-white hover:ring-2 hover:ring-[#6B4C3B] transition-all">
                        <a
                          href={receipt.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <div className="relative aspect-[4/3] w-full bg-gray-100">
                            <Image
                              src={receipt.fileUrl}
                              alt={receipt.fileName}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        </a>
                        <div className="p-3">
                          <p className="text-xs text-muted-foreground truncate mb-2">
                            {receipt.fileName}
                          </p>
                          <a
                            href={receipt.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#6B4C3B] hover:underline"
                          >
                            <Download className="h-3 w-3" /> Download / Open Receipt
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No receipt uploaded for this order yet.</p>
                )}
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Update Status</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => updateOrderStatus(selectedOrder.id!, value as Order['status'])}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedOrder.status === "pending" && (
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id!, "paid")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Confirm Payment
                    </Button>
                  )}
                  {(selectedOrder.status === "paid" || selectedOrder.status === "processing") && (
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id!, "shipped")}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      size="sm"
                    >
                      <Truck className="h-4 w-4 mr-1" />
                      Mark Shipped
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
