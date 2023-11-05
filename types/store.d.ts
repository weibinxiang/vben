import { ErrorTypeEnum } from '/@/enums/exceptionEnum';
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';
import { RoleEnum } from '/@/api/sys/model/userModel';

// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined;
  // Is it locked?
  isLock?: boolean;
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
  homePath?: string;
}

export interface UserInfo {
  agent_id: number;
  avatar: string;
  consultant_id: number;
  customer_id: number;
  name: string;
  role: RoleEnum;
  token: string;
  phone: string;
  homePath?: string;
  is_register: 0 | 1;
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}
