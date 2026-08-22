# 🚀 JIBBLE APPLICATION: THE ULTIMATE STEP-BY-STEP EXTERNAL SETUP GUIDE

> [!IMPORTANT]
> **WELCOME TO THE STEP-BY-STEP EXTERNAL SETUP MASTER GUIDE!**  
> This guide is meticulously formatted to walk you through **every single click, menu, screen, input field, and file placement** required to set up Firebase, Push Notifications, AWS Cloud Storage (S3), Neon PostgreSQL Database, Redis, Developer Accounts, App Store Assets, and Physical Device Testing.
> 
> *Note: Android is our immediate primary target for physical testing. However, all iOS setup instructions have been preserved in full detail so that when you purchase your Mac, you can complete the iOS setup without needing any extra documentation!*

---

## 📑 TABLE OF CONTENTS

1. [STEP 1: FIREBASE & PUSH NOTIFICATIONS SETUP (ANDROID & IOS)](#step-1-firebase--push-notifications-setup-android--ios)
   - [1.1 Creating your Firebase Account & Project](#11-creating-your-firebase-account--project)
   - [1.2 Registering the Android Application](#12-registering-the-android-application)
   - [1.3 Downloading & Placing `google-services.json`](#13-downloading--placing-google-servicesjson)
   - [1.4 Registering the iOS Application (Future Mac Setup)](#14-registering-the-ios-application-future-mac-setup)
   - [1.5 Downloading & Placing `GoogleService-Info.plist`](#15-downloading--placing-googleservice-infoplist)
   - [1.6 Enabling Firebase Cloud Messaging (FCM) & Generating Server Keys](#16-enabling-firebase-cloud-messaging-fcm--generating-server-keys)
2. [STEP 2: CLOUD MEDIA STORAGE SETUP (AWS S3)](#step-2-cloud-media-storage-setup-aws-s3)
   - [2.1 AWS S3 Bucket Setup](#21-aws-s3-bucket-setup)
   - [2.2 Configuring CORS (Cross-Origin Resource Sharing) for S3](#22-configuring-cors-cross-origin-resource-sharing-for-s3)
   - [2.3 Creating IAM User Access Keys](#23-creating-iam-user-access-keys)
3. [STEP 3: PRODUCTION DATABASE (NEON POSTGRESQL) & REDIS HOSTING](#step-3-production-database-neon-postgresql--redis-hosting)
   - [3.1 Setting Up Neon PostgreSQL Host](#31-setting-up-neon-postgresql-host)
   - [3.2 Setting Up Managed Redis (Upstash)](#32-setting-up-managed-redis-upstash)
   - [3.3 Connecting Keys to the `backend/.env` File](#33-connecting-keys-to-the-backendenv-file)
4. [STEP 4: DEVELOPER ACCOUNTS (GOOGLE PLAY & APPLE)](#step-4-developer-accounts-google-play--apple)
   - [4.1 Google Play Console Registration ($25)](#41-google-play-console-registration-25)
   - [4.2 Apple Developer Program Registration ($99/year)](#42-apple-developer-program-registration-99year)
5. [STEP 5: APP STORE GRAPHICS & BRANDING ASSETS](#step-5-app-store-graphics--branding-assets)
   - [5.1 App Icon Requirements & Tools](#51-app-icon-requirements--tools)
   - [5.2 Feature Graphic (Android Play Store)](#52-feature-graphic-android-play-store)
   - [5.3 iPhone & Android Screenshot Dimensions](#53-iphone--android-screenshot-dimensions)
   - [5.4 Generating Privacy Policy URL](#54-generating-privacy-policy-url)
6. [STEP 6: PHYSICAL DEVICE TESTING GUIDE](#step-6-physical-device-testing-guide)
   - [6.1 Android Developer Options & USB Debugging Setup](#61-android-developer-options--usb-debugging-setup)
   - [6.2 Testing Camera, Media Capture, & Reels](#62-testing-camera-media-capture--reels)
   - [6.3 Testing Background Push Notifications](#63-testing-background-push-notifications)
7. [APPENDIX: MASTER ENVIRONMENT VARIABLES CHEATSHEET](#appendix-master-environment-variables-cheatsheet)

---

## STEP 1: FIREBASE & PUSH NOTIFICATIONS SETUP (ANDROID & IOS)

> [!NOTE]
> Firebase powers user push notifications, device tokens, and cloud notification channels for Jibble.

### 1.1 Creating your Firebase Account & Project

```
[Browser] ➔ Navigate to console.firebase.google.com
   │
   ├── 1. Click "Add project" (or "Create a project")
   ├── 2. Enter Project Name: "Jibble"
   ├── 3. Click "Continue"
   ├── 4. Google Analytics: Keep ENABLED (Recommended for tracking crashes)
   ├── 5. Choose Google Analytics account (or "Default Account for Firebase")
   └── 6. Click "Create project" (Wait ~15 seconds for setup to finish)
```

1. Open your browser and navigate to: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Log in with your primary Google Account.
3. Click on the large **`+ Add project`** card in the center of the screen.
4. In the **Project Name** input box, type: `Jibble` (or `Jibble Community`).
5. Click **Continue**.
6. On the **Google Analytics for your Firebase project** screen:
   - Leave the toggle **Enabled**.
   - Click **Continue**.
7. In the **Select an account** dropdown menu, select **Default Account for Firebase**.
8. Click the blue **Create project** button.
9. Wait for the progress circle to complete (takes ~10 to 20 seconds). When it says *"Your new project is ready"*, click **Continue**.

---

### 1.2 Registering the Android Application

> [!IMPORTANT]
> Your Android Package Name (Application ID) is defined in `apps/mobile_app/android/app/build.gradle.kts`.  
> Current default: `com.example.jibble_mobile` (or `com.jibble.app` when customized).

```
Firebase Project Dashboard
   │
   └── Click on the Android Icon (Android logo)
         │
         ├── Field 1: Android package name ➔ com.example.jibble_mobile
         ├── Field 2: App nickname ➔ Jibble Android Mobile
         ├── Field 3: Debug signing certificate SHA-1 ➔ (Optional for now)
         └── Click "Register app"
```

1. On the Firebase Project Overview screen, click the **Android icon** (`android`) below the *"Get started by adding Firebase to your app"* heading.
2. Under **Android package name**, enter: `com.example.jibble_mobile`  
   *(If you change your app id in code later to `com.jibble.app`, make sure this matches exact case).*
3. Under **App nickname (optional)**, enter: `Jibble Android`
4. Under **Debug signing certificate SHA-1**, leave it blank for now (you will generate this later when enabling Google Sign-In or Phone Auth).
5. Click the blue **Register app** button.

---

### 1.3 Downloading & Placing `google-services.json`

```
Firebase Step 2: Download config file
   │
   ├── 1. Click "Download google-services.json"
   ├── 2. Locate downloaded file in your computer's Downloads folder
   └── 3. Move/Copy file into workspace directory:
          d:\for opening\for opening\Jibble\apps\mobile_app\android\app\google-services.json
```

1. Click the blue **Download google-services.json** button.
2. Open your Windows File Explorer and navigate to your `Downloads` folder.
3. Locate `google-services.json`.
4. Copy or cut the file.
5. Navigate to your Jibble workspace directory path:
   `d:\for opening\for opening\Jibble\apps\mobile_app\android\app\`
6. Paste the file directly inside the `app` folder.  
   *Target full path must be exactly:*  
   `d:\for opening\for opening\Jibble\apps\mobile_app\android\app\google-services.json`
7. Go back to your browser, click **Next**, click **Next** on the Gradle instructions, and finally click **Continue to console**.

---

### 1.4 Registering the iOS Application (Future Mac Setup)

> [!TIP]
> Keep these instructions safe! When you purchase your Mac computer, perform these exact steps to activate iOS Push Notifications and Apple App Store builds.

```
Firebase Project Dashboard
   │
   └── Click "+ Add app" ➔ Select iOS Icon (Apple logo)
         │
         ├── Field 1: Apple bundle ID ➔ com.example.jibbleMobile (or com.jibble.app)
         ├── Field 2: App nickname ➔ Jibble iOS Mobile
         ├── Field 3: App Store ID ➔ (Leave blank)
         └── Click "Register app"
```

1. On your Firebase Dashboard, click **`+ Add app`** and select the **iOS icon** (`iOS`).
2. Under **iOS bundle ID**, enter: `com.example.jibbleMobile` (or your final iOS Bundle Identifier).
3. Under **App nickname**, enter: `Jibble iOS`.
4. Click **Register app**.

---

### 1.5 Downloading & Placing `GoogleService-Info.plist`

```
Firebase Step 2 (iOS): Download config file
   │
   ├── 1. Click "Download GoogleService-Info.plist"
   └── 2. Copy/Move file into workspace directory:
          d:\for opening\for opening\Jibble\apps\mobile_app\ios\Runner\GoogleService-Info.plist
```

1. Click **Download GoogleService-Info.plist**.
2. Save/move the file to:
   `d:\for opening\for opening\Jibble\apps\mobile_app\ios\Runner\GoogleService-Info.plist`
3. When on your Mac in Xcode, drag this file into the Xcode Project Navigator under the `Runner` folder (ensure *"Copy items if needed"* is checked).
4. Click **Next** and finish setup.

---

### 1.6 Enabling Firebase Cloud Messaging (FCM) & Generating Server Keys

```
Firebase Console ➔ Project Settings (Gear icon ⚙️ at top left)
   │
   ├── Select Tab: "Cloud Messaging"
   │
   ├── SECTION A: Firebase Cloud Messaging API (V1)
   │     └── Copy "Project ID" (e.g. jibble-app-12345)
   │
   └── SECTION B: Service Accounts Tab
         ├── 1. Click "Service accounts" tab
         ├── 2. Click "Generate new private key"
         ├── 3. Confirm by clicking "Generate key"
         └── 4. Downloaded JSON contains private_key and client_email
```

1. In Firebase Console, click the **Gear Icon** (`⚙️`) next to *Project Overview* in the top left sidebar.
2. Select **Project Settings**.
3. Click on the **Cloud Messaging** tab at the top.
4. Check if **Firebase Cloud Messaging API (V1)** is **Enabled**. If it says Disabled, click the 3 dots menu on the right, select *"Manage API in Google Cloud Console"*, click **Enable**, and return to Firebase.
5. Click on the **Service Accounts** tab.
6. Click the blue button **Generate new private key**.
7. A dialog pop-up will appear. Click **Generate key**.
8. A `.json` credentials file will download to your computer.
9. Open this file with Notepad or VS Code.
10. You will see values for `project_id`, `private_key`, and `client_email`.
11. Keep these handy to paste into your `backend/.env` file (see Step 3.3).

---

## STEP 2: CLOUD MEDIA STORAGE SETUP (AWS S3)

> [!WARNING]
> Storing images, videos, reels, and user avatars directly on your server disk will fill up server storage instantly. AWS S3 provides high-speed, infinite cloud storage.

### 2.1 AWS S3 Bucket Setup

```
[Browser] ➔ Navigate to aws.amazon.com ➔ Console
   │
   ├── Search Service: "S3"
   ├── Click "Create bucket"
   │     ├── Bucket Name: jibble-media-storage-prod
   │     ├── AWS Region: us-east-1 (or ap-south-1 for India)
   │     ├── Object Ownership: ACLs disabled (recommended)
   │     └── Block Public Access: UNCHECK "Block all public access"
   │           └── Acknowledge checkbox: "I understand..."
   └── Click "Create bucket"
```

1. Go to [https://aws.amazon.com/](https://aws.amazon.com/) and click **Sign In to the Console** (Create an AWS account if you don't have one).
2. In the top search bar, type `S3` and select **S3 (Scalable Storage in the Cloud)**.
3. Click the orange **Create bucket** button.
4. Under **Bucket name**, enter a unique lowercase name, e.g.: `jibble-media-storage-prod`
5. Under **AWS Region**, select the region closest to your users:
   - For India: `ap-south-1 (Asia Pacific - Mumbai)`
   - For US: `us-east-1 (US East - N. Virginia)`
6. Under **Block Public Access settings for this bucket**:
   - **Uncheck** the box that says *"Block all public access"* (This allows user profile photos and post images to be viewable on mobile devices).
   - Select the warning checkbox below it: *"I acknowledge that the current settings might result in this bucket and the objects within it becoming public."*
7. Scroll to the bottom and click **Create bucket**.

---

### 2.2 Configuring CORS (Cross-Origin Resource Sharing) for S3

```
S3 Console ➔ Buckets ➔ Click "jibble-media-storage-prod"
   │
   ├── Select Tab: "Permissions"
   ├── Scroll down to: "Cross-origin resource sharing (CORS)"
   ├── Click "Edit"
   ├── Paste JSON CORS Configuration
   └── Click "Save changes"
```

1. Inside S3 Console, click on your newly created bucket name `jibble-media-storage-prod`.
2. Click on the **Permissions** tab.
3. Scroll down near the bottom to the **Cross-origin resource sharing (CORS)** section.
4. Click **Edit**.
5. Paste the following JSON block into the code editor:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE",
            "HEAD"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [
            "ETag"
        ],
        "MaxAgeSeconds": 3000
    }
]
```

6. Click **Save changes**.

---

### 2.3 Creating IAM User Access Keys

```
AWS Top Search Bar ➔ Type "IAM" ➔ Users
   │
   ├── Click "Add users"
   │     ├── User name: jibble-backend-s3-user
   │     └── Attach policies directly: Select "AmazonS3FullAccess"
   ├── Click "Create user"
   │
   └── Security Credentials Tab
         ├── Click "Create access key"
         ├── Choose Use Case: "Application running outside AWS"
         └── Result: Access Key ID & Secret Access Key generated!
```

1. In the AWS top search bar, type `IAM` and select **IAM (Identity and Access Management)**.
2. Click **Users** on the left navigation menu.
3. Click the orange **Add users** button.
4. Under **User name**, enter: `jibble-backend-s3-user`.
5. Click **Next**.
6. Under **Permissions options**, select **Attach policies directly**.
7. In the search box under *Permissions policies*, type `AmazonS3FullAccess`.
8. Check the checkbox next to **AmazonS3FullAccess**.
9. Click **Next**, then click **Create user**.
10. Click on the newly created user name `jibble-backend-s3-user`.
11. Select the **Security credentials** tab.
12. Scroll down to **Access keys** and click **Create access key**.
13. Select **Application running outside AWS**.
14. Click **Next**, then click **Create access key**.
15. **CRITICAL:** Copy both the **Access Key ID** (e.g. `AKIAIOSFODNN7EXAMPLE`) and **Secret Access Key** (e.g. `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`).  
    *Save these securely! You will paste them into `backend/.env`.*

---

## STEP 3: PRODUCTION DATABASE (NEON POSTGRESQL) & REDIS HOSTING

### 3.1 Setting Up Neon PostgreSQL Host

```
[Browser] ➔ Navigate to neon.tech
   │
   ├── 1. Click "Sign Up" (Sign in with GitHub or Google)
   ├── 2. Click "Create Project"
   │     ├── Project Name: Jibble Production DB
   │     ├── Postgres Version: Select 15 or 16 (Latest)
   │     └── Region: Select closest region (e.g. Asia Pacific - Singapore / US East)
   ├── 3. Click "Create Project"
   │
   └── Dashboard Dashboard ➔ Connection Details
         ├── Select Role / Database: postgres / main
         └── Connection String (Pooled) ➔ COPY: postgresql://alex:xxxx@ep-cool-name-12345.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

1. Go to [https://neon.tech/](https://neon.tech/) and click **Sign Up** (Log in using your GitHub or Google account).
2. Click **Create Project**.
3. Under **Project Name**, type: `Jibble Production DB`.
4. Under **Postgres version**, select the latest default (PostgreSQL 16).
5. Under **Region**, choose the region closest to your users.
6. Click **Create Project**.
7. Once the dashboard loads, locate the **Connection Details** box on the right.
8. Make sure **Pooled connection** is checked (recommended for Node.js backend scalability).
9. Click **Copy** on the connection string URL.
10. The copied connection string will look like:  
    `postgresql://username:password@ep-sample-12345.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`

---

### 3.2 Setting Up Managed Redis (Upstash)

```
[Browser] ➔ Navigate to upstash.com
   │
   ├── 1. Sign in with GitHub / Google
   ├── 2. Click "Create Database"
   │     ├── Name: jibble-redis-cache
   │     ├── Type: Primary database
   │     ├── Region: Select closest region
   │     └── TLS (SSL): ENABLED
   ├── 3. Click "Create"
   │
   └── Redis Database Details Screen
         └── Scroll to "UPSTASH_REDIS_REST_URL" or "redis://..." connection string ➔ COPY
```

1. Go to [https://upstash.com/](https://upstash.com/) and sign in with GitHub or Google.
2. Click **Create Database**.
3. Under **Database Name**, enter: `jibble-redis-cache`.
4. Under **Region**, select your region (match your PostgreSQL region if possible).
5. Leave **TLS Enabled** checked.
6. Click **Create**.
7. Under the **Details** tab, scroll to **Node.js** / **ioredis** / **Connection String**.
8. Copy the `rediss://default:xxxx@xxxx.upstash.io:6379` connection URL.

---

### 3.3 Connecting Keys to the `backend/.env` File

Open your project file: `d:\for opening\for opening\Jibble\backend\.env` in VS Code and update it with all your newly collected credentials:

```env
# ==============================================================================
# JIBBLE CORE BACKEND PRODUCTION CONFIGURATION
# ==============================================================================
PORT=5000
NODE_ENV=production

# 1. DATABASE (NEON POSTGRESQL) & CACHE (UPSTASH REDIS) CONNECTION STRINGS
DATABASE_URL="postgresql://username:password@ep-sample-12345.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
REDIS_URL="rediss://default:xxxx@xxxx.upstash.io:6379"

# 2. JWT SECURITY KEYS
JWT_SECRET="generate_a_super_secret_random_64_character_string_here"
JWT_EXPIRES_IN="7d"

# 3. AWS S3 CLOUD MEDIA STORAGE
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_REGION="ap-south-1"
AWS_S3_BUCKET_NAME="jibble-media-storage-prod"

# 4. FIREBASE CLOUD MESSAGING (PUSH NOTIFICATIONS)
FIREBASE_PROJECT_ID="jibble-app-12345"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@jibble-app-12345.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

---

## STEP 4: DEVELOPER ACCOUNTS (GOOGLE PLAY & APPLE)

### 4.1 Google Play Console Registration ($25)

```
[Browser] ➔ Navigate to play.google.com/console/signup
   │
   ├── 1. Sign in with Google Account
   ├── 2. Choose Developer Type: "Yourself" OR "Organization / Business"
   ├── 3. Enter Developer Name (e.g. "Jibble Technologies")
   ├── 4. Enter Contact Email & Phone Number (Verify via OTP)
   ├── 5. Accept Developer Agreement
   ├── 6. Pay $25 Registration Fee via Credit/Debit Card
   └── 7. Identity Verification: Upload Govt ID (Passport/Driving License/PAN Card)
```

1. Navigate to: [https://play.google.com/console/signup](https://play.google.com/console/signup)
2. Log in with your developer Google account.
3. Select **An individual** (or **An organization** if registered as a company).
4. Fill in your **Developer Name** (This name appears on the Google Play Store under your app title).
5. Enter your phone number and email address, then click **Verify** to complete SMS and Email OTP verification.
6. Check the agreement box to accept the **Google Play Developer Distribution Agreement**.
7. Click **Create account and pay**.
8. Pay the one-time registration fee of **$25 USD** using a credit or debit card enabled for international transactions.
9. After payment, complete **Identity Verification** by uploading a photo of a government-issued photo ID (e.g., Passport, Driver's License, or National Identity Card). Verification takes between 2 to 48 hours.

---

### 4.2 Apple Developer Program Registration ($99/year)

> [!TIP]
> Complete this step after you purchase your Mac.

```
[Browser] ➔ Navigate to developer.apple.com/programs/enroll
   │
   ├── 1. Sign in with Apple ID (Enable Two-Factor Authentication first)
   ├── 2. Download "Apple Developer" app on iPhone/iPad OR complete on Web
   ├── 3. Enter Legal First Name, Last Name, Address, & Phone Number
   ├── 4. Select Membership Type: Individual / Sole Proprietor
   ├── 5. Pay $99 USD / year annual fee
   └── 6. Verification completed by Apple Team!
```

1. Enable **Two-Factor Authentication (2FA)** on your Apple ID.
2. Go to: [https://developer.apple.com/programs/enroll/](https://developer.apple.com/programs/enroll/)
3. Click **Start Your Enrollment**.
4. Log in with your Apple ID.
5. Fill in your legal personal details (Name, Physical Billing Address, Phone Number).
6. Pay the **$99 USD/year** membership fee.
7. Apple will send a confirmation email once your account is active (usually within 24 hours).

---

## STEP 5: APP STORE GRAPHICS & BRANDING ASSETS

Before uploading Jibble to the stores, prepare your visual assets using design tools like Canva, Figma, or Adobe Photoshop.

```
                  APP STORE GRAPHIC DIMENSIONS MAP
 ┌───────────────────────┐   ┌─────────────────────────────────────────┐
 │       APP ICON        │   │        FEATURE GRAPHIC (ANDROID)        │
 │     1024 x 1024       │   │               1024 x 500                │
 └───────────────────────┘   └─────────────────────────────────────────┘
 ┌───────────────────────┐   ┌─────────────────────────────────────────┐
 │  IPHONE SCREENSHOTS   │   │       ANDROID PHONE SCREENSHOTS         │
 │  6.5": 1284 x 2778    │   │           1080 x 1920                   │
 │  5.5": 1242 x 2208    │   │                                         │
 └───────────────────────┘   └─────────────────────────────────────────┘
```

### 5.1 App Icon Requirements & Tools
- **Dimension:** `1024 x 1024 px`
- **Format:** PNG format, 32-bit color, no transparency (flat background).
- **Free Icon Generator:** Use [AppIcon.co](https://appicon.co/) to automatically slice your 1024x1024 PNG into all Android (`res/mipmap`) and iOS (`AppIcon.appiconset`) folder sizes.

### 5.2 Feature Graphic (Android Play Store)
- **Dimension:** `1024 x 500 px`
- **Format:** PNG or JPEG (max 15MB).
- **Description:** Eye-catching banner banner placed at the top of your Google Play Store listing showcasing the Jibble logo and tagline (e.g. *"Jibble - Connect with Your Communities"*).

### 5.3 iPhone & Android Screenshot Dimensions
Prepare 4 to 6 screenshots demonstrating core screens (Home Feed, Circles Discovery, Chat, Reels, Profile).

* **Android Phone Screenshots:** `1080 x 1920 px` or `1440 x 2560 px` (Aspect ratio 16:9 or 19.5:9).
* **iPhone 6.5-Inch Screenshots (iPhone 15 Pro Max / 14 Pro Max):** `1284 x 2778 px`
* **iPhone 5.5-Inch Screenshots (iPhone 8 Plus):** `1242 x 2208 px`

### 5.4 Generating Privacy Policy URL
Google Play & Apple require a public URL linking to your privacy policy.
1. Go to a free privacy policy generator like [PrivacyPolicyGenerator.info](https://www.privacypolicygenerator.info/).
2. Enter App Name: `Jibble`.
3. Select Entity Type: Individual / Company.
4. Generate text and host it for free on [GitHub Pages](https://pages.github.com/) or Notion / Vercel (e.g. `https://yourname.github.io/jibble-privacy-policy`).

---

## STEP 6: PHYSICAL DEVICE TESTING GUIDE

> [!IMPORTANT]
> Testing on a real physical Android phone is essential to verify camera hardware access, video acceleration for Reels, and real-time background notification banners.

### 6.1 Android Developer Options & USB Debugging Setup

```
Android Phone ➔ Settings
   │
   ├── 1. Scroll to "About Phone"
   ├── 2. Find "Build Number"
   ├── 3. Tap "Build Number" SEVEN (7) TIMES consecutively
   │     └── Toast message pops up: "You are now a developer!"
   │
   ├── 4. Go back to main Settings ➔ System ➔ Developer options
   ├── 5. Enable toggle: "USB Debugging"
   │
   └── 6. Connect phone to Windows Laptop via USB Cable
         └── Phone pop-up: "Allow USB debugging?" ➔ Check "Always allow" ➔ Click "ALLOW"
```

1. Open your Android phone's **Settings** app.
2. Scroll down and tap **About phone** (or **Software information**).
3. Find **Build number**.
4. Tap **Build number** quickly **7 times** in a row.
5. You will see a small pop-up message: *"Developer mode has been enabled!"*
6. Go back to the main **Settings** menu, scroll down, and tap **Developer options** (or **System > Developer options**).
7. Turn ON the toggle for **USB debugging**.
8. Connect your Android phone to your Windows laptop using a USB data cable.
9. A pop-up prompt will appear on your phone screen: *"Allow USB debugging?"*.
10. Check the box *"Always allow from this computer"* and tap **Allow**.
11. In your VS Code terminal, run:
    ```powershell
    cd "d:\for opening\for opening\Jibble\apps\mobile_app"
    flutter devices
    ```
12. You will see your physical Android phone listed (e.g. `SM-G998B • 123456789 • android-arm64 • Android 13`).
13. To launch Jibble directly on your physical phone, run:
    ```powershell
    flutter run
    ```

---

### 6.2 Testing Camera, Media Capture, & Reels
1. Open Jibble on your phone.
2. Tap the **+ Post** or **Reels Upload** button.
3. Verify that the Android System OS prompts: *"Allow Jibble to access camera and microphone?"*
4. Tap **While using the app**.
5. Record a 5-second video, attach a caption, and verify smooth preview playback.

---

### 6.3 Testing Background Push Notifications
1. With your phone connected, run the Flutter app so your FCM Token is registered.
2. Open Firebase Console ➔ **Engage** ➔ **Messaging**.
3. Click **Create your first campaign** ➔ Select **Firebase Notification messages**.
4. Enter Notification Title: `Test Jibble Alert`
5. Enter Notification Text: `Hello from Firebase! Real-time notifications are working.`
6. Click **Send test message**.
7. Press the **Home** button on your Android phone so Jibble goes to the background.
8. Paste your device FCM registration token into Firebase and click **Test**.
9. Verify that a push notification banner pops up at the top of your Android phone screen!

---

## APPENDIX: MASTER ENVIRONMENT VARIABLES CHEATSHEET

Below is a reference guide for all variables used across the Jibble workspace:

| Variable Name | Environment | Description | Example Value |
| :--- | :--- | :--- | :--- |
| `PORT` | `backend/.env` | Core Backend HTTP/Socket Port | `5000` |
| `DATABASE_URL` | `backend/.env` | Neon PostgreSQL Connection String | `postgresql://username:password@ep-sample-12345.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |
| `REDIS_URL` | `backend/.env` | Upstash Cloud Redis Connection URL | `rediss://default:...@upstash.io:6379` |
| `JWT_SECRET` | `backend/.env` | Secret key for signing auth tokens | `super_secret_key_string` |
| `AWS_ACCESS_KEY_ID` | `backend/.env` | S3 IAM User Access Key | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | `backend/.env` | S3 IAM User Secret Key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_S3_BUCKET_NAME` | `backend/.env` | S3 Media Upload Bucket Name | `jibble-media-storage-prod` |
| `FIREBASE_PROJECT_ID` | `backend/.env` | Firebase Project Identifier | `jibble-app-12345` |
| `FIREBASE_SERVER_KEY` | `backend/.env` | Firebase Messaging Server Key | `AAAAxxxx:APA91b...` |

---

> [!TIP]
> **CONGRATULATIONS!** You now possess the complete, ultimate step-by-step external setup guide tailored specifically to AWS S3, Neon PostgreSQL, Upstash Redis, and Firebase. Keep this document handy whenever setting up new environments!
