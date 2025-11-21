import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from '@firebase/firestore';
import { db } from '../config/firebase';
import { CheckIn } from '../types/models';

export function useCheckins(patientId: string) {
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'checkins'),
      where('patientId', '==', patientId),
      orderBy('timestamp', 'desc'),
      limit(7)
    );

    return onSnapshot(q, (snapshot) => {
      const checkinData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CheckIn));

      setCheckins(checkinData);
      setLoading(false);
    });
  }, [patientId]);

  return { checkins, loading };
}
