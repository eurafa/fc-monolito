import GenerateInvoiceUsecase from "./generate-invoice.usecase";
import InvoiceRepository from "../../repository/invoice-repository";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice-item";
import Address from "../../../@shared/domain/value-object/address";

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
      address: {
        street: "Street 1",
        number: "1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "Zipcode 1",
      },
      items: [
        { name: "Item 1", price: 100 },
        { name: "Item 2", price: 200 },
      ],
    };

    const output = await usecase.execute(input);

    expect(output.id).toBeDefined();
    expect(output.name).toBe("Invoice 1");
    expect(output.document).toBe("Document 1");
    expect(output.address).toBeInstanceOf(Address);
    expect(output.address.street).toBe("Street 1");
    expect(output.address.number).toBe("1");
    expect(output.address.complement).toBe("Complement 1");
    expect(output.address.city).toBe("City 1");
    expect(output.address.state).toBe("State 1");
    expect(output.address.zipCode).toBe("Zipcode 1");
    expect(output.items).toHaveLength(2);
    expect(output.items[0]).toBeInstanceOf(InvoiceItem);
    expect(output.items[0].id.id).toBeDefined();
    expect(output.items[0].name).toBe("Item 1");
    expect(output.items[0].price).toBe(100);
    expect(output.items[1].id.id).toBeDefined();
    expect(output.items[1].name).toBe("Item 2");
    expect(output.items[1].price).toBe(200);
    expect(output.createdAt).toBeInstanceOf(Date);
    expect(output.updatedAt).toBeInstanceOf(Date);
  });

  it("should call repository.create with an Invoice instance", async () => {
    const input = {
      name: "Invoice 1",
      document: "Document 1",
      address: {
        street: "Street 1",
        number: "1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "Zipcode 1",
      },
      items: [{ name: "Item 1", price: 100 }],
    };

    await usecase.execute(input);

    expect(invoiceRepository.create).toHaveBeenCalledTimes(1);
    const invoice = (invoiceRepository.create as jest.Mock).mock.calls[0][0];
    expect(invoice).toBeInstanceOf(Invoice);
    expect(invoice.id.id).toBeDefined();
    expect(invoice.name).toBe("Invoice 1");
    expect(invoice.document).toBe("Document 1");
    expect(invoice.address).toBeInstanceOf(Address);
    expect(invoice.items).toHaveLength(1);
    expect(invoice.items[0].id.id).toBeDefined();
    expect(invoice.items[0].name).toBe("Item 1");
    expect(invoice.items[0].price).toBe(100);
  });

  it("should generate a unique id for each invoice", async () => {
    const input = {
      name: "Invoice 1",
      document: "Document 1",
      address: {
        street: "Street 1",
        number: "1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "Zipcode 1",
      },
      items: [{ name: "Item 1", price: 100 }],
    };

    const output1 = await usecase.execute(input);
    const output2 = await usecase.execute(input);

    expect(output1.id).not.toBe(output2.id);
  });

  it("should return the same data that was sent to the repository", async () => {
    const input = {
      name: "Invoice 1",
      document: "Document 1",
      address: {
        street: "Street 1",
        number: "1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "Zipcode 1",
      },
      items: [{ name: "Item 1", price: 100 }],
    };

    const output = await usecase.execute(input);
    const invoice = (invoiceRepository.create as jest.Mock).mock.calls[0][0];

    expect(output.id).toBe(invoice.id.id);
    expect(output.name).toBe(invoice.name);
    expect(output.document).toBe(invoice.document);
    expect(output.address).toBe(invoice.address);
    expect(output.items).toBe(invoice.items);
    expect(output.createdAt).toBe(invoice.createdAt);
    expect(output.updatedAt).toBe(invoice.updatedAt);
  });
});