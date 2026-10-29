# Poojra Silvassa - Google Sheet Setup Guide (Sirf 1 Minute)

Aapka poora Spin & Win lead data (**Customer Name**, **Mobile Number**, **Brand Name**, **Prize Won**, aur **Coupon Code**) seedha aapki is Google Sheet me jayega:

🔗 **Aapki Google Sheet Link:**  
**[https://docs.google.com/spreadsheets/d/1EX0eqM7-8atPIc57zaOmJOoG0V6zPe7Ovl04laMRH1M/edit](https://docs.google.com/spreadsheets/d/1EX0eqM7-8atPIc57zaOmJOoG0V6zPe7Ovl04laMRH1M/edit)**

---

### Step 1: Apni Sheet Me Apps Script Kholein
1. Apni upar di gayi Google Sheet open karein.
2. Top Menu bar me click karein: **Extensions** > **Apps Script** (jiska icon orange `</>` hota hai).

---

### Step 2: Code Paste Karein
1. Apps Script editor me jo bhi code dikhe use pura delete kar dein (Ctrl + A dabakar Delete).
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
7. Is Web app URL ko copy kar lijiye aur chat me bhej dijiye (ya website par paste kar dein)!

---

### ✅ Result:
- Jaise hi koi customer wheel ghumayega aur apna Name, Mobile Number, aur Brand bharega, wo entry **seedha aapki sheet me exact Name, Mobile Number, Brand columns me add ho jayegi**!
