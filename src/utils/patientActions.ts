import { doc, updateDoc, arrayUnion } from '@firebase/firestore';
import { db } from '../config/firebase';

export async function markCheckInHandled(checkInId: string) {
  const checkInRef = doc(db, 'checkins', checkInId);
  await updateDoc(checkInRef, {
    handled: true,
  });
}

export async function addNoteToCheckIn(checkInId: string, note: string) {
  const checkInRef = doc(db, 'checkins', checkInId);
  await updateDoc(checkInRef, {
    notes: arrayUnion(note),
  });
}

export async function flagForVisit(patientId: string, flag: boolean) {
  const patientRef = doc(db, 'patients', patientId);
  await updateDoc(patientRef, {
    needsVisit: flag,
    updatedAt: new Date(),
  });
}
