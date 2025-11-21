import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import twilio from 'twilio';

const twilioClient = twilio(
  functions.config().twilio.account_sid,
  functions.config().twilio.auth_token
);

export const scheduleCheckins = functions.pubsub
  .schedule('every day 08:00')
  .timeZone('America/Los_Angeles')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();

    // Get all active patients
    const patients = await db
      .collection('patients')
      .where('active', '==', true)
      .get();

    const batch = db.batch();
    const sendPromises: Promise<any>[] = [];

    patients.forEach((patient) => {
      const data = patient.data();
      const checkInId = db.collection('checkins').doc().id;
      
      // Create check-in document
      batch.set(db.collection('checkins').doc(checkInId), {
        patientId: patient.id,
        timestamp: now,
        handled: false,
        notes: [],
      });

      // Send SMS with check-in link
      const message = {
        body: `Your daily post-op check-in: https://postopv2-defb6.web.app/checkin/${checkInId}`,
        to: data.phone,
        from: functions.config().twilio.phone_number,
      };

      sendPromises.push(twilioClient.messages.create(message));
    });

    await batch.commit();
    await Promise.all(sendPromises);
  });
