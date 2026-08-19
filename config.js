// ==== הגדרות שיש לערוך לפני פרסום האתר ====

// שם המשתמש/ארגון והריפו בגיטהאב שבו יעלה האתר (למשל אם הכתובת היא
// https://kolnoa-revivim-rashlaz.github.io/ziud/ אז:
//   GITHUB_OWNER = "kolnoa-revivim-rashlaz"
//   GITHUB_REPO  = "ziud"
const GITHUB_OWNER = "REPLACE_ME_OWNER";
const GITHUB_REPO = "REPLACE_ME_REPO";

// טוקן "בוט" ציבורי המשמש רק ליצירת בקשות (Issues) חדשות מהאתר הציבורי.
// ליצירה: github.com -> Settings -> Developer settings -> Fine-grained tokens
// הרשאות: Repository permissions -> Issues: Read and write. שום הרשאה אחרת!
// חשוב: טוקן זה גלוי לכל מי שרואה את קוד המקור של האתר (זו מגבלה של אתר
// סטטי בלי שרת). לכן הוא מוגבל *רק* ל-Issues של הריפו הזה — במקרה הגרוע
// מישהו יכול ליצור/להעיר על issues, אבל לא לגעת בקוד, בקבצים או במלאי.
const GITHUB_BOT_TOKEN = "REPLACE_ME_BOT_TOKEN";

// קישור לתקנון השאלת הציוד (חוזה שהתלמיד מתחייב לו בכל בקשה ובכל איסוף).
// חשוב: יש לוודא שהקישור פתוח לצפייה לכל מי שיש לו את הקישור
// (Google Docs -> Share -> "Anyone with the link" -> Viewer),
// אחרת התלמידים לא יוכלו לקרוא את מה שהם חותמים עליו.
const RULES_DOC_URL = "https://docs.google.com/document/d/1k6x4emuOsE8J7bWiUCVi5Iec4zoIHgzJE7Xtk72cfl4/edit?tab=t.0";
