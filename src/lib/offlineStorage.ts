// filepath: d:\project\astra-invite\src\lib\offlineStorage.ts
// IndexedDB wrapper for offline data storage
//export const offlineStorage = new OfflineStorage();
interface CachedInvitation {
  slug: string;
  guestName: string;
  weddingInfo: any;
  guest: any;
  timestamp: number;
  lastUpdated: number;
}

interface PendingRSVP {
  id?: number;
  slug: string;
  attending: boolean;
  declineReason?: string;
  timestamp: number;
  synced: boolean;
}

export class OfflineStorage {
  private db: IDBDatabase | null = null;
  private dbName = 'WeddingInviteDB';
  private version = 1;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('invitations')) {
          db.createObjectStore('invitations', { keyPath: 'slug' });
        }
        
        if (!db.objectStoreNames.contains('rsvps')) {
          const rsvpStore = db.createObjectStore('rsvps', { keyPath: 'id', autoIncrement: true });
          rsvpStore.createIndex('slug', 'slug', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  // Store wedding date for offline countdown
  async storeWeddingDate(slug: string, date: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put({ 
        key: `wedding_date_${slug}`, 
        value: date,
        timestamp: Date.now()
      });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get wedding date for offline countdown
  async getWeddingDate(slug: string): Promise<string | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get(`wedding_date_${slug}`);
      
      request.onsuccess = () => resolve(request.result?.value || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Cache invitation data
  async cacheInvitation(data: CachedInvitation): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['invitations'], 'readwrite');
      const store = transaction.objectStore('invitations');
      const request = store.put(data);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get cached invitation
  async getCachedInvitation(slug: string): Promise<CachedInvitation | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['invitations'], 'readonly');
      const store = transaction.objectStore('invitations');
      const request = store.get(slug);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Store pending RSVP
  async storePendingRSVP(rsvp: PendingRSVP): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['rsvps'], 'readwrite');
      const store = transaction.objectStore('rsvps');
      const request = store.add(rsvp);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get pending RSVPs
  async getPendingRSVPs(): Promise<PendingRSVP[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['rsvps'], 'readonly');
      const store = transaction.objectStore('rsvps');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const rsvps = request.result.filter((rsvp: PendingRSVP) => !rsvp.synced);
        resolve(rsvps);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Mark RSVP as synced
  async markRSVPSynced(id: number): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['rsvps'], 'readwrite');
      const store = transaction.objectStore('rsvps');
      const request = store.get(id);
      
      request.onsuccess = () => {
        const rsvp = request.result;
        if (rsvp) {
          rsvp.synced = true;
          const updateRequest = store.put(rsvp);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Update local guest status
  async updateLocalGuestStatus(slug: string, status: string, attending: boolean, declineReason?: string): Promise<void> {
    const cached = await this.getCachedInvitation(slug);
    if (cached) {
      cached.guest.status = status;
      cached.guest.attending = attending;
      if (declineReason) {
        cached.guest.declineReason = declineReason;
      }
      cached.lastUpdated = Date.now();
      await this.cacheInvitation(cached);
    }
  }
}

// Export the singleton instance
export const offlineStorage = new OfflineStorage();
