import InvoiceFacadeInterface from "../facade/facade.interface";
import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice-repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFacadeFactory {
  static create(): InvoiceFacadeInterface {
    const repository = new InvoiceRepository();
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(repository);
    const findInvoiceUseCase = new FindInvoiceUseCase(repository);
    const facade = new InvoiceFacade(generateInvoiceUseCase, findInvoiceUseCase);
    return facade;
  }
}
