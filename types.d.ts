type UserData = {
    id: number;
    firstName: string;
    email: string;
    password: number;
    lastName: string;
    role: number;
    banned: boolean;
};

declare global {
    namespace Express {
        interface User extends UserData {}
    }
}

