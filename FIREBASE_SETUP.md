# Firebase Setup Guide

This app now uses Firebase Realtime Database for real-time data synchronization across all users!

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `tasmania-trek-planner` (or any name you prefer)
4. **Disable Google Analytics** (not needed for this project)
5. Click **"Create project"**

## Step 2: Create a Web App

1. In your Firebase project, click the **Web icon (</>)** to add a web app
2. Enter app nickname: `Tassie Trekkers`
3. **Don't** check "Set up Firebase Hosting"
4. Click **"Register app"**
5. **Copy the `firebaseConfig` object** (you'll need this in Step 4)

## Step 3: Enable Realtime Database

1. In the left sidebar, click **"Build"** → **"Realtime Database"**
2. Click **"Create Database"**
3. Choose location: **United States** (or closest to you)
4. Start in **"Test mode"** for now (we can add security rules later)
5. Click **"Enable"**

## Step 4: Add Firebase Config to Your App

1. Open the file: `src/firebase/config.js`
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "AIza...", // Your actual API key
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

3. Save the file

## Step 5: Update Security Rules (Optional but Recommended)

For now, test mode allows anyone to read/write. After testing, update the rules:

1. In Firebase Console, go to **"Realtime Database"** → **"Rules"**
2. Replace with these rules (allows read/write for everyone, but you can add authentication later):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

3. Click **"Publish"**

## Step 6: Test the App

1. Run `npm run dev` locally
2. Open the app in your browser
3. Try adding a trekker profile or task
4. Open the app in an incognito window or different browser
5. You should see the same data!

## What's Synced with Firebase?

✅ **Synced across all users:**
- Trekker profiles
- Tasks and bookings
- Packing list items
- Flight prices
- Chat messages
- Training activities and calendar
- Group training events

📱 **Stored locally only:**
- Current user name selection
- UI preferences (active tab, etc.)

## Troubleshooting

**Error: "Firebase: Error (auth/configuration-not-found)"**
- Make sure you copied the entire `firebaseConfig` object correctly

**Data not syncing:**
- Check your browser console for errors
- Verify the `databaseURL` in your config ends with `.firebaseio.com`
- Make sure Realtime Database is enabled in Firebase Console

**"Permission denied" errors:**
- Check that your database rules allow read/write
- Make sure you're in "test mode" or have proper security rules set up

---

## Need Help?

If you run into issues, check:
1. Firebase Console for any error messages
2. Browser console (F12) for JavaScript errors
3. Firebase documentation: https://firebase.google.com/docs/database/web/start
