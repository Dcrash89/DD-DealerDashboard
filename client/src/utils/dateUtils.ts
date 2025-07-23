
export const getDaysRemaining = (endDateString: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date
    const endDate = new Date(endDateString);
    
    if (isNaN(endDate.getTime())) {
        return 0;
    }
    
    const diffTime = endDate.getTime() - today.getTime();
    if (diffTime < 0) return 0;

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};
