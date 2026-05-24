import type { Activity, Company, Post } from "@/types";

// Excel 원본 활동 데이터 (CT-045) 그대로 반영
export const activities: Activity[] = [
  // 전기 — 한국전력 (kWh)
  { id: "a-e1", date: "2025-01-01", activityType: "electricity", source: "한국전력", quantity: 110, unit: "kWh" },
  { id: "a-e2", date: "2025-02-01", activityType: "electricity", source: "한국전력", quantity: 112, unit: "kWh" },
  { id: "a-e3", date: "2025-03-01", activityType: "electricity", source: "한국전력", quantity: 115, unit: "kWh" },
  { id: "a-e4", date: "2025-04-01", activityType: "electricity", source: "한국전력", quantity: 130, unit: "kWh" },
  { id: "a-e5", date: "2025-05-01", activityType: "electricity", source: "한국전력", quantity: 120, unit: "kWh" },
  { id: "a-e6", date: "2025-06-01", activityType: "electricity", source: "한국전력", quantity: 110, unit: "kWh" },
  { id: "a-e7", date: "2025-07-01", activityType: "electricity", source: "한국전력", quantity: 120, unit: "kWh" },
  { id: "a-e8", date: "2025-08-01", activityType: "electricity", source: "한국전력", quantity: 111, unit: "kWh" },
  { id: "a-e9", date: "2025-05-01", activityType: "electricity", source: "한국전력", quantity: 101, unit: "kWh" },

  // 원소재 — 플라스틱 1, 2 (kg)
  { id: "a-r1",  date: "2025-01-01", activityType: "raw_material", source: "플라스틱 1", quantity: 230, unit: "kg" },
  { id: "a-r2",  date: "2025-02-01", activityType: "raw_material", source: "플라스틱 1", quantity: 340, unit: "kg" },
  { id: "a-r3",  date: "2025-03-01", activityType: "raw_material", source: "플라스틱 2", quantity: 23,  unit: "kg" },
  { id: "a-r4",  date: "2025-03-01", activityType: "raw_material", source: "플라스틱 1", quantity: 430, unit: "kg" },
  { id: "a-r5",  date: "2025-04-01", activityType: "raw_material", source: "플라스틱 1", quantity: 510, unit: "kg" },
  { id: "a-r6",  date: "2025-05-01", activityType: "raw_material", source: "플라스틱 1", quantity: 424, unit: "kg" },
  { id: "a-r7",  date: "2025-05-01", activityType: "raw_material", source: "플라스틱 2", quantity: 40,  unit: "kg" },
  { id: "a-r8",  date: "2025-06-01", activityType: "raw_material", source: "플라스틱 1", quantity: 450, unit: "kg" },
  { id: "a-r9",  date: "2025-07-01", activityType: "raw_material", source: "플라스틱 1", quantity: 340, unit: "kg" },
  { id: "a-r10", date: "2025-07-01", activityType: "raw_material", source: "플라스틱 2", quantity: 43,  unit: "kg" },
  { id: "a-r11", date: "2025-08-01", activityType: "raw_material", source: "플라스틱 1", quantity: 230, unit: "kg" },
  { id: "a-r12", date: "2025-05-01", activityType: "raw_material", source: "플라스틱 1", quantity: 232, unit: "kg" },

  // 운송 — 트럭 (ton-km)
  { id: "a-t1", date: "2025-01-01", activityType: "transport", source: "트럭", quantity: 41,  unit: "ton-km" },
  { id: "a-t2", date: "2025-02-01", activityType: "transport", source: "트럭", quantity: 211, unit: "ton-km" },
  { id: "a-t3", date: "2025-03-01", activityType: "transport", source: "트럭", quantity: 123, unit: "ton-km" },
  { id: "a-t4", date: "2025-04-01", activityType: "transport", source: "트럭", quantity: 42,  unit: "ton-km" },
  { id: "a-t5", date: "2025-05-01", activityType: "transport", source: "트럭", quantity: 123, unit: "ton-km" },
  { id: "a-t6", date: "2025-06-01", activityType: "transport", source: "트럭", quantity: 123, unit: "ton-km" },
  { id: "a-t7", date: "2025-07-01", activityType: "transport", source: "트럭", quantity: 41,  unit: "ton-km" },
  { id: "a-t8", date: "2025-08-01", activityType: "transport", source: "트럭", quantity: 123, unit: "ton-km" },
  { id: "a-t9", date: "2025-05-01", activityType: "transport", source: "트럭", quantity: 12,  unit: "ton-km" },
];

export const companies: Company[] = [
  {
    id: "c1",
    name: "Acme Corp",
    country: "US",
    emissions: [
      { yearMonth: "2024-01", source: "gasoline", emissions: 120 },
      { yearMonth: "2024-02", source: "gasoline", emissions: 110 },
      { yearMonth: "2024-03", source: "gasoline", emissions: 95 },
    ],
  },
  {
    id: "c2",
    name: "Globex",
    country: "DE",
    emissions: [
      { yearMonth: "2024-01", source: "lpg", emissions: 80 },
      { yearMonth: "2024-02", source: "lpg", emissions: 105 },
      { yearMonth: "2024-03", source: "lpg", emissions: 120 },
    ],
  },
];

export const posts: Post[] = [
  {
    id: "p1",
    title: "Sustainability Report",
    resourceUid: "c1",
    dateTime: "2024-02",
    content: "Quarterly CO2 update",
  },
];
