# Date Menu Component V2 — כולל סינון בפועל

הגרסה הזאת כבר לא רק מציגה תפריט תאריכים.
היא כוללת גם פונקציה שמסננת נתונים לפי התאריך שנבחר.

## קבצים
- `DateRangeMenu.jsx` — תפריט התאריכים.
- `dateRangeUtils.js` — חישוב טווח + סינון רשומות.
- `DashboardExample.jsx` — דוגמה מלאה שבה הנתונים באמת מסתננים.
- `date_menu_schema.json` — מבנה הפלט.

## הפונקציה החשובה
```js
filterRowsByDateRange(rows, range, "date")
```

היא מחזירה רק רשומות שהתאריך שלהן נמצא בתוך:
```js
range.startDate <= row.date <= range.endDate
```

## שמות תאריך נתמכים אוטומטית
הפונקציה מזהה:
- `date`
- `תאריך`
- `report_date`
- `production_date`

או שאפשר להעביר שם עמודה:
```js
filterRowsByDateRange(rows, range, "תאריך דיווח")
```

## דוגמה
```js
const filteredRows = filterRowsByDateRange(allRows, selectedRange, "date");
```

עכשיו הדשבורד צריך להשתמש ב־`filteredRows` במקום `allRows`.
