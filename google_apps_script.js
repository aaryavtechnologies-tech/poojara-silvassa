/**
 * ============================================================================
 * POOJRA SILVASSA - GOOGLE APPS SCRIPT WEBHOOK
 * ============================================================================
 * Target Google Sheet:
 * https://docs.google.com/spreadsheets/d/1EX0eqM7-8atPIc57zaOmJOoG0V6zPe7Ovl04laMRH1M/edit
 * 
 * Target Sheet ID: 1EX0eqM7-8atPIc57zaOmJOoG0V6zPe7Ovl04laMRH1M
 * Columns: Name | Mobile Number | Brand | Prize Won | Coupon Code | Timestamp
 * ============================================================================
 */

var SPREADSHEET_ID = "1EX0eqM7-8atPIc57zaOmJOoG0V6zPe7Ovl04laMRH1M";

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

    // Headers check (matches user's columns: Name, Mobile Number, Brand)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Name",
        "Mobile Number",
        "Brand",
        "Prize Won",
        "Coupon Code",
        "Timestamp"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setBackground("#070A2B");
      headerRange.setFontColor("#F5C542");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    } else if (sheet.getLastColumn() < 6) {
      sheet.getRange(1, 4, 1, 3).setValues([["Prize Won", "Coupon Code", "Timestamp"]]);
      var extraHeader = sheet.getRange(1, 4, 1, 3);
      extraHeader.setBackground("#070A2B");
      extraHeader.setFontColor("#F5C542");
      extraHeader.setFontWeight("bold");
    }

    // Parse Data from Website (support JSON or URLSearchParams)
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
    var phone = data.phone || data.contact || data.number || data.mobile_number || "N/A";
    var brand = data.brand || data.mobile_model || data.mobileModel || "N/A";
    var prize = data.prize || data.prize_name || "N/A";
    var coupon = data.coupon || data.coupon_code || "N/A";

    // Row append directly into user's columns:
    // Col A: Name
    // Col B: Mobile Number
    // Col C: Brand
    // Col D: Prize Won
    // Col E: Coupon Code
    // Col F: Timestamp
    sheet.appendRow([
      name,
      "'" + phone, // Apostrophe preserves full 10-digit number
      brand,
      prize,
      coupon,
      timestamp
    ]);

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 6).setVerticalAlignment("middle");

    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        row: lastRow,
        data: { name: name, phone: phone, brand: brand, prize: prize, coupon: coupon }
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
