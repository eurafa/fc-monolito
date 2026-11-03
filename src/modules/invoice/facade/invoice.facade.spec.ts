import InvoiceFacade from "./invoice.facade";
import GenerateInvoiceUsecase from "../usecase/generate-invoice/generate-invoice.usecase";
import FindInvoiceUsecase from "../usecase/find-invoice/find-invoice.usecase";
import InvoiceRepository from "../repository/invoice-repository";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-item";
import Address from "../../@shared/domain/value-object/address";

describe("InvoiceFacade unit tests", () => {
  const invoiceRepository = {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
  } as unknown as InvoiceRepository;

  const generateInvoiceUseCase = new GenerateInvoiceUsecase(invoiceRepository);
  const findInvoiceUseCase = new FindInvoiceUsecase(invoiceRepository);
  const facade = new InvoiceFacade(generateInvoiceUseCase, findInvoiceUseCase);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate an invoice", async () => {
    const input = {
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zipcode 1",
      items: [
        { id: "1", name: "Item 1", price: 100 },
        { id: "2", name: "Item 2", price: 200 },
      ],
    };

    const output = await facade.generate(input);

    expect(output.id).toBeDefined();
    expect(output.name).toBe("Invoice 1");
    expect(output.document).toBe("Document 1");
    expect(output.street).toBe("Street 1");
    expect(output.number).toBe("1");
    expect(output.complement).toBe("Complement 1");
    expect(output.city).toBe("City 1");
    expect(output.state).toBe("State 1");
    expect(output.zipCode).toBe("Zipcode 1");
    expect(output.items).toHaveLength(2);
    expect(output.items[0].id).toBe("1");
    expect(output.items[0].name).toBe("Item 1");
    expect(output.items[0].price).toBe(100);
    expect(output.items[1].id).toBe("2");
    expect(output.items[1].name).toBe("Item 2");
    expect(output.items[1].price).toBe(200);
    expect(output.total).toBe(300);
    expect(invoiceRepository.create).toHaveBeenCalledTimes(1);
  });

  it("should find an invoice", async () => {
    const address = new Address("Street 1", "1", "Complement 1", "City 1", "State 1", "Zipcode 1");
    const item1 = new InvoiceItem({ id: new Id("1"), name: "Item 1", price: 100 });
    const item2 = new InvoiceItem({ id: new Id("2"), name: "Item 2", price: 200 });
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document 1",
      address,
      items: [item1, item2],
    });

    (invoiceRepository.find as jest.Mock).mockResolvedValue(invoice);

    const output = await facade.find({ id: "1" });

    expect(output.id).toBe("1");
    expect(output.name).toBe("Invoice 1");
    expect(output.document).toBe("Document 1");
    expect(output.address.street).toBe("Street 1");
    expect(output.address.number).toBe("1");
    expect(output.address.complement).toBe("Complement 1");
    expect(output.address.city).toBe("City 1");
    expect(output.address.state).toBe("State 1");
    expect(output.address.zipCode).toBe("Zipcode 1");
    expect(output.items).toHaveLength(2);
    expect(output.items[0].id).toBe("1");
    expect(output.items[0].name).toBe("Item 1");
    expect(output.items[0].price).toBe(100);
    expect(output.items[1].id).toBe("2");
    expect(output.items[1].name).toBe("Item 2");
    expect(output.items[1].price).toBe(200);
    expect(output.total).toBe(300);
    expect(output.createdAt).toBe(invoice.createdAt);
    expect(invoiceRepository.find).toHaveBeenCalledTimes(1);
    expect(invoiceRepository.find).toHaveBeenCalledWith("1");
  });

  it("should throw an error when invoice is not found", async () => {
    (invoiceRepository.find as jest.Mock).mockRejectedValue(new Error("Invoice not found"));

    await expect(facade.find({ id: "456ABC" })).rejects.toThrow("Invoice not found");
  });
});