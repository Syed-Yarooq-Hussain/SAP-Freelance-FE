export interface ISignUpForm {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    city: string;
    country: string;
    module: string;
    level: string;
    experience: number;
    rate: number;
    availableHours: number;
    availability: {
        day: string;
        enabled: boolean;
        start?: string;
        end?: string;
    }[];
    cv: File | null;
    termsAccepted: boolean;
}
