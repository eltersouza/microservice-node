interface EnrollmentProps {
    customerId?: number;
    courseId?: number;
    enrolledAt: Date;
}

export class Enrollment {
    private _id?: number;
    private props: EnrollmentProps;

    get id(): number | undefined {
        return this._id;
    }

    get customerId(): number | undefined {
        return this.props.customerId;
    }

    get courseId(): number | undefined {
        return this.props.courseId;
    }

    get enrolledAt(): Date {
        return this.props.enrolledAt;
    }

    constructor(props: EnrollmentProps, id?: number) {
        this._id = id;
        this.props = props;
    }
}