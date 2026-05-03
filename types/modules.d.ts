export interface SapModule {
    id: string;
    name: string;
  }
  
export interface SapModuleGroup {
    id: string;
    name: string;
    modules: SapModule[];
  }