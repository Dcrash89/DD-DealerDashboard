
import React from 'react';
import { DealerCategory } from '../../types';

interface CategoryBadgeProps {
  category: DealerCategory;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const categoryStyles: Record<DealerCategory, string> = {
    [DealerCategory.S]: 'bg-gold/20 text-yellow-800 dark:text-gold border-gold/50',
    [DealerCategory.A]: 'bg-silver/20 text-gray-800 dark:text-silver border-silver/50',
    [DealerCategory.B]: 'bg-bronze/20 text-orange-800 dark:text-bronze border-bronze/50',
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-bold rounded-full inline-block border ${categoryStyles[category]}`}
    >
      {`Cat. ${category}`}
    </span>
  );
};

export default CategoryBadge;
