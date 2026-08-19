// קטלוג הציוד — מבנה קבוע (שם, קטגוריה, האם יש שדה כמות).
// כמויות המלאי בפועל נמצאות בקובץ data/inventory.json ונערכות מפאנל הניהול.
const EQUIPMENT_CATALOG = [
  {
    category: "cameras",
    title: "📷 מצלמות ועדשות",
    items: [
      { id: "cam_s3", name: "מצלמת סוני אלפא 7S III (כיתה יב)", qtyField: false },
      { id: "cam_r3", name: "מצלמת סוני אלפא 7R III (כיתה יא)", qtyField: false },
      { id: "cam_blackmagic", name: "מצלמת Blackmagic (כולל עדשה 35מ״מ)", qtyField: false },
      { id: "cam_audition", name: "מצלמת אודישנים (עם סאונד מובנה)", qtyField: false },
      { id: "cam_junior", name: "מצלמת חטיבה (קאנון/פנסוניק)", qtyField: true },
      { id: "camera_bag", name: "תיק מצלמה", qtyField: true },
      { id: "cage", name: "כלוב (+מפתח)", qtyField: true },
      { id: "cards", name: "כרטיסי זיכרון", qtyField: true },
      { id: "charger", name: "מטען סוני (בודד)", qtyField: true },
      { id: "charger_sony_dual", name: "מטען כפול סוני", qtyField: true },
      { id: "lens2470", name: "עדשה זום 24-70 (אוטומטית)", qtyField: false },
      { id: "lens2470_manual", name: "עדשה זום 24-70 (ידנית)", qtyField: false },
      { id: "lens2870", name: "עדשה זום 28-70", qtyField: false },
      { id: "lens2860", name: "עדשה זום 28-60 (צמצם קבוע ~f/5.6)", qtyField: false },
      { id: "lens50", name: "עדשה פריים 50", qtyField: false },
      { id: "lens70180", name: "עדשה זום 70-180", qtyField: false },
      { id: "filter", name: "פילטר ND/UV", qtyField: true }
    ]
  },
  {
    category: "sound",
    title: "🎙️ סאונד והקלטה",
    items: [
      { id: "zoom_h4_essential", name: "Zoom H4n Essential", qtyField: true },
      { id: "zoom_h4_pro", name: "Zoom H4n Pro", qtyField: false },
      { id: "zoom", name: "מכשיר הקלטה נוסף (Zoom — דגם ישן, לאימות)", qtyField: false },
      { id: "sound_bag_large", name: "תיק סאונד גדול", qtyField: false },
      { id: "sound_bag_medium", name: "תיק סאונד בינוני", qtyField: false },
      { id: "sound_bag_small", name: "תיק סאונד קטן", qtyField: true },
      { id: "condenser", name: "מיקרופון קונדנסר", qtyField: true },
      { id: "boom", name: "מקל בום", qtyField: true },
      { id: "boom_stand", name: "מוט/סטנד לבומים", qtyField: true },
      { id: "mic_stand", name: "חצובת מיקרופון", qtyField: true },
      { id: "deadcat", name: "כיסוי שפן/רוח", qtyField: true },
      { id: "xlr_cable", name: "כבל XLR", qtyField: true },
      { id: "headphones", name: "אוזניות", qtyField: true },
      { id: "extra_mic_set", name: "➕ סט מיקרופון נוסף (קונדנסר/כבל/אוזניות)", qtyField: false },
      { id: "junior_sound_kit", name: "ערכת סאונד לחטיבה (בתיק)", qtyField: false }
    ]
  },
  {
    category: "lighting",
    title: "💡 תאורה, מוניטורים וסוללות",
    items: [
      { id: "monitor_small", name: "מוניטור קטן + זרוע", qtyField: false },
      { id: "monitor_big", name: "מוניטור גדול בקייס", qtyField: false },
      { id: "led_big_new", name: "לד גדול חדש (מזוודה)", qtyField: true },
      { id: "led_big_old", name: "לד גדול ישן", qtyField: true },
      { id: "led_med_1", name: "לד בינוני (תיק) 1", qtyField: true },
      { id: "led_med_2", name: "לד בינוני (תיק) 2", qtyField: true },
      { id: "led_small_bag", name: "לד קטן", qtyField: true },
      { id: "light_batteries", name: "סוללות לתאורה (ממוספרות 1-18, #15 חסרה)", qtyField: true },
      { id: "v_lock_bat", name: "סוללות V-lock", qtyField: true },
      { id: "light_charger_dual", name: "מטען כפול לסוללות תאורה", qtyField: true },
      { id: "v_lock_charger_dual", name: "מטען כפול לסוללות V-lock", qtyField: true },
      { id: "gel_orange", name: "ג'לטינים כתום + תנינים", qtyField: false },
      { id: "gel_color", name: "ג'לטינים צבעוני + תנינים", qtyField: false },
      { id: "gel_clips", name: "תנינים / קליפסים נוספים לג'לטין", qtyField: true },
      { id: "tripod_light_new", name: "חצובת תאורה חדשה", qtyField: true },
      { id: "tripod_light_big", name: "חצובת תאורה גדולה", qtyField: true },
      { id: "tripod_light_medium", name: "חצובת תאורה בינונית", qtyField: true },
      { id: "tripod_light_small", name: "חצובת תאורה קטנה", qtyField: true }
    ]
  },
  {
    category: "grip",
    title: "🔧 חצובות, אחיזה וגריפ",
    items: [
      { id: "tripod_cam", name: "חצובת מצלמה", qtyField: true },
      { id: "softstand", name: "סטנד ריכוך", qtyField: true },
      { id: "grip_stands", name: "גריפ סטנדס", qtyField: true },
      { id: "grip_extension", name: "מרחק לגריפ (מוט הארכה)", qtyField: true },
      { id: "sandbags", name: "שקי חול", qtyField: true },
      { id: "shoulder", name: "תיק מכתוף", qtyField: false },
      { id: "shoulder_rig_plastic", name: "מכתוף פלסטיק", qtyField: true },
      { id: "shoulder_rig_metal", name: "מכתוף מתכת", qtyField: true },
      { id: "gimbal", name: "גימבל", qtyField: false },
      { id: "dolly", name: "דולי + פסים/קושרת", qtyField: false },
      { id: "extension", name: "כבל מאריך/תוף", qtyField: true },
      { id: "clamp", name: "קלפ צילום", qtyField: true }
    ]
  }
];

function findItemMeta(id) {
  for (const cat of EQUIPMENT_CATALOG) {
    const found = cat.items.find(i => i.id === id);
    if (found) return found;
  }
  return null;
}
