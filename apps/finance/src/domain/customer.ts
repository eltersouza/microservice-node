interface CustomerProps{
    name: string;
    email: string;
}

export class Customer {
    private _id?: number;
    private props: CustomerProps;

    get id(): number | undefined {
        return this._id;
    }

    get email(): string {
        return this.props.email;
    }

    get name(): string {
        return this.props.name;
    }

    constructor(props: CustomerProps, id?: number){
        this._id = id;
        this.props = props;
    }
}