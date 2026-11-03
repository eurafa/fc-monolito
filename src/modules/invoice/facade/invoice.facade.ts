import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "../usecase/find-invoice/find-invoice.dto";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "../usecase/generate-invoice/generate-invoice.dto";
import InvoiceFacadeInterface from "./facade.interface";

export default class InvoiceFacade implements InvoiceFacadeInterface {
  constructor(
    private generateInvoiceUseCase: UseCaseInterface,
    private findInvoiceUseCase: UseCaseInterface
  ) {}

  generate(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
    return this.generateInvoiceUseCase.execute(input);
  }

  find(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
    return this.findInvoiceUseCase.execute(input);
  }
}