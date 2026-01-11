export interface User {
    id: number;
    uuid: string | null;
    full_name: string;
    email: string;
    provider: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export interface LoggedInHistory {
    id: number;
    user_id: number;
    session_id: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}