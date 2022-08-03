import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

// funtions folders
import * as mail from './mailgun';

// Organize cloud functions based on logical roles
// Mailgun functions
export const sendEmail = mail.sendEmail;
