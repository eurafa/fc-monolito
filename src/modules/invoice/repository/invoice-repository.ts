import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-item";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";

export default class InvoiceRepository {
  async create(invoice: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      address: this.serializeAddress(invoice.address),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });

    await InvoiceItemModel.bulkCreate(
      invoice.items.map((item) => ({
        id: item.id.id,
        invoiceId: invoice.id.id,
        name: item.name,
        price: item.price,
      }))
    );
  }

  async update(invoice: Invoice): Promise<void> {
    await InvoiceModel.update(
      {
        name: invoice.name,
        document: invoice.document,
        address: this.serializeAddress(invoice.address),
        updatedAt: invoice.updatedAt,
      },
      { where: { id: invoice.id.id } }
    );

    await InvoiceItemModel.destroy({ where: { invoiceId: invoice.id.id } });

    await InvoiceItemModel.bulkCreate(
      invoice.items.map((item) => ({
        id: item.id.id,
        invoiceId: invoice.id.id,
        name: item.name,
        price: item.price,
      }))
    );
  }

  async find(id: string): Promise<Invoice> {
    const invoiceModel = await InvoiceModel.findOne({
      where: { id },
      include: [{ model: InvoiceItemModel, as: "items" }],
    });

    if (!invoiceModel) {
      throw new Error("Invoice not found");
    }

    return this.toDomain(invoiceModel);
  }

  async findAll(): Promise<Invoice[]> {
    const invoiceModels = await InvoiceModel.findAll({
      include: [{ model: InvoiceItemModel, as: "items" }],
    });

    return invoiceModels.map((model: InvoiceModel) => this.toDomain(model));
  }

  private serializeAddress(address: Address): string {
    return JSON.stringify({
      street: address.street,
      number: address.number,
      complement: address.complement,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    });
  }

  private deserializeAddress(value: string): Address {
    const data = JSON.parse(value);
    return new Address(
      data.street,
      data.number,
      data.complement,
      data.city,
      data.state,
      data.zipCode
    );
  }

  private toDomain(model: InvoiceModel): Invoice {
    const address = this.deserializeAddress(model.address);

    const items = (model.items ?? []).map(
      (item: InvoiceItemModel) =>
        new InvoiceItem({ id: new Id(item.id), name: item.name, price: item.price })
    );

    return new Invoice({
      id: new Id(model.id),
      name: model.name,
      document: model.document,
      address,
      items,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}