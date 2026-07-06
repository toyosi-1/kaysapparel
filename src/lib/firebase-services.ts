import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  onSnapshot
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './firebase'
import { Product as ProductType } from './types'

// Collections
const PRODUCTS_COLLECTION = 'products'
const ORDERS_COLLECTION = 'orders'
const USERS_COLLECTION = 'users'
const RECEIPTS_COLLECTION = 'receipts'

// Product types
export interface Product {
  id?: string
  name: string
  price: number // Price in kobo (Naira * 100)
  category: string
  sizes: string[]
  colors: string[]
  images: string[]
  description?: string
  inStock: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
  _isStatic?: boolean
}

export interface Order {
  id?: string
  userId?: string
  customerInfo?: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    deliveryZone?: string
    deliveryFee?: number
  }
  items: OrderItem[]
  total: number // Total in Naira
  subtotal?: number // Items total before delivery
  deliveryFee?: number
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentInfo?: {
    bank: string
    accountName: string
    accountNumber: string
    paidAt?: Timestamp
  }
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  size: string
  color: string
  price: number // Price at time of purchase
}

export interface User {
  id?: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Receipt {
  id?: string
  orderId: string
  fileName: string
  fileUrl: string
  uploadedAt?: Timestamp
}

// Product services
export const productService = {
  async getAll(): Promise<Product[]> {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION))
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
  },

  async getById(id: string): Promise<Product | null> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Product : null
  },

  async getByCategory(category: string): Promise<Product[]> {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
  },

  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    const docSnap = await getDoc(docRef)
    return { id: docRef.id, ...docSnap.data() } as Product
  },

  async update(id: string, product: Partial<Product>): Promise<void> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id)
    await updateDoc(docRef, {
      ...product,
      updatedAt: Timestamp.now()
    })
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id)
    await deleteDoc(docRef)
  },

  subscribeToAll(callback: (products: ProductType[]) => void) {
    return onSnapshot(collection(db, PRODUCTS_COLLECTION), (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProductType[]
      callback(products)
    }, (error) => {
      console.error('Products subscription error:', error)
    })
  },

  subscribeToById(id: string, callback: (product: ProductType | null) => void) {
    const docRef = doc(db, PRODUCTS_COLLECTION, id)
    return onSnapshot(docRef, (docSnap) => {
      callback(docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as ProductType : null)
    }, (error) => {
      console.error('Product subscription error:', error)
    })
  }
}

// Order services
export const orderService = {
  async getAll(): Promise<Order[]> {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[]
  },

  async getById(id: string): Promise<Order | null> {
    const docRef = doc(db, ORDERS_COLLECTION, id)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Order : null
  },

  async getByUserId(userId: string): Promise<Order[]> {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[]
  },

  async create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const now = Timestamp.now()
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...order,
      createdAt: now,
      updatedAt: now
    })
    return { id: docRef.id, ...order, createdAt: now, updatedAt: now } as Order
  },

  async updateStatus(id: string, status: Order['status']): Promise<void> {
    const docRef = doc(db, ORDERS_COLLECTION, id)
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now()
    })
  },

  async markAsPaid(id: string, paymentInfo: Order['paymentInfo']): Promise<void> {
    const docRef = doc(db, ORDERS_COLLECTION, id)
    await updateDoc(docRef, {
      status: 'paid',
      paymentInfo: {
        ...paymentInfo,
        paidAt: Timestamp.now()
      },
      updatedAt: Timestamp.now()
    })
  }
}

// User services
export const userService = {
  async getById(id: string): Promise<User | null> {
    const docRef = doc(db, USERS_COLLECTION, id)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as User : null
  },

  async getByEmail(email: string): Promise<User | null> {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('email', '==', email)
    )
    const snapshot = await getDocs(q)
    if (snapshot.empty) return null
    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() } as User
  },

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const docRef = await addDoc(collection(db, USERS_COLLECTION), {
      ...user,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    const docSnap = await getDoc(docRef)
    return { id: docRef.id, ...docSnap.data() } as User
  },

  async update(id: string, user: Partial<User>): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, id)
    await updateDoc(docRef, {
      ...user,
      updatedAt: Timestamp.now()
    })
  }
}

// Receipt services
export const receiptService = {
  async upload(orderId: string, file: File): Promise<Receipt> {
    // Upload file to Firebase Storage under order folder to match security rules
    const fileName = `${Date.now()}_${file.name}`
    const storageRef = ref(storage, `receipts/${orderId}/${fileName}`)
    await uploadBytes(storageRef, file)
    const fileUrl = await getDownloadURL(storageRef)

    // Save receipt info to Firestore
    const docRef = await addDoc(collection(db, RECEIPTS_COLLECTION), {
      orderId,
      fileName,
      fileUrl,
      uploadedAt: Timestamp.now()
    })
    const docSnap = await getDoc(docRef)
    return { id: docRef.id, ...docSnap.data() } as Receipt
  },

  async getByOrderId(orderId: string): Promise<Receipt[]> {
    const q = query(
      collection(db, RECEIPTS_COLLECTION),
      where('orderId', '==', orderId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Receipt[]
  }
}
