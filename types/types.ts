export interface FormData{
    email: string;
    password: string;
}
    
export interface Memo {
    id: number;
    title: string;
    content: string;
}


export interface User {
    id: number;
    username: string;
    email: string;
}

export interface RegisterFormData {
    username: string;
    email:string;
    password: string;
    password2:string;
}