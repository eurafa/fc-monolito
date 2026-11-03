export interface InvoiceInputDto {
    name: string;
    document: string;
    address: {
        street: string;
        number: number;
        complement: string;
        city: string;
        state: string;
        zipCode: string;
    };
    items: {
        id: string;
        name: string;
        price: number;
    }[];
}

export interface InvoiceOutputDto {
  id: string;
  name: string;
  document: string;
  address: {
    street: string;
    number: number;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
