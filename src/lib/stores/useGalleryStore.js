// stores/admin/useGalleryStore.js
import { create } from 'zustand';
import { db, storage } from '@/lib/firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { toast } from 'react-hot-toast';

const useGalleryStore = create((set, get) => ({
  // State
  images: [],
  loading: false,
  uploadProgress: {},
  uploadQueue: [],
  selectedImages: [],
  totalImages: 0,

  // Fetch all images
  fetchImages: async () => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, 'gallery'),
        orderBy('order', 'asc'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const images = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()
      }));
      set({ images, totalImages: images.length, loading: false });
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to fetch images');
      set({ loading: false });
    }
  },

  // Upload multiple images
  uploadImages: async (files) => {
    const uploadPromises = [];
    const newQueue = [...get().uploadQueue, ...files];
    set({ uploadQueue: newQueue });

    for (const file of files) {
      const uploadId = Date.now() + Math.random();
      set(state => ({
        uploadProgress: { ...state.uploadProgress, [uploadId]: 0 }
      }));

      // Create a unique filename
      const timestamp = Date.now();
      const filename = `gallery/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, filename);
      
      // Upload with progress
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      const promise = new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            set(state => ({
              uploadProgress: { ...state.uploadProgress, [uploadId]: progress }
            }));
          },
          (error) => {
            console.error('Upload error:', error);
            toast.error(`Failed to upload ${file.name}`);
            reject(error);
          },
          async () => {
            // Get download URL
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Create Firestore document
            const order = get().totalImages + get().uploadQueue.indexOf(file) + 1;
            
            await addDoc(collection(db, 'gallery'), {
              filename: file.name,
              storagePath: filename,
              url: downloadUrl,
              title: file.name.split('.')[0], // Default title from filename
              showcase: false,
              order,
              size: file.size,
              type: file.type,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });

            // Remove from queue and progress
            set(state => {
              const newQueue = state.uploadQueue.filter(f => f !== file);
              const newProgress = { ...state.uploadProgress };
              delete newProgress[uploadId];
              return {
                uploadQueue: newQueue,
                uploadProgress: newProgress
              };
            });

            resolve();
          }
        );
      });

      uploadPromises.push(promise);
    }

    try {
      await Promise.all(uploadPromises);
      await get().fetchImages();
      toast.success(`${files.length} images uploaded successfully`);
    } catch (error) {
      console.error('Bulk upload error:', error);
      toast.error('Some images failed to upload');
    }
  },

  // Update image metadata
  updateImage: async (imageId, updates) => {
    try {
      await updateDoc(doc(db, 'gallery', imageId), {
        ...updates,
        updatedAt: serverTimestamp()
      });

      // Update local state
      set(state => ({
        images: state.images.map(img => 
          img.id === imageId ? { ...img, ...updates } : img
        )
      }));

      toast.success('Image updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Failed to update image');
      return { success: false };
    }
  },

  // Toggle showcase (for landing page)
  toggleShowcase: async (imageId) => {
    const image = get().images.find(img => img.id === imageId);
    if (!image) return;

    return await get().updateImage(imageId, { 
      showcase: !image.showcase 
    });
  },

  // Bulk toggle showcase
  bulkToggleShowcase: async (imageIds, value) => {
    try {
      const promises = imageIds.map(id => 
        updateDoc(doc(db, 'gallery', id), {
          showcase: value,
          updatedAt: serverTimestamp()
        })
      );
      
      await Promise.all(promises);
      
      // Update local state
      set(state => ({
        images: state.images.map(img => 
          imageIds.includes(img.id) ? { ...img, showcase: value } : img
        )
      }));

      toast.success(`${imageIds.length} images updated`);
    } catch (error) {
      console.error('Bulk update error:', error);
      toast.error('Failed to update images');
    }
  },

  // Delete image
  deleteImage: async (imageId) => {
    try {
      const image = get().images.find(img => img.id === imageId);
      if (!image) return;

      // Delete from storage
      if (image.storagePath) {
        const storageRef = ref(storage, image.storagePath);
        await deleteObject(storageRef);
      }

      // Delete from Firestore
      await deleteDoc(doc(db, 'gallery', imageId));

      // Update local state
      set(state => ({
        images: state.images.filter(img => img.id !== imageId)
      }));

      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  },

  // Bulk delete
  bulkDelete: async (imageIds) => {
    try {
      const images = get().images.filter(img => imageIds.includes(img.id));
      
      // Delete from storage
      const storagePromises = images.map(img => 
        img.storagePath ? deleteObject(ref(storage, img.storagePath)) : Promise.resolve()
      );
      
      // Delete from Firestore
      const firestorePromises = imageIds.map(id => 
        deleteDoc(doc(db, 'gallery', id))
      );

      await Promise.all([...storagePromises, ...firestorePromises]);

      // Update local state
      set(state => ({
        images: state.images.filter(img => !imageIds.includes(img.id)),
        selectedImages: []
      }));

      toast.success(`${imageIds.length} images deleted successfully`);
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete images');
    }
  },

  // Reorder images
  reorderImages: async (sourceIndex, destinationIndex) => {
    const newImages = [...get().images];
    const [moved] = newImages.splice(sourceIndex, 1);
    newImages.splice(destinationIndex, 0, moved);

    // Update order in Firestore
    try {
      const updatePromises = newImages.map((img, index) => 
        updateDoc(doc(db, 'gallery', img.id), { order: index + 1 })
      );
      
      await Promise.all(updatePromises);
      set({ images: newImages });
      toast.success('Images reordered successfully');
    } catch (error) {
      console.error('Reorder error:', error);
      toast.error('Failed to reorder images');
      // Revert on error
      await get().fetchImages();
    }
  },

  // Select/deselect images
  toggleSelect: (imageId) => {
    set(state => ({
      selectedImages: state.selectedImages.includes(imageId)
        ? state.selectedImages.filter(id => id !== imageId)
        : [...state.selectedImages, imageId]
    }));
  },

  selectAll: () => {
    set(state => ({
      selectedImages: state.images.map(img => img.id)
    }));
  },

  clearSelection: () => set({ selectedImages: [] }),

  // Reset
  reset: () => set({
    images: [],
    loading: false,
    uploadProgress: {},
    uploadQueue: [],
    selectedImages: []
  })
}));

export default useGalleryStore;