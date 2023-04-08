 type UserData = {
    id: number;
    fullname: string;
    email: string;
    avatarUrl: string;
};


export type {UserData, UserCreateData}

 export interface UserModelInterface {
     id?: string;
     email?: string;
     confirmationCode?: string;
     firstName: string;
     lastName: string;
     password: string;
 }
