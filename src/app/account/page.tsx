"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { orderService, Order } from "@/lib/firebase-services";
import { formatPrice } from "@/lib/data";
import {
  User,
  ShoppingBag,
  Package,
  MapPin,
  Phone,
  Mail,
  Edit,
  LogOut,
  Eye,
  Clock,
  CheckCircle,
  Truck,
  Home,
  XCircle
} from "lucide-react";
import { toast } from "sonner";

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
  paid: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: Home,
  cancelled: XCircle
};

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: "",
    lastName: "",
    phone: ""
  });
  
  const router = useRouter();
  const { user, userProfile, signOut, updateProfile, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (userProfile) {
      setEditedProfile({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        phone: userProfile.phone
      });
    }
  }, [isAuthenticated, userProfile, router]);

  useEffect(() => {
    if (userProfile?.email) {
      loadUserOrders();
    }
  }, [userProfile]);

  const loadUserOrders = async () => {
    try {
      const allOrders = await orderService.getAll();
      const userOrders = allOrders.filter(order => 
        order.customerInfo?.email === userProfile?.email
      );
      setOrders(userOrders);
    } catch (error) {
      console.error("Failed to load user orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!userProfile) return;

    try {
      await updateProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      // Error is already handled by the auth context
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (!isAuthenticated || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B4C3B]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-light text-gray-900">My Account</h1>
              <p className="text-sm text-gray-500">Manage your profile and orders</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="rounded-none"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="rounded-none"
                    >
                      {isEditing ? (
                        "Cancel"
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={editedProfile.firstName}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, firstName: e.target.value }))}
                            className="rounded-none"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={editedProfile.lastName}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, lastName: e.target.value }))}
                            className="rounded-none"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                          className="rounded-none"
                        />
                      </div>
                      <div>
                        <Label>Email Address</Label>
                        <Input
                          value={userProfile.email}
                          disabled
                          className="rounded-none bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Email cannot be changed
                        </p>
                      </div>
                      <Button 
                        onClick={handleUpdateProfile}
                        className="bg-[#6B4C3B] hover:bg-[#5a3f31] text-white rounded-none"
                      >
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#6B4C3B] rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">
                            {userProfile.firstName} {userProfile.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">Member since {new Date(userProfile.createdAt?.toDate?.() || Date.now()).getFullYear()}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm text-gray-500">Contact Information</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span>{userProfile.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span>{userProfile.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                      ))}
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => {
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
                                    <p className="text-muted-foreground">
                                      {order.createdAt?.toDate?.() ? 
                                        new Date(order.createdAt.toDate()).toLocaleDateString() : 
                                        'Unknown'
                                      }
                                    </p>
                                    <p className="font-medium text-primary">
                                      {formatPrice(order.total)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Link href={`/track-order?orderId=${order.id}`}>
                                  <Button variant="outline" size="sm" className="rounded-none">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-500 mb-6">When you place your first order, it will appear here.</p>
                      <Link href="/shop">
                        <Button className="bg-[#6B4C3B] hover:bg-[#5a3f31] text-white rounded-none">
                          Start Shopping
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No saved addresses</h3>
                    <p className="text-gray-500 mb-6">Add addresses for faster checkout.</p>
                    <Button variant="outline" className="rounded-none">
                      Add New Address
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
