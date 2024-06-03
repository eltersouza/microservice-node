import { Customer } from "../../domain/customer";

export interface ICustomerRepository {
    create(student: Customer) : Promise<Customer>;
    findCustomerByEmail(email?: string): Promise<Customer | null>;
    findCustomerById(id: number): Promise<Customer | null>;
    getAll() : Promise<Customer[] | null>;
}