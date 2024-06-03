import { Student as PrismaStudent } from "@prisma/client";

interface StudentProps{
    name: string;
    email: string;
}

export class Student {
    private _id?: number;
    private props: StudentProps;

    get id(): number | undefined {
        return this._id;
    }

    get email(): string {
        return this.props.email;
    }

    get name(): string {
        return this.props.name;
    }

    constructor(props: StudentProps, id?: number){
        this._id = id;
        this.props = props;
    }
}