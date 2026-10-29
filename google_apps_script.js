/**
 * ============================================================================
 * POOJRA SILVASSA - GOOGLE APPS SCRIPT FOR SPIN & WIN FESTIVE LEADS
 * ============================================================================
 * Target Google Sheet URL:
 * https://docs.google.com/spreadsheets/d/1-X2xESGDHWeRGhBrs6UW4himc7y8Ks-i3G8IJxGbMWY/edit
 * 
 * Target Sheet ID: 1-X2xESGDHWeRGhBrs6UW4himc7y8Ks-i3G8IJxGbMWY
 * ============================================================================
 * 
 * SETUP INSTRUCTIONS (Sirf 1 Minute):
 * -----------------------------------
 * 1. Apni di gayi Google Sheet open karein:
 *    https://docs.google.com/spreadsheets/d/1-X2xESGDHWeRGhBrs6UW4himc7y8Ks-i3G8IJxGbMWY/edit
 * 
 * 2. Top menu me "Extensions" > "Apps Script" par click karein.
 * 
 * 3. Wahan jo bhi pehle se code likha ho use delete (Ctrl + A -> Delete) karein,
 *    aur yeh pura code paste kar dein.
 * 
 * 4. Ctrl + S dabakar save karein.
 * 
 * 5. Top-right corner me blue "Deploy" button > "New deployment" par click karein.
 * 
 * 6. Left side gear icon (Select type) me "Web app" choose karein:
 *    - Description: "Poojra Spin Leads"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" ⚠️ (ZAROORI: "Anyone" hi select karein)
 * 
 * 7. Click "Deploy" > "Authorize access" > apna Google account select karein >
 *    "Advanced" > "Go to Poojra Leads (unsafe)" > "Allow".
 * 
 * 8. Deployment complete hone par aapko ek Web App URL milega:
 *    (e.g., https://script.google.com/macros/s/AKfycb.../exec)
 * 
 * 9. Yeh URL copy karke index.html me GOOGLE_SHEET_URL me paste kar dein!
 * ============================================================================
 */

// Target Sheet ID
var SPREADSHEET_ID = "1-X2xESGDHWeRGhBrs6UW4himc7y8Ks-i3G8IJxGbMWY";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc;
    try {
      doc = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (err) {
      doc = SpreadsheetApp.getActiveSpreadsheet();
    }
    
    var sheet = doc.getActiveSheet();

    // 1. Agar sheet blank hai toh Header Row banayein
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Customer Name",
        "Contact Number",
        "Konsa Mobile Liya (Purchased Model)",
        "Prize Won",
        "Coupon Code",
        "Store Location",
        "Status"
      ]);

      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setBackground("#070A2B");
      headerRange.setFontColor("#F5C542");
      headerRange.setFontWeight("bold");
      headerRange.setFontSize(11);
      sheet.setFrozenRows(1);
    }

    // 2. Data Parse karein (JSON aur Form URL-encoded dono supported)
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    var timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var name = data.name || data.cust_name || "N/A";
    var phone = data.phone || data.contact || "N/A";
    var mobileModel = data.mobile_model || data.mobileModel || "N/A";
    var prize = data.prize || data.prize_name || "N/A";
    var coupon = data.coupon || data.coupon_code || "N/A";
    var store = data.store || "Poojra Silvassa";

    // 3. New Entry Append karein
    sheet.appendRow([
      timestamp,
      name,
      "'" + phone, // Apostrophe prevents dropping leading zero in Google Sheets
      mobileModel,
      prize,
      coupon,
      store,
      "New Claim"
    ]);

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 8).setVerticalAlignment("middle");

    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        row: lastRow,
        spreadsheetId: SPREADSHEET_ID,
        message: "Lead recorded in Poojra Silvassa Sheet successfully!"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("Poojra Silvassa Webhook is ACTIVE for Sheet: " + SPREADSHEET_ID)
    .setMimeType(ContentService.MimeType.TEXT);
}
