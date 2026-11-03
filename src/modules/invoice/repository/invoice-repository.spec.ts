import { Sequelize } from "sequelize-typescript";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-item";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceRepository from "./invoice-repository";

describe("Invoice repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an invoice", async () => {
    const invoiceRepository = new InvoiceRepository();

    const item1 = new InvoiceItem({ id: new Id("1"), name: "Item 1", price: 100 });
    const item2 = new InvoiceItem({ id: new Id("2"), name: "Item 2", price: 200 });
    const address = new Address("Street 1", "1", "Complement 1", "City 1", "State 1", "Zipcode 1");

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document 1",
      address,
      items: [item1, item2],
    });

    await invoiceRepository.create(invoice);

    const invoiceModel = await InvoiceModel.findOne({
      where: { id: "1" },
      include: [{ model: InvoiceItemModel, as: "items" }],
    });

    expect(invoiceModel.toJSON()).toStrictEqual({
      id: "1",
      name: "Invoice 1",
      document: "Document 1",
      address: expect.any(String),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      items: [
        { id: "1", invoiceId: "1", name: "Item 1", price: 100 },
        { id: "2", invoiceId: "1", name: "Item 2", price: 200 },
      ],
    });
  });

  it("should find an invoice", async () => {
    const invoiceRepository = new InvoiceRepository();

    const item1 = new InvoiceItem({ id: new Id("1"), name: "Item 1", price: 100 });
    const item2 = new InvoiceItem({ id: new Id("2"), name: "Item 2", price: 200 });
    const address = new Address("Street 1", "1", "Complement 1", "City 1", "State 1", "Zipcode 1");

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document 1",
      address,
      items: [item1, item2],
    });

    await invoiceRepository.create(invoice);

    const foundInvoice = await invoiceRepository.find("1");

    expect(foundInvoice.id.id).toBe("1");
    expect(foundInvoice.name).toBe("Invoice 1");
    expect(foundInvoice.document).toBe("Document 1");
    expect(foundInvoice.address.street).toBe("Street 1");
    expect(foundInvoice.address.number).toBe("1");
    expect(foundInvoice.address.complement).toBe("Complement 1");
    expect(foundInvoice.address.city).toBe("City 1");
    expect(foundInvoice.address.state).toBe("State 1");
    expect(foundInvoice.address.zipCode).toBe("Zipcode 1");
    expect(foundInvoice.items).toHaveLength(2);
    expect(foundInvoice.items[0].id.id).toBe("1");
    expect(foundInvoice.items[0].name).toBe("Item 1");
    expect(foundInvoice.items[0].price).toBe(100);
    expect(foundInvoice.items[1].id.id).toBe("2");
    expect(foundInvoice.items[1].name).toBe("Item 2");
    expect(foundInvoice.items[1].price).toBe(200);
  });

  it("should throw an error when invoice is not found", async () => {
    const invoiceRepository = new InvoiceRepository();

    await expect(invoiceRepository.find("456ABC")).rejects.toThrow("Invoice not found");
  });

  it("should find all invoices", async () => {
    const invoiceRepository = new InvoiceRepository();

    const address1 = new Address("Street 1", "1", "Complement 1", "City 1", "State 1", "Zipcode 1");
    const invoice1 = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document 1",
      address: address1,
      items: [new InvoiceItem({ id: new Id("1"), name: "Item 1", price: 100 })],
    });
    await invoiceRepository.create(invoice1);

    const address2 = new Address("Street 2", "2", "Complement 2", "City 2", "State 2", "Zipcode 2");
    const invoice2 = new Invoice({
      id: new Id("2"),
      name: "Invoice 2",
      document: "Document 2",
      address: address2,
      items: [new InvoiceItem({ id: new Id("2"), name: "Item 2", price: 200 })],
    });
    await invoiceRepository.create(invoice2);

    const invoices = await invoiceRepository.findAll();

    expect(invoices).toHaveLength(2);
    expect(invoices[0].id.id).toBe("1");
    expect(invoices[0].name).toBe("Invoice 1");
    expect(invoices[0].items).toHaveLength(1);
    expect(invoices[0].items[0].id.id).toBe("1");
    expect(invoices[1].id.id).toBe("2");
    expect(invoices[1].name).toBe("Invoice 2");
    expect(invoices[1].items).toHaveLength(1);
    expect(invoices[1].items[0].id.id).toBe("2");
  });
});