export class Box {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  heightCm: number;
  widthCm: number;
  depthCm: number;
  weightG: number;

  constructor(params: {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    heightCm: number;
    widthCm: number;
    depthCm: number;
    weightG: number;
  }) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.heightCm = params.heightCm;
    this.widthCm = params.widthCm;
    this.depthCm = params.depthCm;
    this.weightG = params.weightG;
  }
}
