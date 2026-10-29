/**
 * ============================================================================
 * POOJRA SILVASSA - GOOGLE APPS SCRIPT WEBHOOK FOR SPIN & WIN
 * ============================================================================
 * Target Spreadsheet ID: 1-X2xESGDHWeRGhBrs6UW4himc7y8Ks-i3G8IJxGbMWY
 * Target Spreadsheet URL:
 * https://docs.google.com/spreadsheets/d/1-X2xESGDHWeRGhBrs6UW4himc7y8Ks-i3G8IJxGbMWY/edit?usp=drivesdk
 *
 * Required Target Columns in the First Worksheet:
 * 1. Timestamp
 * 2. Full Name
 * 3. Mobile Number
 * 4. Brand Name
 * 5. Spin Result
 * ============================================================================
 */

// Target Google Sheet ID - Exact ID specified for Poojra Silvassa
var SPREADSHEET_ID = "1-X2xESGDHWeRGhBrs6UW4himc7y8Ks-i3G8IJxGbMWY";

/**
 * Handles HTTP POST requests from the Spinning Wheel landing page form
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 15 seconds to safely handle concurrent submissions without race conditions
  if (!lock.tryLock(15000)) {
    return createJsonResponse({
      status: "error",
      message: "Server is currently busy with another submission. Please retry in a few moments."
    });
  }

  try {
    // 1. Open Target Spreadsheet by explicit ID
    var doc;
    try {
      doc = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (openErr) {
      // Fallback if bound directly as container script
      doc = SpreadsheetApp.getActiveSpreadsheet();
    }

    if (!doc) {
      return createJsonResponse({
        status: "error",
        message: "Spreadsheet could not be opened. Please check spreadsheet ID: " + SPREADSHEET_ID
      });
    }

    // Always use the first worksheet
    var sheet = doc.getSheets()[0];

    // 2. Parse Incoming Payload (supports application/x-www-form-urlencoded and JSON)
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // 3. Extract and Validate Mandatory Fields
    var name = (data.fullName || data.name || data.full_name || data["Full Name"] || "").toString().trim();
    var phone = (data.mobileNumber || data.phone || data.mobile || data.number || data["Mobile Number"] || "").toString().trim();
    var brand = (data.brandName || data.brand || data.mobile_model || data["Brand Name"] || "").toString().trim();
    var spinResult = (data.spinResult || data.prize || data.prize_name || data["Spin Result"] || "Spin Reward").toString().trim();
    var submissionId = (data.submissionId || data.coupon || "").toString().trim();

    // Validation Rule 1: Full Name (min 2 characters)
    if (!name || name.length < 2) {
      return createJsonResponse({
        status: "error",
        message: "Validation Error: Full Name is required (minimum 2 characters)."
      });
    }

    // Validation Rule 2: Mobile Number (10-digit Indian Mobile Validation)
    var cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length === 12 && cleanPhone.indexOf("91") === 0) {
      cleanPhone = cleanPhone.substring(2);
    }
    if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return createJsonResponse({
        status: "error",
        message: "Validation Error: Mobile Number must be a valid 10-digit Indian mobile number."
      });
    }

    // Validation Rule 3: Brand Name (min 2 characters)
    if (!brand || brand.length < 2) {
      return createJsonResponse({
        status: "error",
        message: "Validation Error: Brand Name of phone is required."
      });
    }

    // Generate formatted timestamp in Indian Standard Time (IST)
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss");

    // 4. Duplicate Check (Check recent 25 rows to prevent network retry duplicates)
    var lastRow = sheet.getLastRow();
    var lastCol = Math.max(sheet.getLastColumn(), 1);

    if (lastRow > 1) {
      var checkLimit = Math.min(25, lastRow - 1);
      var recentValues = sheet.getRange(lastRow - checkLimit + 1, 1, checkLimit, lastCol).getValues();
      for (var r = recentValues.length - 1; r >= 0; r--) {
        var rowText = recentValues[r].join(" ");
        // If unique coupon/submissionId matches, or same phone registered recently
        if (submissionId && rowText.indexOf(submissionId) !== -1) {
          return createJsonResponse({
            status: "success",
            message: "Duplicate submission ignored; ticket already recorded.",
            row: lastRow - checkLimit + 1 + r,
            duplicateIgnored: true
          });
        }
      }
    }

    // 5. Intelligent Header Mapping & Preservation of Existing Data
    // Target columns: Timestamp, Full Name, Mobile Number, Brand Name, Spin Result
    if (lastRow === 0) {
      // Worksheet is completely empty: set initial headers
      sheet.appendRow(["Timestamp", "Full Name", "Mobile Number", "Brand Name", "Spin Result"]);
      var headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setBackground("#070A2B");
      headerRange.setFontColor("#F5C542");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
      lastRow = 1;
      lastCol = 5;
    }

    // Read current row 1 headers
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) {
      return (h || "").toString().trim();
    });

    var colIndex = {
      timestamp: -1,
      name: -1,
      phone: -1,
      brand: -1,
      spinResult: -1
    };

    for (var i = 0; i < headers.length; i++) {
      var h = headers[i].toLowerCase();
      if (/time|date/.test(h) && colIndex.timestamp === -1) colIndex.timestamp = i;
      else if (/full\s*name|customer|name/.test(h) && colIndex.name === -1) colIndex.name = i;
      else if (/mobile|number|phone|contact/.test(h) && colIndex.phone === -1) colIndex.phone = i;
      else if (/brand|model/.test(h) && colIndex.brand === -1) colIndex.brand = i;
      else if (/spin|result|prize|reward/.test(h) && colIndex.spinResult === -1) colIndex.spinResult = i;
    }

    // If existing sheet has missing target columns, safely append headers without altering existing columns
    if (colIndex.name === -1) {
      headers.push("Full Name");
      colIndex.name = headers.length - 1;
      sheet.getRange(1, headers.length).setValue("Full Name");
    }
    if (colIndex.phone === -1) {
      headers.push("Mobile Number");
      colIndex.phone = headers.length - 1;
      sheet.getRange(1, headers.length).setValue("Mobile Number");
    }
    if (colIndex.brand === -1) {
      headers.push("Brand Name");
      colIndex.brand = headers.length - 1;
      sheet.getRange(1, headers.length).setValue("Brand Name");
    }
    if (colIndex.spinResult === -1) {
      headers.push("Spin Result");
      colIndex.spinResult = headers.length - 1;
      sheet.getRange(1, headers.length).setValue("Spin Result");
    }
    if (colIndex.timestamp === -1) {
      headers.push("Timestamp");
      colIndex.timestamp = headers.length - 1;
      sheet.getRange(1, headers.length).setValue("Timestamp");
    }

    // Construct the new row array perfectly aligned with header positions
    var newRow = new Array(headers.length).fill("");
    newRow[colIndex.timestamp] = timestamp;
    newRow[colIndex.name] = name;
    newRow[colIndex.phone] = "'" + cleanPhone; // Single quote prevents scientific notation / digit truncation
    newRow[colIndex.brand] = brand;
    newRow[colIndex.spinResult] = spinResult;

    // 6. Append New Customer Row
    sheet.appendRow(newRow);
    var newLastRow = sheet.getLastRow();
    sheet.getRange(newLastRow, 1, 1, newRow.length).setVerticalAlignment("middle");

    // 7. Return Verified Success JSON
    return createJsonResponse({
      status: "success",
      message: "Customer entry added successfully to Google Sheet.",
      row: newLastRow,
      data: {
        timestamp: timestamp,
        name: name,
        phone: cleanPhone,
        brand: brand,
        spinResult: spinResult
      }
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "Server Error: " + error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handles HTTP GET requests - used to quickly test if the Web App is alive
 */
function doGet(e) {
  return createJsonResponse({
    status: "active",
    message: "Poojra Silvassa Webhook is ACTIVE",
    targetSpreadsheetId: SPREADSHEET_ID,
    timestamp: Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss")
  });
}

/**
 * Helper to produce standard JSON responses with appropriate headers
 */
function createJsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
