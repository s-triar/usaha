declare namespace NodeJS{
    export interface ProcessEnv{
        PORT?:string;

        MYSQL_DB_APP_PORT?:string;
        MYSQL_DB_APP_HOST?:string;
        MYSQL_DB_APP_USERNAME?:string;
        MYSQL_DB_APP_PASSWORD?:string;
        MYSQL_DB_APP_DATABASE?:string;

        MYSQL_DB_AUTH_PORT?:string;
        MYSQL_DB_AUTH_HOST?:string;
        MYSQL_DB_AUTH_USERNAME?:string;
        MYSQL_DB_AUTH_PASSWORD?:string;
        MYSQL_DB_AUTH_DATABASE?:string;

        JWT_SECRET_KEY?:string;
    }
}