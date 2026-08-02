export const legal = {
  operatorName: "[ФИО / наименование ИП или ООО]",
  inn: "[ИНН]",
  ogrnip: "[ОГРНИП / ОГРН]",
  address: "[адрес регистрации / место нахождения]",
  email: "[email для обращений]",
  phone: "[телефон]",
  siteUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  serviceName: "NimbleFlow",
  effectiveDate: "[дата публикации, ДД.ММ.ГГГГ]",
} as const;
