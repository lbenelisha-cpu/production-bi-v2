# מעקב מכולות v0.5 — שמירה בענן

## מה חדש
- שמירה משותפת ב-Supabase.
- טעינה אוטומטית מהענן בפתיחת האפליקציה.
- רענון אוטומטי כל 15 שניות.
- מחיקה מהענן.
- שמירת תאריך ושעה בעת יצירת התנועה.
- האיתורים ממשיכים להיבנות אוטומטית מהנתונים.
- יצוא לאקסל לפי המסנן המוצג.

## התקנה
1. ב-Supabase פתח SQL Editor.
2. הרץ את הקובץ `supabase.sql`.
3. ב-Supabase פתח Project Settings > API.
4. העתק את Project URL ואת anon/public key.
5. פתח את `config.js` והחלף:
   - `https://YOUR-PROJECT.supabase.co`
   - `YOUR_SUPABASE_ANON_KEY`
6. העלה את כל 4 הקבצים ל-Netlify:
   - index.html
   - config.js
   - supabase.sql (לא נדרש לאתר לאחר ההתקנה, אך אפשר להשאיר)
   - netlify.toml

כאשר החיבור תקין תופיע בראש האפליקציה הודעה: "מחובר לענן".


## v0.5
החיבור ל-Supabase כבר מוגדר בקובץ config.js. אין צורך לערוך את המפתח או ה-URL לפני העלאה ל-Netlify.
