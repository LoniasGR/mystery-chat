import type { User as UserResponse } from "@/common/types";

export interface User extends UserResponse {
  passphrase: string;
}
