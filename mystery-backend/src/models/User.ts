export interface UserResponse {
  _id: string;
  avatar: string;
}

export interface User extends UserResponse {
  passphrase: string;
}
