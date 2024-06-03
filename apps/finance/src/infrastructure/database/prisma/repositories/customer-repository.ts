import { ICustomerRepository } from "../../../../application/repositories/customer-repository";
import { Customer } from "../../../../domain/customer";
import { prisma } from "../prisma";

export class PrismaCustomerRepository implements ICustomerRepository {
    
    async create(customer: Customer): Promise<Customer> {
        const prismaCustomer = await prisma.customer.create({
            data: {
                email: customer.email,
                name: customer.name
            }
        });

        return new Customer({name: prismaCustomer.name, email: prismaCustomer.email}, prismaCustomer.id);
    }

    async findCustomerByEmail(email?: string): Promise<Customer | null> {
        if(!email)
            return null;

        const prismaCustomer = await prisma.customer.findUnique({where: { email: email }});

        if(!prismaCustomer)
            return null;

        const student = new Customer({email: prismaCustomer!.email!, name: prismaCustomer!.name}, prismaCustomer?.id);
        return student;
    }
    
    async findCustomerById(id: number): Promise<Customer | null> {
        const prismaCustomer = await prisma.customer.findUnique({where: { id }});

        if(!prismaCustomer)
            return null;

        const student = new Customer({email: prismaCustomer!.email, name: prismaCustomer!.name}, prismaCustomer?.id);
        return student;
    }

    async getAll() : Promise<Customer[] | null> {
        const customers = await prisma.customer.findMany();

        if(!customers)
            return null;

        return customers.map( cust => new Customer({email: cust.email, name: cust.name}, cust.id));
    }
}