# ADAMA Production BI — Sprint 5.1 Cloud + UI Restore

מה תוקן:
- הוחזר המראה והמבנה של Sprint 4.
- נשמר חיבור Supabase מ-Sprint 5.
- נשמר מסך Database.
- נשמר SQL מלא: supabase/schema.sql.
- טעינת Excel שומרת לענן כאשר Supabase מחובר.
- המערכת עדיין עובדת מקומית אם Supabase לא מוגדר.

Netlify Environment Variables:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Build command:
npm run build

Publish directory:
dist
