import { db, auth } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, setDoc } from 'firebase/firestore';
import { BrdVersion } from '@/hooks/useGenerateBRD';

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  userId: string;
}

export const saveProject = async (name: string) => {
  if (!auth.currentUser) return null;
  
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      name,
      createdAt: new Date(),
      userId: auth.currentUser.uid
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding project: ", error);
    return null;
  }
};

export const getProjects = async () => {
  if (!auth.currentUser) return [];
  
  try {
    const q = query(
      collection(db, 'projects'), 
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  } catch (error) {
    console.error("Error getting projects: ", error);
    return [];
  }
};

export const saveBrdVersion = async (projectId: string, version: BrdVersion) => {
  if (!auth.currentUser) return;
  
  try {
    await setDoc(doc(db, 'projects', projectId, 'versions', version.id), {
      version: version.version,
      timestamp: version.timestamp,
      markdown: version.markdown,
      files: version.files
    });
  } catch (error) {
    console.error("Error saving version: ", error);
  }
};
