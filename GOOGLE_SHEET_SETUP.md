# Poojra Silvassa - Google Sheet Setup & Deployment Guide

This guide explains how to connect the **Poojra Silvassa Spinning Wheel Landing Page** to your specific Google Sheet.

- **Spreadsheet ID:** `1-X2xESGDHWeRGhBrs6UW4himc7y8Ks-i3G8IJxGbMWY`
- **Spreadsheet URL:** [https://docs.google.com/spreadsheets/d/1-X2xESGDHWeRGhBrs6UW4himc7y8Ks-i3G8IJxGbMWY/edit?usp=drivesdk](https://docs.google.com/spreadsheets/d/1-X2xESGDHWeRGhBrs6UW4himc7y8Ks-i3G8IJxGbMWY/edit?usp=drivesdk)

---

## 1. Google Sheets Target Columns

The script records each submission in the first worksheet into the following columns:
1. **Timestamp** (e.g., `29/10/2026 15:30:00`)
2. **Full Name** (Customer's Name)
3. **Mobile Number** (10-digit Indian Mobile Number)
4. **Brand Name** (Purchased Mobile Brand/Model)
5. **Spin Result** (Reward Won from the Wheel)

*Note: If your sheet already contains columns like `Name`, `Number`, `Brand`, the script automatically detects and preserves them, placing values in the matching columns without deleting or modifying any existing data.*

---

## 2. Deploy Google Apps Script (Step-by-Step)

### Step 1: Open Apps Script in Your Spreadsheet
1. Open your Google Sheet:  
   **[https://docs.google.com/spreadsheets/d/1-X2xESGDHWeRGhBrs6UW4himc7y8Ks-i3G8IJxGbMWY/edit](https://docs.google.com/spreadsheets/d/1-X2xESGDHWeRGhBrs6UW4himc7y8Ks-i3G8IJxGbMWY/edit)**
2. In the top menu, click **Extensions** > **Apps Script**.

### Step 2: Paste the Backend Code
1. In the Apps Script code editor, delete any existing code (press `Ctrl + A` then `Delete`).
2. Copy the entire contents of [`google_apps_script.js`](./google_apps_script.js) from this repository and paste it into the editor.
3. Press **Ctrl + S** (or click the disk icon) to save the script.

### Step 3: Deploy as a Web App
1. At the top-right corner, click **Deploy** > **New deployment**.
2. Click the gear icon (**Select type**) next to "Select type" and choose **Web app**.
3. Configure the deployment settings:
   - **Description:** `Poojra Silvassa Wheel Webhook`
   - **Execute as:** `Me (your Google email)`
   - **Who has access:** **`Anyone`** ⚠️ *(CRITICAL: Must be "Anyone" so the landing page can record customer entries without requiring customers to log in).*
4. Click **Deploy**.

### Step 4: Authorize Google Permissions
1. Click **Authorize access**.
2. Choose your Google account.
3. If Google shows *"Google hasn't verified this app"*:
   - Click **Advanced** (at the bottom-left).
   - Click **Go to Poojra Silvassa Webhook (unsafe)**.
   - Click **Allow**.
4. Once deployment succeeds, Google will display your **Web app URL**:
   `https://script.google.com/macros/s/AKfycb.../exec`
5. Copy this URL!

---

## 3. Connect the Web App URL to Your Landing Page

You have two easy ways to insert the URL:

### Method A: Directly via the Landing Page (Instant - No Code Edit Required)
1. Open the landing page (`http://localhost:8080/` or your live URL).
2. Spin the wheel to open the Winner Modal.
3. Click the link at the bottom: **⚙️ Setup / Change Google Sheet Link**.
4. Paste your Web App `/exec` URL and click **OK**.
5. Done! All future submissions will go directly to your spreadsheet.

### Method B: In `index.html` (Permanent)
1. Open `index.html`.
2. Locate line **1197**:
   ```javascript
   const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'` with your actual deployed URL:
   ```javascript
   const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYED_ID/exec';
   ```
4. Save the file.

---

## 4. Verification Test

To verify that the complete data flow is working:
1. Open the landing page and click **SPIN NOW**.
2. When the wheel stops and the registration form appears, fill in:
   - **Full Name:** `Himanshu`
   - **Mobile Number:** `9328603748`
   - **Brand Name:** `IPHONE`
3. Click **🎁 Submit Now**.
4. The button will show `⏳ Submitting to Sheet...`.
5. Upon confirmation from your Apps Script backend, the modal switches to the **Claim Registered!** success card.
6. Open your Google Sheet:
   A new row will be present with `Himanshu`, `9328603748`, `IPHONE`, the exact prize won, and timestamp!
