# Sprint 6 — שילוב תפריט תאריכים בדשבורד

## איפה התפריט ממוקם?
במסך הדשבורד הראשי:

1. כותרת:
   - דשבורד ראשי
   - תמונת מצב ייצור, אריזה, איכות והזמנות

2. מיד מתחת לכותרת:
   - DateFilterBar

3. מתחתיו:
   - כרטיסי KPI
   - גרפים
   - טבלאות
   - דוחות

## מה השתנה?
הדשבורד כבר לא מציג את כל הנתונים.
הוא משתמש בנתונים מסוננים לפי טווח התאריכים:

```js
const filteredProduction = filterRowsByDateRange(productionRows, range, "date");
const filteredQuality = filterRowsByDateRange(qualityRows, range, "date");
const filteredEvents = filterRowsByDateRange(eventRows, range, "date");
```

## מה צריך לחבר בהמשך?
בכל מקום שבו הגרפים משתמשים ב־productionRows, צריך להחליף ל־filteredProduction.

בכל מקום שבו דוח Excel או WhatsApp משתמשים בכל הרשומות, צריך להחליף לנתונים המסוננים.

## שדות תאריך נתמכים
הסינון מזהה אוטומטית:
- date
- Date
- תאריך
- תאריך דיווח
- report_date
- production_date
- createdAt
