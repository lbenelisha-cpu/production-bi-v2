# תפריט תאריכים לאפליקציית הדשבורד

החבילה כוללת קומפוננטה מוכנה לאפליקציה:

## קבצים
- `DateRangeMenu.jsx` — הקומפוננטה הראשית.
- `dateRangeUtils.js` — פונקציות חישוב טווחי תאריכים.
- `AppExample.jsx` — דוגמת שילוב באפליקציה.
- `date_menu_schema.json` — מבנה הפלט שהדשבורד יקבל.

## סוגי תצוגה
- יומי
- חודשי
- רבעוני
- שנתי
- טווח חופשי

## פלט לדשבורד
```json
{
  "viewMode": "month",
  "startDate": "2026-06-01",
  "endDate": "2026-06-30",
  "label": "חודשי | 2026-06"
}
```

## שילוב
```jsx
<DateRangeMenu onChange={(range) => {
  // כאן מסננים את נתוני הדשבורד לפי range.startDate / range.endDate
}} />
```
