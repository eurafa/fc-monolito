import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice-item";
import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceRepository from "../../repository/invoice-repository";

export interface GenerateInvoiceInputDto {
  name: string;
  document: string;
  address: {
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: {
    name: string;
    price: number;
  }[];
}

export interface GenerateInvoiceOutputDto {
  id: string;
  name: string;
  document: string;
  address: Address;
  items: InvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

export default class GenerateInvoiceUsecase {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async execute(input: GenerateInvoiceInputDto): Promise<GenerateInvoiceOutputDto> {
    const address = new Address(
      input.address.street,
      input.address.number,
      input.address.complement,
      input.address.city,
      input.address.state,
      input.address.zipCode
    );

    const items = input.items.map(
      (item) => new InvoiceItem({ name: item.name, price: item.price })
    );

    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address,
      items,
    });

    await this.invoiceRepository.create(invoice);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      address: invoice.address,
      items: invoice.items,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    };
  }
}