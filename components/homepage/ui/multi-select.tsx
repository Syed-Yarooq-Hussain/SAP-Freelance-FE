"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { Button } from "./button"
import { Badge } from "./badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { cn } from "./utils"

export type MultiSelectOption = {
  label: string
  value: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val))
    } else {
      onChange([...value, val])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-brand-yellow min-h-[44px] h-auto"
        >
          <div className="flex gap-1 flex-wrap flex-1 text-left">
            {value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              value.map((val) => {
                const option = options.find((o) => o.value === val)
                return (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="gap-1 bg-light-grey text-white"
                  >
                    {option?.label}
                    <span
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer inline-flex items-center"
                      onPointerDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          e.stopPropagation()
                          onChange(value.filter((v) => v !== val))
                        }
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onChange(value.filter((v) => v !== val))
                      }}
                    >
                      <X className="w-3 h-3" />
                    </span>
                  </Badge>
                )
              })
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  toggleValue(option.value)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}