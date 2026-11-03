import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice-item";
import Address from "../../../@shared/domain/value-object/address";
import InvoiceRepository from "../../repository/invoice-repository";

export interface FindInvoiceInputDto {
  id: string;
}

export interface FindInvoiceOutputDto {
  id: string;
  name: string;
  document: string;
  address: Address;
  items: InvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

export default class FindInvoiceUseCase {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async execute(input: FindInvoiceInputDto): Promise<FindInvoiceOutputDto> {
    const invoice = await this.invoiceRepository.find(input.id);

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