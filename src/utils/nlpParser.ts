import { Priority, TaskCategory } from '../types/task';
import { getTodayDateString, getTomorrowDateString, getNextWeekDateString } from './date';

export interface ParsedTaskInput {
  cleanTitle: string;
  detectedPriority?: Priority;
  detectedCategory?: TaskCategory;
  detectedDueDate?: string;
  detectedEstimatedMinutes?: number;
  hasDetectedTokens: boolean;
}

export function parseNaturalLanguageInput(raw: string): ParsedTaskInput {
  let title = raw;
  let detectedPriority: Priority | undefined;
  let detectedCategory: TaskCategory | undefined;
  let detectedDueDate: string | undefined;
  let detectedEstimatedMinutes: number | undefined;

  // 1. Detect Priority: !high, !urgent, !medium, !med, !low
  const priorityRegex = /(?:^|\s)!(high|urgent|medium|med|low)(?=\s|$)/i;
  const pMatch = title.match(priorityRegex);
  if (pMatch) {
    const pVal = pMatch[1].toLowerCase();
    if (pVal === 'high' || pVal === 'urgent') detectedPriority = 'high';
    else if (pVal === 'medium' || pVal === 'med') detectedPriority = 'medium';
    else if (pVal === 'low') detectedPriority = 'low';
    title = title.replace(pMatch[0], ' ');
  }

  // 2. Detect Category: #work, #personal, #health, #study, #finance, #general
  const categoryRegex = /(?:^|\s)#(work|personal|health|fitness|study|learn|learning|finance|money|general)(?=\s|$)/i;
  const cMatch = title.match(categoryRegex);
  if (cMatch) {
    const cVal = cMatch[1].toLowerCase();
    if (cVal === 'work') detectedCategory = 'work';
    else if (cVal === 'personal') detectedCategory = 'personal';
    else if (cVal === 'health' || cVal === 'fitness') detectedCategory = 'health';
    else if (cVal === 'study' || cVal === 'learn' || cVal === 'learning') detectedCategory = 'study';
    else if (cVal === 'finance' || cVal === 'money') detectedCategory = 'finance';
    else detectedCategory = 'general';
    title = title.replace(cMatch[0], ' ');
  }

  // 3. Detect Estimated Duration: ~15m, ~30m, ~45m, ~1h, ~2h, 30min, 1 hour
  const timeRegex = /(?:^|\s)(?:~|est:?)(\d+)(m|min|h|hr|hours?)(?=\s|$)/i;
  const tMatch = title.match(timeRegex);
  if (tMatch) {
    const num = parseInt(tMatch[1], 10);
    const unit = tMatch[2].toLowerCase();
    if (unit.startsWith('h')) {
      detectedEstimatedMinutes = num * 60;
    } else {
      detectedEstimatedMinutes = num;
    }
    title = title.replace(tMatch[0], ' ');
  }

  // 4. Detect Due Date keywords: today, tomorrow, next week, or day of week
  const todayRegex = /(?:^|\s)(?:by\s+|due\s+|on\s+)?(today|tonight)(?=\s|$)/i;
  const tomorrowRegex = /(?:^|\s)(?:by\s+|due\s+|on\s+)?(tomorrow)(?=\s|$)/i;
  const nextWeekRegex = /(?:^|\s)(?:by\s+|due\s+|on\s+)?(next week)(?=\s|$)/i;

  if (tomorrowRegex.test(title)) {
    detectedDueDate = getTomorrowDateString();
    title = title.replace(tomorrowRegex, ' ');
  } else if (todayRegex.test(title)) {
    detectedDueDate = getTodayDateString();
    title = title.replace(todayRegex, ' ');
  } else if (nextWeekRegex.test(title)) {
    detectedDueDate = getNextWeekDateString();
    title = title.replace(nextWeekRegex, ' ');
  } else {
    // Detect day names e.g. "by friday", "on monday"
    const dayRegex = /(?:^|\s)(?:by\s+|due\s+|on\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?=\s|$)/i;
    const dMatch = title.match(dayRegex);
    if (dMatch) {
      const dayName = dMatch[1].toLowerCase();
      const dayMap: Record<string, number> = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
      };
      const targetDay = dayMap[dayName];
      if (targetDay !== undefined) {
        const now = new Date();
        const currentDay = now.getDay();
        let diff = targetDay - currentDay;
        if (diff <= 0) diff += 7; // Next occurrence
        const targetDate = new Date();
        targetDate.setDate(now.getDate() + diff);
        const y = targetDate.getFullYear();
        const m = String(targetDate.getMonth() + 1).padStart(2, '0');
        const d = String(targetDate.getDate()).padStart(2, '0');
        detectedDueDate = `${y}-${m}-${d}`;
        title = title.replace(dMatch[0], ' ');
      }
    }
  }

  const cleanTitle = title.replace(/\s+/g, ' ').trim();
  const hasDetectedTokens = Boolean(
    detectedPriority || detectedCategory || detectedDueDate || detectedEstimatedMinutes
  );

  return {
    cleanTitle: cleanTitle || raw.trim(),
    detectedPriority,
    detectedCategory,
    detectedDueDate,
    detectedEstimatedMinutes,
    hasDetectedTokens,
  };
}
