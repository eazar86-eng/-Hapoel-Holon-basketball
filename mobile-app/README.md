# אבי חולון - iOS App

גרסת iOS של אתר הפועל ״אבי״ חולון.

## ארכיטקטורה
- Capacitor + Vite
- ממשק App-first עם ניווט תחתון קבוע
- מידע ציבורי בלבד על שחקנים
- מקור לו״ז: schedule-data.json באתר הקבוצה
- מקור ליגה: league-data.json
- מקור סגל: team-data.json
- Local Notifications לתזכורת אישית
- Push Notifications ו-Staff Login יתווספו לאחר פתיחת Apple Developer והשלמת הרשאות

## הרצה מקומית
```bash
cd mobile-app
npm install
npm run dev
```

## יצירת פרויקט iOS
נדרש Mac עם Xcode עדכני.

```bash
cd mobile-app
npm install
npm run build
npm run ios:add
npm run ios:sync
npm run ios:open
```

ב-Xcode:
1. בחר Signing & Capabilities.
2. בחר את חשבון Apple Developer האישי.
3. ודא Bundle ID: com.aviholon.teamapp
4. קבע Deployment Target בהתאם לדרישות App Store.
5. בדוק על iPhone אמיתי.
6. לאחר אישור חשבון Developer, הפעל Push Notifications ו-Background Modes לפי הצורך.

## פרטיות
אין לפרסם תמונות שחקנים או נתונים אישיים רגישים של קטינים ללא הרשאה מתאימה.
