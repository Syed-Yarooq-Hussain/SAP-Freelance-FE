export interface SapModule {
    id: string;
    name: string;
  }
  
export interface SapModuleGroup {
    id: string;
    name: string;
    modules: SapModule[];
  }

export interface ModuleRequest {
  id: number;
  name: string;
  user_id: number;
  is_accepted: boolean | null;
  created_at?: string;
  user?: {
    id: number;
    username?: string;
    email?: string;
  };
}
