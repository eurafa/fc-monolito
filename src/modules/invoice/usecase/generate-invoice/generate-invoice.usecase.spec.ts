import GenerateInvoiceUsecase from "./generate-invoice.usecase";
import InvoiceRepository from "../../repository/invoice-repository";
import Invoice from "../../domain/invoice";

describe("GenerateInvoiceUsecase unit tests", () => {
  const invoiceRepository = {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
  } as unknown as InvoiceRepository;

  const usecase = new GenerateInvoiceUsecase(invoiceRepository);

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

    const output = await usecase.execute(input);

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
  });

  it("should call repository.create with an Invoice instance", async () => {
    const input = {
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zipcode 1",
      items: [{ id: "1", name: "Item 1", price: 100 }],
    };

    await usecase.execute(input);

    expect(invoiceRepository.create).toHaveBeenCalledTimes(1);
    const invoice = (invoiceRepository.create as jest.Mock).mock.calls[0][0];
    expect(invoice).toBeInstanceOf(Invoice);
    expect(invoice.id.id).toBeDefined();
    expect(invoice.name).toBe("Invoice 1");
    expect(invoice.document).toBe("Document 1");
    expect(invoice.address.street).toBe("Street 1");
    expect(invoice.items).toHaveLength(1);
    expect(invoice.items[0].id.id).toBe("1");
    expect(invoice.items[0].name).toBe("Item 1");
    expect(invoice.items[0].price).toBe(100);
  });

  it("should generate a unique id for each invoice", async () => {
    const input = {
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zipcode 1",
      items: [{ id: "1", name: "Item 1", price: 100 }],
    };

    const output1 = await usecase.execute(input);
    const output2 = await usecase.execute(input);

    expect(output1.id).not.toBe(output2.id);
  });

  it("should return the same data that was sent to the repository", async () => {
    const input = {
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zipcode 1",
      items: [{ id: "1", name: "Item 1", price: 100 }],
    };

    const output = await usecase.execute(input);
    const invoice = (invoiceRepository.create as jest.Mock).mock.calls[0][0];

    expect(output.id).toBe(invoice.id.id);
    expect(output.name).toBe(invoice.name);
    expect(output.document).toBe(invoice.document);
    expect(output.street).toBe(invoice.address.street);
    expect(output.number).toBe(invoice.address.number);
    expect(output.complement).toBe(invoice.address.complement);
    expect(output.city).toBe(invoice.address.city);
    expect(output.state).toBe(invoice.address.state);
    expect(output.zipCode).toBe(invoice.address.zipCode);
    expect(output.items).toHaveLength(invoice.items.length);
    expect(output.total).toBe(invoice.total());
  });
});