/* ==========================================================================
   Curious Katie – contact form script
   This runs in Google Apps Script, not on the website. It receives the
   Contact page form, saves each message as a row in your Google Sheet,
   emails you the details, and sends the person a short thank-you note.
   Setup steps are in README.md under "Your contact form".
   ========================================================================== */

// ---------- Things you might want to change ----------

// Where new-message emails are sent
var KATIE_EMAIL = "kmaygroves@gmail.com";

// The name people see on the thank-you email
var SENDER_NAME = "Katie at Curious Katie";

// The thank-you email. {name} is replaced with the person's first name.
var AUTO_REPLY_SUBJECT = "Thanks for reaching out";
var AUTO_REPLY_BODY = [
  "Hi {name},",
  "",
  "Thank you for getting in touch. I'm glad you're here.",
  "",
  "I'll be in touch within a couple of days to find a time for your free 30-minute intro call. There's nothing you need to prepare. We'll simply talk about what's going on for you and whether working together feels right.",
  "",
  "Warmly,",
  "Katie",
  "Curious Katie – Body Explorations"
].join("\n");

// The tab in your Google Sheet where messages are saved
var SHEET_NAME = "Messages";

var HEADERS = [
  "Received",
  "Name",
  "Email",
  "What they'd like support with",
  "Times that suit them",
  "How they found me"
];

// ---------- The workings (no need to edit below here) ----------

var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Run this once from the Apps Script editor. It adds the column headings
// and asks Google for permission to use your Sheet and send email.
function setUp() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  PropertiesService.getScriptProperties().setProperty("SHEET_ID", spreadsheet.getId());
  Logger.log("All set. Messages will be saved to the \"" + SHEET_NAME + "\" tab.");
}

// Visiting the web app address in a browser shows this, which is a quick
// way to check the script is deployed
function doGet() {
  return ContentService.createTextOutput("The Curious Katie contact form is running.");
}

// The Contact page sends each message here
function doPost(e) {
  var params = (e && e.parameter) || {};
  // The page's script adds js=1 and reads the reply itself. Without it,
  // the visitor's browser came straight here and needs a page to read.
  var fromScript = params.js === "1";
  var result;
  try {
    result = handleMessage(params);
  } catch (err) {
    console.error(err);
    result = { ok: false, error: "server" };
  }
  return respond(fromScript, result);
}

function handleMessage(params) {
  // Spam bots fill in the hidden "website" box. Act as if it worked.
  if (params.website) return { ok: true };

  var message = {
    name: clean(params.name, 200, false),
    email: clean(params.email, 254, false),
    support: clean(params.support, 5000, true),
    times: clean(params.times, 1000, true),
    found: clean(params.found, 500, false)
  };
  if (!message.name || !EMAIL_PATTERN.test(message.email)) {
    return { ok: false, error: "invalid" };
  }

  saveToSheet(message);
  emailKatie(message);
  sendAutoReply(message);
  return { ok: true };
}

function saveToSheet(message) {
  var sheetId = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
  if (!sheetId) throw new Error("Run setUp() once before deploying.");
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(SHEET_NAME);

  // One message at a time, so two arriving together don't overwrite each other
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet.appendRow([
      new Date(),
      asText(message.name),
      asText(message.email),
      asText(message.support),
      asText(message.times),
      asText(message.found)
    ]);
  } finally {
    lock.releaseLock();
  }
}

function emailKatie(message) {
  MailApp.sendEmail({
    to: KATIE_EMAIL,
    replyTo: message.email,
    subject: "New intro call request from " + message.name,
    body: [
      "Someone sent a message through your Contact page. Reply to this email to answer them.",
      "",
      "Name: " + message.name,
      "Email: " + message.email,
      "",
      "What they'd like support with:",
      message.support || "(left blank)",
      "",
      "Times that suit them:",
      message.times || "(left blank)",
      "",
      "How they found you:",
      message.found || "(left blank)"
    ].join("\n")
  });
}

function sendAutoReply(message) {
  // Only one thank-you per address every 6 hours, so the form can't be
  // used to flood someone's inbox
  var cache = CacheService.getScriptCache();
  var key = "replied-" + Utilities.base64Encode(
    Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, message.email.toLowerCase())
  );
  if (cache.get(key)) return;
  cache.put(key, "1", 6 * 60 * 60);

  MailApp.sendEmail({
    to: message.email,
    replyTo: KATIE_EMAIL,
    name: SENDER_NAME,
    subject: AUTO_REPLY_SUBJECT,
    body: AUTO_REPLY_BODY.replace(/\{name\}/g, message.name.split(" ")[0])
  });
}

function respond(fromScript, result) {
  if (fromScript) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: result.ok, error: result.error || null }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  var text = result.ok
    ? "Thank you, your message is on its way. I'll be in touch within a couple of days."
    : "Sorry, your message didn't send. Please go back and try again, or email me at " + KATIE_EMAIL + ".";
  return HtmlService
    .createHtmlOutput('<p style="font-family: sans-serif; font-size: 18px; max-width: 34em; margin: 3em auto; padding: 0 20px;">' + text + "</p>")
    .setTitle("Curious Katie");
}

// Trims a form answer and caps its length. Single-line answers also lose
// any line breaks, so they can't break the email subject line.
function clean(value, maxLength, multiline) {
  var text = String(value || "").trim();
  if (!multiline) text = text.replace(/\s+/g, " ");
  return text.slice(0, maxLength);
}

// Stops Google Sheets treating an answer like "=SUM(...)" as a formula
function asText(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}
