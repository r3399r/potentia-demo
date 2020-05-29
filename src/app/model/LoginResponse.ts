export interface LoginResponse {
    token: string;
    accessible_until: number;
    refreshable_until: number;
}
