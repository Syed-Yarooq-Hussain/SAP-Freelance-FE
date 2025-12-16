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
  defaultValue?: string | number | boolean | null;
  hidden?: boolean;
}

interface ICreateFormProps {
  elements: IFieldConfig[];
  onSuccess: (data: FieldValues) => void;
  onCancel?: () => void;
  loading?: boolean;
  error?: string;
  onCVParsed?: (cvData: Partial<FieldValues>) => void;
  actionsContainerProps?: any;
  submitButton?: ButtonProps;
  cancelButton?: ButtonProps;
  leadingContent?: ReactNode;
  inlineActions?: boolean;
}