export interface IGateway {
  id?: number;
}

export class Gateway implements IGateway {
  constructor(public id?: number) {}
}

export function getGatewayIdentifier(gateway: IGateway): number | undefined {
  return gateway.id;
}
