# Poojra Silvassa - Google Sheet Setup Guide (Sirf 1 Minute)

Aapka poora Spin & Win lead data (**Customer Name**, **Contact Number**, **Konsa Mobile Liya Hai**, **Prize Won**, aur **Coupon Code**) seedha aapki is Google Sheet me jayega:

🔗 **Aapki Google Sheet Link:**  
**[https://docs.google.com/spreadsheets/d/1-X2xESGDHWeRGhBrs6UW4himc7y8Ks-i3G8IJxGbMWY/edit](https://docs.google.com/spreadsheets/d/1-X2xESGDHWeRGhBrs6UW4himc7y8Ks-i3G8IJxGbMWY/edit)**

---

### Step 1: Apni Sheet Me Apps Script Kholein
1. Apni upar di gayi Google Sheet open karein.
2. Top Menu bar me click karein: **Extensions** > **Apps Script**.

---

### Step 2: Code Paste Karein
1. Apps Script editor me jo bhi default code dikhe use pura delete kar dein (Ctrl + A dabakar Delete).
2. Hamare project me di gayi file [`google_apps_script.js`](./google_apps_script.js) ka pura code copy karein aur wahan paste kar dein.
3. **Ctrl + S** dabakar save karein.

---

### Step 3: Web App Deploy Karein (Zaroori Step)
1. Top-right corner me blue **Deploy** button par click karein > **New deployment**.
2. Left side me **Gear icon (Select type)** par click karein aur **Web app** select karein.
3. Settings me:
   - **Description:** `Poojra Silvassa Leads Webhook`
   - **Execute as:** `Me (apna email)`
   - **Who has access:** **`Anyone`** ⚠️ *(Zaroor "Anyone" select karein, taaki customers bina Google login ke data bhej sakein)*
4. Click **Deploy**.
5. Google permission maangega:
   - Click **Authorize access**
   - Apna Google account select karein
   - Agar *"Google hasn't verified this app"* screen aaye toh click karein **Advanced** (niche chhota sa likha hota hai)
   - Click **Go to Poojra Leads (unsafe)**
   - Click **Allow**
6. Deployment complete hone par aapko ek **Web app URL** milega:
   `https://script.google.com/macros/s/AKfycb.../exec`
7. Is Web app URL ko copy kar lijiye!

---

### Step 4: URL Website me Dalein
1. `index.html` file me line 1178 par apna copy kiya hua Web app URL paste kar dein:
   ```javascript
   const GOOGLE_SHEET_URL = 'PASTE_YOUR_COPIED_WEB_APP_URL_HERE';
   ```
   *(Ya aap browser console me direct `setGoogleSheetUrl("PASTE_YOUR_URL")` bhi chala sakte hain).*

---

### ✅ Result:
- Jaise hi koi customer wheel ghumayega aur apna Name, Contact Number, aur Konsa Mobile Liya Hai bharega, wo entry **seedha aapki sheet `1-X2xESGDHWeRGhBrs6UW4himc7y8Ks-i3G8IJxGbMWY` me new row ban kar add ho jayegi**!
