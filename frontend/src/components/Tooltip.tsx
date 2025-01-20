import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  id?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content,
  side = 'top',
  align = 'center',
  id
}) => {
  return (
    <RadixTooltip.Provider delayDuration={200}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          <span 
            tabIndex={0} 
            role="button" 
            className="focus:outline-none focus:ring-2 focus:ring-blue-500/40 rounded-lg"
          >
            {children}
          </span>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            id={id}
            className="
              bg-gray-900 dark:bg-gray-100
              text-white dark:text-gray-900
              px-3 py-2 rounded-lg shadow-lg
              text-sm font-medium
              animate-in fade-in zoom-in-50
              duration-200
              z-50
            "
            role="tooltip"
            sideOffset={5}
          >
            {content}
            <RadixTooltip.Arrow 
              className="fill-gray-900 dark:fill-gray-100" 
              width={12} 
              height={6} 
            />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

export default Tooltip;
