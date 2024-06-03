interface CourseProps {
    title: string;
    description: string | null;
}

export class Course {
    private _id?: number;
    private props: CourseProps;

    get id(): number | undefined {
        return this._id;
    }

    get title(): string{
        return this.props.title;
    }

    get description(): string | null {
        return this.props.description;
    }

    constructor(props: CourseProps, id?: number) {
        this._id = id;
        this.props = props;
    }
}