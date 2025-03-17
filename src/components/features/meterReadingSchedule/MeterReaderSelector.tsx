'use client';

import { FunctionComponent, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@srms/components/ui/Command';
import { Popover, PopoverContent, PopoverTrigger } from '@srms/components/ui/Popover';
import { Button } from '@srms/components/ui/Button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@srms/utils/shadcn';

type MeterReader = {
  id: string;
  value: string;
  label: string;
};

// Sample data with proper typing
const sampleData: MeterReader[] = [
  {
    id: '1',
    value: 'John Doe',
    label: 'John Doe',
  },
  {
    id: '2',
    value: 'Linus Torvalds',
    label: 'Linus Torvalds',
  },
  {
    id: '3',
    value: 'Rob Pke',
    label: 'Rob Pike',
  },
  {
    id: '4',
    value: 'Sam Altman',
    label: 'Sam Altman',
  },
  {
    id: '5',
    value: 'Jane Dane',
    label: 'Jane Dane',
  },
];

type MeterReaderSelectorProps = {
  value: string;
  setValue: (value: string) => void;
};

// Memoized Calendar component with TypeScript props

// Separate component for the meter reader selection popover
export const MeterReaderSelector: FunctionComponent<MeterReaderSelectorProps> = ({ value, setValue }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {value ? sampleData.find(framework => framework.value === value)?.label : 'Select Meter Reader'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              <p className="text-muted-foreground">Not found</p>
            </CommandEmpty>
            <CommandGroup>
              {sampleData.map((framework, index) => (
                <CommandItem
                  key={index}
                  value={framework.value}
                  onSelect={currentValue => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <Check className={cn('ml-auto', value === framework.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
