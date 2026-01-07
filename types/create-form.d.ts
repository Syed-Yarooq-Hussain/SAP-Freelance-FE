export interface IFieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  rules?: RegisterOptions;
  options?: IOption[];
  fetchUrl?: string;
  column?: any;
  row?: any;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  select?: boolean;
  multiple?: boolean;
  defaultValue?: string | number | boolean | null | string[];
  hidden?: boolean;
  column?: IGridSpan;
  row?: IGridSpan;
  disabled?: boolean;
  readOnly?: boolean;
}

export interface IGridSpan {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

interface ICreateFormProps {
  elements: IFieldConfig[];
  onSuccess: (data: FieldValues) => void;
  defaultValues?: Record<string, any>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string;
  onCVParsed?: (cvData: Partial<FieldValues>) => void;
  actionsContainerProps?: any;
  submitButton?: ButtonProps;
  cancelButton?: ButtonProps;
  leadingContent?: ReactNode;
  inlineActions?: boolean;
  showProgress?: boolean;
  mode?: "wizard" | "normal";
}
