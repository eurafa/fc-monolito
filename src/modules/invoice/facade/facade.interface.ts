import Address from "../../@shared/domain/value-object/address";
import InvoiceItem from "../domain/invoice-item";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "../usecase/find-invoice/find-invoice.dto";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "../usecase/generate-invoice/generate-invoice.dto";

export interface FindInvoiceFacadeInputDto {
  id: string;
}

export interface FindInvoiceFacadeOutputDto {
  id: string;
  name: string;
  document: string;
  address: Address;
  items: InvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

export default interface InvoiceFacadeInterface {
  generate(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto>;
  find(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO>;
}
