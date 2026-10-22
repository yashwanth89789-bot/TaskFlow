export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTomorrowDateString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getNextWeekDateString(): string {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const year = nextWeek.getFullYear();
  const month = String(nextWeek.getMonth() + 1).padStart(2, '0');
  const day = String(nextWeek.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDueDate(dateString?: string): {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
  isTomorrow: boolean;
} {
  if (!dateString) {
    return { label: 'No due date', isOverdue: false, isToday: false, isTomorrow: false };
  }

  const [yearStr, monthStr, dayStr] = dateString.split('-');
  if (!yearStr || !monthStr || !dayStr) {
    return { label: dateString, isOverdue: false, isToday: false, isTomorrow: false };
  }

  const targetDate = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, parseInt(dayStr, 10));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[targetDate.getMonth()];
  const formattedStandard = `${monthName} ${targetDate.getDate()}${
    targetDate.getFullYear() !== today.getFullYear() ? `, ${targetDate.getFullYear()}` : ''
  }`;

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      label: overdueDays === 1 ? 'Yesterday (Overdue)' : `${overdueDays}d overdue · ${formattedStandard}`,
      isOverdue: true,
      isToday: false,
      isTomorrow: false,
    };
  }

  if (diffDays === 0) {
    return { label: 'Today', isOverdue: false, isToday: true, isTomorrow: false };
  }

  if (diffDays === 1) {
    return { label: 'Tomorrow', isOverdue: false, isToday: false, isTomorrow: true };
  }

  if (diffDays > 1 && diffDays <= 6) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return {
      label: `${dayNames[targetDate.getDay()]} (${monthName} ${targetDate.getDate()})`,
      isOverdue: false,
      isToday: false,
      isTomorrow: false,
    };
  }

  return { label: formattedStandard, isOverdue: false, isToday: false, isTomorrow: false };
}
