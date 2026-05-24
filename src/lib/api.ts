import { activities as seedActivities, companies, posts } from "@/lib/data/seed";
import { emissionFactors as seedFactors } from "@/lib/data/emission-factors";
import type { Activity, Company, EmissionFactor, Post } from "@/types";

let _activities: Activity[] = [...seedActivities];
let _companies: Company[] = [...companies];
let _posts: Post[] = [...posts];
let _factors: EmissionFactor[] = [...seedFactors];

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600;
const maybeFail = () => Math.random() < 0.15;

// ── Activities ──────────────────────────────────────────────────────────────

export async function fetchActivities(): Promise<Activity[]> {
  await delay(jitter());
  return [..._activities];
}

export async function createActivity(
  input: Omit<Activity, "id">
): Promise<Activity> {
  await delay(jitter());
  if (maybeFail()) throw new Error("저장에 실패했습니다. 다시 시도해 주세요.");
  const created: Activity = { ...input, id: crypto.randomUUID() };
  _activities = [..._activities, created];
  return created;
}

export async function updateActivity(
  input: Activity
): Promise<Activity> {
  await delay(jitter());
  if (maybeFail()) throw new Error("저장에 실패했습니다. 다시 시도해 주세요.");
  _activities = _activities.map((a) => (a.id === input.id ? input : a));
  return input;
}

export async function deleteActivity(id: string): Promise<void> {
  await delay(jitter());
  if (maybeFail()) throw new Error("삭제에 실패했습니다. 다시 시도해 주세요.");
  _activities = _activities.filter((a) => a.id !== id);
}

// ── Emission Factors ─────────────────────────────────────────────────────────

export async function fetchEmissionFactors(): Promise<EmissionFactor[]> {
  await delay(jitter());
  return [..._factors];
}

export async function updateEmissionFactor(
  input: EmissionFactor
): Promise<EmissionFactor> {
  await delay(jitter());
  if (maybeFail()) throw new Error("저장에 실패했습니다. 다시 시도해 주세요.");
  // 버전 이력 추적: 기존 항목을 대체하되 version을 증가시킨 새 레코드 추가
  const prev = _factors.find((f) => f.id === input.id);
  const updated: EmissionFactor = {
    ...input,
    version: prev ? prev.version + 1 : 1,
  };
  _factors = _factors.map((f) => (f.id === input.id ? updated : f));
  return updated;
}

// ── Companies ────────────────────────────────────────────────────────────────

export async function fetchCompanies(): Promise<Company[]> {
  await delay(jitter());
  return [..._companies];
}

// ── Posts ────────────────────────────────────────────────────────────────────

export async function fetchPosts(): Promise<Post[]> {
  await delay(jitter());
  return [..._posts];
}

export async function createOrUpdatePost(
  p: Omit<Post, "id"> & { id?: string }
): Promise<Post> {
  await delay(jitter());
  if (maybeFail()) throw new Error("저장에 실패했습니다. 다시 시도해 주세요.");
  if (p.id) {
    _posts = _posts.map((x) => (x.id === p.id ? (p as Post) : x));
    return p as Post;
  }
  const created = { ...p, id: crypto.randomUUID() };
  _posts = [..._posts, created];
  return created;
}

// ── Reset (테스트용) ──────────────────────────────────────────────────────────

export function __resetStore() {
  _activities = [...seedActivities];
  _companies = [...companies];
  _posts = [...posts];
  _factors = [...seedFactors];
}
