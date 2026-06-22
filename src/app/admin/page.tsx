"use client";

import { useEffect, useState } from "react";
import { orderService, Order } from "@/lib/firebase-services";
import { categories, formatPrice } from "@/lib/data";
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
} from "lucide-react";
import { toast } from "sonner";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  // Order Management State
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Add Product State
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    sizes: [] as string[],
    colors: "",
    description: "",
  });
  const [productImages, setProductImages] = useState<File[]>([]);

  // Load orders from Firebase
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

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
      const ordersData = await orderService.getAll();
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      await loadOrders(); // Refresh orders
      setSelectedOrder(null);
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

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "kaysadmin2025") {
      setIsAuthenticated(true);
      toast.success("Welcome, Admin!");
    } else {
      toast.error("Incorrect password");
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
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
    toast.success(`Product "${newProduct.name}" added successfully!`);
    setNewProduct({
      name: "",
      price: "",
      category: "",
      sizes: [],
      colors: "",
      description: "",
    });
    setProductImages([]);
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
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-sm mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center">
                <LogIn className="h-5 w-5" /> Admin Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <Label htmlFor="admin-pass">Admin Password</Label>
                  <Input
                    id="admin-pass"
                    type="password"
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
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

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="add-product">Add Product</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* Products List */}
        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: "Elegant Midi Dress",
                    price: 12000,
                    category: "Dresses",
                    stock: true,
                  },
                  {
                    name: "Ankara Print Blouse",
                    price: 8000,
                    category: "Tops",
                    stock: true,
                  },
                  {
                    name: "High-Waist Pencil Skirt",
                    price: 10000,
                    category: "Skirts",
                    stock: true,
                  },
                  {
                    name: "Wide-Leg Palazzo Pants",
                    price: 15000,
                    category: "Trousers",
                    stock: true,
                  },
                ].map((product, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm">
                        {formatPrice(product.price)}
                      </span>
                      <Badge
                        variant={product.stock ? "default" : "destructive"}
                      >
                        {product.stock ? "In Stock" : "Out"}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Product */}
        <TabsContent value="add-product" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" /> Add New Product
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

                {/* Image Upload */}
                <div>
                  <Label>Product Images</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center mt-2 hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        setProductImages(
                          e.target.files ? Array.from(e.target.files) : []
                        )
                      }
                      className="hidden"
                      id="product-images"
                    />
                    <label htmlFor="product-images" className="cursor-pointer">
                      {productImages.length > 0 ? (
                        <div className="space-y-2">
                          <Check className="h-8 w-8 mx-auto text-green-600" />
                          <p className="text-sm font-medium text-green-600">
                            {productImages.length} image(s) selected
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Click to change
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="text-sm font-medium">
                            Click to upload images
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG up to 5MB each
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Plus className="h-4 w-4 mr-2" /> Add Product
                </Button>
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
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-sm">#{order.id}</p>
                              <Badge className={statusColors[order.status]}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {order.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="font-medium">
                                  {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                                </p>
                                <p className="text-muted-foreground">{order.customerInfo?.email}</p>
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
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
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

              {/* Status Update */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {["pending", "paid", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                    <Button
                      key={status}
                      variant={selectedOrder.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id!, status as Order['status'])}
                      className={`rounded-none ${
                        selectedOrder.status === status 
                          ? "bg-[#6B4C3B] hover:bg-[#5a3f31] text-white" 
                          : ""
                      }`}
                      disabled={selectedOrder.status === status}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
