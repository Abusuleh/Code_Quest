import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { processStreakOnLessonComplete } from "@/lib/streak-engine";

const prismaMock = vi.hoisted(() => ({
  child: {
    findUniqueOrThrow: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

const { findUniqueOrThrow, update } = prismaMock.child;

function mockChild({
  streakCurrent,
  streakLongest,
  streakLastAt,
}: {
  streakCurrent: number;
  streakLongest: number;
  streakLastAt: Date | null;
}) {
  findUniqueOrThrow.mockResolvedValueOnce({
    streakCurrent,
    streakLongest,
    streakLastAt,
  });
}

describe("streak engine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-01T10:00:00Z"));
    findUniqueOrThrow.mockReset();
    update.mockReset();
    update.mockResolvedValueOnce({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("no previous streak -> streakCurrent = 1, no bonus", async () => {
    mockChild({ streakCurrent: 0, streakLongest: 0, streakLastAt: null });

    const result = await processStreakOnLessonComplete("child_1");

    expect(result).toEqual({ streakCurrent: 1, streakLongest: 1, streakBonus: 0 });
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ streakCurrent: 1, streakLongest: 1 }),
      }),
    );
  });

  it("same calendar day -> no change, streakBonus = 0", async () => {
    mockChild({
      streakCurrent: 4,
      streakLongest: 6,
      streakLastAt: new Date("2026-03-01T01:00:00Z"),
    });

    const result = await processStreakOnLessonComplete("child_1");

    expect(result).toEqual({ streakCurrent: 4, streakLongest: 6, streakBonus: 0 });
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ streakCurrent: 4, streakLongest: 6 }),
      }),
    );
  });

  it("previous lesson yesterday -> streak increments, bonus = 25", async () => {
    mockChild({
      streakCurrent: 2,
      streakLongest: 3,
      streakLastAt: new Date("2026-02-28T23:50:00Z"),
    });

    const result = await processStreakOnLessonComplete("child_1");

    expect(result).toEqual({ streakCurrent: 3, streakLongest: 3, streakBonus: 25 });
  });

  it("previous lesson 2 days ago -> streak resets to 1, no bonus", async () => {
    mockChild({
      streakCurrent: 5,
      streakLongest: 5,
      streakLastAt: new Date("2026-02-27T10:00:00Z"),
    });

    const result = await processStreakOnLessonComplete("child_1");

    expect(result).toEqual({ streakCurrent: 1, streakLongest: 5, streakBonus: 0 });
  });

  it("streakLongest updates when new streak exceeds previous longest", async () => {
    mockChild({
      streakCurrent: 4,
      streakLongest: 4,
      streakLastAt: new Date("2026-02-28T10:00:00Z"),
    });

    const result = await processStreakOnLessonComplete("child_1");

    expect(result.streakLongest).toBe(5);
  });

  it("streakLongest does not decrease when streak resets", async () => {
    mockChild({
      streakCurrent: 6,
      streakLongest: 10,
      streakLastAt: new Date("2026-02-26T10:00:00Z"),
    });

    const result = await processStreakOnLessonComplete("child_1");

    expect(result.streakLongest).toBe(10);
  });
});
